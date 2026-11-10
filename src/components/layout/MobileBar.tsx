'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ButtonBody, buttonClass } from '@/components/ui/Button'
import { Phone } from '@/components/ui/Icons'
import { cx } from '@/lib/cx'

/** Keeps call and consultation one tap away on phones once the hero has scrolled past. */
export function MobileBar({ href, label, tel, phone }: { href: string; label: string; tel: string; phone: string }) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 160)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className={cx('fixed inset-x-2 bottom-2 z-30 flex gap-2 rounded-[18px] bg-white p-2 shadow-[inset_0_0_0_1px_var(--color-border),0_12px_34px_-14px_rgba(56,31,26,.5)] transition-transform duration-300 lg:hidden', shown ? 'translate-y-0' : 'translate-y-[calc(100%+16px)]')}>
      <a href={`tel:${tel}`} aria-label={phone} tabIndex={shown ? undefined : -1} className="btn btn--secondary !px-0 w-[54px] flex-none"><Phone size={18} /></a>
      <Link href={href} tabIndex={shown ? undefined : -1} className={buttonClass('primary', false, 'flex-1')}><ButtonBody>{label}</ButtonBody></Link>
    </div>
  )
}
