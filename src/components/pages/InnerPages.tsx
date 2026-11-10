import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ChipRow } from '@/components/ui/ChipRow'
import { SwipeHint } from '@/components/ui/SwipeHint'
import { CountUp } from '@/components/ui/CountUp'
import { CTASection } from '@/components/ui/CTASection'
import { ArrowSide, Back, Chat, Clock, Doc, Eye, Facebook, Home, Instagram, Key, Phone, Pin, Shield } from '@/components/ui/Icons'
import { ImageWrapper } from '@/components/ui/ImageWrapper'
import { AddressPanel, FloorPlan } from '@/components/ui/Panels'
import { Pending } from '@/components/ui/Pending'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Accordion } from '@/components/ui/Accordion'
import { Words } from '@/components/ui/Words'
import { Hero, TextHero } from '@/components/sections/Hero'
import { Advantages, ConsultForm, CreditCheck, FormBand, Process, processCta } from '@/components/sections/HomeSections'
import { ArticleCard, CaseCard, CasesSection, FaqSection, LinkTile, TeamSection } from '@/components/sections/Shared'
import { LeadForm } from '@/components/forms/LeadForm'
import { visibleArticles, visibleFaqs } from '@/content'
import type { SiteContent } from '@/content/types'
import { cx } from '@/lib/cx'
import { ctaLinks, FORM_ANCHOR } from '@/lib/links'
import { MEDIA } from '@/content/media'
import { CATEGORY_IDS, href, type ArticleId, type CaseId, type CategoryId, type Locale, type ServiceKey } from '@/lib/routes'
import { INSTAGRAM_POSTS, SITE } from '@/lib/site'

type P = { locale: Locale; c: SiteContent }

const SERVICES: ServiceKey[] = ['mortgage', 'cash', 'refinancing', 'consolidation', 'otherCredit']

export function CreditsPage({ locale, c }: P) {
  const p = c.pages.credits
  return (
    <>
      <Hero locale={locale} c={c} copy={p} />
      <Section>
        <SectionHeader {...p.types} />
        <div className="grid gap-tile sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((key) => <LinkTile key={key} title={c.serviceNames[key]} to={href(locale, { key })} more={c.ui.more} />)}
        </div>
      </Section>
      <Advantages heading={p.why} items={c.home.advantages.items} cta={processCta(locale, c)} />
      <CreditCheck locale={locale} c={c} />
      <Process heading={p.process} steps={c.home.process.steps.slice(0, 4)} cta={processCta(locale, c)} />
      <CasesSection locale={locale} c={c} heading={p.cases} />
      <FaqSection heading={p.faq} items={p.faq.items} pendingLabel={c.ui.pending} />
      <ConsultForm locale={locale} c={c} />
    </>
  )
}

export function ServicePage({ locale, c, service }: P & { service: ServiceKey }) {
  const p = c.pages.services[service]
  const s = c.pages.serviceSections
  const list = service === 'otherCredit' ? c.pages.otherCreditItems : null
  return (
    <>
      <Hero locale={locale} c={c} copy={p} />
      {(p.description || list) && (
        <Section>
          <div className="reveal grid gap-4 lg:grid-cols-12 lg:gap-6">
            <p className="t-label eyebrow self-start lg:col-span-3">{s.about}</p>
            <div className="lg:col-span-9">
              {list && <ul className="grid gap-2">{list.map((i) => <li key={i} className="card t-h3">{i}</li>)}</ul>}
              {p.description && <div className={cx('grid gap-4', list && 'mt-6')}>{p.description.map((t) => <p key={t} className="t-lead text-muted">{t}</p>)}</div>}
            </div>
          </div>
        </Section>
      )}
      <Advantages heading={s.benefits} items={c.home.advantages.items} cta={processCta(locale, c)} />
      <Process heading={s.process} steps={c.home.process.steps.slice(0, 4)} cta={processCta(locale, c)} />
      <FaqSection heading={s.faq} items={p.faq} pendingLabel={c.ui.pending} />
      <CTASection locale={locale} c={c} />
    </>
  )
}

/** Icons by position in `pages.property.services.items`: markets (hidden here), selection, viewings, documents, negotiation, transaction. */
const SERVICE_ICONS = [Home, Home, Home, Eye, Doc, Chat, Key]
/** Insurance help points: needs, comparison, decision. */
const HELP_ICONS = [Chat, Doc, Shield]

