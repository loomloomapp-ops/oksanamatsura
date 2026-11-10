import { NextResponse, type NextRequest } from 'next/server'

/** Polish is served without a prefix: /kredyty is rendered by the /pl/kredyty route. */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const first = pathname.split('/')[1]
  const url = req.nextUrl.clone()

  if (first === 'pl') {
    url.pathname = pathname.replace(/^\/pl/, '') || '/'
    return NextResponse.redirect(url, 308)
  }
  if (first === 'ua' || first === 'ru') return NextResponse.next()

  url.pathname = `/pl${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api|_next|brand|images|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
}
