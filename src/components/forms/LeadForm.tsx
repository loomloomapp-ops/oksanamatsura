'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { useForm, type FieldErrors, type Resolver } from 'react-hook-form'
import { ButtonBody, buttonClass } from '@/components/ui/Button'
import { Alert, Check } from '@/components/ui/Icons'
import type { FormCopy } from '@/content/types'
import { buildSchema, FORMS, QUIZ_STEPS, type FieldConfig, type LeadKind } from '@/lib/forms'
import type { Locale } from '@/lib/routes'

type Values = Record<string, string | boolean>

const Err = ({ id, text }: { id: string; text?: string }) =>
  text ? (
    <p id={id} className="mt-2 flex items-center gap-2 text-sm font-semibold">
      <Alert size={16} className="flex-none" />
      {text}
    </p>
  ) : null

/**
 * The client's questionnaire as a quiz: one question per step with a progress line, the contacts and consent last.
 * A choice made with a pointer moves on by itself; keyboard users confirm with the button, so arrow keys never skip a step.
 */
export function LeadForm({ kind, locale, copy, privacyHref, submitLabel }: {
  kind: LeadKind
  locale: Locale
  copy: FormCopy
  privacyHref: string
  submitLabel?: string
}) {
  const uid = useId()
  const started = useRef(0)
  const honeypot = useRef<HTMLInputElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const moved = useRef(false)
  const advance = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [step, setStep] = useState(0)
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle')
  const schema = useMemo(() => buildSchema(kind, copy), [kind, copy])
  const { register, handleSubmit, trigger, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) as unknown as Resolver<Values> })

  const fields = useMemo(() => Object.fromEntries(FORMS[kind].map((f) => [f.name, f])), [kind])
  const total = QUIZ_STEPS.length
  const current = QUIZ_STEPS[step]
  const last = step === total - 1

  // Focus follows the step for keyboard and screen reader users, but never on first render.
  useEffect(() => { if (moved.current) heading.current?.focus({ preventScroll: true }) }, [step])
  useEffect(() => () => { if (advance.current) clearTimeout(advance.current) }, [])

  const go = (n: number) => { moved.current = true; setStep(n) }
  const next = async () => { if (await trigger(current.fields)) go(step + 1) }

  const send = handleSubmit(async ({ consent, ...values }) => {
    setState('sending')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind, locale, page: location.pathname, startedAt: started.current, website: honeypot.current?.value, values: { ...values, consent } }),
      })
      setState(res.ok ? 'done' : 'failed')
    } catch {
      setState('failed')
    }
  }, (errs: FieldErrors<Values>) => {
    // An earlier answer is missing: go back to its step.
    const at = QUIZ_STEPS.findIndex((s) => s.fields.some((n) => errs[n]))
    if (at >= 0 && at !== step) go(at)
  })

  const onSubmit = (e: FormEvent) => {
    if (last) return send(e)
    e.preventDefault()
    void next()
  }

  if (state === 'done') {
    return (
      <p role="status" className="flex items-start gap-3 text-lg font-medium">
        <span className="chip"><Check /></span>
        {copy.success}
      </p>
    )
  }

  const labelOf = (f: FieldConfig) => (typeof f.label === 'string' ? copy[f.label] : f.label[locale])
  const message = (name: string) => errors[name]?.message as string | undefined
  const single = current.fields.length === 1
  const title = current.title?.[locale] ?? labelOf(fields[current.fields[0]])
  const titleId = `${uid}-title`

  const renderField = (f: FieldConfig) => {
    const id = `${uid}-${f.name}`
    const err = message(f.name)
    const described = { 'aria-invalid': !!err, 'aria-describedby': err ? `${id}-e` : undefined }
    if (f.type === 'radio') {
      return (
        <fieldset key={f.name} aria-labelledby={titleId}>
          <div className="quiz__opts">
            {f.options?.map((o) => (
              <label
                key={o.value}
                className="quiz__opt"
                onClick={(e) => {
                  // detail is 0 for clicks made with the keyboard.
                  if (e.detail === 0) return
                  if (advance.current) clearTimeout(advance.current)
                  advance.current = setTimeout(() => void next(), 260)
                }}
              >
                <input type="radio" value={o.value} {...described} {...register(f.name)} />
                <span>{o.label[locale]}</span>
                <span className="quiz__dot" aria-hidden><Check size={14} /></span>
              </label>
            ))}
          </div>
          <Err id={`${id}-e`} text={err} />
        </fieldset>
      )
    }
    if (f.type === 'checkbox') {
      return (
        <label key={f.name} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input type="checkbox" {...register(f.name)} className="mt-0.5 h-5 w-5 flex-none accent-brown" />
          <span>{labelOf(f)}</span>
        </label>
      )
    }
    return (
      <div key={f.name}>
        <label htmlFor={id} className={single ? 'sr-only' : 'mb-1.5 block text-sm'}>{labelOf(f)}</label>
        <input id={id} {...described} {...register(f.name)} type={f.type} autoComplete={f.autoComplete} className="field" />
        <Err id={`${id}-e`} text={err} />
      </div>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} onFocus={() => { if (!started.current) started.current = Date.now() }} className="quiz">
      <div className="quiz__progress">
        <p className="quiz__count" aria-live="polite">{copy.quiz.step.replace('{n}', String(step + 1)).replace('{total}', String(total))}</p>
        <div className="quiz__bar" aria-hidden><i style={{ width: `${((step + 1) / total) * 100}%` }} /></div>
      </div>

      <div className="quiz__body" key={step}>
        <h3 id={titleId} ref={heading} tabIndex={-1} className="quiz__title">{title}</h3>
        <div className="grid gap-4">
          {current.fields.filter((n) => fields[n].type !== 'checkbox').map((n) => renderField(fields[n]))}
          {last && (
            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
                <input type="checkbox" {...register('consent')} aria-invalid={!!message('consent')} className="mt-0.5 h-5 w-5 flex-none accent-brown" />
                <span>
                  {copy.questionnaire.consentBefore}{' '}
                  <Link href={privacyHref} className="underline underline-offset-2">{copy.questionnaire.consentLink}</Link>
                  {` ${copy.questionnaire.consentAfter}`}.
                </span>
              </label>
              <Err id={`${uid}-consent-e`} text={message('consent')} />
            </div>
          )}
          {/* Optional consents come after the required one. */}
          {current.fields.filter((n) => fields[n].type === 'checkbox').map((n) => renderField(fields[n]))}
        </div>
      </div>

      {/* Hidden from people, filled in by bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input ref={honeypot} tabIndex={-1} autoComplete="off" name="website" />
      </div>

      <div className="quiz__nav">
        {step > 0 && (
          <button type="button" onClick={() => go(step - 1)} className={buttonClass('secondary', false, 'quiz__back')}>
            <ButtonBody variant="secondary">{copy.quiz.back}</ButtonBody>
          </button>
        )}
        <button type="submit" disabled={state === 'sending'} className={buttonClass('primary', false, 'quiz__next')}>
          <ButtonBody>{last ? (state === 'sending' ? copy.sending : submitLabel ?? copy.submit) : copy.quiz.next}</ButtonBody>
        </button>
      </div>

      {state === 'failed' && (
        <p role="alert" className="flex items-center gap-2 text-sm font-semibold">
          <Alert size={16} className="flex-none" />
          {copy.failure}
        </p>
      )}
    </form>
  )
}
