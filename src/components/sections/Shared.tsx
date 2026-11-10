import Link from 'next/link'
import { Accordion, FaqTabs } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { CountUp } from '@/components/ui/CountUp'
import { Arrow, Plus } from '@/components/ui/Icons'
import { ImageWrapper } from '@/components/ui/ImageWrapper'
import { FloorPlan, Monogram } from '@/components/ui/Panels'
import { Pending } from '@/components/ui/Pending'
import { ScrollBox } from '@/components/ui/ScrollBox'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Words } from '@/components/ui/Words'
import { visibleArticles, visibleFaqs } from '@/content'
import type { Article, CaseStudy, Faq, FaqGroup, Heading, Person, SiteContent } from '@/content/types'
import { cx } from '@/lib/cx'
import { ctaLinks } from '@/lib/links'
import { href, type Locale } from '@/lib/routes'
import { SHOW_PENDING } from '@/lib/site'
import { FactToggle, PersonBio } from './PersonDetails'
import { ReviewSlider } from './ReviewSlider'
import { TeamRoster } from './TeamRoster'

type P = { locale: Locale; c: SiteContent }

/** Specialization, languages and register entries; whatever the client has supplied. */
function PersonFacts({ person, c }: { person: Person; c: SiteContent }) {
  const { languages, specialization, registry } = person
  if (!languages && !specialization && !registry) return null
  return (
    <dl className="facts">
      {specialization && (
        <FactToggle label={c.ui.specialization}>
          <ul className="facts__list">{specialization.map((x) => <li key={x}>{x}</li>)}</ul>
        </FactToggle>
      )}
      {languages && (
        <div className="facts__group">
          <dt className="facts__label">{c.ui.languages}</dt>
          <dd><ul className="flex flex-wrap gap-1.5">{languages.map((x) => <li key={x} className="tag">{x}</li>)}</ul></dd>
        </div>
      )}
      {registry?.map((r) => (
        <div key={r.value + r.label} className="facts__group">
          <dt className="facts__label">{r.label}</dt>
          <dd className="facts__reg">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** An expert's profile: portrait or monogram, then name, bio and facts. */
const ExpertProfile = ({ person, c }: { person: Person; c: SiteContent }) => (
  <article className="expert reveal">
    <div className="expert__media">
      <ImageWrapper image={person.image} fallback={<Monogram name={person.name} dark />} sizes="(max-width: 1023px) 100vw, 30vw" className="h-full w-full !rounded-inner" />
    </div>
    <div className="expert__body">
      <header>
        <p className="t-label text-muted">{person.role}</p>
        <h3 className="expert__name">{person.name}</h3>
      </header>
      {person.bio
        ? <PersonBio paragraphs={person.bio} more={c.ui.readMore} less={c.ui.readLess} />
        : SHOW_PENDING && <Pending label={c.ui.pending} />}
      <PersonFacts person={person} c={c} />
    </div>
  </article>
)

export function TeamSection({ locale, c, heading, full }: P & { heading?: Heading; full?: boolean }) {
  const [founder, ...experts] = c.people
  if (full) {
    return (
      <>
        <Section>
          <div className="split split--media-left">
            <div className="split__head reveal">
              <p className="t-label eyebrow">{c.ui.founder}</p>
              <h2 className="t-h1-page mt-4">{founder.name}</h2>
            </div>
            <div className="split__media">
              <ImageWrapper image={founder.image} fallback={<Monogram name={founder.name} dark />} sizes="(max-width: 1023px) 100vw, 40vw" className="aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[520px]" />
            </div>
            <div className="split__body reveal fdr">
              <p className="t-lead">{founder.role}{founder.experience && ` · ${founder.experience}`}</p>
              {founder.bio && <PersonBio paragraphs={founder.bio} more={c.ui.readMore} less={c.ui.readLess} className="max-w-[60ch] text-muted" />}
              {/* The office's own approach, as stated in the home "about" block. */}
              <blockquote className="fdr__quote">{c.home.about.paragraphs[0]}</blockquote>
              <dl className="fdr__stats">
                {c.home.trust.map((s) => (
                  <div key={s.label} className="fdr__stat">
                    <dd><CountUp value={s.value} /></dd>
                    <dt>{s.label}</dt>
                  </div>
                ))}
              </dl>
              <ul className="flex flex-wrap gap-2">
                {[c.ui.nav.credits, c.ui.nav.property, c.ui.nav.insurance].map((area) => <li key={area} className="tag">{area}</li>)}
              </ul>
              <PersonFacts person={founder} c={c} />
            </div>
            <div className="split__cta reveal">
              <div className="btn-group"><Button href={ctaLinks(locale).consult}>{c.ui.consult}</Button></div>
            </div>
          </div>
        </Section>
        <Section>
          <SectionHeader {...c.pages.team.experts} />
          <div className="grid gap-tile">
            {experts.map((p) => <ExpertProfile key={p.id} person={p} c={c} />)}
          </div>
        </Section>
      </>
    )
  }
  return (
    <Section>
      <div className="roster">
        <header className="roster__head">
          {heading && <p className="t-label eyebrow reveal">{heading.eyebrow}</p>}
          {heading && <h2 className="t-h1-page mt-4" data-reveal><Words text={heading.h2} /></h2>}
          <p className="t-lead reveal mt-4 text-muted">{c.pages.team.lead}</p>
        </header>
        <TeamRoster people={c.people} />
        <div className="roster__cta btn-group reveal">
          <Button href={ctaLinks(locale).consult}>{c.ui.consult}</Button>
          <Button href={href(locale, { key: 'team' })} variant="secondary">{c.ui.nav.team}</Button>
        </div>
      </div>
    </Section>
  )
}

/** One card per case: the floor plan (or photo) with the headline figure in a white tag, then the title, figures and link. Side by side from 640px. */
export function CaseCard({ item, locale, c, index = 0 }: P & { item: CaseStudy; index?: number }) {
  return (
    <Link href={href(locale, { key: 'case', id: item.id })} className="card-link case reveal">
      <div className="case__media">
        <ImageWrapper image={item.image} fallback={<FloorPlan variant={index} />} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 40vw, 20vw" className="h-full w-full !rounded-inner" />
        <p className="case__stat">
          <span className="case__value"><CountUp value={item.highlight.value} /></span>
          <span className="t-label">{item.highlight.label}</span>
        </p>
      </div>
      <div className="case__body">
        <div className="case__head">
          <h3 className="case__title">{item.title}</h3>
          <span className="chip"><Plus /></span>
        </div>
        <dl className="case__stats">
          {item.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
        <span className="case__more">{c.ui.seeCase}<Arrow size={16} /></span>
      </div>
    </Link>
  )
}

export const CasesSection = ({ locale, c, heading }: P & { heading?: Heading }) => (
  <Section>
    {heading && <SectionHeader {...heading} />}
    <div className="grid gap-tile lg:grid-cols-2">
      {c.cases.map((item, i) => <CaseCard key={item.id} item={item} locale={locale} c={c} index={i} />)}
    </div>
  </Section>
)

export function Reviews({ c }: { c: SiteContent }) {
  const r = c.home.reviews
  if (!r.items.length && !SHOW_PENDING) return null
  return (
    <Section>
      <div className="reviews panel-dark surface">
        <SectionHeader eyebrow={r.eyebrow} h2={r.h2} lead={r.lead} dark />
        {r.items.length > 0
          ? <ReviewSlider items={r.items} labels={{ prev: c.ui.prev, next: c.ui.next, source: c.ui.source, video: c.ui.watchVideo }} />
          : <div className="[&_.pending]:border-on-dark-line [&_.pending]:text-on-dark"><Pending label={c.ui.pending} /></div>}
      </div>
    </Section>
  )
}

/** FAQ cards; with `groups` they sit under tabs, which disappear when only one tab still has questions. */
export function FaqSection({ heading, items, groups, pendingLabel }: { heading: Heading; items: Faq[]; groups?: FaqGroup[]; pendingLabel: string }) {
  const visible = visibleFaqs(items)
  if (!visible.length) return null
  const tabs = (groups ?? []).map((g) => ({ ...g, items: visibleFaqs(g.items) })).filter((g) => g.items.length)
  return (
    <Section>
      <SectionHeader {...heading} />
      <div className="reveal lg:ml-[calc((100%+24px)/4)]">
        {tabs.length > 1 ? <FaqTabs groups={tabs} pendingLabel={pendingLabel} /> : <Accordion items={visible} pendingLabel={pendingLabel} />}
      </div>
    </Section>
  )
}

export function ArticleCard({ article, locale, c, featured }: P & { article: Article; featured?: boolean }) {
  const to = href(locale, { key: 'article', id: article.id })
  const label = <p className="t-label post__cat">{c.categories[article.category]}</p>
  const meta = (
    <div>
      {article.date && <p className="post__date">{article.date}</p>}
      <h3 className="post__title">{article.title}</h3>
      {article.excerpt && <p className="post__excerpt">{article.excerpt}</p>}
    </div>
  )
  if (featured) {
    return (
      <Link href={to} className="card-link post post--image reveal">
        <ImageWrapper image={article.cover} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" className="!absolute inset-0 -z-10 !rounded-none" />
        <span className="t-label self-end rounded-[50px] bg-white px-3 py-1.5 text-brown">{c.categories[article.category]}</span>
        <div className="rounded-inner bg-white p-4 text-brown">{meta}</div>
      </Link>
    )
  }
  return (
    <Link href={to} className="card-link post reveal">
      <div className="post__top flex items-start justify-between gap-4">
        <ImageWrapper image={article.cover} sizes="160px" className="post__thumb flex-none" />
        {label}
      </div>
      {meta}
    </Link>
  )
}

/** Home blog: the shared section header and three equal article cards. */
export function BlogSection({ locale, c }: P) {
  const list = visibleArticles(c).slice(0, 3)
  if (!list.length) return null
  return (
    <Section>
      <div className="blog">
        <SectionHeader {...c.home.blog} className="blog__head" />
        <div className="blog-grid">
          {list.map((a) => <ArticleCard key={a.id} article={a} locale={locale} c={c} />)}
        </div>
        <div className="blog__cta btn-group">
          <Button href={href(locale, { key: 'blog' })} variant="secondary">{c.ui.allArticles}</Button>
        </div>
      </div>
    </Section>
  )
}

/** SEO text above the footer: centred uppercase heading, the full text in a short box that scrolls inside. */
export const SeoText = ({ c }: { c: SiteContent }) => (
  <Section>
    <div className="seo reveal">
      <h2 id="seo-text" className="seo__title">{c.home.seoText.h2}</h2>
      <ScrollBox labelledBy="seo-text" className="seo__box">
        {c.home.seoText.paragraphs.map((p) => <p key={p}>{p}</p>)}
      </ScrollBox>
    </div>
  </Section>
)

export const LinkTile = ({ title, to, more }: { title: string; to: string; more: string }) => (
  <Link href={to} className="tile card-link reveal">
    <h3 className="tile__title">{title}</h3>
    <span className="flex items-center justify-between text-[0.9375rem] font-medium">{more}<span className="chip"><Arrow /></span></span>
  </Link>
)
