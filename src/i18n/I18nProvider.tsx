import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en } from '../locales/en'
import { es, type MessageKey } from '../locales/es'
import { I18nContext, type Lang, type Translate } from './useI18n'

const STORAGE_KEY = 'portfolio-lang'
const messages: Record<Lang, Record<MessageKey, string>> = { es, en }

/** Preferencia guardada > idioma del navegador (inglés si corresponde) > español */
function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'es' || saved === 'en') return saved
  } catch {
    // sin almacenamiento: se detecta en cada visita
  }
  const preferred = navigator.languages?.[0] ?? navigator.language ?? ''
  return preferred.toLowerCase().startsWith('en') ? 'en' : 'es'
}

// Da el idioma a toda la app: cambia los textos sin recargar la página ni mover el scroll.
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // sin almacenamiento: vale solo para esta visita
    }
  }, [])

  const t = useCallback<Translate>(
    (key, vars) => {
      const text = messages[lang][key] ?? es[key] ?? key
      return vars ? text.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m)) : text
    },
    [lang],
  )

  // Documento: idioma, título y descripción (para lectores de pantalla, buscadores y al compartir)
  useEffect(() => {
    const m = messages[lang]
    document.documentElement.lang = lang
    document.title = m['meta.title']
    const set = (selector: string, value: string) => document.querySelector(selector)?.setAttribute('content', value)
    set('meta[name="description"]', m['meta.description'])
    set('meta[property="og:title"]', m['meta.title'])
    set('meta[property="og:description"]', m['meta.ogDescription'])
    set('meta[property="og:locale"]', lang === 'en' ? 'en_US' : 'es_AR')
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
