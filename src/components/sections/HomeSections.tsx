import { Button } from '@/components/ui/Button'
import { CountUp } from '@/components/ui/CountUp'
import { Bank, Chat, Clock, Home, Phone, Pin, Shield } from '@/components/ui/Icons'
import { ImageWrapper } from '@/components/ui/ImageWrapper'
import { Monogram } from '@/components/ui/Panels'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Words } from '@/components/ui/Words'
import { LeadForm } from '@/components/forms/LeadForm'
import { MEDIA } from '@/content/media'
import type { Heading, Item, SiteContent, Stat } from '@/content/types'
import { CALC_READY } from '@/lib/calculator'
import { cx } from '@/lib/cx'
import { CHECK_ANCHOR, ctaLinks } from '@/lib/links'
import { href, type Locale } from '@/lib/routes'
import { SITE } from '@/lib/site'
import { Calculator } from './Calculator'
import { ProcessSteps } from './ProcessSteps'
import { ServiceAccordion } from './ServiceAccordion'

type P = { locale: Locale; c: SiteContent }

const num = (i: number) => String(i + 1).padStart(2, '0')

/** Trust bar: key figures directly under the first screen. */
export const TrustBar = ({ items }: { items: Stat[] }) => (
  <dl className="grid grid-cols-2 gap-tile lg:grid-cols-4">
    {items.map((s) => (
      <div key={s.label} className="stat-tile reveal">
        <dd className="whitespace-nowrap text-[1.125rem] font-extrabold leading-tight tracking-[-0.02em] sm:text-[1.375rem] lg:text-[1.875rem]"><CountUp value={s.value} /></dd>
        <dt className="text-sm text-muted">{s.label}</dt>
      </div>
    ))}
  </dl>
)

export function ServicesBento({ locale, c }: P) {
  const s = c.home.services
  const rows = [
    { icon: <Bank size={20} />, ...s.credit, to: href(locale, { key: 'credits' }), more: c.ui.more },
    { icon: <Home size={20} />, ...s.property, to: href(locale, { key: 'property' }), more: c.ui.more },
    { icon: <Shield size={20} />, ...s.insurance, to: href(locale, { key: 'insurance' }), more: c.ui.more },
  ]
  return (
    <Section>
      <SectionHeader eyebrow={s.eyebrow} h2={s.h2} lead={s.lead} />
      <div className="lg:ml-[calc((100%+24px)/4)]">
        <ServiceAccordion rows={rows} />
      </div>
    </Section>
  )
}

export { Advantages } from './Advantages'

