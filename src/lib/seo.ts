import type { Metadata } from 'next'
import { href, HTML_LANG, LOCALES, type Locale, type PageRef } from './routes'
import { SITE } from './site'

export function pageMetadata(locale: Locale, ref: PageRef, meta: { title: string; description: string; noindex?: boolean }): Metadata {
  const languages: Record<string, string> = Object.fromEntries(
    LOCALES.map((l) => [HTML_LANG[l], `${SITE.url}${href(l, ref)}`]),
  )
  languages['x-default'] = `${SITE.url}${href('pl', ref)}`
  const url = `${SITE.url}${href(locale, ref)}`
  return {
    metadataBase: new URL(SITE.url),
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url, languages },
    robots: meta.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'website', url, title: meta.title, description: meta.description, siteName: SITE.brand,
      locale: { pl: 'pl_PL', ua: 'uk_UA', ru: 'ru_RU' }[locale],
      images: [{ url: '/brand/og.png', width: 1200, height: 630 }],
    },
  }
}

export function organizationLd(locale: Locale, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: `${SITE.brand} | Ekspert finansowy`,
    description,
    url: `${SITE.url}${href(locale, { key: 'home' })}`,
    telephone: SITE.phone,
    areaServed: 'PL',
    sameAs: [SITE.instagram, SITE.facebook].filter(Boolean),
    address: { '@type': 'PostalAddress', streetAddress: SITE.street, addressLocality: SITE.city, addressCountry: 'PL' },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '18:00',
    },
  }
}

export function faqLd(items: { q: string; a: string | null }[]) {
  const answered = items.filter((i) => i.a)
  if (!answered.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: answered.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  }
}
