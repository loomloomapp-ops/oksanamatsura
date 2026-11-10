import type { ArticleId, Locale } from '@/lib/routes'
import type { ArticleBlock } from './types'

/**
 * Placeholder date, excerpt and body used to judge the blog until the client's articles arrive. Not client text:
 * deliberately general, with no rates, figures or legal promises.
 * Applied only while placeholders are enabled and only to fields still `null`, so it can never reach production
 * (articles without a real body stay hidden there). Fill `articles` in each language and these stop being used.
 */
type Sample = { date: string; excerpt: string; body: ArticleBlock[] }

const p = (text: string): ArticleBlock => ({ type: 'p', text })
const h2 = (text: string): ArticleBlock => ({ type: 'h2', text })
const h3 = (text: string): ArticleBlock => ({ type: 'h3', text })

export const SAMPLE_ARTICLES: Record<Locale, Record<ArticleId, Sample>> = {
  pl: {
    ukrainians: {
      date: '3 listopada 2026',
      excerpt: 'Od czego zacząć, jakie dokumenty przygotować i na co banki zwracają uwagę, gdy o kredyt hipoteczny wnioskuje obcokrajowiec.',
      body: [
        p('Coraz więcej osób z Ukrainy planuje zakup własnego mieszkania w Polsce. Kredyt hipoteczny jest dla obcokrajowca dostępny, ale każdy bank ocenia wniosek według własnych zasad, dlatego warto wcześniej wiedzieć, czego się spodziewać.'),
        h2('Od czego zacząć'),
        p('Pierwszym krokiem jest spokojna analiza sytuacji: rodzaju zatrudnienia, wysokości i stabilności dochodów oraz dokumentów pobytowych. Na tej podstawie można ocenić, które banki rozpatrzą wniosek i na jakich warunkach.'),
        h2('Dokumenty'),
        p('Zwykle potrzebne są dokument tożsamości, dokument potwierdzający legalny pobyt oraz zaświadczenia o dochodach. Dokładna lista zależy od banku i od formy zatrudnienia, dlatego przygotowujemy ją indywidualnie.'),
        h3('Na co zwrócić uwagę'),
        p('Warto porównać nie tylko oprocentowanie, ale też wymagany wkład własny, dodatkowe produkty banku i warunki ubezpieczenia. Szczegóły wyjaśniamy podczas bezpłatnej konsultacji.'),
      ],
    },
    'no-deposit': {
      date: '27 października 2026',
      excerpt: 'Czy da się kupić mieszkanie bez oszczędności na wkład własny i kiedy taki kredyt ma sens.',
      body: [
        p('Wkład własny to dla wielu osób największa przeszkoda w drodze do własnego mieszkania. Kredyt bez wkładu własnego jest możliwy w ramach odpowiedniego programu, ale nie każdy wniosek spełnia jego warunki.'),
        h2('Kiedy to możliwe'),
        p('O tym, czy możesz skorzystać z takiego rozwiązania, decydują między innymi Twoja sytuacja dochodowa, rodzaj nieruchomości i aktualne zasady programu. Podczas konsultacji sprawdzimy, czy spełniasz kryteria.'),
        h2('Co warto wiedzieć wcześniej'),
        p('Brak wkładu własnego zwykle oznacza wyższą kwotę kredytu, a więc także wyższą ratę. Dlatego zanim podejmiesz decyzję, warto policzyć cały koszt i porównać go z innymi możliwościami.'),
      ],
    },
    zlecenie: {
      date: '20 października 2026',
      excerpt: 'Umowa zlecenie nie przekreśla szansy na kredyt. Wyjaśniamy, jak banki patrzą na taki dochód.',
      body: [
        p('Nie każdy pracuje na umowie o pracę, a mimo to marzy o własnym mieszkaniu. Dochód z umowy zlecenia także może być podstawą do starania się o kredyt hipoteczny.'),
        h2('Jak bank ocenia dochód'),
        p('Banki zwracają uwagę przede wszystkim na ciągłość i stabilność dochodu. Znaczenie ma to, jak długo trwa współpraca i czy wpływy są regularne. Wymagania różnią się między bankami.'),
        h2('Jak się przygotować'),
        p('Warto zebrać umowy i potwierdzenia wpływów z ostatnich miesięcy. Pomagamy przygotować dokumenty tak, aby bank mógł rzetelnie ocenić Twoją sytuację.'),
      ],
    },
    income: {
      date: '13 października 2026',
      excerpt: 'Od czego zależy zdolność kredytowa i dlaczego sama wysokość pensji to nie wszystko.',
      body: [
        p('Jedno z najczęstszych pytań brzmi: ile trzeba zarabiać, żeby dostać kredyt hipoteczny? Odpowiedź zależy od wielu czynników, a nie tylko od wysokości wynagrodzenia.'),
        h2('Co wpływa na zdolność kredytową'),
        p('Bank bierze pod uwagę dochód netto, liczbę osób w gospodarstwie domowym, inne raty i limity na kontach, a także okres spłaty. Każdy bank liczy zdolność według własnego modelu.'),
        h2('Jak sprawdzić swoje możliwości'),
        p('Orientacyjny wynik da kalkulator na naszej stronie, ale ostateczną decyzję zawsze podejmuje bank. Podczas konsultacji porównamy oferty i wyjaśnimy, co możesz zrobić, aby poprawić swoją zdolność.'),
      ],
    },
  },
  ua: {
    ukrainians: {
      date: '3 листопада 2026',
      excerpt: 'З чого почати, які документи підготувати і на що банки звертають увагу, коли іпотеку оформлює іноземець.',
      body: [
        p('Дедалі більше людей з України планують купівлю власного житла в Польщі. Іпотека для іноземця доступна, але кожен банк оцінює заявку за власними правилами, тому варто заздалегідь знати, чого очікувати.'),
        h2('З чого почати'),
        p('Перший крок — спокійний аналіз ситуації: виду зайнятості, розміру та стабільності доходу, а також документів на перебування. На цій основі можна оцінити, які банки розглянуть заявку і на яких умовах.'),
        h2('Документи'),
        p('Зазвичай потрібні документ, що посвідчує особу, документ про легальне перебування та довідки про доходи. Точний перелік залежить від банку і форми зайнятості, тому ми готуємо його індивідуально.'),
        h3('На що звернути увагу'),
        p('Варто порівнювати не лише відсоткову ставку, а й потрібний перший внесок, додаткові продукти банку та умови страхування. Деталі пояснюємо під час безкоштовної консультації.'),
      ],
    },
    'no-deposit': {
      date: '27 жовтня 2026',
      excerpt: 'Чи можна купити житло без заощаджень на перший внесок і коли такий кредит має сенс.',
      body: [
        p('Перший внесок для багатьох — найбільша перешкода на шляху до власного житла. Кредит без першого внеску можливий у межах відповідної програми, але не кожна заявка відповідає її умовам.'),
        h2('Коли це можливо'),
        p('Чи можете ви скористатися таким рішенням, залежить, зокрема, від вашої ситуації з доходами, типу нерухомості та чинних правил програми. Під час консультації перевіримо, чи відповідаєте ви критеріям.'),
        h2('Що варто знати заздалегідь'),
        p('Відсутність першого внеску зазвичай означає більшу суму кредиту, а отже і вищий платіж. Тому перед рішенням варто порахувати повну вартість і порівняти її з іншими можливостями.'),
      ],
    },
    zlecenie: {
      date: '20 жовтня 2026',
      excerpt: 'Umowa zlecenie не перекреслює шансів на кредит. Пояснюємо, як банки дивляться на такий дохід.',
      body: [
        p('Не всі працюють за трудовим договором, але мріють про власне житло. Дохід за umowa zlecenie також може бути підставою для оформлення іпотеки.'),
        h2('Як банк оцінює дохід'),
        p('Банки насамперед звертають увагу на безперервність і стабільність доходу. Має значення, як довго триває співпраця і чи регулярні надходження. Вимоги різняться між банками.'),
        h2('Як підготуватися'),
        p('Варто зібрати договори та підтвердження надходжень за останні місяці. Ми допомагаємо підготувати документи так, щоб банк міг сумлінно оцінити вашу ситуацію.'),
      ],
    },
    income: {
      date: '13 жовтня 2026',
      excerpt: 'Від чого залежить кредитоспроможність і чому сама зарплата — це ще не все.',
      body: [
        p('Одне з найчастіших запитань: скільки треба заробляти, щоб отримати іпотеку? Відповідь залежить від багатьох чинників, а не лише від розміру зарплати.'),
        h2('Що впливає на кредитоспроможність'),
        p('Банк враховує чистий дохід, кількість осіб у домогосподарстві, інші платежі та ліміти на рахунках, а також термін погашення. Кожен банк рахує кредитоспроможність за власною моделлю.'),
        h2('Як перевірити свої можливості'),
        p('Орієнтовний результат дасть калькулятор на нашому сайті, але остаточне рішення завжди ухвалює банк. Під час консультації порівняємо пропозиції та пояснимо, що можна зробити, щоб покращити вашу кредитоспроможність.'),
      ],
    },
  },
  ru: {
    ukrainians: {
      date: '3 ноября 2026',
      excerpt: 'С чего начать, какие документы подготовить и на что банки обращают внимание, когда ипотеку оформляет иностранец.',
      body: [
        p('Всё больше людей из Украины планируют покупку собственного жилья в Польше. Ипотека для иностранца доступна, но каждый банк оценивает заявку по своим правилам, поэтому стоит заранее знать, чего ожидать.'),
        h2('С чего начать'),
        p('Первый шаг — спокойный анализ ситуации: вида занятости, размера и стабильности дохода, а также документов на пребывание. На этой основе можно оценить, какие банки рассмотрят заявку и на каких условиях.'),
        h2('Документы'),
        p('Обычно нужны документ, удостоверяющий личность, документ о легальном пребывании и справки о доходах. Точный список зависит от банка и формы занятости, поэтому мы готовим его индивидуально.'),
        h3('На что обратить внимание'),
        p('Стоит сравнивать не только процентную ставку, но и требуемый первый взнос, дополнительные продукты банка и условия страхования. Подробности объясняем на бесплатной консультации.'),
      ],
    },
    'no-deposit': {
      date: '27 октября 2026',
      excerpt: 'Можно ли купить жильё без сбережений на первый взнос и когда такой кредит имеет смысл.',
      body: [
        p('Первый взнос для многих — главное препятствие на пути к собственному жилью. Кредит без первого взноса возможен в рамках соответствующей программы, но не каждая заявка соответствует её условиям.'),
        h2('Когда это возможно'),
        p('Сможете ли вы воспользоваться таким решением, зависит, в частности, от вашей ситуации с доходами, типа недвижимости и действующих правил программы. На консультации проверим, соответствуете ли вы критериям.'),
        h2('Что стоит знать заранее'),
        p('Отсутствие первого взноса обычно означает большую сумму кредита, а значит и более высокий платёж. Поэтому перед решением стоит посчитать полную стоимость и сравнить её с другими возможностями.'),
      ],
    },
    zlecenie: {
      date: '20 октября 2026',
      excerpt: 'Umowa zlecenie не перечёркивает шансы на кредит. Объясняем, как банки смотрят на такой доход.',
      body: [
        p('Не все работают по трудовому договору, но мечтают о собственном жилье. Доход по umowa zlecenie тоже может быть основанием для оформления ипотеки.'),
        h2('Как банк оценивает доход'),
        p('Банки прежде всего обращают внимание на непрерывность и стабильность дохода. Важно, как долго длится сотрудничество и регулярны ли поступления. Требования различаются между банками.'),
        h2('Как подготовиться'),
        p('Стоит собрать договоры и подтверждения поступлений за последние месяцы. Мы помогаем подготовить документы так, чтобы банк мог добросовестно оценить вашу ситуацию.'),
      ],
    },
    income: {
      date: '13 октября 2026',
      excerpt: 'От чего зависит кредитоспособность и почему одна зарплата — это ещё не всё.',
      body: [
        p('Один из самых частых вопросов: сколько нужно зарабатывать, чтобы получить ипотеку? Ответ зависит от многих факторов, а не только от размера зарплаты.'),
        h2('Что влияет на кредитоспособность'),
        p('Банк учитывает чистый доход, количество человек в домохозяйстве, другие платежи и лимиты на счетах, а также срок погашения. Каждый банк считает кредитоспособность по своей модели.'),
        h2('Как проверить свои возможности'),
        p('Ориентировочный результат даст калькулятор на нашем сайте, но окончательное решение всегда принимает банк. На консультации сравним предложения и объясним, что можно сделать, чтобы улучшить вашу кредитоспособность.'),
      ],
    },
  },
}
