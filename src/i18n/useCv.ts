import { cvFor } from '../data/cv'
import { useI18n } from './useI18n'

/** Enlace y nombre de archivo del CV en el idioma activo */
export function useCv() {
  const { lang } = useI18n()
  return cvFor(lang)
}
