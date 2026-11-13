import { useState, type CSSProperties } from 'react'
import { box, type PetSlot } from '../../data/scene'
import type { PetPortrait } from '../../types/portfolio'
import { asset } from '../../utils/asset'
import type { AttentionHandlers } from './ProjectObjects'

interface PetFrameProps extends AttentionHandlers {
  slot: PetSlot
  pet: PetPortrait
  order: number
  open: boolean
  onToggle: (id: string) => void
}

const BACKDROPS = ['#f1d1d1', '#d7ebea']

// Cuadrito de una de mis gatitas. Al tocarlo se despega una notita con una frase sobre ella.
export function PetFrame({ slot, pet, order, open, onToggle, ...handlers }: PetFrameProps) {
  // Mantiene la nota montada mientras se guarda (animación de salida)
  const [shown, setShown] = useState(open)
  if (open && !shown) setShown(true)
  const noteId = `nota-${pet.id}`

  const picture = pet.photo ? (
    <img
      src={asset(`${pet.photo.base}-640.webp`)}
      alt=""
      decoding="async"
      className="h-full w-full object-cover"
      style={pet.photo.position ? { objectPosition: pet.photo.position } : undefined}
    />
  ) : (
    <PetIllustration pet={pet} backdrop={BACKDROPS[order % BACKDROPS.length]} />
  )

  return (
    <div
      data-pet-frame=""
      style={{ ...box(slot.x, slot.y, slot.w, slot.h), animationDelay: `${300 + order * 90}ms` }}
      className={`absolute pointer-events-auto [animation:scene-in_0.9s_var(--ease-soft)_backwards] ${open ? 'z-30' : 'hover:z-20 focus-within:z-20'}`}
    >
      <button
        type="button"
        onClick={() => onToggle(pet.id)}
        aria-expanded={open}
        aria-controls={noteId}
        aria-label={`Foto de ${pet.name}, mi gatita. ${open ? 'Guardar' : 'Leer'} su notita`}
        {...handlers}
        className="group relative block h-full w-full cursor-pointer"
      >
        <span
          className={`block h-full w-full origin-bottom transition-[rotate,translate] duration-700 ease-[var(--ease-swing)] [rotate:var(--tilt)] group-hover:-translate-y-[5%] group-hover:[rotate:calc(var(--tilt)*0.4)] group-focus-visible:-translate-y-[5%] ${
            open ? '-translate-y-[5%] [rotate:calc(var(--tilt)*0.4)]' : ''
          } ${
            slot.variant === 'stand'
              ? 'bg-wood-deep p-[8%] shadow-[0_1cqw_1.6cqw_-0.6cqw_rgb(0_0_0/0.35)]'
              : 'bg-[#fbf7f0] px-[7%] pt-[7%] pb-[22%] shadow-[0_1cqw_1.6cqw_-0.6cqw_rgb(0_0_0/0.3)] dark:bg-[#e9e1d0]'
          }`}
          style={{ '--tilt': `${slot.tilt}deg` } as CSSProperties}
        >
          {slot.variant === 'polaroid' && (
            <>
              {/* Cinta washi que la sostiene */}
              <span aria-hidden="true" className="absolute -top-[7%] left-1/2 h-[14%] w-[46%] -translate-x-1/2 -rotate-6 bg-teal/70 [clip-path:polygon(4%_0,96%_6%,100%_100%,0_90%)]" />
              <span aria-hidden="true" className="absolute inset-x-0 bottom-[5%] text-center font-hand text-[2.6cqw] leading-none text-ink-soft dark:text-[#2c2c2c]">
                {pet.name}
              </span>
            </>
          )}
          <span className={`block h-full w-full overflow-hidden ${slot.variant === 'stand' ? 'bg-card p-[6%]' : ''}`}>
            <span className="block h-full w-full overflow-hidden">{picture}</span>
          </span>
        </span>
        {slot.variant === 'stand' && (
          <span aria-hidden="true" className="absolute -bottom-[2%] left-[60%] h-[28%] w-[5%] origin-bottom skew-x-[-18deg] bg-wood-deep/80" />
        )}
        {/* Nombre manuscrito que se asoma al pasar el mouse */}
        {!open && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[calc(100%+0.3rem)] left-1/2 -translate-x-1/2 translate-y-1 font-hand text-[clamp(1rem,3.2cqw,1.3rem)] leading-none whitespace-nowrap text-rose-deep opacity-0 transition-all duration-300 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100"
          >
            {pet.name} ♡
          </span>
        )}
      </button>

      {shown && (
        <div
          id={noteId}
          role="note"
          aria-label={`Notita sobre ${pet.name}`}
          onAnimationEnd={(e) => e.animationName === 'note-tuck' && setShown(false)}
          className="pointer-events-auto absolute bottom-[calc(100%+0.5rem)] left-1/2 w-[clamp(9.5rem,36cqw,13rem)] -translate-x-1/2 cursor-default"
        >
          <div
            className={`relative origin-bottom px-[0.85em] pt-[0.9em] pb-[0.8em] font-hand text-[clamp(1rem,3.4cqw,1.25rem)] leading-[1.12] text-[#3b3427] shadow-[0.2rem_0.35rem_0.9rem_-0.2rem_rgb(0_0_0/0.3)] ${
              order % 2 ? 'rotate-[2.5deg]' : 'rotate-[-2.5deg]'
            } bg-[#fdf0b8] dark:bg-[#ece0a4] ${open ? '[animation:note-pop_0.55s_var(--ease-swing)]' : '[animation:note-tuck_0.35s_var(--ease-soft)_forwards]'}`}
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 0.9em), calc(100% - 0.9em) 100%, 0 100%)' }}
          >
            {/* Esquinita doblada */}
            <span aria-hidden="true" className="absolute right-0 bottom-0 size-[0.9em] bg-linear-to-tl from-transparent from-50% to-[#e6d48c] to-50% dark:to-[#cdbf86]" />
            <strong className="block text-[1.12em] font-semibold text-rose-deep dark:text-[#93354f]">{pet.name} ♡</strong>
            <span className="mt-0.5 block">{pet.note}</span>
          </div>
          {/* Cinta de papel arriba */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute -top-[0.45rem] left-1/2 h-[0.95rem] w-[3.4rem] -translate-x-1/2 bg-rose-soft/90 shadow-sm [clip-path:polygon(3%_0,97%_6%,100%_100%,0_92%)] dark:bg-[#f1d1d1]/85 ${
              open ? '[animation:note-pop_0.55s_var(--ease-swing)]' : '[animation:note-tuck_0.35s_var(--ease-soft)_forwards]'
            } ${order % 2 ? 'rotate-[4deg]' : 'rotate-[-4deg]'}`}
          />
        </div>
      )}
    </div>
  )
}

/** Retrato ilustrado, para cuando todavía no hay foto real. */
function PetIllustration({ pet, backdrop }: { pet: PetPortrait; backdrop: string }) {
  const clipId = `pet-head-${pet.id}`
  const light = pet.markings === 'tuxedo' ? pet.patch : undefined
  return (
    <svg viewBox="0 0 60 64" preserveAspectRatio="xMidYMid slice" className="h-full w-full transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.05]">
      <defs>
        <clipPath id={clipId}>
          <ellipse cx="30" cy="30" rx="17" ry="14" />
          <path d="M13 26 L15 8 L27 18 Z M47 26 L45 8 L33 18 Z" />
        </clipPath>
      </defs>
      <rect width="60" height="64" fill={backdrop} className="dark:brightness-[0.82]" />
      <circle cx="49" cy="12" r="5" fill="#ffffff" opacity="0.45" />
      {/* Hombros y pechito */}
      <path d="M8 66 C 9 50, 19 42, 30 42 C 41 42, 51 50, 52 66 Z" fill={pet.fur} />
      {light && <path d="M23 66 C 23 54, 26 47, 30 46 C 34 47, 37 54, 37 66 Z" fill={light} />}
      {/* Orejas */}
      <path d="M13 26 L15 8 L27 18 Z M47 26 L45 8 L33 18 Z" fill={pet.fur} />
      <path d="M16 22 L17 12 L24 18 Z M44 22 L43 12 L36 18 Z" fill="#d88da0" opacity="0.8" />
      <ellipse cx="30" cy="30" rx="17" ry="14" fill={pet.fur} />
      {/* Mancha sobre un ojo (Micha) o hocico claro (Nami) */}
      <g clipPath={`url(#${clipId})`}>
        {pet.markings === 'patch' && pet.patch && <ellipse cx="18" cy="18" rx="12" ry="11" fill={pet.patch} />}
        {pet.markings === 'tuxedo' && light && <path d="M22 44 C 22 36, 26 31, 30 31 C 34 31, 38 36, 38 44 Z" fill={light} />}
      </g>
      {[23, 37].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy="29" rx="3.4" ry="3.6" fill={pet.eyes} />
          <ellipse cx={cx} cy="29" rx="1.3" ry="2.8" fill="#141414" />
          <circle cx={cx - 1} cy="27.6" r="0.8" fill="#ffffff" />
        </g>
      ))}
      <path d="M28.4 34 L31.6 34 L30 36 Z" fill="#e7a0b0" />
      <path d="M30 36 Q28.6 38.4 27 37.4 M30 36 Q31.4 38.4 33 37.4" stroke={light ? '#141414' : '#00000055'} strokeOpacity="0.45" strokeWidth="0.6" fill="none" strokeLinecap="round" />
      <circle cx="19.5" cy="35" r="2.4" fill="#d88da0" opacity="0.3" />
      <circle cx="40.5" cy="35" r="2.4" fill="#d88da0" opacity="0.3" />
    </svg>
  )
}
