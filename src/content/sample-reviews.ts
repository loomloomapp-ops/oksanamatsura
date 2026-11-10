import type { Locale } from '@/lib/routes'
import type { Review } from './types'

/**
 * Sample text used to judge the Reviews block until the client's real reviews arrive. They are not real clients.
 * Used only while placeholders are enabled and `home.reviews.items` is empty, so they can never reach production:
 * put the real reviews into `home.reviews.items` in each language and these stop being used.
 */
export const SAMPLE_REVIEWS: Record<Locale, Review[]> = {
  pl: [
    { id: 'sample-1', author: 'Anna K.', text: 'Wszystko zostało wyjaśnione prostym językiem, krok po kroku. Od początku wiedziałam, czego się spodziewać i jakie dokumenty przygotować.' },
    { id: 'sample-2', author: 'Mateusz W.', text: 'Bardzo konkretna współpraca. Dostaliśmy porównanie ofert i spokojne wyjaśnienie różnic, bez presji i pośpiechu.' },
    { id: 'sample-3', author: 'Olena S.', text: 'Jako obcokrajowiec bałam się formalności. Zespół przeprowadził mnie przez cały proces i zawsze odpowiadał na pytania.' },
    { id: 'sample-4', author: 'Dmytro P.', text: 'Pomoc nie skończyła się na kredycie. Mieliśmy wsparcie także przy wyborze mieszkania i ubezpieczeniu.' },
    { id: 'sample-5', author: 'Katarzyna M.', text: 'Szybki kontakt, jasne zasady i poczucie, że ktoś naprawdę pilnuje naszej sprawy do samego końca.' },
  ],
  ua: [
    { id: 'sample-1', author: 'Анна К.', text: 'Усе пояснили простою мовою, крок за кроком. Від початку я знала, чого очікувати та які документи підготувати.' },
    { id: 'sample-2', author: 'Матеуш В.', text: 'Дуже конкретна співпраця. Ми отримали порівняння пропозицій і спокійне пояснення різниці, без тиску та поспіху.' },
    { id: 'sample-3', author: 'Олена С.', text: 'Як іноземка я боялася формальностей. Команда провела мене через увесь процес і завжди відповідала на запитання.' },
    { id: 'sample-4', author: 'Дмитро П.', text: 'Допомога не закінчилася на кредиті. Нас підтримали також у виборі квартири та страхуванні.' },
    { id: 'sample-5', author: 'Катажина М.', text: 'Швидкий зв’язок, зрозумілі правила й відчуття, що нашу справу справді ведуть до самого кінця.' },
  ],
  ru: [
    { id: 'sample-1', author: 'Анна К.', text: 'Всё объяснили простым языком, шаг за шагом. С самого начала я знала, чего ожидать и какие документы подготовить.' },
    { id: 'sample-2', author: 'Матеуш В.', text: 'Очень конкретное сотрудничество. Мы получили сравнение предложений и спокойное объяснение различий, без давления и спешки.' },
    { id: 'sample-3', author: 'Олена С.', text: 'Как иностранка я боялась формальностей. Команда провела меня через весь процесс и всегда отвечала на вопросы.' },
    { id: 'sample-4', author: 'Дмитрий П.', text: 'Помощь не закончилась на кредите. Нас поддержали также при выборе квартиры и страховании.' },
    { id: 'sample-5', author: 'Катажина М.', text: 'Быстрая связь, понятные правила и ощущение, что наше дело действительно ведут до самого конца.' },
  ],
}
