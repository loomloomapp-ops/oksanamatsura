import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Animate } from '@/components/layout/Animate'
import { ConsultModal } from '@/components/layout/ConsultModal'
import { LeadForm } from '@/components/forms/LeadForm'
import { ContactRows } from '@/components/sections/HomeSections'
import { Footer } from '@/components/layout/Footer'
import { MobileBar } from '@/components/layout/MobileBar'
import { Header, type NavItem } from '@/components/layout/Header'
import { HomePage } from '@/components/pages/HomePage'
import {
  ArticlePage, BlogPage, CaseDetailPage, CasesPage, ContactPage, CreditsPage, InsurancePage, LegalPage, PropertyPage, ServicePage, TeamPage,
} from '@/components/pages/InnerPages'
import { getContent, isDraft } from '@/content'
import type { SiteContent } from '@/content/types'
import { ctaLinks } from '@/lib/links'
import { href, isLocale, SERVICE_KEYS, LOCALES, resolve, staticParams, type Locale, type PageRef, type ServiceKey } from '@/lib/routes'
import { faqLd, organizationLd, pageMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

type Props = { params: Promise<{ locale: string; slug?: string[] }> }

const isService = (k: string): k is ServiceKey => (SERVICE_KEYS as string[]).includes(k)

export const generateStaticParams = staticParams

async function load({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const ref = resolve(locale, slug)
  if (!ref) notFound()
  return { locale, ref, c: getContent(locale) }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, ref, c } = await load(props)
  if (ref.key === 'case') {
    const item = c.cases.find((x) => x.id === ref.id)!
    return pageMetadata(locale, ref, { title: `${item.title} | ${SITE.brand}`, description: item.summary })
  }
  if (ref.key === 'article') {
    const a = c.articles.find((x) => x.id === ref.id)!
    return pageMetadata(locale, ref, { title: `${a.title} | ${SITE.brand}`, description: a.excerpt ?? a.title, noindex: isDraft(locale, a.id) })
  }
  if (ref.key === 'category') {
    return pageMetadata(locale, ref, { title: `${c.categories[ref.id]} | ${SITE.brand}`, description: c.seo.blog.description })
  }
  return pageMetadata(locale, ref, { ...c.seo[ref.key], noindex: ref.key === 'privacy' || ref.key === 'cookies' })
}

function renderPage(locale: Locale, ref: PageRef, c: SiteContent) {
  const p = { locale, c }
  switch (ref.key) {
    case 'home': return <HomePage {...p} />
    case 'credits': return <CreditsPage {...p} />
    case 'property': return <PropertyPage {...p} />
    case 'insurance': return <InsurancePage {...p} />
    case 'team': return <TeamPage {...p} />
    case 'cases': return <CasesPage {...p} />
    case 'case': return <CaseDetailPage {...p} id={ref.id} />
    case 'blog': return <BlogPage {...p} />
    case 'category': return <BlogPage {...p} category={ref.id} />
    case 'article': return <ArticlePage {...p} id={ref.id} />
    case 'contact': return <ContactPage {...p} />
    case 'privacy': return <LegalPage c={c} title={c.pages.privacy.title} />
    case 'cookies': return <LegalPage c={c} title={c.pages.cookies.title} />
    default: return isService(ref.key) ? <ServicePage {...p} service={ref.key} /> : null
  }
}

function faqFor(ref: PageRef, c: SiteContent) {
  if (ref.key === 'home' || ref.key === 'credits') return c.home.faq.items
  if (ref.key === 'property') return c.pages.property.faq.items
  return isService(ref.key) ? c.pages.services[ref.key].faq : []
}

const json = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c')

export default async function Page(props: Props) {
  const { locale, ref, c } = await load(props)
  const links = ctaLinks(locale)
  const nav: NavItem[] = [
    { label: c.ui.nav.home, href: href(locale, { key: 'home' }) },
    {
      label: c.ui.nav.credits,
      href: href(locale, { key: 'credits' }),
      children: [
        { label: c.ui.allCredits, href: href(locale, { key: 'credits' }) },
        ...SERVICE_KEYS.map((key) => ({ label: c.serviceNames[key], href: href(locale, { key }) })),
      ],
    },
    { label: c.ui.nav.property, href: href(locale, { key: 'property' }) },
    { label: c.ui.nav.insurance, href: href(locale, { key: 'insurance' }) },
    { label: c.ui.nav.team, href: href(locale, { key: 'team' }) },
    { label: c.ui.nav.blog, href: href(locale, { key: 'blog' }) },
    { label: c.ui.nav.contact, href: href(locale, { key: 'contact' }) },
  ]
  const langs = LOCALES.map((l) => ({ code: l, label: l.toUpperCase(), href: href(l, ref), active: l === locale }))
  const ld = [
    (ref.key === 'home' || ref.key === 'contact') && organizationLd(locale, c.seo.home.description),
    faqLd(faqFor(ref, c)),
  ].filter(Boolean)

  return (
    <>
      <Header
        homeHref={href(locale, { key: 'home' })}
        nav={nav}
        langs={langs}
        languageLabel={c.ui.languageLabel}
        phone={SITE.phone}
        tel={SITE.tel}
        consultHref={links.consult}
        consultShort={c.ui.consultShort}
        consult={c.ui.consult}
        check={c.ui.check}
        checkHref={links.check}
        openMenu={c.ui.openMenu}
        closeMenu={c.ui.closeMenu}
      />
      <main>{renderPage(locale, ref, c)}</main>
      <Footer locale={locale} c={c} />
      <MobileBar href={links.consult} label={c.ui.consultShort} tel={SITE.tel} phone={SITE.phone} />
      <ConsultModal
        trigger={links.consult}
        eyebrow={c.pages.contact.formEyebrow}
        title={c.cta.h2}
        lead={c.form.questionnaire.intro}
        formTitle={c.pages.contact.formTitle}
        closeLabel={c.ui.close}
        aside={<ContactRows c={c} />}
      >
        <LeadForm kind="booking" locale={locale} copy={c.form} privacyHref={href(locale, { key: 'privacy' })} />
      </ConsultModal>
      <Animate />
      {ld.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(d) }} />)}
    </>
  )
}
