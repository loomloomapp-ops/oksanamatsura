import type { MetadataRoute } from 'next'
import { getContent, isDraft } from '@/content'
import { ALL_REFS, href, HTML_LANG, LOCALES } from '@/lib/routes'
import { SITE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const drafts = new Set(getContent('pl').articles.filter((a) => isDraft('pl', a.id)).map((a) => a.id))
  const refs = ALL_REFS.filter((r) => {
    if (r.key === 'privacy' || r.key === 'cookies') return false
    return !(r.key === 'article' && drafts.has(r.id))
  })
  return refs.flatMap((ref) =>
    LOCALES.map((l) => ({
      url: `${SITE.url}${href(l, ref)}`,
      alternates: { languages: Object.fromEntries(LOCALES.map((x) => [HTML_LANG[x], `${SITE.url}${href(x, ref)}`])) },
    })),
  )
}
