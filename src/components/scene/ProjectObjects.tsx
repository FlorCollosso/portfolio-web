import type { CSSProperties, FocusEvent, PointerEvent } from 'react'
import { categoryLabels } from '../../data/labels'
import { box, SCENE, type BookSlot, type FrameSlot } from '../../data/scene'
import type { Project } from '../../types/portfolio'
import { asset } from '../../utils/asset'

export interface AttentionHandlers {
  onPointerEnter: (e: PointerEvent<HTMLElement>) => void
  onPointerLeave: () => void
  onFocus: (e: FocusEvent<HTMLElement>) => void
  onBlur: () => void
}

// Etiqueta tipo museo que aparece al pasar el mouse o con el foco del teclado.
export function SceneLabel({ title, detail, place = 'top' }: { title: string; detail: string; place?: 'top' | 'bottom' }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 z-30 w-max max-w-48 -translate-x-1/2 rounded-md border border-line bg-card px-3 py-2 text-left opacity-0 shadow-lg shadow-ink/10 transition-all duration-300 ease-[var(--ease-soft)] group-focus-visible:opacity-100 [@media(hover:hover)]:group-hover:opacity-100 ${
        place === 'top'
          ? 'bottom-[calc(100%+0.6rem)] translate-y-1 group-focus-visible:translate-y-0 [@media(hover:hover)]:group-hover:translate-y-0'
          : 'top-[calc(100%+0.6rem)] -translate-y-1 group-focus-visible:translate-y-0 [@media(hover:hover)]:group-hover:translate-y-0'
      }`}
    >
      <span className="block font-serif text-base leading-tight font-semibold text-ink">{title}</span>
      <span className="mt-0.5 block text-xs text-muted">{detail}</span>
      <span className="mt-1 block font-hand text-sm text-rose-deep">abrir →</span>
    </span>
  )
}

const detailOf = (p: Project) => `${categoryLabels[p.category]}${p.year ? ` · ${p.year}` : ''}`

interface BookProps extends Partial<AttentionHandlers> {
  slot: BookSlot
  project?: Project
  lying?: boolean
  /** Base sobre la que se apoya (en unidades de la escena) */
  baseY: number
  order: number
  onOpen?: (project: Project) => void
}

// Un lomo de libro dibujado con CSS. Si representa un proyecto, es un botón que se "asoma" de la repisa.
export function Book({ slot, project, lying = false, baseY, order, onOpen, ...handlers }: BookProps) {
  const style: CSSProperties = {
    ...box(slot.x, baseY - slot.h, slot.w, slot.h),
    animationDelay: `${180 + order * 70}ms`,
  }
  const spine = (
    <span
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-t-[3px] rounded-b-[1px] shadow-[inset_-0.35cqw_0_0_rgb(0_0_0/0.14),inset_0.25cqw_0_0_rgb(255_255_255/0.16)] transition-[filter] duration-700 dark:brightness-[0.82] dark:saturate-[0.9]"
      style={{ backgroundColor: slot.color, color: slot.ink, transform: slot.tilt ? `rotate(${slot.tilt}deg)` : undefined, transformOrigin: 'bottom left' }}
    >
      {slot.band && (
        <>
          <span className={`absolute ${lying ? 'inset-y-0 left-[7%] w-[3%]' : 'inset-x-0 top-[8%] h-[3%]'}`} style={{ backgroundColor: slot.band }} />
          <span className={`absolute ${lying ? 'inset-y-0 right-[7%] w-[3%]' : 'inset-x-0 bottom-[8%] h-[3%]'}`} style={{ backgroundColor: slot.band }} />
        </>
      )}
      {project && (
        <span
          className={`font-serif leading-none font-semibold tracking-wide whitespace-nowrap ${lying ? 'text-[2.3cqw]' : 'text-[2.5cqw] [writing-mode:vertical-rl] rotate-180'}`}
        >
          {project.title}
        </span>
      )}
    </span>
  )

  if (!project) {
    return (
      <span aria-hidden="true" style={style} className="absolute [animation:scene-in_0.8s_var(--ease-soft)_backwards]">
        {spine}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onOpen?.(project)}
      aria-label={`${project.title}: ${detailOf(project)}. Abrir proyecto`}
      style={style}
      {...handlers}
      className="group absolute pointer-events-auto cursor-pointer [animation:scene-in_0.8s_var(--ease-soft)_backwards] hover:z-20 focus-visible:z-20"
    >
      <span className={`block h-full w-full transition-transform duration-500 ease-[var(--ease-swing)] ${lying ? 'group-hover:-translate-x-[6%] group-focus-visible:-translate-x-[6%]' : 'group-hover:-translate-y-[9%] group-focus-visible:-translate-y-[9%]'}`}>
        {spine}
      </span>
      <SceneLabel title={project.title} detail={detailOf(project)} />
    </button>
  )
}

interface FrameProps extends AttentionHandlers {
  slot: FrameSlot
  project: Project
  order: number
  onOpen: (project: Project) => void
}

// Cuadros colgados, un portarretratos y una postal: cada uno abre su proyecto.
export function Frame({ slot, project, order, onOpen, ...handlers }: FrameProps) {
  const style: CSSProperties = { ...box(slot.x, slot.y, slot.w, slot.h), animationDelay: `${120 + order * 90}ms` }
  const img = project.image && (
    <img
      src={asset(`${project.image.base}-640.webp`)}
      alt=""
      loading="eager"
      decoding="async"
      className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.06]"
      style={project.image.position ? { objectPosition: project.image.position } : undefined}
    />
  )

  const frameLook = {
    wall: 'bg-wood-deep p-[5%] shadow-[0_1.4cqw_2cqw_-0.8cqw_rgb(0_0_0/0.35)]',
    stand: 'bg-ink-soft p-[6%] shadow-[0_1cqw_1.6cqw_-0.6cqw_rgb(0_0_0/0.35)] dark:bg-[#2b2a30]',
    postcard: 'bg-[#fbf7f0] p-[5%] shadow-[0_1cqw_1.6cqw_-0.6cqw_rgb(0_0_0/0.3)]',
  }[slot.variant]

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-label={`${project.title}: ${detailOf(project)}. Abrir proyecto`}
      style={style}
      {...handlers}
      className="group absolute pointer-events-auto cursor-pointer [animation:scene-in_0.9s_var(--ease-soft)_backwards] hover:z-20 focus-visible:z-20"
    >
      {slot.variant === 'wall' && (
        <svg aria-hidden="true" viewBox="0 0 100 30" preserveAspectRatio="none" className="absolute bottom-full left-[15%] h-[22%] w-[70%] overflow-visible">
          <path d="M0 30 L50 2 L100 30" fill="none" className="stroke-ink-soft/50" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx="50" cy="2" r="2.4" fill="#b8893a" />
        </svg>
      )}
      <span
        className={`block h-full w-full origin-top transition-[rotate,translate] duration-700 ease-[var(--ease-swing)] [rotate:var(--tilt)] group-hover:[rotate:calc(var(--tilt)*-0.8)] group-focus-visible:[rotate:0deg] ${
          slot.variant === 'wall' ? '' : 'group-hover:-translate-y-[5%]'
        } ${frameLook}`}
        style={{ '--tilt': `${slot.tilt}deg` } as CSSProperties}
      >
        <span className={`block h-full w-full overflow-hidden ${slot.variant === 'wall' ? 'bg-card p-[7%]' : ''}`}>
          <span className="block h-full w-full overflow-hidden">{img}</span>
        </span>
      </span>
      {slot.variant === 'stand' && (
        <span aria-hidden="true" className="absolute -bottom-[2%] left-[58%] h-[30%] w-[5%] origin-bottom skew-x-[-18deg] bg-ink-soft/80" />
      )}
      <SceneLabel title={project.title} detail={detailOf(project)} place={slot.y < SCENE.shelfTop ? 'bottom' : 'top'} />
    </button>
  )
}
