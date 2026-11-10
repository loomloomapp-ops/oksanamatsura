import { z } from 'zod'

/**
 * The site has one form, the client's Google Form questionnaire. The kind only records where it was sent from:
 * `consultation` is the form on a page (end of the credit, property and insurance pages, contact page),
 * `booking` the consultation pop-up that every consultation button opens, including the one in the mortgage block.
 */
export type LeadKind = 'consultation' | 'booking'
export const LEAD_KINDS: LeadKind[] = ['consultation', 'booking']

type Text = { pl: string; ua: string; ru: string }

export type FieldConfig = {
  name: string
  /** `checkbox` is an optional extra consent, shown under the required one; its label is the consent text. */
  type: 'text' | 'tel' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox'
  /** Label: a key of the shared form copy, or text per locale for questionnaire questions. */
  label: 'name' | 'phone' | Text
  required?: boolean
  autoComplete?: string
  options?: { value: string; label: Text }[]
  /** Financial answers stay in the sheet and are never copied into the notification email. */
  sensitive?: boolean
}

/** The client's Google Form "Запис на консультацію": its questions and options. Income moves up beside city so the short fields pair. */
const QUESTIONNAIRE: FieldConfig[] = [
  { name: 'name', type: 'text', label: { pl: 'Imię i nazwisko', ua: 'Прізвище та ім’я', ru: 'Фамилия и имя' }, required: true, autoComplete: 'name' },
  { name: 'phone', type: 'tel', label: 'phone', required: true, autoComplete: 'tel' },
  { name: 'city', type: 'text', label: { pl: 'Miasto', ua: 'Місто', ru: 'Город' }, required: true, autoComplete: 'address-level2' },
  { name: 'income', type: 'text', label: { pl: 'Miesięczny dochód netto', ua: 'Чистий щомісячний дохід (netto)', ru: 'Чистый ежемесячный доход (netto)' }, required: true, sensitive: true },
  {
    name: 'employment', type: 'radio', required: true, sensitive: true,
    label: { pl: 'Forma zatrudnienia', ua: 'Тип працевлаштування', ru: 'Тип трудоустройства' },
    options: [
      { value: 'zlecenie', label: { pl: 'Umowa zlecenie', ua: 'Umowa zlecenie', ru: 'Umowa zlecenie' } },
      { value: 'praca', label: { pl: 'Umowa o pracę', ua: 'Umowa o pracę', ru: 'Umowa o pracę' } },
      { value: 'jdg', label: { pl: 'Działalność (JDG)', ua: 'Діяльність (JDG)', ru: 'Деятельность (JDG)' } },
      { value: 'other', label: { pl: 'Inne', ua: 'Інше', ru: 'Другое' } },
    ],
  },
  {
    name: 'propertyValue', type: 'radio', required: true, sensitive: true,
    label: { pl: 'Orientacyjna wartość nieruchomości, którą rozważasz', ua: 'Орієнтовна вартість нерухомості, яку розглядаєте', ru: 'Ориентировочная стоимость недвижимости, которую рассматриваете' },
    options: [
      { value: 'to300', label: { pl: 'do 300 tys.', ua: 'до 300 тис.', ru: 'до 300 тыс.' } },
      { value: '300-500', label: { pl: '300–500 tys.', ua: '300–500 тис.', ru: '300–500 тыс.' } },
      { value: '500-700', label: { pl: '500–700 tys.', ua: '500–700 тис.', ru: '500–700 тыс.' } },
      { value: 'other', label: { pl: 'Inna kwota', ua: 'Інша сума', ru: 'Другая сумма' } },
    ],
  },
  {
    name: 'deposit', type: 'radio', required: true, sensitive: true,
    label: { pl: 'Wysokość wkładu własnego', ua: 'Сума першого внеску', ru: 'Сумма первоначального взноса' },
    options: [
      { value: 'none', label: { pl: 'Chcę skorzystać z programu bez wkładu własnego', ua: 'Хочу скористатися програмою без першого внеску', ru: 'Хочу воспользоваться программой без первоначального взноса' } },
      { value: '10', label: { pl: '10%', ua: '10%', ru: '10%' } },
      { value: '20', label: { pl: '20%', ua: '20%', ru: '20%' } },
      { value: 'other', label: { pl: 'Inny wariant', ua: 'Інший варіант', ru: 'Другой вариант' } },
    ],
  },
  {
    name: 'timing', type: 'radio', required: true,
    label: { pl: 'Kiedy planujesz rozpocząć proces kredytowy?', ua: 'Коли плануєте розпочати кредитний процес?', ru: 'Когда планируете начать кредитный процесс?' },
    options: [
      { value: 'now', label: { pl: 'Od razu', ua: 'Відразу', ru: 'Сразу' } },
      { value: '1-3', label: { pl: 'W ciągu 1–3 miesięcy', ua: '1–3 місяці', ru: '1–3 месяца' } },
      { value: 'exploring', label: { pl: 'Na razie analizuję możliwości', ua: 'Поки просто аналізую можливості', ru: 'Пока просто анализирую возможности' } },
    ],
  },
  { name: 'preferredTime', type: 'text', label: { pl: 'Dogodna data i godzina konsultacji', ua: 'Зручні дата та час для консультації', ru: 'Удобные дата и время для консультации' }, required: true },
  {
    name: 'marketing', type: 'checkbox',
    label: {
      pl: 'Wyrażam dobrowolną zgodę na otrzymywanie od IBUD MAX Sp. z o.o. informacji o nowych ofertach, programach kredytowych, inwestycjach i innych usługach drogą elektroniczną lub telefonicznie.',
      ua: 'Даю добровільну згоду на отримання від IBUD MAX Sp. z o.o. інформації про нові пропозиції, програми кредитування, інвестиції та інші послуги електронною поштою або телефоном.',
      ru: 'Даю добровольное согласие на получение от IBUD MAX Sp. z o.o. информации о новых предложениях, программах кредитования, инвестициях и других услугах по электронной почте или телефону.',
    },
  },
]

