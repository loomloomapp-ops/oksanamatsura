import { href, type Locale } from './routes'

export const FORM_ANCHOR = 'formularz'
export const CHECK_ANCHOR = 'zdolnosc'

export const ctaLinks = (locale: Locale) => ({
  consult: `${href(locale, { key: 'contact' })}#${FORM_ANCHOR}`,
  check: `${href(locale, { key: 'home' })}#${CHECK_ANCHOR}`,
})
