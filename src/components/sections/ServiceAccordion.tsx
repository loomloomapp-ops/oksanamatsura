'use client'

import Link from 'next/link'
import { useEffect, useId, useState, type ReactNode } from 'react'
import { Arrow, Plus } from '@/components/ui/Icons'
import { ImageWrapper } from '@/components/ui/ImageWrapper'
import { TapHint } from '@/components/ui/TapHint'
import type { ImageSlot } from '@/content/types'

export type ServiceRow = { icon: ReactNode; title: string; text: string; items: string[]; image: ImageSlot; to: string; more: string }

/**
 * On phones every row starts closed and a hand taps the first plus. From 1024px the first service opens on load,
 * so the main offer is visible without a click.
 */
export function ServiceAccordion({ rows }: { rows: ServiceRow[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const [touched, setTouched] = useState(false)
  const base = useId()
  // Follows the screen until the visitor opens or closes a row, so a window resized across 1024px matches too.
  useEffect(() => {
    if (touched) return
    const desktop = window.matchMedia('(min-width: 1024px)')
    const sync = () => setOpen(desktop.matches ? 0 : null)
    sync()
    desktop.addEventListener('change', sync)
    return () => desktop.removeEventListener('change', sync)
  }, [touched])
  const hint = touched ? -1 : rows.findIndex((_, i) => i !== open)
  return (
    <div className="border-t border-line">
      {rows.map((row, i) => {
        const isOpen = open === i
        return (
          <div key={row.to} className="svc-row">
            <h3>
              <button type="button" id={`${base}-b${i}`} aria-expanded={isOpen} aria-controls={`${base}-p${i}`} onClick={() => { setOpen(isOpen ? null : i); setTouched(true) }} className="svc-row__btn t-h3">
                <span className="svc-row__icon">{row.icon}</span>
                {row.title}
                <span className="svc-plus">
                  <Plus size={22} />
                  {i === hint && <TapHint />}
                </span>
              </button>
            </h3>
            <div id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-b${i}`} className="accordion__panel" data-open={isOpen}>
              <div inert={!isOpen}>
                <div className="grid gap-6 pb-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
                  <ImageWrapper image={row.image} sizes="(max-width: 1023px) 100vw, 320px" className="aspect-[4/3] w-full lg:order-last" />
                  <div>
                    <p className="max-w-[52ch] text-muted">{row.text}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {row.items.map((it) => (
                        <li key={it} className="tag"><Plus size={14} className="flex-none" />{it}</li>
                      ))}
                    </ul>
                    <Link href={row.to} className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium">
                      {row.more}
                      <Arrow size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
