import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { box, type PetSlot } from '../../data/scene'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import type { PetPortrait } from '../../types/portfolio'
import { asset } from '../../utils/asset'
import type { AttentionHandlers } from './ProjectObjects'

interface PetFrameProps extends AttentionHandlers {
  slot: PetSlot
  pet: PetPortrait
  order: number
}

// Marcos con los tonos de la paleta (rose / teal)
const FRAME_COLOR = {
  rose: 'bg-rose shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08),inset_0.25em_0.25em_0_rgb(255_255_255/0.22)]',
  teal: 'bg-teal shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08),inset_0.25em_0.25em_0_rgb(255_255_255/0.22)]',
}

type Phase = 'closed' | 'open' | 'closing'

// Cuadrito de una de mis gatitas. Al tocarlo, la foto sale del marco y se amplía;
// después aparece una notita pegada a su costado.
export function PetFrame({ slot, pet, order, ...handlers }: PetFrameProps) {
  const [phase, setPhase] = useState<Phase>('closed')
  const reduced = useReducedMotion()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const frameRef = useRef<HTMLSpanElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const figureRef = useRef<HTMLElement>(null)
  const titleId = `foto-${pet.id}-titulo`
  const src = (w: number) => asset(`${pet.photo.base}-${w}.webp`)
  const position = pet.photo.position ? { objectPosition: pet.photo.position } : undefined

  // Transformación que lleva la foto ampliada de vuelta al lugar del cuadrito (para animar entre ambos)
  const fromFrame = () => {
    const a = frameRef.current?.getBoundingClientRect()
    const b = figureRef.current?.getBoundingClientRect()
    if (!a || !b || !b.width) return 'none'
    const dx = a.left + a.width / 2 - (b.left + b.width / 2)
    const dy = a.top + a.height / 2 - (b.top + b.height / 2)
    return `translate(${dx}px, ${dy}px) rotate(${slot.tilt}deg) scale(${a.width / b.width})`
  }

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (phase !== 'open' || !dialog || dialog.open) return
    dialog.showModal()
    if (!reduced) {
      figureRef.current?.animate([{ transform: fromFrame() }, { transform: 'none' }], {
        duration: 560,
        easing: 'cubic-bezier(0.2, 0.8, 0.25, 1.04)',
      })
    }
    // fromFrame solo lee medidas del DOM
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reduced])

  const close = () => {
    if (phase !== 'open') return
    setPhase('closing')
    const finish = () => {
      dialogRef.current?.close()
      setPhase('closed')
      buttonRef.current?.focus({ preventScroll: true })
    }
    const anim = reduced
      ? null
      : figureRef.current?.animate([{ transform: 'none' }, { transform: fromFrame() }], {
          duration: 440,
          delay: 140,
          easing: 'cubic-bezier(0.55, 0, 0.7, 0.2)',
          fill: 'forwards',
        })
    if (anim) anim.finished.then(finish, finish)
    else finish()
  }

  const closing = phase === 'closing'

  return (
    <div
      style={{ ...box(slot.x, slot.y, slot.w, slot.h), animationDelay: `${300 + order * 90}ms` }}
      className="absolute pointer-events-auto [animation:scene-in_0.9s_var(--ease-soft)_backwards] hover:z-20 focus-within:z-20"
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setPhase('open')}
        aria-haspopup="dialog"
        aria-label={`Ver la foto de ${pet.name}, mi gatita`}
        {...handlers}
        className={`group relative block h-full w-full cursor-pointer transition-opacity duration-150 ${phase === 'closed' ? '' : 'opacity-0'}`}
      >
        {/* Patita de apoyo del portarretratos */}
        <span aria-hidden="true" className="absolute -bottom-[2%] left-[58%] h-[28%] w-[5%] origin-bottom skew-x-[-18deg] bg-ink/25" />
        <span
          ref={frameRef}
          className={`block h-full w-full origin-bottom rounded-[2px] p-[9%] [rotate:var(--tilt)] shadow-[0_1cqw_1.6cqw_-0.6cqw_rgb(0_0_0/0.35)] transition-[rotate,translate] duration-700 ease-[var(--ease-swing)] group-hover:-translate-y-[5%] group-hover:[rotate:calc(var(--tilt)*0.4)] group-focus-visible:-translate-y-[5%] ${FRAME_COLOR[slot.frame]}`}
          style={{ '--tilt': `${slot.tilt}deg` } as CSSProperties}
        >
          <span className="block h-full w-full bg-card p-[5%] shadow-[inset_0_0.15em_0.3em_rgb(0_0_0/0.18)] dark:bg-[#e9e1d0]">
            <img
              src={src(640)}
              alt=""
              decoding="async"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
              style={position}
            />
          </span>
        </span>
        {/* Nombre manuscrito que se asoma al pasar el mouse */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[calc(100%+0.3rem)] left-1/2 -translate-x-1/2 translate-y-1 font-hand text-[clamp(1rem,3.2cqw,1.3rem)] leading-none whitespace-nowrap text-rose-deep opacity-0 transition-all duration-300 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100"
        >
          {pet.name} ♡
        </span>
      </button>

      {phase !== 'closed' && (
        <dialog
          ref={dialogRef}
          aria-labelledby={titleId}
          data-closing={closing || undefined}
          onCancel={(e) => {
            e.preventDefault()
            close()
          }}
          onClick={(e) => e.target === dialogRef.current && close()}
          // pointer-events-auto: la escena tiene pointer-events: none y el diálogo lo heredaría
          className="pet-dialog pointer-events-auto m-auto max-w-none overflow-visible bg-transparent p-0"
        >
          <div className="flex flex-col items-center sm:flex-row sm:items-start">
            {/* La foto ampliada, en el mismo marco de color */}
            <figure
              ref={figureRef}
              className={`relative w-[min(74vw,21rem,50vh)] origin-center rounded-[3px] p-[5%] text-[clamp(0.9rem,3vw,1.1rem)] shadow-[0_1.5rem_3rem_-1rem_rgb(0_0_0/0.5)] ${FRAME_COLOR[slot.frame]} ${
                slot.tilt < 0 ? '-rotate-1' : 'rotate-1'
              }`}
            >
              <div className="bg-card p-[3.5%] shadow-[inset_0_0.15em_0.4em_rgb(0_0_0/0.18)] dark:bg-[#e9e1d0]">
                <img
                  src={src(1280)}
                  srcSet={`${src(640)} 640w, ${src(1280)} 1280w`}
                  sizes="(min-width: 40rem) 21rem, 74vw"
                  alt={pet.photo.alt}
                  decoding="async"
                  className="aspect-[3/4] w-full object-cover"
                  style={position}
                />
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={`Cerrar la foto de ${pet.name}`}
                className="absolute -top-3 -left-3 grid size-9 cursor-pointer place-items-center rounded-full bg-card text-lg leading-none text-ink shadow-md transition-transform hover:scale-110 dark:bg-[#e9e1d0] dark:text-[#2c2c2c]"
              >
                ×
              </button>
            </figure>

            {/* Notita pegada al costado de la foto */}
            <div
              className={`relative z-10 -mt-10 mr-[-0.5rem] w-[min(68vw,12.5rem)] origin-top-left self-end sm:mt-[38%] sm:mr-0 sm:-ml-7 sm:self-auto ${
                order % 2 ? '-rotate-3' : 'rotate-3'
              } ${closing ? '[animation:note-unstick_0.2s_ease-in_forwards]' : reduced ? '' : '[animation:note-stick_0.5s_var(--ease-swing)_0.5s_backwards]'}`}
            >
              <div
                className="relative bg-[#fdf0b8] px-[0.85em] pt-[1em] pb-[0.85em] font-hand text-[1.3rem] leading-[1.12] text-[#3b3427] dark:bg-[#ece0a4]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 0.9em), calc(100% - 0.9em) 100%, 0 100%)' }}
              >
                {/* Esquinita doblada */}
                <span aria-hidden="true" className="absolute right-0 bottom-0 size-[0.9em] bg-linear-to-tl from-transparent from-50% to-[#e6d48c] to-50% dark:to-[#cdbf86]" />
                <strong id={titleId} className="block text-[1.15em] font-semibold text-rose-deep dark:text-[#93354f]">
                  {pet.name} ♡
                </strong>
                <p className="mt-0.5">{pet.note}</p>
              </div>
              {/* Sombra (el recorte de la esquina no deja usar box-shadow en el papel) */}
              <span aria-hidden="true" className="absolute inset-0 -z-10 translate-x-1 translate-y-1.5 bg-black/20 blur-[6px]" />
              {/* Cinta que la pega a la foto */}
              <span aria-hidden="true" className="absolute -top-1.5 -left-4 h-[0.95rem] w-[3.4rem] -rotate-[32deg] bg-rose-soft/90 shadow-sm [clip-path:polygon(3%_0,97%_6%,100%_100%,0_92%)] dark:bg-[#f1d1d1]/85" />
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}
