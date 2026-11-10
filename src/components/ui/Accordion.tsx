'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import type { Faq, FaqGroup } from '@/content/types'
import { Pending } from './Pending'
import { Bank, Chat, Plus } from './Icons'

export function Accordion({ items, pendingLabel }: { items: Faq[]; pendingLabel: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const base = useId()
  return (
    <div className="grid gap-2">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className="faq-card">
            <h3>
              <button
                type="button"
                id={`${base}-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="faq-card__btn"
              >
                {item.q}
                <span className="faq-icon"><Plus /></span>
              </button>
            </h3>
            <div id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-b${i}`} className="accordion__panel" data-open={isOpen}>
              <div>
                <div className="faq-card__body">
                  {item.a ?? <Pending label={pendingLabel} />}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const TAB_ICONS = { credit: Bank, cooperation: Chat }

/** FAQ split into tabs. Every panel stays in the page, the inactive ones are hidden. Arrow keys move between tabs. */
export function FaqTabs({ groups, pendingLabel }: { groups: FaqGroup[]; pendingLabel: string }) {
  const [tab, setTab] = useState(0)
  const base = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (tab + step + groups.length) % groups.length
    setTab(next)
    refs.current[next]?.focus()
  }
  return (
    <div>
      <div role="tablist" className="faq-tabs" onKeyDown={onKey}>
        {groups.map((g, i) => {
          const Icon = TAB_ICONS[g.icon]
          return (
            <button
              key={g.label}
              ref={(el) => { refs.current[i] = el }}
              type="button"
              role="tab"
              id={`${base}-t${i}`}
              aria-selected={tab === i}
              aria-controls={`${base}-tp${i}`}
              tabIndex={tab === i ? 0 : -1}
              onClick={() => setTab(i)}
              className="faq-tab"
            >
              <Icon size={18} />
              {g.label}
            </button>
          )
        })}
      </div>
      {groups.map((g, i) => (
        <div key={g.label} role="tabpanel" id={`${base}-tp${i}`} aria-labelledby={`${base}-t${i}`} hidden={tab !== i}>
          <Accordion items={g.items} pendingLabel={pendingLabel} />
        </div>
      ))}
    </div>
  )
}
