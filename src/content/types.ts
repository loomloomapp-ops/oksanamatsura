import type { ArticleId, CaseId, CategoryId, ServiceKey, StaticKey } from '@/lib/routes'

/** No `src` means the client's photograph has not been supplied yet. */
export type ImageSlot = { src?: string; alt: string; position?: string }
/** `null` means the client's text has not been supplied yet. It must not be invented. */
export type Pending<T> = T | null

export type Faq = { q: string; a: Pending<string> }
/** A tab of the home FAQ. Its items are the same objects as in `items`, which stays the full list for structured data. */
export type FaqGroup = { label: string; icon: 'credit' | 'cooperation'; items: Faq[] }
export type Item = { title: string; text?: Pending<string> }
export type Stat = { value: string; label: string }
export type Heading = { eyebrow: string; h2: string; lead?: string }

/** A public register entry, e.g. the KNF register of mortgage credit agents. */
export type Registry = { label: string; value: string }

export type Person = {
  id: string
  name: string
  role: string
  experience?: string
  /** Paragraphs. */
  bio: Pending<string[]>
  languages: Pending<string[]>
  specialization: Pending<string[]>
  registry: Pending<Registry[]>
  image: ImageSlot
}

export type CaseStudy = {
  id: CaseId
  /** The client's label for the case, e.g. mortgage or property. */
  category: string
  title: string
  summary: string
  /** The client's account: situation or request, what was done, result. */
  story: { label: string; text: string }[]
  highlight: Stat
  stats: Stat[]
  image: ImageSlot
  /** Optional link to a video version of the case. */
  video?: string
}

export type Review = {
  id: string
  author: string
  text?: string
  image?: ImageSlot
  video?: string
  source?: string
}

export type ArticleBlock = { type: 'h2' | 'h3' | 'p'; text: string }

export type Article = {
  id: ArticleId
  category: CategoryId
  title: string
  excerpt: Pending<string>
  date: Pending<string>
  author: Pending<string>
  cover: ImageSlot
  body: Pending<ArticleBlock[]>
  faq: Faq[]
}

export type HeroCopy = { eyebrow: string; title: string; lead: string; image: ImageSlot }
export type ServicePage = HeroCopy & { faq: Faq[]; description: Pending<string[]> }

export type FormCopy = {
  name: string
  phone: string
  submit: string
  sending: string
  success: string
  failure: string
  required: string
  invalidName: string
  invalidPhone: string
  invalidEmail: string
  consentRequired: string
  /** Quiz navigation; `step` holds `{n}` and `{total}`. */
  quiz: { next: string; back: string; step: string }
  /** The client's Google Form: intro for the pop-up and its consent, which names the data controller. */
  questionnaire: { intro: string; consentBefore: string; consentLink: string; consentAfter: string }
}

export type CalculatorCopy = Record<'title' | 'household' | 'income' | 'otherLoans' | 'limits' | 'people' | 'planned' | 'term' | 'years' | 'rate' | 'result' | 'payment' | 'note', string>

export type SiteContent = {
  ui: {
    nav: Record<'home' | 'credits' | 'property' | 'insurance' | 'team' | 'cases' | 'blog' | 'contact', string>
    allCredits: string
    consult: string
    getConsult: string
    consultShort: string
    check: string
    more: string
    seeCase: string
    watchVideo: string
    allArticles: string
    allCategories: string
    openMenu: string
    closeMenu: string
    close: string
    languageLabel: string
    pending: string
    languages: string
    specialization: string
    readMore: string
    readLess: string
    prev: string
    next: string
    source: string
    backToBlog: string
    related: string
    author: string
    date: string
    questions: string
    founder: string
  }
  form: FormCopy
  seo: Record<StaticKey, { title: string; description: string }>
  serviceNames: Record<ServiceKey, string>
  categories: Record<CategoryId, string>
  home: {
    hero: HeroCopy & { experience: string; caption: string; captionRole: string }
    trust: Stat[]
    services: Heading & Record<'credit' | 'property' | 'insurance', { title: string; text: string; items: string[]; image: ImageSlot }>
    advantages: Heading & { items: Item[] }
    creditCheck: Heading
    team: Heading
    process: Heading & { steps: Item[] }
    about: Heading & { paragraphs: string[]; image: ImageSlot }
    cases: Heading
    reviews: Heading & { items: Review[] }
    faq: Heading & { items: Faq[]; groups?: FaqGroup[] }
    blog: Heading
    seoText: { h2: string; paragraphs: string[] }
  }
  people: Person[]
  cases: CaseStudy[]
  articles: Article[]
  calculator: CalculatorCopy
  cta: { h2: string; lead: string }
  pages: {
    credits: HeroCopy & { types: Heading; why: Heading; process: Heading; cases: Heading; faq: Heading & { items: Faq[] } }
    services: Record<ServiceKey, ServicePage>
    serviceSections: { about: string; benefits: Heading; process: Heading; faq: Heading }
    otherCreditItems: string[]
    property: HeroCopy & {
      types: Heading & { items: Item[] }
      services: Heading & { items: Item[] }
      benefits: Heading
      process: Heading & { steps: Item[] }
      combo: Heading & { text: string }
      cases: Heading
      faq: Heading & { items: Faq[] }
    }
    insurance: HeroCopy & {
      types: Heading & { items: Item[] }
      /** `items`: how the team helps choose; not supplied by the client yet. */
      help: Heading & { text: string; items?: Item[] }
      benefits: Heading
      process: Heading & { steps?: Item[] }
      faq: Heading & { items?: Faq[] }
    }
    team: HeroCopy & { experts: Heading }
    /** `instagram`: the client's Instagram posts, linked as cards (`INSTAGRAM_POSTS` in `lib/site`). */
    cases: HeroCopy & { instagram: Heading & { item: string; open: string } }
    blog: HeroCopy
    contact: HeroCopy & {
      office: string
      phone: string
      hours: string
      hoursValue: string
      map: string
      formEyebrow: string
      formTitle: string
      formLead: string
    }
    privacy: { title: string }
    cookies: { title: string }
  }
  footer: {
    description: string
    navigation: string
    services: string
    contacts: string
    privacy: string
    cookies: string
    disclaimer: string
    rights: string
  }
}
