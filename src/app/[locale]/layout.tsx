import { Montserrat } from 'next/font/google'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { PRELOADER_BOOT, PremiumPreloader } from '@/components/layout/PremiumPreloader'
import { HTML_LANG, isLocale, LOCALES } from '@/lib/routes'
import '../globals.css'

// `subsets` only controls preloading: Cyrillic files are still served and load when a page needs them.
const montserrat = Montserrat({ subsets: ['latin', 'latin-ext'], variable: '--font-montserrat', display: 'swap' })

export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }))

export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return (
    <html lang={HTML_LANG[locale]} className={montserrat.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Adds `js` and, before the first paint, decides whether the preloader runs (see PremiumPreloader). */}
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_BOOT }} />
      </head>
      <body>
        <PremiumPreloader />
        {children}
      </body>
    </html>
  )
}
