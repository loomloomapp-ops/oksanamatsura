import { createSign } from 'node:crypto'
import { answerText, FORMS, type LeadKind } from './forms'

/** `expert` is the team member the visitor booked with from their profile, or `null` for the office. */
export type Lead = { kind: LeadKind; locale: string; page: string; expert: { id: string; name: string } | null; values: Record<string, unknown> }

const env = process.env
export const sheetsConfigured = () => !!(env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_PRIVATE_KEY && env.GOOGLE_SHEET_ID)
export const emailConfigured = () => !!(env.RESEND_API_KEY && env.LEAD_EMAIL_FROM && env.LEAD_EMAIL_TO)

const b64 = (v: string | Buffer) => Buffer.from(v).toString('base64url')

async function googleToken() {
  const now = Math.floor(Date.now() / 1000)
  const head = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = b64(JSON.stringify({
    iss: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }))
  const key = env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n')
  const signature = createSign('RSA-SHA256').update(`${head}.${claims}`).sign(key)
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${head}.${claims}.${b64(signature)}`,
    }),
  })
  if (!res.ok) throw new Error(`google token ${res.status}`)
  return ((await res.json()) as { access_token: string }).access_token
}

export async function appendToSheet(lead: Lead) {
  const token = await googleToken()
  const range = encodeURIComponent(env.GOOGLE_SHEET_RANGE || 'Leads!A:Z')
  const row = [
    new Date().toISOString(), lead.kind, lead.locale, lead.page, lead.expert?.name ?? '',
    ...FORMS[lead.kind].map((f) => answerText(f, lead.values[f.name])),
  ]
  // RAW keeps user input as plain text, so it can never be evaluated as a spreadsheet formula.
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ values: [row] }),
    },
  )
  if (!res.ok) throw new Error(`sheets ${res.status}`)
}

const SUBJECTS: Record<LeadKind, string> = { consultation: 'konsultacja (formularz na stronie)', booking: 'konsultacja (okno)' }

/**
 * Optional per-expert copies: `LEAD_EMAIL_EXPERTS=alina-korobko:alina@example.com,denys-petelin:denys@example.com`.
 * A lead booked with an expert goes to LEAD_EMAIL_TO and to that expert's address.
 */
function expertEmail(id: string) {
  for (const pair of (env.LEAD_EMAIL_EXPERTS ?? '').split(',')) {
    const [key, address] = pair.split(':').map((x) => x.trim())
    if (key === id && address) return address
  }
  return null
}

export async function sendNotification(lead: Lead) {
  const lines = FORMS[lead.kind]
    .filter((f) => !f.sensitive)
    .map((f) => `${f.name}: ${answerText(f, lead.values[f.name])}`)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.LEAD_EMAIL_FROM,
      to: [env.LEAD_EMAIL_TO!, lead.expert && expertEmail(lead.expert.id)].filter(Boolean),
      subject: `Nowe zgłoszenie: ${SUBJECTS[lead.kind]}${lead.expert ? ` · ${lead.expert.name}` : ''}`,
      text: [`Formularz: ${lead.kind}`, `Ekspert: ${lead.expert?.name ?? 'biuro (bez wyboru)'}`, `Język: ${lead.locale}`, `Strona: ${lead.page}`, '', ...lines].join('\n'),
    }),
  })
  if (!res.ok) throw new Error(`email ${res.status}`)
}