export function PropertyPage({ locale, c }: P) {
  const p = c.pages.property
  const links = ctaLinks(locale)
  return (
    <>
      <Hero locale={locale} c={c} copy={p} />
      <Section>
        <SectionHeader {...p.types} />
        <div className="grid gap-tile md:grid-cols-2">
          {p.types.items.map((t, i) => (
            <article key={t.title} className="market reveal">
              <ImageWrapper image={{ src: MEDIA.propertyTypes[i], alt: '', position: i === 1 ? '50% 35%' : '50% 50%' }} sizes="(max-width: 767px) 100vw, 50vw" className="market__media !rounded-inner" />
              <div className="market__tag">
                <span className="market__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="market__title">{t.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeader {...p.services} />
        <ul className="svc-grid">
          {p.services.items.map((s, i) => ({ ...s, Icon: SERVICE_ICONS[i] ?? Home })).filter((s) => !p.types.items.some((t) => t.title === s.title)).map(({ title, text, Icon }) => (
            <li key={title} className="svc-card reveal">
              <span className="svc-card__icon"><Icon size={20} /></span>
              <div>
                <h3 className="svc-card__title">{title}</h3>
                {text && <p className="svc-card__text">{text}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Section>
      <Advantages heading={p.benefits} items={c.home.advantages.items} cta={processCta(locale, c)} />
      <Process heading={p.process} steps={p.process.steps} />
      <Section>
        <div className="panel-dark surface reveal grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
          <div className="lg:col-span-8">
            <p className="t-label eyebrow">{p.combo.eyebrow}</p>
            <h2 className="t-h2 mt-4">{p.combo.h2}</h2>
            <p className="t-lead mt-4 text-on-dark">{p.combo.text}</p>
          </div>
          <div className="btn-group lg:col-span-4 lg:justify-end">
            <Button href={links.consult} variant="light">{c.ui.consult}</Button>
          </div>
        </div>
      </Section>
      <CasesSection locale={locale} c={c} heading={p.cases} />
      <FaqSection heading={p.faq} items={p.faq.items} pendingLabel={c.ui.pending} />
      <ConsultForm locale={locale} c={c} />
    </>
  )
}

export function InsurancePage({ locale, c }: P) {
  const p = c.pages.insurance
  // Until insurance-specific steps are supplied, this uses only steps already approved elsewhere on the site.
  const generalSteps = [c.home.process.steps[0], { title: p.help.eyebrow, text: p.help.text }, c.home.process.steps[5]]
  return (
    <>
      <Hero locale={locale} c={c} copy={p} />
      <Section>
        <SectionHeader {...p.types} />
        {/* One row per type: the descriptions are long, so they read best at full width. */}
        <div className="grid gap-tile">
          {p.types.items.map((t, i) => (
            <article key={t.title} className="row-card reveal">
              <span className="row-card__num t-label">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="row-card__title">{t.title}</h3>
              {t.text && <p className="row-card__text">{t.text}</p>}
            </article>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeader eyebrow={p.help.eyebrow} h2={p.help.h2} lead={p.help.text} />
        {p.help.items?.length ? (
          <ul className="svc-grid">
            {p.help.items.map((item, i) => {
              const Icon = HELP_ICONS[i % HELP_ICONS.length]
              return (
                <li key={item.title} className="svc-card reveal">
                  <span className="svc-card__icon"><Icon size={20} /></span>
                  <div>
                    <h3 className="svc-card__title">{item.title}</h3>
                    {item.text && <p className="svc-card__text">{item.text}</p>}
                  </div>
                </li>
              )
            })}
          </ul>
        ) : null}
      </Section>
      <Advantages heading={p.benefits} items={c.home.advantages.items} cta={processCta(locale, c)} />
      <Process heading={p.process} steps={p.process.steps?.length ? p.process.steps : generalSteps} />
      {p.faq.items?.length ? <FaqSection heading={p.faq} items={p.faq.items} pendingLabel={c.ui.pending} /> : null}
      <ConsultForm locale={locale} c={c} />
    </>
  )
}

export function TeamPage({ locale, c }: P) {
  const p = c.pages.team
  return (
    <>
      <TextHero eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
      <TeamSection locale={locale} c={c} full />
      <CTASection locale={locale} c={c} />
    </>
  )
}

export function CasesPage({ locale, c }: P) {
  const p = c.pages.cases
  return (
    <>
      <TextHero eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
      <CasesSection locale={locale} c={c} />
      <InstagramShelf c={c} />
      <CTASection locale={locale} c={c} />
    </>
  )
}

/** The client's Instagram posts as a swipeable shelf of link cards; nothing loads from Instagram until a card is opened. */
function InstagramShelf({ c }: { c: SiteContent }) {
  const ig = c.pages.cases.instagram
  if (!INSTAGRAM_POSTS.length) return null
  return (
    <Section>
      <SectionHeader eyebrow={ig.eyebrow} h2={ig.h2} lead={ig.lead} />
      <SwipeHint />
      <ul className="ig-shelf">
        {INSTAGRAM_POSTS.map((url, i) => (
          <li key={url}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="ig-card card-link surface">
              <span className="ig-card__top">
                <Instagram size={22} />
                <span className="t-label">{String(i + 1).padStart(2, '0')}</span>
              </span>
              <span className="ig-card__title">{ig.item}</span>
              <span className="ig-card__foot">{ig.open}<span className="chip"><ArrowSide size={14} /></span></span>
            </a>
          </li>
        ))}
      </ul>
      {SITE.instagram && (
        <div className="btn-group reveal mt-8">
          <Button href={SITE.instagram} variant="secondary" external>{`@${new URL(SITE.instagram).pathname.replaceAll('/', '')}`}</Button>
        </div>
      )}
    </Section>
  )
}

export function CaseDetailPage({ locale, c, id }: P & { id: CaseId }) {
  const item = c.cases.find((x) => x.id === id)!
  const others = c.cases.filter((x) => x.id !== id)
  const links = ctaLinks(locale)
  return (
    <>
      <Section>
        <div className="split">
          <div className="split__head">
            <Link href={href(locale, { key: 'cases' })} className="t-label enter inline-flex min-h-11 items-center gap-2"><Back size={14} />{c.ui.nav.cases}</Link>
            <h1 className="t-h1-page enter mt-4">{item.title}</h1>
            <p className="tag enter mt-5">{item.category}</p>
          </div>
          <div className="split__media">
            <ImageWrapper image={item.image} priority fallback={<FloorPlan variant={c.cases.indexOf(item)} />} sizes="(max-width: 1023px) 100vw, 45vw" className="aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[560px]" />
          </div>
          <div className="split__body">
            <p className="t-lead text-muted">{item.summary}</p>
            <div className="card mt-6">
              <p className="t-stat"><CountUp value={item.highlight.value} /></p>
              <p className="mt-1 text-muted">{item.highlight.label}</p>
            </div>
            <dl className="card mt-tile grid grid-cols-2 gap-x-6 gap-y-4">
              {item.stats.map((s) => <div key={s.label}><dt className="text-[0.9375rem] text-muted">{s.label}</dt><dd className="font-medium">{s.value}</dd></div>)}
            </dl>
          </div>
          <div className="split__cta">
            <div className="btn-group">
              {item.video && <Button href={item.video} variant="secondary" external>{c.ui.watchVideo}</Button>}
              <Button href={links.consult}>{c.ui.consult}</Button>
            </div>
          </div>
        </div>
      </Section>
      <Section>
        {/* Situation, what was done, result: the last step on the dark surface. */}
        <ol className="story">
          {item.story.map((s, i) => (
            <li key={s.label} className="story__step reveal">
              <span className="story__label t-label">{String(i + 1).padStart(2, '0')} · {s.label}</span>
              <p className="story__text">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>
      {others.length > 0 && (
        <Section>
          <SectionHeader {...c.home.cases} />
          <div className="grid gap-5 lg:grid-cols-2">
            {others.map((o) => <CaseCard key={o.id} item={o} locale={locale} c={c} index={c.cases.indexOf(o)} />)}
          </div>
        </Section>
      )}
      <CTASection locale={locale} c={c} />
    </>
  )
}

export function BlogPage({ locale, c, category }: P & { category?: CategoryId }) {
  const p = c.pages.blog
  const list = visibleArticles(c).filter((a) => !category || a.category === category)
  const chip = (active: boolean) => cx('btn btn--small', active ? 'btn--primary' : 'btn--secondary')
  return (
    <>
      <TextHero eyebrow={p.eyebrow} title={category ? c.categories[category] : p.title} lead={p.lead} />
      <Section>
        <SwipeHint className="swipe-hint--top" />
        <ChipRow label={p.title} className="reveal mb-8 flex gap-2 lg:flex-wrap">
          <Link className={chip(!category)} aria-current={!category ? 'page' : undefined} href={href(locale, { key: 'blog' })}>{c.ui.allCategories}</Link>
          {CATEGORY_IDS.map((id) => <Link key={id} className={chip(category === id)} aria-current={category === id ? 'page' : undefined} href={href(locale, { key: 'category', id })}>{c.categories[id]}</Link>)}
        </ChipRow>
        {list.length > 0 ? (
          <div className="grid gap-tile sm:grid-cols-2 xl:grid-cols-4">
            {list.map((a, i) => <ArticleCard key={a.id} article={a} locale={locale} c={c} featured={i === 0} />)}
          </div>
        ) : <Pending label={c.ui.pending} />}
      </Section>
      <CTASection locale={locale} c={c} />
    </>
  )
}

export function ArticlePage({ locale, c, id }: P & { id: ArticleId }) {
  const a = c.articles.find((x) => x.id === id)!
  const related = visibleArticles(c).filter((x) => x.id !== id).slice(0, 3)
  const faq = visibleFaqs(a.faq)
  return (
    <>
      <Section>
        <div className="mx-auto max-w-[920px]">
          <Link href={href(locale, { key: 'blog' })} className="t-label enter inline-flex min-h-11 items-center gap-2"><Back size={14} />{c.ui.backToBlog}</Link>
          <p className="t-label enter mt-5 text-muted">{c.categories[a.category]}</p>
          <h1 className="t-h1-page enter mt-3">{a.title}</h1>
          {(a.date || a.author) && <p className="mt-5 text-muted">{[a.date, a.author].filter(Boolean).join(' · ')}</p>}
          <ImageWrapper image={a.cover} priority sizes="(max-width: 1023px) 100vw, 920px" className="mt-8 aspect-[16/9] w-full" />
          <div className="mt-10 grid gap-5 lg:text-lg">
            {a.body?.map((b, i) =>
              b.type === 'h2' ? <h2 key={i} className="t-h2 mt-6">{b.text}</h2>
              : b.type === 'h3' ? <h3 key={i} className="t-h3 mt-4">{b.text}</h3>
              : <p key={i}>{b.text}</p>,
            ) ?? <div><Pending label={c.ui.pending} /></div>}
          </div>
          {faq.length > 0 && <div className="mt-12"><Accordion items={faq} pendingLabel={c.ui.pending} /></div>}
        </div>
      </Section>
      {related.length > 0 && (
        <Section>
          <h2 className="t-h2 mb-8 lg:mb-14" data-reveal><Words text={c.ui.related} /></h2>
          <div className="grid gap-tile sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => <ArticleCard key={r.id} article={r} locale={locale} c={c} />)}
          </div>
        </Section>
      )}
      <CTASection locale={locale} c={c} />
    </>
  )
}

export function ContactPage({ locale, c }: P) {
  const p = c.pages.contact
  const rows = [
    { icon: <Pin size={18} />, label: p.office, value: `${SITE.city}, ${SITE.street}`, to: SITE.maps, external: true },
    { icon: <Phone size={18} />, label: p.phone, value: SITE.phone, to: `tel:${SITE.tel}` },
    { icon: <Clock size={18} />, label: p.hours, value: p.hoursValue },
  ]
  const social = [
    { icon: <Instagram size={18} />, label: 'Instagram', to: SITE.instagram },
    { icon: <Facebook size={18} />, label: 'Facebook', to: SITE.facebook },
  ].filter((x) => x.to)
  return (
    <>
      <Section>
        <div className="split split--media-left">
          <div className="split__head">
            <p className="t-label eyebrow enter">{p.eyebrow}</p>
            <h1 className="t-h1-page enter mt-4">{p.title}</h1>
          </div>
          <div className="split__media">
            <ImageWrapper image={p.image} priority fallback={<AddressPanel city={SITE.city} street={SITE.street} />} sizes="(max-width: 1023px) 100vw, 46vw" className="aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[640px]" />
          </div>
          <div className="split__body">
            <p className="t-lead text-muted">{p.lead}</p>
            <ul className="mt-6 grid gap-tile">
              {rows.map((r) => {
                const body = (
                  <>
                    <span><span className="block text-sm text-muted">{r.label}</span><span className="font-medium">{r.value}</span></span>
                    <span className="chip">{r.icon}</span>
                  </>
                )
                const cls = 'card flex items-center justify-between gap-4'
                return (
                  <li key={r.label}>
                    {r.to ? <a href={r.to} className={cx(cls, 'card-link')} {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{body}</a> : <div className={cls}>{body}</div>}
                  </li>
                )
              })}
            </ul>
            {social.length > 0 && (
              <ul className="mt-tile grid grid-cols-2 gap-tile">
                {social.map((x) => (
                  <li key={x.label}>
                    <a href={x.to!} target="_blank" rel="noopener noreferrer" className="card card-link flex items-center justify-between gap-4">
                      <span className="font-medium">{x.label}</span>
                      <span className="chip">{x.icon}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>
      <FormBand id={FORM_ANCHOR} eyebrow={p.formEyebrow} h2={p.formTitle} lead={p.formLead} formTitle={c.ui.consultShort}>
        <LeadForm kind="consultation" locale={locale} copy={c.form} privacyHref={href(locale, { key: 'privacy' })} />
      </FormBand>
    </>
  )
}

export const LegalPage = ({ c, title }: { c: SiteContent; title: string }) => (
  <>
    <TextHero eyebrow="Legal" title={title} />
    <Section><div className="lg:ml-[calc((100%+24px)/4)]"><Pending label={c.ui.pending} /></div></Section>
  </>
)
