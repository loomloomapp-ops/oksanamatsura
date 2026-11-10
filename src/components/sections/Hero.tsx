import Image from 'next/image'
import Link from 'next/link'
import { Fragment, type CSSProperties, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Plus } from '@/components/ui/Icons'
import { ImageWrapper } from '@/components/ui/ImageWrapper'
import { Words } from '@/components/ui/Words'
import { Section } from '@/components/ui/Section'
import type { HeroCopy, SiteContent } from '@/content/types'
import { HeroSpotlight } from './HeroSpotlight'
import { ctaLinks } from '@/lib/links'
import { href, type Locale, type ServiceKey } from '@/lib/routes'

const delay = (i: number) => ({ '--i': i }) as CSSProperties
const CHIPS: ServiceKey[] = ['mortgage', 'cash', 'refinancing', 'consolidation', 'otherCredit']

/**
 * Home first screen. From 1024px a rounded photo banner under the header: copy top left, service links bottom left and
 * the three directions bottom right. The DOM order is the required mobile order.
 */
export function HomeHero({ locale, c, after }: { locale: Locale; c: SiteContent; after?: ReactNode }) {
  const h = c.home.hero
  const s = c.home.services
  const links = ctaLinks(locale)
  // Two lines in every language: the break falls before the last five words. \s also matches the copy's non-breaking spaces.
  const lines = h.title.match(/^(.*)\s((?:\S+\s){4}\S+)$/)?.slice(1) ?? [h.title]
  const directions = [
    { title: s.credit.title, text: s.credit.text, src: s.credit.image.src, to: href(locale, { key: 'credits' }) },
    { title: s.property.title, text: s.property.text, src: s.property.image.src, to: href(locale, { key: 'property' }) },
    { title: s.insurance.title, text: s.insurance.text, src: s.insurance.image.src, to: href(locale, { key: 'insurance' }) },
  ]
  return (
    <section className="section">
      <div className="stage surface">
        <div className="stage__inner">
          <h1 className="stage__title words--now">
            {lines.map((line, i) => (
              <Fragment key={i}>
                <span className="stage__line"><Words text={line} start={i ? lines[0].split(' ').length : 0} /></span>{' '}
              </Fragment>
            ))}
          </h1>
          <div className="stage__photo">
            {h.image.src && <Image src={h.image.src} alt="" fill sizes="100vw" loading="eager" fetchPriority="high" className="stage__img" />}
          </div>
          <p className="stage__lead t-lead enter" style={delay(2)}>{h.lead}</p>
          <div className="stage__cards enter" style={delay(3)}>
            <HeroSpotlight items={directions} />
          </div>
          <div className="stage__cta enter" style={delay(3)}>
            <Button href={links.consult} variant="light">{c.ui.consult}</Button>
            <Button href={links.check} variant="ghost">{c.ui.check}</Button>
          </div>
          <ul className="stage__chips enter" style={delay(4)}>
            {CHIPS.map((key) => (
              <li key={key}>
                <Link href={href(locale, { key })} className="stage-chip"><Plus size={11} />{c.serviceNames[key]}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {after && <div className="hero__after">{after}</div>}
    </section>
  )
}

/** Hero of the inner pages. The DOM order is the required mobile order; columns only move from 1024px. */
export function Hero({ locale, c, copy }: { locale: Locale; c: SiteContent; copy: HeroCopy }) {
  const links = ctaLinks(locale)
  return (
    <section className="section">
      <div className="hero__grid">
        <div className="hero__head">
          <p className="t-label eyebrow enter">{copy.eyebrow}</p>
          <h1 className="t-h1-page words--now mt-4"><Words text={copy.title} /></h1>
        </div>
        <ImageWrapper image={copy.image} priority sizes="100vw" className="hero__media aspect-[4/3] lg:aspect-auto lg:h-[min(58vh,560px)]" />
        <div className="hero__body enter" style={delay(2)}>
          <p className="t-lead">{copy.lead}</p>
        </div>
        <div className="hero__cta enter" style={delay(3)}>
          <div className="btn-group">
            <Button href={links.consult}>{c.ui.consult}</Button>
            <Button href={links.check} variant="secondary">{c.ui.check}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Text-only hero for listing and legal pages. */
export const TextHero = ({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) => (
  <Section>
    <header className="mx-auto max-w-[896px] text-center">
      <p className="t-label eyebrow enter">{eyebrow}</p>
      <h1 className="t-h1-page words--now mt-4"><Words text={title} /></h1>
      {lead && <p className="t-lead enter mx-auto mt-5" style={delay(2)}>{lead}</p>}
    </header>
  </Section>
)
