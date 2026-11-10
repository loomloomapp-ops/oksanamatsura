import { Fragment, type CSSProperties } from 'react'

/** Splits a heading into words for the reveal. `start` continues the stagger when a heading is set in several parts. */
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="w">
            <span className="w__i" style={{ '--i': start + i } as CSSProperties}>{word}</span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </>
  )
}
