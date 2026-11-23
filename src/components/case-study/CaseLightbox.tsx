import { useEffect, useRef, type KeyboardEvent } from 'react'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import { useI18n } from '../../i18n/useI18n'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import type { ResolvedMedia } from './mediaResolver'

export interface LightboxState {
  items: ResolvedMedia[]
  index: number
}

interface CaseLightboxProps {
  state: LightboxState | null
  onMove: (index: number) => void
  onClose: () => void
}

const control = 'grid size-11 place-items-center rounded-full bg-[#fbf7f0]/90 text-[#141414] shadow transition hover:bg-[#fbf7f0]'

// Visor de imágenes. Al ser un <dialog>, Escape cierra solo el visor y el foco vuelve a la imagen.
export function CaseLightbox({ state, onMove, onClose }: CaseLightboxProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const touchX = useRef<number | null>(null)
  const { t } = useI18n()
  const isOpen = state !== null

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  const count = state?.items.length ?? 0
  const go = (delta: number) => state && count > 1 && onMove((state.index + delta + count) % count)
  const item = state?.items[state.index]

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
    // Se resuelve acá para que Escape cierre solo el visor y no también el caso de estudio.
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      onClose()
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => (e.target === ref.current || (e.target as HTMLElement).dataset.backdrop) && onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
      }}
      aria-label={item ? item.title : t('case.lightbox')}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-[#111114]/95 p-0 text-[#f7f6f5]"
    >
      {item && (
        <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
          <div className="flex items-center justify-between gap-4 p-3 sm:p-4">
            <p className="text-sm tabular-nums text-[#d8d3cb]" aria-live="polite">
              {t('case.counter', { n: state.index + 1, total: count })}
            </p>
            <button type="button" onClick={onClose} className={control}>
              <FiX aria-hidden="true" className="size-5" />
              <span className="sr-only">{t('case.closeImage')}</span>
            </button>
          </div>

          <div data-backdrop="true" className="relative flex min-h-0 items-center justify-center px-3 sm:px-20">
            <ResponsiveImage
              key={item.id}
              priority
              image={{ base: item.base, alt: item.alt }}
              sizes="100vw"
              className="max-h-full max-w-full rounded-[0.25rem] object-contain motion-safe:animate-[backdrop-in_0.3s_ease-out]"
            />
            {count > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} className={`${control} absolute left-3 max-sm:top-auto max-sm:bottom-2 sm:left-5`}>
                  <FiChevronLeft aria-hidden="true" className="size-5" />
                  <span className="sr-only">{t('case.prev')}</span>
                </button>
                <button type="button" onClick={() => go(1)} className={`${control} absolute right-3 max-sm:top-auto max-sm:bottom-2 sm:right-5`}>
                  <FiChevronRight aria-hidden="true" className="size-5" />
                  <span className="sr-only">{t('case.next')}</span>
                </button>
              </>
            )}
          </div>

          <div className="mx-auto max-w-2xl px-5 py-3 text-center sm:py-4">
            <p className="font-serif text-lg italic">{item.title}</p>
            {item.description && <p className="mt-1 text-sm text-[#d8d3cb]">{item.description}</p>}
          </div>
        </div>
      )}
    </dialog>
  )
}
