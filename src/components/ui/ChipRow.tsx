'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * A row of filter chips. Below 1024px it is one line that scrolls sideways with a finger, edge to edge, and the
 * active chip (`aria-current`) is brought into view; from 1024px the chips wrap as usual.
 */
export function ChipRow({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const row = ref.current
    const active = row?.querySelector<HTMLElement>('[aria-current]')
    if (!row || !active || row.scrollWidth <= row.clientWidth) return
    row.scrollLeft = active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2
  }, [])
  return <nav ref={ref} aria-label={label} className={`chip-row ${className ?? ''}`}>{children}</nav>
}
