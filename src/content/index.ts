import type { ArticleId, Locale } from '@/lib/routes'
import { SHOW_PENDING } from '@/lib/site'
import { applyMedia } from './media'
import { pl } from './pl'
import { ru } from './ru'
import { SAMPLE_ARTICLES } from './sample-articles'
import { SAMPLE_REVIEWS } from './sample-reviews'
import { SAMPLE_INSURANCE_HELP, SAMPLE_SERVICE_TEXT } from './sample-services'
import type { Faq, SiteContent } from './types'
import { ua } from './ua'

/** Keeps one-letter words (i, w, z, в, у, з…) off line ends and dashes off line starts. */
function bindShortWords<T>(value: T): T {
  if (typeof value === 'string') return value.replace(/(?<=^|[\s\u00A0(„«])(\p{L})\s/gu, '$1\u00A0').replace(/\s—\s/g, '\u00A0— ') as T
  if (Array.isArray(value)) return value.map(bindShortWords) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, bindShortWords(v)])) as T
  }
  return value
}

/**
 * Sample reviews and article texts stand in only while placeholders are enabled, and only where the client's
 * material is still missing: reviews when none were added, article date, excerpt and body and property service
 * descriptions when they are `null`, insurance "how we help you choose" points when none were supplied.
 */
function withSamples(c: SiteContent, locale: Locale): SiteContent {
  if (!SHOW_PENDING) return c
  const articles = c.articles.map((a) => {
    const s = SAMPLE_ARTICLES[locale][a.id]
    return { ...a, date: a.date ?? s.date, excerpt: a.excerpt ?? s.excerpt, body: a.body ?? s.body }
  })
  const reviews = c.home.reviews.items.length ? c.home.reviews : { ...c.home.reviews, items: SAMPLE_REVIEWS[locale] }
  const services = c.pages.property.services
  const serviceItems = services.items.map((s, i) => ({ ...s, text: s.text ?? SAMPLE_SERVICE_TEXT[locale][i] ?? null }))
  const property = { ...c.pages.property, services: { ...services, items: serviceItems } }
  const help = c.pages.insurance.help
  const insurance = { ...c.pages.insurance, help: { ...help, items: help.items?.length ? help.items : SAMPLE_INSURANCE_HELP[locale] } }
  return { ...c, articles, home: { ...c.home, reviews }, pages: { ...c.pages, property, insurance } }
}

const prepare = (c: SiteContent, locale: Locale) => applyMedia(bindShortWords(withSamples(c, locale)))
const RAW: Record<Locale, SiteContent> = { pl, ua, ru }
const CONTENT: Record<Locale, SiteContent> = { pl: prepare(pl, 'pl'), ua: prepare(ua, 'ua'), ru: prepare(ru, 'ru') }
export const getContent = (locale: Locale) => CONTENT[locale]

/** Unanswered questions are shown only while placeholders are enabled. */
export const visibleFaqs = (items: Faq[]) => items.filter((f) => f.a !== null || SHOW_PENDING)
/** An article whose client text has not arrived. Sample text does not count, so drafts stay out of the sitemap and are noindex. */
export const isDraft = (locale: Locale, id: ArticleId) => RAW[locale].articles.find((a) => a.id === id)?.body === null
/** Articles without a body are drafts: visible with placeholders, hidden in production. */
export const visibleArticles = (c: SiteContent) => c.articles.filter((a) => a.body !== null || SHOW_PENDING)
