import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

export const Container = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cx('page-container', className)}>{children}</div>
)
