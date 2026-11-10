import { SHOW_PENDING } from './site'

/**
 * Assumptions behind the credit capacity estimate. These are WORKING VALUES, not the client's or any bank's terms.
 * Replace them with the figures the client approves, then set `confirmed: true`.
 * Until then the calculator appears only while placeholders are enabled, so production falls back to the plain lead form.
 */
export const CALC = {
  confirmed: false,
  /** Largest share of net income that all loan payments together may take. */
  maxDebtShare: 0.4,
  /** Monthly living costs of the first person in the household and of each further person, in PLN. */
  livingFirst: 1200,
  livingNext: 800,
  /** Share of account and card limits counted as a monthly commitment. */
  limitShare: 0.03,
  /** Annual interest rate pre-filled in the form, in percent. The visitor can change it. */
  defaultRate: 7,
}

export const CALC_READY = CALC.confirmed || SHOW_PENDING

export type CalcInput = { income: number; otherLoans: number; limits: number; people: number; years: number; rate: number }

const clean = (v: number, min: number, max = Number.MAX_SAFE_INTEGER) => (Number.isFinite(v) ? Math.min(Math.max(v, min), max) : min)

/** Annuity loan that fits the monthly payment left after living costs and existing commitments. */
export function creditCapacity(input: CalcInput) {
  const income = clean(input.income, 0)
  const people = Math.floor(clean(input.people, 1, 20))
  const months = Math.round(clean(input.years, 1, 35) * 12)
  const monthlyRate = clean(input.rate, 0, 100) / 100 / 12
  const living = CALC.livingFirst + (people - 1) * CALC.livingNext
  const commitments = clean(input.otherLoans, 0) + clean(input.limits, 0) * CALC.limitShare
  const payment = Math.max(Math.min(income * CALC.maxDebtShare, income - living) - commitments, 0)
  const factor = monthlyRate === 0 ? months : (1 - (1 + monthlyRate) ** -months) / monthlyRate
  return { amount: Math.floor((payment * factor) / 1000) * 1000, payment: Math.floor(payment) }
}
