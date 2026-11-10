'use client'

import { useId, useState, type CSSProperties } from 'react'
import { Button } from '@/components/ui/Button'
import { Alert, Minus, Plus } from '@/components/ui/Icons'
import type { CalculatorCopy } from '@/content/types'
import { CALC, creditCapacity, type CalcInput } from '@/lib/calculator'
import { HTML_LANG, type Locale } from '@/lib/routes'

type Key = keyof CalcInput
type Range = { min: number; max: number; step: number }

/** A white tile holding its own label and value. The two main parameters also get a slider along the bottom. */
function Field({ label, unit, value, onChange, max, step, range }: {
  label: string; unit?: string; value: string; onChange: (v: string) => void; max?: number; step?: number; range?: Range
}) {
  const id = useId()
  const fill = range ? Math.min(Math.max(((parseFloat(value) || 0) - range.min) / (range.max - range.min), 0), 1) * 100 : 0
  return (
    <div className="calc-box">
      <label htmlFor={id} className="calc-box__label">{label}</label>
      <span className="calc-box__value">
        <input id={id} type="number" inputMode="decimal" min={0} max={max} step={step ?? 1} value={value} onChange={(e) => onChange(e.target.value)} className="calc-num" />
        {unit && <span className="calc-box__unit">{unit}</span>}
      </span>
      {range && (
        <input type="range" aria-label={label} min={range.min} max={range.max} step={range.step} value={parseFloat(value) || 0} onChange={(e) => onChange(e.target.value)} className="calc-range" style={{ '--p': `${fill}%` } as CSSProperties} />
      )}
    </div>
  )
}

function Stepper({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const current = Math.min(Math.max(parseInt(value, 10) || 1, 1), 20)
  return (
    <div className="calc-box" role="group" aria-label={label}>
      <span className="calc-box__label">{label}</span>
      <span className="calc-box__value">
        <output className="calc-num">{current}</output>
        <span className="calc-step">
          <button type="button" aria-label={`${label}: −1`} disabled={current <= 1} onClick={() => onChange(String(current - 1))}><Minus size={16} /></button>
          <button type="button" aria-label={`${label}: +1`} disabled={current >= 20} onClick={() => onChange(String(current + 1))}><Plus size={16} /></button>
        </span>
      </span>
    </div>
  )
}

/** The inputs card beside the live result; the result card ends with the button that opens the consultation questionnaire. */
export function Calculator({ locale, copy, cta }: {
  locale: Locale
  copy: CalculatorCopy
  cta: { label: string; href: string }
}) {
  const [values, setValues] = useState<Record<Key, string>>({ income: '4500', otherLoans: '0', limits: '0', people: '1', years: '30', rate: String(CALC.defaultRate) })
  const set = (key: Key) => (v: string) => setValues((s) => ({ ...s, [key]: v }))
  const { amount, payment } = creditCapacity(Object.fromEntries(Object.entries(values).map(([k, v]) => [k, parseFloat(v)])) as CalcInput)
  const money = (n: number) => `${new Intl.NumberFormat(HTML_LANG[locale], { maximumFractionDigits: 0 }).format(n)} zł`

  return (
    <>
      <div className="calc__card" role="group" aria-label={copy.title}>
        <h3 className="calc__group t-label">{copy.household}</h3>
        <div className="calc__fields">
          <Field label={copy.income} unit="PLN" value={values.income} onChange={set('income')} range={{ min: 0, max: 30000, step: 100 }} />
          <Field label={copy.otherLoans} unit="PLN" value={values.otherLoans} onChange={set('otherLoans')} />
          <Field label={copy.limits} unit="PLN" value={values.limits} onChange={set('limits')} />
          <Stepper label={copy.people} value={values.people} onChange={set('people')} />
        </div>
        <h3 className="calc__group t-label">{copy.planned}</h3>
        <div className="calc__fields">
          <Field label={copy.term} unit={copy.years} value={values.years} onChange={set('years')} max={35} range={{ min: 1, max: 35, step: 1 }} />
          <Field label={copy.rate} unit="%" value={values.rate} onChange={set('rate')} max={100} step={0.01} />
        </div>
      </div>
      <div className="calc__side">
        <div className="calc__result">
          <div aria-live="polite">
            <p className="calc__label">{copy.result}</p>
            <p className="calc__amount">{money(amount)}</p>
          </div>
          <div className="calc__foot">
            {/* The payment first, then the two inputs the figure depends on most. */}
            <dl className="calc__facts">
              <div className="calc__fact calc__fact--main">
                <dt>{copy.payment}</dt>
                <dd>{money(payment)}</dd>
              </div>
              <div className="calc__fact">
                <dt>{copy.term}</dt>
                <dd>{parseFloat(values.years) || 0} {copy.years}</dd>
              </div>
              <div className="calc__fact">
                <dt>{copy.rate}</dt>
                <dd>{new Intl.NumberFormat(HTML_LANG[locale], { maximumFractionDigits: 2 }).format(parseFloat(values.rate) || 0)} %</dd>
              </div>
            </dl>
            <p className="calc__note"><Alert size={14} className="mt-0.5 flex-none" />{copy.note}</p>
            <div className="calc__cta"><Button href={cta.href} variant="light" className="w-full">{cta.label}</Button></div>
          </div>
        </div>
      </div>
    </>
  )
}
