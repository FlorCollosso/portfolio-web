import { createContext, useContext } from 'react'
import type { Lang } from '../../i18n/useI18n'
import type { CaseBlock, CaseMediaItem, CaseSection, CaseStudyData } from '../../types/caseStudy'
import { asset } from '../../utils/asset'

// Archivos de public/images/projects al compilar (los lista vite.config.ts)
declare const __CASE_STUDY_FILES__: string[]
const files = new Set(__CASE_STUDY_FILES__)

/** Los espacios para imágenes pendientes solo se ven en desarrollo */
export const SHOW_SLOTS = import.meta.env.DEV

export interface ResolvedMedia extends Omit<CaseMediaItem, 'alt' | 'title' | 'description' | 'video'> {
  base: string
  path: string
  available: boolean
  videoUrl?: string
  alt: string
  title: string
  description?: string
}

export type MediaMap = Map<string, ResolvedMedia>

export function resolveMedia(study: CaseStudyData, lang: Lang): MediaMap {
  const folder = study.basePath.replace('/images/projects/', '')
  const sorted = [...study.media].sort((a, b) => a.category.localeCompare(b.category) || a.order - b.order)

  return new Map(
    sorted.map((item) => {
      const file = `${folder}/${item.src}`
      const available = files.has(`${file}-640.webp`) && files.has(`${file}-1280.webp`)
      const hasVideo = item.video && files.has(`${folder}/${item.video}`)
      return [
        item.id,
        {
          ...item,
          base: `${study.basePath}/${item.src}`,
          path: `public${study.basePath}/${item.src}-1280.webp`,
          available,
          videoUrl: hasVideo ? asset(`${study.basePath}/${item.video}`) : undefined,
          alt: item.alt[lang],
          title: item.title[lang],
          description: item.description?.[lang],
        },
      ]
    }),
  )
}

const pick = (ids: string[], media: MediaMap) => ids.flatMap((id) => media.get(id) ?? [])
const shown = (items: ResolvedMedia[]) => items.filter((m) => m.available || SHOW_SLOTS)

export const visibleMedia = (ids: string[], media: MediaMap) => shown(pick(ids, media))

function blockIds(block: CaseBlock): string[] {
  switch (block.type) {
    case 'gallery':
      return block.items.map((i) => i.id)
    case 'story':
      return [block.media]
    case 'phones':
      return block.media
    case 'carousel':
      return block.items
    default:
      return []
  }
}

const hasMedia = (block: CaseBlock) => blockIds(block).length > 0

/** Un bloque visual sin ninguna imagen disponible no se muestra */
export const isBlockVisible = (block: CaseBlock, media: MediaMap) => !hasMedia(block) || visibleMedia(blockIds(block), media).length > 0

export const isSectionVisible = (section: CaseSection, media: MediaMap) =>
  section.requiresMedia ? section.blocks.some((b) => hasMedia(b) && isBlockVisible(b, media)) : section.blocks.some((b) => isBlockVisible(b, media))

export const LightboxContext = createContext<(items: ResolvedMedia[], index: number) => void>(() => {})
export const useLightbox = () => useContext(LightboxContext)
