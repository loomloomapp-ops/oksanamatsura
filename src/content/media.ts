import type { CaseId, ServiceKey } from '@/lib/routes'
import type { ImageSlot, SiteContent } from './types'

/**
 * Photographs shared by all languages. Replace a path here to change it everywhere.
 * These are temporary CC0 architecture images, see docs/image-credits.md.
 * Portraits and the office stay empty until the client supplies them. Case images are illustrations supplied by the user.
 */
export const MEDIA = {
  hero: '/images/hero-interior.webp',
  advantages: '/images/stairs-stone.webp',
  process: '/images/process-keys.webp',
  services: { credit: '/images/facade-rise.webp', property: '/images/interior-light.webp', insurance: '/images/roof-angle.webp' },
  credits: '/images/facade-rise.webp',
  property: '/images/interior-light.webp',
  insurance: '/images/stairs-stone.webp',
  /** Primary market: a new-build facade; secondary market: an older tenement. */
  propertyTypes: ['/images/facade-white.webp', '/images/tenement.webp'],
  pages: {
    mortgage: '/images/facade-lines.webp',
    cash: '/images/balcony-glass.webp',
    refinancing: '/images/balcony-curve.webp',
    consolidation: '/images/interior-window.webp',
    otherCredit: '/images/roof-angle.webp',
  } satisfies Record<ServiceKey, string>,
  cases: {
    ilawa: { src: '/images/case-ilawa.webp', position: '80% 60%' },
    'new-build': { src: '/images/case-new-build.webp', position: '45% 45%' },
  } satisfies Record<CaseId, { src: string; position: string }>,
  /** Contact page: an illustration of an office with a view of Łódź, supplied by the user; not the real office. */
  contact: '/images/contact-office.webp',
  articles: ['/images/interior-window.webp', '/images/balcony-glass.webp', '/images/facade-lines.webp', '/images/interior-light.webp'],
}

/** Stock images are decorative, so they get an empty alt instead of the real photo's description. */
function stock(slot: ImageSlot, src: string, position?: string) {
  slot.src = src
  slot.alt = ''
  if (position) slot.position = position
}

export function applyMedia(c: SiteContent): SiteContent {
  const copy = structuredClone(c)
  stock(copy.home.hero.image, MEDIA.hero)
  for (const key of ['credit', 'property', 'insurance'] as const) stock(copy.home.services[key].image, MEDIA.services[key])
  stock(copy.pages.credits.image, MEDIA.credits)
  stock(copy.pages.property.image, MEDIA.property)
  stock(copy.pages.insurance.image, MEDIA.insurance)
  for (const key of Object.keys(MEDIA.pages) as ServiceKey[]) stock(copy.pages.services[key].image, MEDIA.pages[key])
  for (const item of copy.cases) stock(item.image, MEDIA.cases[item.id].src, MEDIA.cases[item.id].position)
  stock(copy.pages.contact.image, MEDIA.contact, '92% 50%')
  copy.articles.forEach((a, i) => stock(a.cover, MEDIA.articles[i % MEDIA.articles.length]))
  return copy
}
