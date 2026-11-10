'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Arrow } from '@/components/ui/Icons'

export type Spot = { title: string; text: string; to: string; src?: string }

/**
 * One direction at a time: photo, name and short description. The fill of the active line times the rotation, so
 * hovering or focusing the card pauses it through CSS alone. Choosing a direction by hand stops the rotation.
 * All slides share one grid cell, so the card keeps the height of the tallest and nothing jumps.
 */
export function HeroSpotlight({ items }: { items: Spot[] }) {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)

  return (
    <div className="spot" data-auto={auto}>
      <div className="spot__slides">
        {items.map((d, i) => (
          <Link key={d.to} href={d.to} className="spot__slide" data-active={i === active}>
            <span className="spot__media">
              {d.src && <Image src={d.src} alt="" fill sizes="(max-width: 1023px) 40vw, 180px" />}
            </span>
            <span className="spot__copy">
              <span className="spot__head">
                <span className="spot__title">{d.title}</span>
                <span className="spot__chip"><Arrow size={14} /></span>
              </span>
              <span className="spot__text">{d.text}</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="spot__tabs">
        {items.map((d, i) => (
          <button key={d.to} type="button" aria-pressed={i === active} className="spot__tab" onClick={() => { setActive(i); setAuto(false) }}>
            <span className="spot__line">
              <i onAnimationEnd={() => setActive((i + 1) % items.length)} />
            </span>
            {d.title}
          </button>
        ))}
      </div>
    </div>
  )
}
