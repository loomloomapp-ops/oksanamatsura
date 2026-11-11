'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/** The point on the screen the timeline fills up to, as a share of the viewport height. */
const READ_LINE = 0.62

/**
 * The process steps as a scroll timeline on phones (below 640px): a thin rail runs through the number circles and fills
 * up to a line 62% down the screen, and each circle fills once the rail reaches it. Every step draws its own piece of
 * the rail (from the gap above it to its bottom), so the circles always sit over the line. From 640px the steps are a
 * grid and the timeline is off. Without JavaScript the circles stay filled and the rail is not drawn.
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
      const gap = parseFloat(getComputedStyle(ol).rowGap) || 0
      const line = window.innerHeight * READ_LINE
      steps.forEach((li, i) => {
        const box = li.getBoundingClientRect()
        const num = li.querySelector('.proc__num')?.getBoundingClientRect()
        const center = num ? num.top + num.height / 2 : box.top
        const start = i === 0 ? center : box.top - gap
        const end = i === steps.length - 1 ? center : box.bottom
        const fill = reduce.matches ? 1 : Math.min(1, Math.max(0, (line - start) / Math.max(1, end - start)))
        li.style.setProperty('--fill', fill.toFixed(4))
        li.toggleAttribute('data-on', reduce.matches || line >= center)
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
