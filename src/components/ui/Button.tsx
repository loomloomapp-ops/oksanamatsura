import Link from 'next/link'
import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { Arrow } from './Icons'

/**
 * One button system for the whole site. `primary` (on light) and `light` (on dark) are the main action and always
 * carry the arrow; `secondary` (on light) and `ghost` (on dark) are the second action and are outlined.
 * `small` is only for compact places such as the header and filters.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'light' | 'ghost'

const hasArrow = (variant: ButtonVariant, small?: boolean) => !small && (variant === 'primary' || variant === 'light')

/** For elements that cannot use `Button`, such as form submits and links with their own click handler. */
export const buttonClass = (variant: ButtonVariant = 'primary', small?: boolean, className?: string) =>
  cx('btn', `btn--${variant}`, small && 'btn--small', hasArrow(variant, small) && 'btn--arrow', className)

export const ButtonBody = ({ variant = 'primary', small, children }: { variant?: ButtonVariant; small?: boolean; children: ReactNode }) => {
  const label = typeof children === 'string'
    ? <span className="btn__roll" data-t={children}><span>{children}</span></span>
    : children
  return hasArrow(variant, small) ? <>{label}<span className="btn__chip"><Arrow size={16} /></span></> : label
}

export const Button = ({ href, variant = 'primary', small, className, external, children }: {
  href: string
  variant?: ButtonVariant
  small?: boolean
  className?: string
  external?: boolean
  children: ReactNode
}) => {
  const cls = buttonClass(variant, small, className)
  const body = <ButtonBody variant={variant} small={small}>{children}</ButtonBody>
  if (external) return <a className={cls} href={href} target="_blank" rel="noopener noreferrer">{body}</a>
  return <Link className={cls} href={href}>{body}</Link>
}
