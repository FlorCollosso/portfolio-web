import type { Lang } from '../i18n/useI18n'

// Contrato de los casos de estudio. Cada proyecto arma su propia secuencia de bloques,
// así comparten componentes sin tener que verse iguales.

export type Localized = Record<Lang, string>

export type CaseMediaCategory = 'cover' | 'branding' | 'ux-ui' | 'frontend' | 'marketing' | 'results'

export interface CaseMediaItem {
  id: string
  /** Ruta dentro de la carpeta del proyecto, sin sufijo: "branding/logo" → logo-640.webp y logo-1280.webp */
  src: string
  category: CaseMediaCategory
  /** Orden de visualización dentro de su categoría */
  order: number
  /** Proporción real del archivo, p. ej. "16 / 10". Evita saltos de layout y recortes. */
  ratio: string
  /** Marco opcional: barra de navegador o teléfono */
  device?: 'desktop' | 'mobile'
  alt: Localized
  title: Localized
  description?: Localized
  /** Video opcional dentro de la carpeta del proyecto, p. ej. "frontend/tour.mp4". La imagen funciona como póster. */
  video?: string
}

export type GallerySpan = 'full' | 'wide' | 'side' | 'half' | 'third' | 'small'

export type CaseBlock =
  | { type: 'needs'; items: { title: Localized; text: Localized }[] }
  | { type: 'process' }
  | { type: 'gallery'; items: { id: string; span: GallerySpan; drop?: boolean }[] }
  | { type: 'story'; media: string; companion?: string; label: Localized; title: Localized; text: Localized; flip?: boolean; dark?: boolean; points?: Localized[] }
  | { type: 'phones'; media: string[]; label: Localized; title: Localized; text: Localized }
  | { type: 'principle'; label: Localized; text: Localized; note: Localized }
  | { type: 'carousel'; items: string[] }
  | { type: 'stack'; items: { name: string; value: Localized }[] }
  | { type: 'highlights' }

export interface CaseSection {
  id: string
  nav: Localized
  eyebrow: Localized
  titleA: Localized
  titleB: Localized
  intro?: Localized
  note?: Localized
  tone?: 'paper' | 'wall' | 'teal' | 'rose'
  /** Si ninguna imagen está disponible, la sección no se muestra en producción */
  requiresMedia?: boolean
  blocks: CaseBlock[]
}

export interface CaseStudyData {
  projectId: string
  /** Carpeta en /public que contiene las imágenes del caso */
  basePath: string
  subtitle: Localized
  disciplines: Localized[]
  role: Localized
  type: Localized
  /** Id de la imagen de portada. Si el archivo no existe, se usa la imagen actual del proyecto. */
  cover: string
  media: CaseMediaItem[]
  sections: CaseSection[]
  closing: { titleA: Localized; titleB: Localized; text: Localized; note: Localized }
}
