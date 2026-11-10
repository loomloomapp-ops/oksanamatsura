'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowSide, Back } from '@/components/ui/Icons'
import { ImageWrapper } from '@/components/ui/ImageWrapper'
import { SwipeHint } from '@/components/ui/SwipeHint'
import type { Review } from '@/content/types'

export function ReviewSlider({ items, labels }: { items: Review[]; labels: { prev: string; next: string; source: string; video: string } }) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    const el = track.current
    if (!el) return
    const sync = () => {
      const start = el.scrollLeft <= 1
      const end = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1
      setEdge((prev) => (prev.start === start && prev.end === end ? prev : { start, end }))
      root.current?.style.setProperty('--seen', String((el.scrollLeft + el.clientWidth) / el.scrollWidth))
    }
    sync()
    el.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      el.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [])

  const move = (dir: 1 | -1) => {
    const el = track.current
    const [first, second] = Array.from(el?.children ?? []) as HTMLElement[]
    if (el && first && second) el.scrollBy({ left: dir * (second.offsetLeft - first.offsetLeft), behavior: 'smooth' })
  }

  return (
    <div ref={root} className="reveal">
      {!(edge.start && edge.end) && <SwipeHint />}
      <ul ref={track} className="reviews__track">
        {items.map((r) => (
          <li key={r.id} className="review">
            {r.image && <ImageWrapper image={r.image} sizes="(max-width: 767px) 280px, 33vw" className="mb-4 aspect-[16/10] w-full" />}
            {r.text && <span aria-hidden className="review__mark">“</span>}
            {r.text && <p className="review__text">{r.text}</p>}
            <div className="review__foot">
              <span aria-hidden className="review__initial">{r.author.charAt(0)}</span>
              <span className="review__author">{r.author}</span>
              {r.video && <a href={r.video} target="_blank" rel="noopener noreferrer">{labels.video}</a>}
              {r.source && <a href={r.source} target="_blank" rel="noopener noreferrer">{labels.source}</a>}
            </div>
          </li>
        ))}
      </ul>
      {!(edge.start && edge.end) && (
        <div className="reviews__nav">
          <span aria-hidden className="reviews__bar"><i /></span>
          <button type="button" aria-label={labels.prev} disabled={edge.start} onClick={() => move(-1)} className="chip reviews__btn"><Back /></button>
          <button type="button" aria-label={labels.next} disabled={edge.end} onClick={() => move(1)} className="chip reviews__btn"><ArrowSide /></button>
        </div>
      )}
    </div>
  )
}
