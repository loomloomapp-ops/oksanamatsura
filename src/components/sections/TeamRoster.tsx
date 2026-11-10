'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Monogram } from '@/components/ui/Panels'
import { SwipeHint } from '@/components/ui/SwipeHint'
import type { Person } from '@/content/types'

const Portrait = ({ person, sizes }: { person: Person; sizes: string }) =>
  person.image.src
    ? <Image src={person.image.src} alt="" fill sizes={sizes} className="object-cover" style={{ objectPosition: person.image.position }} />
    : <Monogram name={person.name} dark />

/**
 * Every name stays visible in the list; pointing at one, focusing it or tapping it changes the large portrait.
 * Below 1024px the portrait is hidden and each row becomes a card in a swipeable row. Placed as items of the `.roster` grid.
 */
export function TeamRoster({ people }: { people: Person[] }) {
  const [active, setActive] = useState(0)
  const current = people[active]
  return (
    <>
      <div aria-hidden className="roster__stage">
        <div className="roster__frame">
          {people.map((p, i) => (
            <div key={p.id} className="roster__portrait" data-active={i === active}><Portrait person={p} sizes="40vw" /></div>
          ))}
        </div>
        <div className="roster__caption">
          <span className="roster__who">{current.name}</span>
          <span className="text-muted">{current.role}{current.experience && ` · ${current.experience}`}</span>
        </div>
      </div>
      <SwipeHint className="roster__hint" />
      <ul className="roster__list">
        {people.map((p, i) => (
          <li key={p.id}>
            <button type="button" className="roster__row" aria-pressed={i === active} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}>
              <span className="roster__avatar"><Portrait person={p} sizes="70vw" /></span>
              <span className="roster__num t-label">{String(i + 1).padStart(2, '0')}</span>
              <span className="roster__name">{p.name}</span>
              <span className="roster__role">{p.role}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
