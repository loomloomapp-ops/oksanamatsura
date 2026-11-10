'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** One shared observer that triggers the heading reveals on every page. */
export function Animate() {
  const pathname = usePathname()
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])
  return null
}
