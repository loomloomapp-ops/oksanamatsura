import type { Locale } from '@/lib/routes'
import type { Item } from './types'

/**
 * Placeholder descriptions for the property page's "Our services" list, by position in `pages.property.services.items`.
 * Not client text: general, with no promises or figures. Used only while placeholders are enabled and only where the
 * item's `text` is still `null`. The first two items repeat the markets block and are not shown, so they have none.
 */
export const SAMPLE_SERVICE_TEXT: Record<Locale, (string | null)[]> = {
  pl: [
    null,
    null,
    'Szukamy mieszkania dopasowanego do Twoich potrzeb, budżetu i możliwości kredytowych.',
    'Umawiamy oglądania i pomagamy ocenić nieruchomość na miejscu, zanim podejmiesz decyzję.',
    'Sprawdzamy dokumenty nieruchomości, aby zakup przebiegł bezpiecznie i bez niespodzianek.',
    'Wspieramy Cię w rozmowach o cenie i warunkach zakupu.',
    'Jesteśmy przy Tobie aż do podpisania umowy i odbioru kluczy.',
  ],
  ua: [
    null,
    null,
    'Шукаємо житло відповідно до ваших потреб, бюджету та кредитних можливостей.',
    'Організовуємо перегляди та допомагаємо оцінити нерухомість на місці, перш ніж ви ухвалите рішення.',
    'Перевіряємо документи на нерухомість, щоб купівля пройшла безпечно і без несподіванок.',
    'Підтримуємо вас у переговорах щодо ціни та умов купівлі.',
    'Супроводжуємо вас аж до підписання договору та отримання ключів.',
  ],
  ru: [
    null,
    null,
    'Ищем жильё с учётом ваших потребностей, бюджета и кредитных возможностей.',
    'Организуем просмотры и помогаем оценить недвижимость на месте, прежде чем вы примете решение.',
    'Проверяем документы на недвижимость, чтобы покупка прошла безопасно и без неожиданностей.',
    'Поддерживаем вас в переговорах о цене и условиях покупки.',
    'Сопровождаем вас вплоть до подписания договора и получения ключей.',
  ],
}

/**
 * Placeholder points for the insurance page's "How we help you choose" block, shown only while placeholders are
 * enabled and only when `pages.insurance.help.items` has not been supplied. General text, no promises or figures.
 */
export const SAMPLE_INSURANCE_HELP: Record<Locale, Item[]> = {
  pl: [
    { title: 'Analiza potrzeb', text: 'Ustalamy, co i przed czym chcesz chronić, aby ubezpieczenie odpowiadało Twojej sytuacji.' },
    { title: 'Porównanie wariantów', text: 'Zestawiamy dostępne rozwiązania i wyjaśniamy różnice w zakresie ochrony i wyłączeniach.' },
    { title: 'Pomoc w decyzji', text: 'Odpowiadamy na pytania i pomagamy wybrać wariant, który najlepiej do Ciebie pasuje.' },
  ],
  ua: [
    { title: 'Аналіз потреб', text: 'Визначаємо, що і від чого ви хочете захистити, щоб страхування відповідало вашій ситуації.' },
    { title: 'Порівняння варіантів', text: 'Зіставляємо доступні рішення та пояснюємо різницю в обсязі захисту та винятках.' },
    { title: 'Допомога з рішенням', text: 'Відповідаємо на запитання та допомагаємо обрати варіант, який підходить саме вам.' },
  ],
  ru: [
    { title: 'Анализ потребностей', text: 'Определяем, что и от чего вы хотите защитить, чтобы страхование соответствовало вашей ситуации.' },
    { title: 'Сравнение вариантов', text: 'Сопоставляем доступные решения и объясняем разницу в объёме защиты и исключениях.' },
    { title: 'Помощь с решением', text: 'Отвечаем на вопросы и помогаем выбрать вариант, который подходит именно вам.' },
  ],
}
