import { portfolioData } from '../data/portfolioData'
import { portfolioDataEn } from '../data/portfolioData.en'
import { useI18n } from './useI18n'

/** Contenido del portfolio (proyectos, experiencia, notas…) en el idioma activo */
export function usePortfolioData() {
  const { lang } = useI18n()
  return lang === 'en' ? portfolioDataEn : portfolioData
}
