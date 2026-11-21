import type { Lang } from '../i18n/useI18n'
import { asset } from '../utils/asset'

// CV por idioma: única fuente para todos los botones de descarga.
// Los PDF van en public/cv/ con estos nombres exactos. Después de agregarlos, reiniciar `npm run dev`.
export const cvFiles: Record<Lang, string> = {
  es: 'Florencia_Collosso_CV_ES.pdf',
  en: 'Florencia_Collosso_CV_EN.pdf',
}

/** CV anterior: se sigue ofreciendo mientras falte el PDF de un idioma, para no dejar enlaces rotos */
const FALLBACK = 'CV_Florencia_Collosso.pdf'

// Lista de PDF que hay en public/cv/ al compilar (la genera vite.config.ts)
declare const __CV_FILES__: string[]

export function cvFor(lang: Lang) {
  const fileName = __CV_FILES__.includes(cvFiles[lang]) ? cvFiles[lang] : FALLBACK
  return { href: asset(`/cv/${fileName}`), fileName }
}
