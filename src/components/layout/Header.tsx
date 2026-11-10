'use client'

import { AnimatePresence, domAnimation, LazyMotion, m, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { ButtonBody, buttonClass } from '@/components/ui/Button'
import { Arrow, Check, Chevron, Globe, Phone, Plus } from '@/components/ui/Icons'
import { cx } from '@/lib/cx'

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] }
export type LangLink = { code: string; label: string; href: string; active: boolean }
type Props = {
  homeHref: string
  nav: NavItem[]
  langs: LangLink[]
  languageLabel: string
  phone: string
  tel: string
  consultHref: string
  consultShort: string
  consult: string
  check: string
  checkHref: string
  openMenu: string
  closeMenu: string
}

/** Language switcher: a globe button that opens the list. The links stay in the markup for crawlers. */
function Langs({ langs, label }: { langs: LangLink[]; label: string }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <nav ref={root} aria-label={label} className="relative">
      <button type="button" aria-expanded={open} aria-label={label} onClick={() => setOpen(!open)} className="header-icon">
        <Globe size={20} />
      </button>
      <ul className={cx('absolute right-0 top-full mt-2 w-28 rounded-card bg-white p-2 text-brown shadow-[var(--shadow-float)] transition-opacity duration-200', open ? 'visible opacity-100' : 'invisible opacity-0')}>
        {langs.map((l) => (
          <li key={l.code}>
            <a href={l.href} hrefLang={l.code === 'ua' ? 'uk' : l.code} aria-current={l.active ? 'true' : undefined}
              className={cx('t-label flex min-h-11 items-center justify-between rounded-inner px-3 hover:bg-soft', l.active && 'bg-soft')}>
              {l.label}
              {l.active && <Check size={16} />}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

const EASE_PANEL = [0.76, 0, 0.24, 1] as const
const EASE_ITEM = [0.22, 1, 0.36, 1] as const

export function Header(p: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <LazyMotion features={domAnimation}>
      <header className="site-header">
        <Link href={p.homeHref} aria-label="Oksana Matsura" className="justify-self-start" onClick={() => setOpen(false)}>
          <Image src="/brand/logo-white.svg" alt="Oksana Matsura | Ekspert finansowy" width={207} height={32} priority className="h-6 w-auto sm:h-7 min-[1440px]:h-8" />
        </Link>

        <nav className="hidden items-center gap-6 xl:flex 2xl:gap-8">
          {p.nav.map((item) => (
            <div key={item.href} className="group relative">
              <Link href={item.href} className="flex h-11 items-center gap-1 whitespace-nowrap text-[0.8125rem] hover:opacity-70 min-[1440px]:text-sm">
                {item.label}
                {item.children && <Chevron size={14} />}
              </Link>
              {item.children && (
                <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="rounded-card bg-white p-2 text-brown shadow-[var(--shadow-float)]">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block rounded-inner px-3 py-2.5 text-sm font-medium hover:bg-soft">{c.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-1 justify-self-end">
          <Langs langs={p.langs} label={p.languageLabel} />
          <a href={`tel:${p.tel}`} className="header-icon hidden xl:inline-flex" aria-label={p.phone} title={p.phone}>
            <Phone size={20} />
          </a>
          <Link href={p.consultHref} className="btn btn--light btn--small ml-2 hidden whitespace-nowrap xl:inline-flex">{p.consultShort}</Link>
          <button type="button" aria-expanded={open} aria-label={open ? p.closeMenu : p.openMenu} onClick={() => setOpen(!open)} className="header-icon xl:hidden">
            <span aria-hidden className="burger"><i /><i /></span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && <MobileMenu {...p} close={() => setOpen(false)} />}
      </AnimatePresence>
    </LazyMotion>
  )
}

/**
 * Below 1280px: a full-screen dark panel that unrolls down from the header, then the links rise in one after another.
 * A section with sub-pages opens as an accordion, so the phone and the buttons stay close. Escape closes it.
 */
function MobileMenu(p: Props & { close: () => void }) {
  const [sub, setSub] = useState<string | null>(null)
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const base = useId()
  const shut = 'inset(0% 0% 100% 0% round 0px 0px 32px 32px)'
  const item = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0, transition: { delay: reduce ? 0 : 0.22 + i * 0.045, duration: 0.55, ease: EASE_ITEM } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  })
  return (
    <m.div
      initial={reduce ? { opacity: 0 } : { clipPath: shut }}
      animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)' }}
      exit={reduce ? { opacity: 0 } : { clipPath: shut, transition: { duration: 0.45, ease: EASE_PANEL, delay: 0.05 } }}
      transition={{ duration: 0.65, ease: EASE_PANEL }}
      className="mnav surface xl:hidden"
    >
      <nav className="mnav__nav">
        <ul>
          {p.nav.map((navItem, i) => {
            const num = <span className="mnav__num t-label">{String(i + 1).padStart(2, '0')}</span>
            const isSub = sub === navItem.href
            return (
              <m.li key={navItem.href} className="mnav__item" {...item(i)}>
                {navItem.children ? (
                  <>
                    <button type="button" className="mnav__row" aria-expanded={isSub} aria-controls={`${base}-${i}`} onClick={() => setSub(isSub ? null : navItem.href)}>
                      {num}
                      <span className="mnav__label">{navItem.label}</span>
                      <span className="mnav__chip mnav__chip--toggle"><Plus size={16} /></span>
                    </button>
                    <div id={`${base}-${i}`} className="accordion__panel" data-open={isSub}>
                      <div inert={!isSub}>
                        <ul className="mnav__sub">
                          {navItem.children.map((c) => (
                            <li key={c.href}>
                              <Link href={c.href} onClick={p.close} aria-current={pathname === c.href ? 'page' : undefined} className="mnav__subLink">{c.label}<Arrow size={14} /></Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link href={navItem.href} onClick={p.close} aria-current={pathname === navItem.href ? 'page' : undefined} className="mnav__row">
                    {num}
                    <span className="mnav__label">{navItem.label}</span>
                    <span className="mnav__chip"><Arrow size={16} /></span>
                  </Link>
                )}
              </m.li>
            )
          })}
        </ul>
      </nav>
      <m.div className="mnav__foot" {...item(p.nav.length)}>
        <a href={`tel:${p.tel}`} className="mnav__phone"><Phone size={20} />{p.phone}</a>
        <div className="grid gap-2">
          <Link href={p.consultHref} onClick={p.close} className={buttonClass('light', false, 'w-full')}><ButtonBody variant="light">{p.consult}</ButtonBody></Link>
          <Link href={p.checkHref} onClick={p.close} className={buttonClass('ghost', false, 'w-full')}><ButtonBody variant="ghost">{p.check}</ButtonBody></Link>
        </div>
      </m.div>
    </m.div>
  )
}
