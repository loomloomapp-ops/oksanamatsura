import { NextResponse } from 'next/server'
import { buildSchema, LEAD_KINDS, type LeadKind } from '@/lib/forms'
import { appendToSheet, emailConfigured, sendNotification, sheetsConfigured } from '@/lib/leads'

export const runtime = 'nodejs'

const MESSAGES = { required: 'required', invalidName: 'name', invalidPhone: 'phone', invalidEmail: 'email', consentRequired: 'consent' }
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 6
const MIN_FILL_MS = 2500
const hits = new Map<string, number[]>()

function limited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  if (limited(ip)) return NextResponse.json({ ok: false }, { status: 429 })

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  const kind = body?.kind as LeadKind
  if (!body || !LEAD_KINDS.includes(kind)) return NextResponse.json({ ok: false }, { status: 400 })

  // Bots get a normal-looking success and nothing is stored.
  const tooFast = Date.now() - Number(body.startedAt ?? 0) < MIN_FILL_MS
  if (body.website || tooFast) return NextResponse.json({ ok: true })

  const parsed = buildSchema(kind, MESSAGES).safeParse(body.values)
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 })

  const lead = { kind, locale: String(body.locale ?? ''), page: String(body.page ?? ''), values: parsed.data }
  const tasks = [sheetsConfigured() && appendToSheet(lead), emailConfigured() && sendNotification(lead)].filter(Boolean) as Promise<void>[]

  if (tasks.length === 0) {
    // Never report success in production when the lead would be lost.
    if (process.env.NODE_ENV === 'production') return NextResponse.json({ ok: false }, { status: 503 })
    console.info(`[lead] integrations not configured, ${kind} form accepted in development only`)
    return NextResponse.json({ ok: true })
  }

  const results = await Promise.allSettled(tasks)
  results.forEach((r) => r.status === 'rejected' && console.error('[lead] delivery failed:', (r.reason as Error).message))
  const delivered = results.some((r) => r.status === 'fulfilled')
  return NextResponse.json({ ok: delivered }, { status: delivered ? 200 : 502 })
}
