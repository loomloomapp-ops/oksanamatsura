'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/** The point on the screen a number fills at, as a share of the viewport height. */
const READ_LINE = 0.62

/**
 * The process steps on phones (below 640px): each number circle fills once it scrolls past a line 62% down the screen,
 * so the steps light up one after another. From 640px the steps are a grid and this is off. Without JavaScript the
 * circles stay filled.
 */
export function ProcessSteps({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const ol = ref.current
    if (!ol) return
    const phone = window.matchMedia('(max-width: 639px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0
      const steps = Array.from(ol.children) as HTMLElement[]
      if (!phone.matches) {
        ol.removeAttribute('data-timeline')
        return
      }
      ol.setAttribute('data-timeline', '')
      const line = window.innerHeight * READ_LINE
      steps.forEach((li) => {
        const num = (li.querySelector('.proc__num') ?? li).getBoundingClientRect()
        li.toggleAttribute('data-on', reduce.matches || line >= num.top + num.height / 2)
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    phone.addEventListener('change', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      phone.removeEventListener('change', schedule)
    }
  }, [])

  return <ol ref={ref} className="proc__steps">{children}</ol>
}
