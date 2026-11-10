'use client'

import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react'

/**
 * A box of fixed height whose content scrolls inside, with an always-visible hairline track and a brown thumb
 * (native overlay scrollbars on macOS stay hidden until scrolling). The native scrollbar is hidden; wheel, touch
 * and keyboard scrolling still work on the box itself, and the thumb can be dragged.
 */
export function ScrollBox({ labelledBy, className, children }: { labelledBy: string; className?: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const thumb = useRef<HTMLSpanElement>(null)
  const drag = useRef<{ y: number; top: number } | null>(null)

  useEffect(() => {
    const el = box.current
    const r = rail.current
    const t = thumb.current
    if (!el || !r || !t) return
    const sync = () => {
      const overflow = el.scrollHeight - el.clientHeight
      r.hidden = overflow <= 1
      if (overflow <= 1) return
      const h = Math.max((el.clientHeight / el.scrollHeight) * r.clientHeight, 40)
      t.style.height = `${h}px`
      t.style.transform = `translateY(${(el.scrollTop / overflow) * (r.clientHeight - h)}px)`
    }
    sync()
    el.addEventListener('scroll', sync, { passive: true })
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', sync)
      ro.disconnect()
    }
  }, [])

  const onDown = (e: PointerEvent<HTMLSpanElement>) => {
    if (!box.current) return
    drag.current = { y: e.clientY, top: box.current.scrollTop }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    const el = box.current
    const r = rail.current
    const t = thumb.current
    if (!drag.current || !el || !r || !t) return
    const ratio = (el.scrollHeight - el.clientHeight) / (r.clientHeight - t.offsetHeight)
    el.scrollTop = drag.current.top + (e.clientY - drag.current.y) * ratio
  }
  const onUp = () => { drag.current = null }

  return (
    <div className="scrollbox">
      <div ref={box} className={className} tabIndex={0} role="region" aria-labelledby={labelledBy}>
        {children}
      </div>
      <div ref={rail} aria-hidden className="scrollbox__rail">
        <span ref={thumb} className="scrollbox__thumb" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} />
      </div>
    </div>
  )
}