/** Phone, office and hours as an alternative to the form, all from the site's real contact data. */
export function ContactRows({ c }: { c: SiteContent }) {
  const p = c.pages.contact
  const rows = [
    { icon: <Phone size={18} />, label: p.phone, value: SITE.phone, to: `tel:${SITE.tel}` },
    { icon: <Pin size={18} />, label: p.office, value: `${SITE.street}, ${SITE.city}`, to: SITE.maps, external: true },
    { icon: <Clock size={18} />, label: p.hours, value: p.hoursValue },
  ]
  return (
    <ul className="reach reveal">
      {rows.map((r) => {
        const body = (
          <>
            <span className="reach__icon">{r.icon}</span>
            <span className="min-w-0">
              <span className="reach__label">{r.label}</span>
              <span className="reach__value">{r.value}</span>
            </span>
          </>
        )
        return (
          <li key={r.label}>
            {r.to
              ? <a href={r.to} className="reach__row reach__row--link" {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{body}</a>
              : <div className="reach__row">{body}</div>}
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Form block: one dark panel, copy and `aside` on the left, a white form card on the right (heading, extras, form on phones).
 */
export function FormBand({ id, eyebrow, h2, lead, formTitle, children, aside }: {
  id: string; eyebrow: string; h2: string; lead?: string; formTitle: string; children: React.ReactNode; aside?: React.ReactNode
}) {
  return (
    <section id={id} className="section">
      <div className="page-container">
        <div className="consult">
          <div className="consult__intro">
            <header>
              <p className="t-label eyebrow reveal">{eyebrow}</p>
              <h2 className="t-h1-page mt-4" data-reveal><Words text={h2} /></h2>
              {lead && <p className="t-lead reveal mt-4 text-on-dark">{lead}</p>}
            </header>
            {aside}
          </div>
          <div className="consult__card">
            <h3 className="consult__title">{formTitle}</h3>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Mortgage block: the calculator once its values are confirmed, otherwise a CTA panel. Either way the button opens the questionnaire pop-up. */
export function CreditCheck({ locale, c }: P) {
  const s = c.home.creditCheck
  const cta = { label: c.ui.getConsult, href: ctaLinks(locale).consult }
  if (CALC_READY) {
    return (
      <section id={CHECK_ANCHOR} className="section">
        <div className="page-container calc">
          <header className="calc__intro">
            <p className="t-label eyebrow reveal">{s.eyebrow}</p>
            <h2 className="t-h1-page mt-4" data-reveal><Words text={s.h2} /></h2>
            <p className="t-lead reveal mt-4 text-muted">{s.lead}</p>
          </header>
          <Calculator locale={locale} copy={c.calculator} cta={cta} />
        </div>
      </section>
    )
  }
  return (
    <Section id={CHECK_ANCHOR}>
      <div className="panel-dark surface reveal grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
        <div className="lg:col-span-8">
          <p className="t-label eyebrow">{s.eyebrow}</p>
          <h2 className="t-h2 mt-4">{s.h2}</h2>
          <p className="t-lead mt-4 text-on-dark">{s.lead}</p>
        </div>
        <div className="btn-group lg:col-span-4 lg:justify-end">
          <Button href={cta.href} variant="light">{cta.label}</Button>
        </div>
      </div>
    </Section>
  )
}

/** "CTA / form" block closing the credit, property and insurance pages. */
export const ConsultForm = ({ locale, c }: P) => (
  <FormBand id="konsultacja" eyebrow={c.pages.contact.formEyebrow} h2={c.cta.h2} lead={c.cta.lead} formTitle={c.pages.contact.formTitle} aside={<ContactRows c={c} />}>
    <LeadForm kind="consultation" locale={locale} copy={c.form} privacyHref={href(locale, { key: 'privacy' })} />
  </FormBand>
)

/**
 * Heading card beside numbered tiles, the CTA under it from 1024px and last on phones.
 * With a photo the card is white and holds the photo below the heading; without one it is the dark surface with a route line.
 */
export function Process({ heading, steps, cta, image = MEDIA.process }: { heading: Heading; steps: Item[]; cta?: { label: string; href: string }; image?: string }) {
  return (
    <Section>
      <div className={cx('proc', cta && 'proc--cta')}>
        <div className={cx('proc__side', image ? 'proc__side--media' : 'surface')}>
          <header className="proc__head">
            <p className="t-label eyebrow reveal">{heading.eyebrow}</p>
            <h2 className={cx('mt-4', image ? 't-h2' : 't-h1-page')} data-reveal><Words text={heading.h2} /></h2>
          </header>
          {image ? (
            <ImageWrapper image={{ src: image, alt: '', position: '72% 55%' }} sizes="(max-width: 1023px) 100vw, 40vw" className="proc__media !rounded-inner" />
          ) : (
            <div aria-hidden className="proc__route t-label">
              <span>{num(0)}</span>
              <span className="proc__line"><i /></span>
              <span>{num(steps.length - 1)}</span>
            </div>
          )}
        </div>
        <ProcessSteps>
          {steps.map((step, i) => (
            <li key={step.title} className="proc__step reveal">
              <span className="proc__num">{num(i)}</span>
              <div className="proc__body">
                <h3 className="proc__title">{step.title}</h3>
                {step.text && <p className="proc__text">{step.text}</p>}
              </div>
            </li>
          ))}
        </ProcessSteps>
        {cta && <div className="proc__cta reveal"><Button href={cta.href}>{cta.label}</Button></div>}
      </div>
    </Section>
  )
}

/** The experience line turning slowly around the years, set over the portrait. Decorative: the same facts are in the caption. */
const XpBadge = ({ text, years }: { text: string; years?: string }) => (
  <div aria-hidden className="xp__badge">
    <svg viewBox="0 0 100 100" className="xp__ring">
      <defs><path id="xp-ring" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" /></defs>
      <text><textPath href="#xp-ring" textLength="238" lengthAdjust="spacing">{text}</textPath></text>
    </svg>
    {years && <span className="xp__years">{years}</span>}
  </div>
)

const POINT_ICONS = [Chat, Shield]

/** Statement and principles beside the expert's portrait on one dark panel. On phones: heading, portrait, statement, principles. */
export function AboutExpert({ c }: { c: SiteContent }) {
  const s = c.home.about
  const [statement, ...rest] = s.paragraphs
  const expert = c.people[0]
  const years = expert.experience?.match(/^\d+/)?.[0]
  return (
    <Section>
      <div className="xp panel-dark surface">
        <header className="xp__head">
          <p className="t-label eyebrow reveal">{s.eyebrow}</p>
          <h2 className="t-h1-page mt-4" data-reveal><Words text={s.h2} /></h2>
        </header>
        <figure className="xp__portrait">
          <ImageWrapper image={expert.image} fallback={<Monogram name={expert.name} />} sizes="(max-width: 1023px) 100vw, 40vw" className="h-full w-full !rounded-none" />
          {expert.experience && <XpBadge text={`${expert.experience} · ${expert.role} · `} years={years} />}
          <figcaption className="xp__caption">
            <span className="xp__name">{expert.name}</span>
            <span className="xp__role">{[expert.role, expert.experience].filter(Boolean).join(' · ')}</span>
          </figcaption>
        </figure>
        <div className="xp__lead reveal">
          <p className="xp__statement">{statement}</p>
          {expert.bio?.map((t) => <p key={t} className="xp__bio">{t}</p>)}
        </div>
        <ul className="xp__points">
          {rest.map((p, i) => {
            const Icon = POINT_ICONS[i % POINT_ICONS.length]
            return (
              <li key={p} className="xp__point reveal">
                <span className="xp__icon"><Icon size={18} /></span>
                <p>{p}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}

export const processCta = (locale: Locale, c: SiteContent) => ({ label: c.ui.consult, href: ctaLinks(locale).consult })
