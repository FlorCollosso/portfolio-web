import { createContext, useContext } from 'react'
import type { MessageKey } from '../locales/es'

// Idioma del sitio: español o inglés. Los textos de interfaz viven en src/locales/,
// y el contenido largo (proyectos, experiencia…) en src/data/ (una versión por idioma).

export type Lang = 'es' | 'en'
export const LANGS: Lang[] = ['es', 'en']

type Vars = Record<string, string | number>
export type Translate = (key: MessageKey, vars?: Vars) => string

export interface I18nValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Translate
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n tiene que usarse dentro de <I18nProvider>')
  return ctx
}
