'use client'

import { useEffect, useRef, useState } from 'react'

// The first number in the value, with its thousands separator (space, NBSP or narrow NBSP) and decimal part kept.
const NUMBER = /(\d{1,3}(?:[   ]\d{3})+|\d+)(?:([.,])(\d+))?/

type Parsed = { before: string; after: string; target: number; group: string; decimal: string; places: number }

function parse(value: string): Parsed | null {
  const m = value.match(NUMBER)
  if (!m || m.index === undefined) return null
  const [whole, int, decimal = '', frac = ''] = m
  const group = int.match(/[   ]/)?.[0] ?? ''
  return {
    before: value.slice(0, m.index),
    after: value.slice(m.index + whole.length),
    target: Number(int.replace(/\D/g, '') + (frac ? `.${frac}` : '')),
    group,
    decimal,
    places: frac.length,
  }
}

function format(p: Parsed, n: number) {
  const [int, frac] = n.toFixed(p.places).split('.')
  const grouped = p.group ? int.replace(/\B(?=(\d{3})+(?!\d))/g, p.group) : int
  return p.before + grouped + (frac ? p.decimal + frac : '') + p.after
}

const ease = (t: number) => 1 - Math.pow(1 - t, 4)
const DURATION = 1600

/**
 * A figure that counts up from zero the first time it scrolls into view. Values without a number render as they are.
 * The final value stays in the layout (holding the width) and in the accessibility tree; without JavaScript it is what shows.
 */
export function CountUp({ value }: { value: string }) {
  const parsed = parse(value)
  const ref = useRef<HTMLSpanElement>(null)
  const [text, setText] = useState(() => (parsed ? format(parsed, 0) : value))

  useEffect(() => {
    const el = ref.current
    if (!parsed || !el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(value)
      return
    }
    let frame = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION)
          setText(t < 1 ? format(parsed, parsed.target * ease(t)) : value)
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
    // `parsed` is derived from `value`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  if (!parsed) return <>{value}</>
  return (
    <span ref={ref} className="count">
      <span className="count__final">{value}</span>
      <span className="count__live" aria-hidden="true">{text}</span>
    </span>
  )
}
