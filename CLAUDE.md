# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Website for the brand Oksana Matsura | Ekspert finansowy (mortgages, property and insurance in Poland), in Polish (default), Ukrainian and Russian. Next.js 16 App Router, TypeScript, Tailwind 4, Motion, React Hook Form, Zod.

## Paths

The project folder name ends with a trailing space (`.../Desktop/Кредитний експерт /`). Absolute paths without that space fail, so prefer paths relative to the working directory.

## Commands

```sh
npm run dev         # development server
npm run build       # production build, renders all locales statically
npm run start       # serve the production build
npm run typecheck   # tsc --noEmit
```

There is no test suite or linter. Port 3100 on this machine is often used by another project.

## Architecture

**Routing is custom, not next-intl.** `src/lib/routes.ts` is the single source of localized URLs. A `PageRef` (`{ key }`, or `{ key, id }` for cases, articles and categories) maps to a path per locale through `href()`, and `resolve()` maps a path back. All pages render through `src/app/[locale]/[[...slug]]/page.tsx`, which dispatches on the ref. `src/proxy.ts` rewrites unprefixed URLs to the `pl` locale and redirects `/pl/*` away. To add a page: add it to the route table, to `SiteContent`, and to `renderPage`.

The URL and label for Ukrainian are `ua`, but its ISO code (`lang`, `hreflang`) is `uk`. See `HTML_LANG`.

**Content is separate from components.** `src/content/{pl,ua,ru}.ts` each implement `SiteContent` (`types.ts`), so TypeScript enforces parity between languages. No CMS is connected yet.

**`null` means the client has not supplied this yet.** Do not invent bios, KNF numbers, FAQ answers, reviews, bank terms or rates. Fill the real value in the content file. An image slot without `src` renders a marked placeholder. `NEXT_PUBLIC_SHOW_PENDING=0` hides all placeholders, unanswered FAQs and articles without a body, and must be set for production. While placeholders are on, `src/content/sample-reviews.ts`, `sample-articles.ts` and `sample-services.ts` fill empty reviews, article date, excerpt and body, property service descriptions and the insurance "how we help you choose" points with general sample text (merged in `content/index.ts`); `isDraft` checks the real content, so sample articles stay noindex and out of the sitemap.

**Client content.** Experts have bio paragraphs, languages, specialization and `registry` entries (KNF numbers with their own label), shown as full-width profiles on the team page. Cases carry the client's `category` and `story` (situation, what was done, result). FAQs are one shared `FAQ` set per locale, assigned to the home tabs, credit, service, property and insurance pages. Instagram posts are listed in `INSTAGRAM_POSTS` (`lib/site.ts`) and shown as link cards on the cases page; nothing loads from Instagram until one is opened.

**Images.** `src/content/media.ts` holds the shared photo paths. They are temporary CC0 architecture shots in natural colour with no brown overlay, at the client's request (`docs/image-credits.md`), and use an empty alt. Text never sits directly on a photo: it goes in a card. After replacing a file under the same name, delete `.next/**/cache/images`, or the old optimized copy keeps being served. Portraits have no stock on purpose: the page shows a monogram until the client's real photos are added. The contact page shows an office illustration the user supplied (`MEDIA.contact`); removing it brings back the address panel. The two cases use illustrations the user supplied (`MEDIA.cases`, licence still to confirm); a case without an image falls back to the floor-plan panel.

**Calculator.** `src/lib/calculator.ts` holds the credit capacity formula and its assumptions (debt share, living costs, limit share, default rate). They are working values, not the client's terms, so `CALC.confirmed` is `false` and production shows only the lead form. Set it to `true` once the client approves real values.

**Page structure** follows the client's scheme: each section list is in `HomePage` and `InnerPages`. Credit, property and insurance pages end with `ConsultForm`, and the home page has no CTA before the footer.

**Forms.** Every link to the consultation form (`ctaLinks(locale).consult`) opens `ConsultModal`, a native `<dialog>` mounted once in the page shell, except on the contact page itself; without JavaScript the links still reach the form there. `src/lib/forms.ts` holds the field config and builds the same Zod schema for the client and for `api/lead`. The site has one form, the client's Google Form questionnaire (`QUESTIONNAIRE`), as the client asked, shown as a quiz (`LeadForm`, steps in `QUIZ_STEPS`): one question per step with a progress line, single choices first, then contacts, then preferred time and consent. A choice made with a pointer moves on by itself; keyboard users press Next. The kind only records where it was sent: `booking` is the pop-up, `consultation` the form on a page (end of the credit, property and insurance pages, contact page). The mortgage block embeds no form: its button (`getConsult`) opens the pop-up, inside the result card when the calculator is shown, otherwise on a dark CTA panel. Radio questions render as pills, the optional marketing consent is a `checkbox` field, and the sheet stores the Polish option label. The consent text names the data controller, IBUD MAX Sp. z o.o. Financial answers are marked `sensitive` to keep them out of the notification email. Leads go to Google Sheets and to `LEAD_EMAIL_TO`. `src/lib/leads.ts` writes to Google Sheets and sends through Resend (see `.env.example`). In production the API returns 503 rather than a false success when neither is configured.

## Design system (`src/app/globals.css`)

The visual language follows the Structa template in `Assets/` closely: its typography, surfaces, card compositions, spacing and motion. Never copy its text, images or colours. The order of sections comes from the client's brief, not from the template.

- Colours are `#381F1A`, white and transparent variations of the brown. No other accent, including for form errors, which use an icon, text and a thicker border.
- Gutters come from `.page-container`: 90px from 1280, 40px from 768, 20px below. Section spacing comes from `.section + .section` and is exactly 80px on mobile.
- Mobile order is heading, image, text, extras, CTA. The `.split`, `.hero__grid` and `.stage__inner` grids keep that as the DOM order and only place elements from 1024px, so do not duplicate elements per breakpoint.
- Component-layer CSS loses to Tailwind utilities regardless of specificity. If a state class must change a colour, set the base colour in CSS too, not with a utility.
- One font only: Montserrat for headings, text and small uppercase labels (`.t-label`). It is the client's choice, the same family as the logo, and covers Polish, Ukrainian and Russian. Headings are weight 500. Black appears in the home hero, where `HomeHero` sets the first word of the title as a stretched SVG line that fits any language to the full width; the rest of the title splits by space-separated tokens, and short words joined by a non-breaking space count as one. Montserrat runs wide, so check long Polish and Russian words at 360px. Clipped reveals (`.w`) keep padding for Polish accents.
- Surfaces: page background is 3% brown on white, cards are white with no border, dark areas use `.surface` (brown, diagonal sheen, grain). Tile gaps are 6px, card radius 16px.
- Figures (trust bar, founder stats, case highlights) count up through `<CountUp value>` the first time they scroll into view; a value without a number renders as is.
- Preloader (`components/layout/PremiumPreloader.tsx`): an inline script in the locale layout decides before the first paint (full on the first visit, short afterwards via localStorage, none with reduced motion or without JS; an 8 s fallback always clears it). Phases 1–2 are CSS, the component runs the opening once fonts and the first image are ready (at most 2 s) and then removes `pl-hold`, which keeps `.enter`, `.words--now` and the hero photo paused and the header hidden. It lives in the layout, so page navigation never repeats it.
- Headings animate through `<Words>` with `data-reveal` (or `words--now` in heroes). Do not let the first screen wait on JavaScript or animation delays.
