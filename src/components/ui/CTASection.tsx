import type { SiteContent } from '@/content/types'
import { ctaLinks } from '@/lib/links'
import type { Locale } from '@/lib/routes'
import { Button } from './Button'
import { Container } from './Container'
import { Words } from './Words'

export const CTASection = ({ locale, c }: { locale: Locale; c: SiteContent }) => {
  const links = ctaLinks(locale)
  return (
    <section className="section">
      <Container>
        <div className="panel-dark surface grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-6">
          <div className="lg:col-span-7">
            <h2 className="t-h2" data-reveal><Words text={c.cta.h2} /></h2>
            <p className="reveal mt-3 text-on-dark">{c.cta.lead}</p>
          </div>
          <div className="cta-actions reveal lg:col-span-5">
            <Button href={links.consult} variant="light">{c.ui.consult}</Button>
            <Button href={links.check} variant="ghost">{c.ui.check}</Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
