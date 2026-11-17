import { href, type Locale } from './routes'

export const FORM_ANCHOR = 'formularz'
export const CHECK_ANCHOR = 'zdolnosc'
/** Query parameter on a consultation link that names the expert the visitor books with (a `Person.id`). */
export const EXPERT_PARAM = 'ekspert'

export const ctaLinks = (locale: Locale) => ({
  consult: `${href(locale, { key: 'contact' })}#${FORM_ANCHOR}`,
  check: `${href(locale, { key: 'home' })}#${CHECK_ANCHOR}`,
})

/** A consultation link booked with one expert: opens the pop-up with their photo and name, and tags the lead with them. */
export const expertConsult = (locale: Locale, id: string) =>
  `${href(locale, { key: 'contact' })}?${EXPERT_PARAM}=${encodeURIComponent(id)}#${FORM_ANCHOR}`