/**
 * The questionnaire as a quiz: one question per step, the easy single-choice answers first, then contacts, then the
 * preferred time and consent. A step with one field uses its question as the heading.
 */
export const QUIZ_STEPS: { fields: string[]; title?: Text }[] = [
  { fields: ['employment'] },
  { fields: ['income'] },
  { fields: ['propertyValue'] },
  { fields: ['deposit'] },
  { fields: ['timing'] },
  { fields: ['name', 'phone', 'city'], title: { pl: 'Jak możemy się z Tobą skontaktować?', ua: 'Як з вами зв’язатися?', ru: 'Как с вами связаться?' } },
  { fields: ['preferredTime', 'marketing'], title: { pl: 'Kiedy możemy porozmawiać?', ua: 'Коли вам зручно поговорити?', ru: 'Когда вам удобно поговорить?' } },
]

export const FORMS: Record<LeadKind, FieldConfig[]> = {
  consultation: QUESTIONNAIRE,
  booking: QUESTIONNAIRE,
}

export type FormMessages = Record<'required' | 'invalidName' | 'invalidPhone' | 'invalidEmail' | 'consentRequired', string>

export function buildSchema(kind: LeadKind, m: FormMessages) {
  const shape: Record<string, z.ZodType> = {
    consent: z.literal(true, { error: m.consentRequired }),
  }
  for (const f of FORMS[kind]) {
    if (f.type === 'checkbox') {
      shape[f.name] = z.boolean().optional()
      continue
    }
    let s = z.string({ error: m.required }).trim().max(2000)
    if (f.required) s = s.min(1, m.required)
    if (f.name === 'name') s = s.min(2, m.invalidName)
    if (f.type === 'tel') s = s.regex(/^\+?[\d\s()-]{9,20}$/, m.invalidPhone)
    if (f.type === 'email') s = s.email(m.invalidEmail)
    const field = f.options ? s.refine((v) => f.options!.some((o) => o.value === v), m.required) : s
    shape[f.name] = f.required ? field : field.optional().or(z.literal(''))
  }
  return z.object(shape)
}

/** A stored answer in readable form: the Polish option label, or tak/nie for a checkbox. */
export function answerText(f: FieldConfig, v: unknown) {
  if (f.type === 'checkbox') return v ? 'tak' : 'nie'
  return f.options?.find((o) => o.value === v)?.label.pl ?? String(v ?? '')
}
