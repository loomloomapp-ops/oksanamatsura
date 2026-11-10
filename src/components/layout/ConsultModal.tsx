'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { Close } from '@/components/ui/Icons'

/**
 * Consultation pop-up. Any link to the consultation form (`trigger`, e.g. `/kontakt#formularz`) opens it instead of
 * navigating, except on the page that holds the form itself. Without JavaScript the links still go to that form.
 * Uses the native <dialog>: focus stays inside, Esc closes it, focus returns to the button that opened it.
 */
export function ConsultModal({ trigger, eyebrow, title, lead, formTitle, closeLabel, aside, children }: {
  trigger: string
  eyebrow: string
  title: string
  lead: string
  formTitle: string
  closeLabel: string
  aside: ReactNode
  children: ReactNode
}) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const target = new URL(trigger, location.origin)
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!link) return
      const url = new URL(link.href, location.href)
      if (url.origin !== target.origin || url.pathname !== target.pathname || url.hash !== target.hash) return
      if (location.pathname === target.pathname) return
      // Capture phase: cancelling here stops next/link from navigating; the link's own onClick (closing the menu) still runs.
      e.preventDefault()
      dialog.current?.showModal()
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [trigger])

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    const lock = () => document.documentElement.classList.toggle('modal-open', d.open)
    const observer = new MutationObserver(lock)
    observer.observe(d, { attributes: true, attributeFilter: ['open'] })
    d.addEventListener('close', lock)
    return () => {
      observer.disconnect()
      d.removeEventListener('close', lock)
    }
  }, [])

  return (
    <dialog
      ref={dialog}
      aria-labelledby="consult-modal-title"
      className="modal"
      onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close() }}
    >
      <div className="modal__panel">
        <button type="button" aria-label={closeLabel} onClick={() => dialog.current?.close()} className="modal__close"><Close size={18} /></button>
        <header className="modal__head">
          <p className="t-label eyebrow">{eyebrow}</p>
          <h2 id="consult-modal-title" className="modal__title">{title}</h2>
          <p className="modal__lead">{lead}</p>
        </header>
        <div className="modal__form">
          <h3 className="consult__title">{formTitle}</h3>
          {children}
        </div>
        <div className="modal__reach">{aside}</div>
      </div>
    </dialog>
  )
}
