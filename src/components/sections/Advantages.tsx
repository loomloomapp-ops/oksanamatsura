import type { CSSProperties } from 'react'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { Words } from '@/components/ui/Words'
import type { Heading, Item } from '@/content/types'

const num = (i: number) => String(i + 1).padStart(2, '0')

/** Pinned heading and contact button beside a stack of cards: each card rides up over the one before it. CSS only. */
export function Advantages({ heading, items, cta }: { heading: Heading; items: Item[]; cta: { label: string; href: string } }) {
  return (
    <Section tone="brown" className="why-section">
      <div className="why">
        <div className="why__aside">
          <header className="why__head">
            <p className="t-label eyebrow reveal">{heading.eyebrow}</p>
            <h2 className="t-h2 mt-4" data-reveal><Words text={heading.h2} /></h2>
            {heading.lead && <p className="reveal mt-4 max-w-[44ch] text-on-dark">{heading.lead}</p>}
          </header>
          <div className="why__cta"><Button href={cta.href} variant="light">{cta.label}</Button></div>
        </div>
        <ol className="why__list">
          {items.map((it, i) => (
            <li key={it.title} className="why-card" style={{ '--i': i } as CSSProperties}>
              <span className="why-card__num t-label">{num(i)}</span>
              <h3 className="why-card__title">{it.title}</h3>
              {it.text && <p className="why-card__text">{it.text}</p>}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
