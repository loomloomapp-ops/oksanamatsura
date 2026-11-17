'use client'

import { useEffect, useRef, useState } from 'react'

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
 * The brand surface with the logo in type: the name and the tagline rise, a hairline under them fills while the page
 * gets ready (the fonts and the first image, never more than 2 s), then the type lifts away and the surface draws up
 * like a curtain onto the page. The rise and the loading line are pure CSS and start with the first paint. The hero
 * and header animations held by `pl-hold` start while the curtain is moving. It lives in the locale layout, so moving
 * between pages never runs it again.
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
    const bar = el.querySelector('.pl__bar i')

    const run = async () => {
      // The type has risen, the line has run most of the way, and the page is ready or the wait is over.
      await Promise.all([ready, finished(bar), finished(el.querySelector('.pl__tag'))])
      if (cancelled) return
      el.classList.add('is-ready')
      await finished(bar)
      // A moment on the finished mark, so the name is read before the page opens.
      await wait(short ? 120 : 380)
      if (cancelled) return
      el.classList.add('is-closing')
      await wait(short ? 260 : 420)
      if (cancelled) return
      el.classList.add('is-opening')
      // The hero starts while the curtain is still rising, so the two read as one movement.
      await wait(short ? 220 : 320)
      html.classList.remove('pl-hold')
      await finished(el)
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
    <div ref={root} className="pl surface" aria-hidden="true">
      <div className="pl__mark">
        <span className="pl__clip"><span className="pl__name">{NAME}</span></span>
        <span className="pl__clip"><span className="pl__tag">{TAG}</span></span>
        <span className="pl__bar"><i /></span>
      </div>
    </div>
  )
}
