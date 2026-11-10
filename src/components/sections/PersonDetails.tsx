'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Plus } from '@/components/ui/Icons'
import { cx } from '@/lib/cx'

/**
 * A person's bio. Below 1024px it shows about three lines with a fade and a "read more" button that opens the rest
 * smoothly; from 1024px, and without JavaScript, the whole text shows. The button only appears when there is more to read.
 */
export function PersonBio({ paragraphs, more, less, className }: { paragraphs: string[]; more: string; less: string; className?: string }) {
  const [open, setOpen] = useState(false)
  const [full, setFull] = useState<number>()
  const [needed, setNeeded] = useState(true)
  const inner = useRef<HTMLDivElement>(null)
  const outer = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    const el = inner.current
    const box = outer.current
    if (!el || !box) return
    const measure = () => {
      setFull(el.scrollHeight)
      // Compare with the closed height set in CSS; on desktop there is no limit, so nothing to open.
      const limit = parseFloat(getComputedStyle(box).getPropertyValue('--bio-closed')) || Infinity
      setNeeded(el.scrollHeight > limit + 2)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className={cx('bio', className)}>
      <div ref={outer} id={id} className="bio__clip" data-open={open || !needed} style={full ? { ['--bio-full' as string]: `${full}px` } : undefined}>
        <div ref={inner} className="expert__bio">{paragraphs.map((t) => <p key={t}>{t}</p>)}</div>
      </div>
      {needed && (
        <button type="button" className="bio__more" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          {open ? less : more}
          <span className="bio__chip"><Plus size={12} /></span>
        </button>
      )}
    </div>
  )
}

/** A fact group that opens like an accordion below 1024px and stays open from 1024px (and without JavaScript). */
export function FactToggle({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className="facts__group facts__group--wide facts__group--toggle" data-open={open}>
      <dt>
        <button type="button" className="facts__toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          <span className="facts__label">{label}</span>
          <span className="facts__chip"><Plus size={14} /></span>
        </button>
      </dt>
      <dd id={id} className="accordion__panel facts__panel" data-open={open}>
        <div>{children}</div>
      </dd>
    </div>
  )
}
