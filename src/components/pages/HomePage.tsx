import { HomeHero } from '@/components/sections/Hero'
import { AboutExpert, Advantages, CreditCheck, Process, processCta, ServicesBento, TrustBar } from '@/components/sections/HomeSections'
import { BlogSection, CasesSection, FaqSection, Reviews, SeoText, TeamSection } from '@/components/sections/Shared'
import type { SiteContent } from '@/content/types'
import type { Locale } from '@/lib/routes'

export function HomePage({ locale, c }: { locale: Locale; c: SiteContent }) {
  const h = c.home
  return (
    <>
      <HomeHero locale={locale} c={c} after={<TrustBar items={h.trust} />} />
      <ServicesBento locale={locale} c={c} />
      <Advantages heading={h.advantages} items={h.advantages.items} cta={processCta(locale, c)} />
      <CreditCheck locale={locale} c={c} />
      <TeamSection locale={locale} c={c} heading={h.team} />
      <Process heading={h.process} steps={h.process.steps} cta={processCta(locale, c)} />
      <AboutExpert c={c} />
      <CasesSection locale={locale} c={c} heading={h.cases} />
      <Reviews c={c} />
      <FaqSection heading={h.faq} items={h.faq.items} groups={h.faq.groups} pendingLabel={c.ui.pending} />
      <BlogSection locale={locale} c={c} />
      <SeoText c={c} />
    </>
  )
}
