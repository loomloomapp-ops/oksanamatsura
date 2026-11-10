import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { Container } from './Container'

export type Tone = 'white' | 'soft' | 'brown'

export const Section = ({ id, tone = 'white', className, children }: { id?: string; tone?: Tone; className?: string; children: ReactNode }) => (
  <section id={id} className={cx('section', tone !== 'white' && `section--${tone}`, tone === 'brown' && 'surface', className)}>
    <Container>{children}</Container>
  </section>
)
