import { useEffect, useState } from 'react'
import { publication } from '../data/publication'

const { guidePdf } = publication

export default function GuiaPdfViewer({ open, onClose, initialLang }) {
  const defaultLang = initialLang ?? guidePdf.defaultLang ?? 'en'
  const [lang, setLang] = useState(defaultLang)
  const current =
    guidePdf.languages.find((item) => item.id === lang) ?? guidePdf.languages[0]
  const fallback =
    guidePdf.languages.find((item) => item.available) ?? guidePdf.languages[0]

  useEffect(() => {
    if (open) setLang(defaultLang)
  }, [open, defaultLang])

  useEffect(() => {
    if (!open) return undefined

    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="guia-pdf-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guia-pdf-title"
    >
      <button
        type="button"
        className="guia-pdf-close"
        aria-label="Cerrar visor de la guía"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="guia-pdf-panel">
        <header className="guia-pdf-header">
          <div className="guia-pdf-header-text">
            <h2 id="guia-pdf-title" className="guia-pdf-title">
              {guidePdf.title}
            </h2>
            {guidePdf.subtitle ? (
              <p className="guia-pdf-subtitle">{guidePdf.subtitle}</p>
            ) : null}
          </div>
          <div className="guia-pdf-lang" role="tablist" aria-label="Idioma del PDF">
            {guidePdf.languages.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className={`guia-pdf-lang-btn ${lang === item.id ? 'guia-pdf-lang-btn--active' : ''}`}
                aria-selected={lang === item.id}
                onClick={() => setLang(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <div className="guia-pdf-frame-wrap">
          {current.available ? (
            <iframe
              key={current.id}
              className="guia-pdf-frame"
              title={`${guidePdf.title} · ${current.docTitle ?? current.label}`}
              src={`${current.src}#view=FitH`}
            />
          ) : (
            <div className="guia-pdf-unavailable">
              <p>{current.notice}</p>
              {fallback?.available ? (
                <button
                  type="button"
                  className="guia-pdf-lang-btn guia-pdf-lang-btn--active"
                  onClick={() => setLang(fallback.id)}
                >
                  Ver manual en {fallback.label}
                </button>
              ) : null}
            </div>
          )}
        </div>

        {current.available ? (
          <footer className="guia-pdf-footer">
            <a
              className="guia-pdf-action"
              href={current.src}
              download={current.downloadName}
            >
              Descargar PDF
            </a>
            <a
              className="guia-pdf-action"
              href={current.src}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir en pestaña nueva
            </a>
          </footer>
        ) : null}
      </div>
    </div>
  )
}
