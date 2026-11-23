import { FiMaximize2 } from 'react-icons/fi'
import { useI18n } from '../../i18n/useI18n'
import { asset } from '../../utils/asset'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import { SHOW_SLOTS, useLightbox, type ResolvedMedia } from './mediaResolver'

interface CaseMediaProps {
  item: ResolvedMedia
  /** Imágenes entre las que se puede navegar al ampliar */
  group?: ResolvedMedia[]
  sizes: string
  caption?: boolean
  className?: string
}

export function CaseMedia({ item, group = [item], sizes, caption = false, className = '' }: CaseMediaProps) {
  if (!item.available && !SHOW_SLOTS) return null

  return (
    <figure className={className}>
      <DeviceFrame device={item.device}>
        {item.available ? <MediaContent item={item} group={group} sizes={sizes} /> : <MediaSlot item={item} />}
      </DeviceFrame>
      {caption && (
        <figcaption className="mt-3 text-sm text-pretty">
          <span className="font-serif text-ink italic">{item.title}</span>
          {item.description && <span className="text-muted"> — {item.description}</span>}
        </figcaption>
      )}
    </figure>
  )
}

function MediaContent({ item, group, sizes }: { item: ResolvedMedia; group: ResolvedMedia[]; sizes: string }) {
  const { t } = useI18n()
  const openLightbox = useLightbox()
  const playable = group.filter((m) => m.available)

  if (item.videoUrl) {
    return (
      <video
        controls
        muted
        playsInline
        preload="none"
        poster={asset(`${item.base}-1280.webp`)}
        aria-label={item.alt}
        style={{ aspectRatio: item.ratio }}
        className="block w-full bg-wall object-contain"
      >
        <source src={item.videoUrl} type="video/mp4" />
      </video>
    )
  }

  return (
    <button
      type="button"
      onClick={() => openLightbox(playable, Math.max(0, playable.findIndex((m) => m.id === item.id)))}
      style={{ aspectRatio: item.ratio }}
      className="group/media relative block w-full cursor-zoom-in overflow-hidden bg-wall"
    >
      <ResponsiveImage
        image={{ base: item.base, alt: item.alt }}
        sizes={sizes}
        className="h-full w-full object-contain transition-transform duration-700 ease-[var(--ease-soft)] group-hover/media:scale-[1.012]"
      />
      <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-[#fbf7f0]/90 text-[#141414] opacity-0 shadow transition-opacity duration-300 group-hover/media:opacity-100 group-focus-visible/media:opacity-100">
        <FiMaximize2 aria-hidden="true" className="size-4" />
      </span>
      <span className="sr-only">{t('case.enlarge', { title: item.title })}</span>
    </button>
  )
}

// Espacio reservado para una pieza real. Nunca llega a producción.
function MediaSlot({ item }: { item: ResolvedMedia }) {
  const { t } = useI18n()
  return (
    <div
      style={{ aspectRatio: item.ratio }}
      className="flex w-full flex-col items-center justify-center gap-1 overflow-hidden border border-dashed border-ink/25 bg-card/60 p-3 text-center"
    >
      <span className="font-hand text-lg leading-tight text-rose-deep">{item.title}</span>
      <span className="text-[0.65rem] font-semibold tracking-widest text-muted uppercase">{t('case.slot')}</span>
      <code className="mt-1 max-w-full text-[0.6rem] leading-snug break-all text-muted">{item.path}</code>
    </div>
  )
}

function DeviceFrame({ device, children }: { device?: ResolvedMedia['device']; children: React.ReactNode }) {
  if (device === 'desktop') {
    return (
      <div className="overflow-hidden rounded-[0.5rem] border border-ink/15 bg-card shadow-[0_1.5rem_3rem_-1.8rem_rgb(20_20_20/0.55)]">
        <div aria-hidden="true" className="flex h-6 items-center gap-1.5 border-b border-line bg-wall px-3 sm:h-7">
          <span className="size-2 rounded-full bg-rose" />
          <span className="size-2 rounded-full bg-ochre" />
          <span className="size-2 rounded-full bg-teal" />
          <span className="ml-3 truncate text-[0.65rem] text-muted">mrobras.com.ar</span>
        </div>
        {children}
      </div>
    )
  }
  if (device === 'mobile') {
    return (
      <div className="overflow-hidden rounded-[1.6rem] border-[5px] border-[#1d1d20] bg-[#1d1d20] shadow-[0_1.5rem_2.5rem_-1.4rem_rgb(20_20_20/0.65)]">
        <div className="overflow-hidden rounded-[1.25rem]">{children}</div>
      </div>
    )
  }
  return <div className="overflow-hidden rounded-[0.4rem] shadow-[0_1.2rem_2.4rem_-1.8rem_rgb(20_20_20/0.5)]">{children}</div>
}
