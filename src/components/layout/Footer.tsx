import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Facebook, Instagram, Pin } from '@/components/ui/Icons'
import type { SiteContent } from '@/content/types'
import { href, type Locale, type ServiceKey } from '@/lib/routes'
import { SITE } from '@/lib/site'

const SERVICES: ServiceKey[] = ['mortgage', 'cash', 'refinancing', 'consolidation', 'otherCredit']
const linkCls = 'flex min-h-8 items-center hover:opacity-60'
const headCls = 't-label mb-4 text-on-dark lg:mb-6'
// Hairline above each group on phones and tablets only.
const groupCls = 'border-t border-on-dark-line pt-6 lg:border-0 lg:pt-0'

export function Footer({ locale, c }: { locale: Locale; c: SiteContent }) {
  const nav = [
    [c.ui.nav.home, 'home'], [c.ui.nav.credits, 'credits'], [c.ui.nav.property, 'property'], [c.ui.nav.insurance, 'insurance'],
    [c.ui.nav.team, 'team'], [c.ui.nav.cases, 'cases'], [c.ui.nav.blog, 'blog'], [c.ui.nav.contact, 'contact'],
  ] as const
  // On phones Instagram and Facebook show as round icons and the map as a pill, all in one row; from 1024px they are text links.
  const social = [
    { label: 'Instagram', url: SITE.instagram, icon: <Instagram size={20} />, iconOnly: true },
    { label: 'Facebook', url: SITE.facebook, icon: <Facebook size={20} />, iconOnly: true },
    { label: c.pages.contact.map, url: SITE.maps, icon: <Pin size={18} />, iconOnly: false },
  ]

  return (
    <footer className="site-footer mt-[var(--section-gap)] bg-brown text-white pb-24 pt-14 lg:pb-14 lg:pt-24">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-x-10 lg:gap-y-10">
          <div className="col-span-2 lg:col-span-1 lg:pr-10">
            <Image src="/brand/logo-white.svg" alt="Oksana Matsura | Ekspert finansowy" width={207} height={32} className="h-auto w-full max-w-[260px] lg:max-w-[311px]" />
            <p className="mt-6 max-w-[34ch] text-on-dark">{c.footer.description}</p>
          </div>
          <div className={groupCls}>
            <h2 className={headCls}>{c.footer.navigation}</h2>
            <ul>{nav.map(([label, key]) => <li key={key}><Link className={linkCls} href={href(locale, { key })}>{label}</Link></li>)}</ul>
          </div>
          <div className={groupCls}>
            <h2 className={headCls}>{c.footer.services}</h2>
            <ul>{SERVICES.map((key) => <li key={key}><Link className={linkCls} href={href(locale, { key })}>{c.serviceNames[key]}</Link></li>)}</ul>
          </div>
          <div className="foot-contact col-span-2 lg:col-span-1">
            <h2 className={headCls}>{c.footer.contacts}</h2>
            <address className="not-italic">
              <p>{SITE.city}, {SITE.street}</p>
              <a className={`${linkCls} foot-phone`} href={`tel:${SITE.tel}`}>{SITE.phone}</a>
              <p className="text-on-dark">{c.pages.contact.hoursValue}</p>
            </address>
            <ul className="foot-social mt-3">
              {social.filter((l) => l.url).map((l) => (
                <li key={l.label}>
                  <a className="flex min-h-10 items-center hover:opacity-60 lg:min-h-8" data-icon-only={l.iconOnly} href={l.url!} target="_blank" rel="noopener noreferrer">
                    <span className="foot-social__icon">{l.icon}</span>
                    <span className="foot-social__label">{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Below 1024px the legal row dissolves into this column, so the legal links and the copyright sit above the wordmark, which closes the footer. */}
        <div className="mt-6 flex flex-col lg:mt-0 lg:block">
          <div className="contents text-sm lg:mt-14 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:border-b lg:border-on-dark-line lg:pb-5">
            <p className="order-2 text-xs text-on-dark lg:order-none lg:text-sm lg:text-white">© {new Date().getFullYear()} {c.footer.rights}</p>
            <div className="order-1 mt-4 flex flex-wrap gap-x-6 lg:order-none lg:mt-0">
              <Link className="flex min-h-11 items-center hover:opacity-60" href={href(locale, { key: 'privacy' })}>{c.footer.privacy}</Link>
              <Link className="flex min-h-11 items-center hover:opacity-60" href={href(locale, { key: 'cookies' })}>{c.footer.cookies}</Link>
            </div>
          </div>
          <p className="mt-2 max-w-[80ch] border-t border-on-dark-line pt-5 text-xs leading-relaxed text-on-dark lg:mt-4 lg:border-0 lg:pt-0">{c.footer.disclaimer}</p>

          <Image src="/brand/wordmark-white.svg" alt="" width={1740} height={124} aria-hidden className="order-last mt-8 h-auto w-full lg:order-none lg:mt-16" />
        </div>
      </Container>
    </footer>
  )
}
