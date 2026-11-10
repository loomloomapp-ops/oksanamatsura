import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="page-container grid min-h-[70vh] place-content-start gap-6">
      <p className="t-label eyebrow">404</p>
      <h1 className="t-h1-page">Nie znaleziono strony</h1>
      <p className="t-lead text-muted">Сторінку не знайдено · Страница не найдена</p>
      <div className="btn-group">
        <Button href="/">Strona główna</Button>
        <Button href="/ua" variant="secondary">Головна</Button>
        <Button href="/ru" variant="secondary">Главная</Button>
      </div>
    </main>
  )
}
