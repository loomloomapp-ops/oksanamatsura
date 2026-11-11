'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

const NAME = 'OKSANA MATSURA'
const TAG = 'EKSPERT FINANSOWY'

/**
 * Decides before the first paint whether the preloader runs, so the page never flashes underneath it.
 * First visit: the full sequence. Later visits: a short one. Reduced motion or no JavaScript: none at all.
 * An 8 s fallback clears the classes even if React never hydrates, so the page can never stay covered.
 */
export const PRELOADER_BOOT = `(function(){var d=document.documentElement;d.classList.add('js');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var k='om-preloader',seen=localStorage.getItem(k);localStorage.setItem(k,'1');d.classList.add('pl-run','pl-hold',seen?'pl-short':'pl-full');setTimeout(function(){d.classList.remove('pl-run','pl-hold','pl-short','pl-full')},8000)}catch(e){}})()`

const finished = (el: Element | null) =>
  Promise.all((el?.getAnimations() ?? []).map((a) => a.finished)).then(() => undefined, () => undefined)

/**
 * "From vision to home": the name rises letter by letter, thin lines draw a house around it, the roof folds flat into a
 * frame, the frame's inside opens onto the page and the frame grows to the edges of the screen. Phases 1–2 are pure CSS
 * and start with the first paint; this component waits for the fonts and the first image (never more than 2 s), then
 * runs phases 3–4, releases the hero and header animations held by `pl-hold`, and removes itself.
 * It lives in the locale layout, so moving between pages never runs it again.
 */
export function PremiumPreloader() {
  const root = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    const el = root.current
    if (!el || !html.classList.contains('pl-run')) {
      setGone(true)
      return
    }
    const short = html.classList.contains('pl-short')
    const timers: number[] = []
    let cancelled = false
    const wait = (ms: number) => new Promise<void>((r) => { timers.push(window.setTimeout(r, ms)) })

    const img = document.querySelector<HTMLImageElement>('main img')
    const imageReady = img && !img.complete
      ? new Promise<void>((r) => {
          img.addEventListener('load', () => r(), { once: true })
          img.addEventListener('error', () => r(), { once: true })
        })
      : Promise.resolve()
    const ready = Promise.race([Promise.all([document.fonts?.ready, imageReady]), wait(short ? 600 : 2000)])

    const run = async () => {
      // The house (or, on later visits, the name) finishes drawing in CSS, and the page is ready or the wait is over.
      await Promise.all([ready, finished(el.querySelector(short ? '.pl__ch:last-child' : '.pl__roof'))])
      // A short pause on the finished mark, so the name is read before the page opens.
      await wait(short ? 250 : 350)
      if (cancelled) return
      if (!short) {
        el.classList.add('is-closing')
        await finished(el.querySelector('.pl__top'))
        if (cancelled) return
      }
      // Distances that take each white panel and frame edge exactly to the edge of the viewport.
      const box = el.querySelector('.pl__stage')!.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      el.style.setProperty('--ex', `${(vw - box.width) / 2 + 2}px`)
      el.style.setProperty('--ey', `${(vh - box.height) / 2 + 2}px`)
      el.style.setProperty('--sx', String((vw + 4) / box.width))
      el.style.setProperty('--sy', String((vh + 4) / box.height))
      el.classList.add('is-opening')
      // The hero starts while the frame is still growing, so the two read as one movement.
      await wait(short ? 280 : 620)
      html.classList.remove('pl-hold')
      await finished(el.querySelector('.pl__panel'))
      if (cancelled) return
      html.classList.remove('pl-run', 'pl-short', 'pl-full')
      setGone(true)
    }
    run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  if (gone) return null
  return (
    <div ref={root} className="pl" aria-hidden="true">
      <span className="pl__panel pl__panel--l" />
      <span className="pl__panel pl__panel--r" />
      <span className="pl__panel pl__panel--t" />
      <span className="pl__panel pl__panel--b" />
      <div className="pl__stage">
        <span className="pl__fill" />
        <svg className="pl__lines" viewBox="0 0 100 62" preserveAspectRatio="none">
          <path className="pl__line pl__base" d="M50 62H0" pathLength={1} />
          <path className="pl__line pl__base" d="M50 62H100" pathLength={1} />
          <path className="pl__line pl__wall" d="M0 62V0" pathLength={1} />
          <path className="pl__line pl__wall" d="M100 62V0" pathLength={1} />
          <path className="pl__line pl__roof" d="M0 0L50 -21" pathLength={1} />
          <path className="pl__line pl__roof" d="M100 0L50 -21" pathLength={1} />
          <path className="pl__line pl__top" d="M50 0H0" pathLength={1} />
          <path className="pl__line pl__top" d="M50 0H100" pathLength={1} />
        </svg>
        <span className="pl__edge pl__edge--t" />
        <span className="pl__edge pl__edge--b" />
        <span className="pl__edge pl__edge--l" />
        <span className="pl__edge pl__edge--r" />
        <div className="pl__logo">
          <span className="pl__name">
            {Array.from(NAME).map((ch, i) => (
              <span key={i} className="pl__ch" style={{ '--i': i } as CSSProperties}>{ch === ' ' ? ' ' : ch}</span>
            ))}
          </span>
          <span className="pl__tag">{TAG}</span>
        </div>
      </div>
    </div>
  )
}
