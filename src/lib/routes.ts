export const LOCALES = ['pl', 'ua', 'ru'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'pl'
/** ISO language codes: Ukrainian is "uk" even though the URL and label use "ua". */
export const HTML_LANG: Record<Locale, string> = { pl: 'pl', ua: 'uk', ru: 'ru' }

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v)

export type StaticKey =
  | 'home' | 'credits' | 'mortgage' | 'cash' | 'refinancing' | 'consolidation' | 'otherCredit'
  | 'property' | 'insurance' | 'team' | 'cases' | 'blog' | 'contact' | 'privacy' | 'cookies'
export type ServiceKey = 'mortgage' | 'cash' | 'refinancing' | 'consolidation' | 'otherCredit'
export type CaseId = 'ilawa' | 'new-build'
export type ArticleId = 'ukrainians' | 'no-deposit' | 'zlecenie' | 'income'
export type CategoryId = 'mortgage' | 'credits' | 'property' | 'insurance' | 'foreigners'

export type PageRef =
  | { key: StaticKey }
  | { key: 'case'; id: CaseId }
  | { key: 'article'; id: ArticleId }
  | { key: 'category'; id: CategoryId }

type L = Record<Locale, string>

const STATIC_PATHS: Record<StaticKey, L> = {
  home: { pl: '', ua: '', ru: '' },
  credits: { pl: 'kredyty', ua: 'kredyty', ru: 'kredity' },
  mortgage: { pl: 'kredyty/kredyt-hipoteczny', ua: 'kredyty/ipoteka', ru: 'kredity/ipoteka' },
  cash: { pl: 'kredyty/kredyt-gotowkowy', ua: 'kredyty/hotivkovyi-kredyt', ru: 'kredity/nalichnyj-kredit' },
  refinancing: { pl: 'kredyty/refinansowanie', ua: 'kredyty/refinansuvannia', ru: 'kredity/refinansirovanie' },
  consolidation: { pl: 'kredyty/konsolidacja', ua: 'kredyty/konsolidatsiia', ru: 'kredity/konsolidaciya' },
  otherCredit: { pl: 'kredyty/inne-uslugi', ua: 'kredyty/inshi-posluhy', ru: 'kredity/drugie-uslugi' },
  property: { pl: 'nieruchomosci', ua: 'nerukhomist', ru: 'nedvizhimost' },
  insurance: { pl: 'ubezpieczenia', ua: 'strakhuvannia', ru: 'strahovanie' },
  team: { pl: 'zespol', ua: 'komanda', ru: 'komanda' },
  cases: { pl: 'realizacje', ua: 'keisy', ru: 'kejsy' },
  blog: { pl: 'blog', ua: 'blog', ru: 'blog' },
  contact: { pl: 'kontakt', ua: 'kontakty', ru: 'kontakty' },
  privacy: { pl: 'polityka-prywatnosci', ua: 'polityka-konfidentsiinosti', ru: 'politika-konfidencialnosti' },
  cookies: { pl: 'cookies', ua: 'cookies', ru: 'cookies' },
}

const CASE_SLUGS: Record<CaseId, L> = {
  ilawa: { pl: 'kredyt-hipoteczny-para-z-ilawy', ua: 'ipoteka-dlia-pary-z-ilavy', ru: 'ipoteka-dlya-pary-iz-ilavy' },
  'new-build': { pl: 'mieszkanie-w-nowym-budownictwie', ua: 'kvartyra-u-novobudovi', ru: 'kvartira-v-novostrojke' },
}

const ARTICLE_SLUGS: Record<ArticleId, L> = {
  ukrainians: { pl: 'kredyt-hipoteczny-w-polsce-dla-ukraincow', ua: 'ipoteka-v-polshchi-dlia-ukraintsiv', ru: 'ipoteka-v-polshe-dlya-ukraincev' },
  'no-deposit': { pl: 'kredyt-hipoteczny-bez-wkladu-wlasnego', ua: 'ipoteka-bez-pershoho-vnesku', ru: 'ipoteka-bez-pervogo-vznosa' },
  zlecenie: { pl: 'kredyt-na-umowe-zlecenie', ua: 'kredyt-na-umowa-zlecenie', ru: 'kredit-na-umowa-zlecenie' },
  income: { pl: 'jaki-dochod-do-kredytu-hipotecznego', ua: 'yakyi-dokhid-potriben-dlia-ipoteky', ru: 'kakoj-dohod-nuzhen-dlya-ipoteki' },
}

const CATEGORY_WORD: L = { pl: 'kategoria', ua: 'katehoriia', ru: 'kategoriya' }
const CATEGORY_SLUGS: Record<CategoryId, L> = {
  mortgage: { pl: 'kredyt-hipoteczny', ua: 'ipoteka', ru: 'ipoteka' },
  credits: { pl: 'kredyty', ua: 'kredyty', ru: 'kredity' },
  property: { pl: 'nieruchomosci', ua: 'nerukhomist', ru: 'nedvizhimost' },
  insurance: { pl: 'ubezpieczenia', ua: 'strakhuvannia', ru: 'strahovanie' },
  foreigners: { pl: 'kredyty-dla-obcokrajowcow', ua: 'kredyty-dlia-inozemtsiv', ru: 'kredity-dlya-inostrancev' },
}

function pathOf(locale: Locale, ref: PageRef): string {
  switch (ref.key) {
    case 'case':
      return `${STATIC_PATHS.cases[locale]}/${CASE_SLUGS[ref.id][locale]}`
    case 'article':
      return `${STATIC_PATHS.blog[locale]}/${ARTICLE_SLUGS[ref.id][locale]}`
    case 'category':
      return `${STATIC_PATHS.blog[locale]}/${CATEGORY_WORD[locale]}/${CATEGORY_SLUGS[ref.id][locale]}`
    default:
      return STATIC_PATHS[ref.key][locale]
  }
}

/** Public URL path of a page, without the domain. Polish has no prefix. */
export function href(locale: Locale, ref: PageRef): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`
  const path = pathOf(locale, ref)
  return `${prefix}${path ? `/${path}` : ''}` || '/'
}

const keys = <T extends string>(o: Record<T, unknown>) => Object.keys(o) as T[]

export const ALL_REFS: PageRef[] = [
  ...keys(STATIC_PATHS).map((key) => ({ key })),
  ...keys(CASE_SLUGS).map((id) => ({ key: 'case' as const, id })),
  ...keys(ARTICLE_SLUGS).map((id) => ({ key: 'article' as const, id })),
  ...keys(CATEGORY_SLUGS).map((id) => ({ key: 'category' as const, id })),
]

const INDEX = new Map<string, PageRef>(
  LOCALES.flatMap((l) => ALL_REFS.map((ref) => [`${l}:${pathOf(l, ref)}`, ref] as const)),
)

export function resolve(locale: Locale, segments: string[] = []): PageRef | null {
  return INDEX.get(`${locale}:${segments.map(decodeURIComponent).join('/')}`) ?? null
}

export function staticParams(): { locale: Locale; slug: string[] }[] {
  return LOCALES.flatMap((locale) =>
    ALL_REFS.map((ref) => ({ locale, slug: pathOf(locale, ref).split('/').filter(Boolean) })),
  )
}

export const CATEGORY_IDS = keys(CATEGORY_SLUGS)

export const SERVICE_KEYS: ServiceKey[] = ['mortgage', 'cash', 'refinancing', 'consolidation', 'otherCredit']
