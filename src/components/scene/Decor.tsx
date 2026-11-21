import { useRef, type CSSProperties, type ReactNode } from 'react'
import { FLOWER_VASE, HANGING_PLANT, POTTED_PLANT } from './decor/decorObjects'
import { useI18n } from '../../i18n/useI18n'

// Piezas decorativas de la escena: no son interactivas (salvo el cuaderno del CV)
// y quedan ocultas para lectores de pantalla.

/** Ventana arqueada: de día cielo y nube, de noche luna y estrellas. */
export function SceneWindow({ style }: { style: CSSProperties }) {
  return (
    <div aria-hidden="true" style={style} className="absolute [animation:scene-in_1s_var(--ease-soft)_backwards]">
      <div className="relative h-[92%] overflow-hidden rounded-t-full border-[0.9cqw] border-b-[0.6cqw] border-wood bg-linear-to-b from-[#bfe1de] via-[#e4efe9] to-[#f8eee2] transition-colors duration-700 dark:from-[#10162f] dark:via-[#1b2142] dark:to-[#2c2747]">
        {/* Sol / luna */}
        <span className="absolute top-[22%] right-[20%] size-[26%] rounded-full bg-[#fff3cf] shadow-[0_0_3cqw_1cqw_rgb(255_236_180/0.8)] transition-all duration-700 dark:bg-[#f3eedf] dark:shadow-[inset_-1.2cqw_0.3cqw_0_0_#cfc7b0,0_0_2.4cqw_0.4cqw_rgb(220_225_255/0.25)]" />
        {/* Nube */}
        <span className="absolute top-[48%] left-0 h-[9%] w-[45%] rounded-full bg-white/85 [animation:cloud_38s_linear_infinite] dark:opacity-0" />
        {/* Estrellas */}
        {[
          [18, 18],
          [40, 32],
          [66, 58],
          [28, 62],
          [78, 76],
          [52, 82],
        ].map(([l, t], i) => (
          <span
            key={i}
            className="absolute size-[2.6%] rounded-full bg-white opacity-0 dark:opacity-100"
            style={{ left: `${l}%`, top: `${t}%`, animation: `twinkle ${2.4 + i * 0.7}s ease-in-out ${i * 0.4}s infinite` }}
          />
        ))}
        {/* Parteluces */}
        <span className="absolute inset-y-0 left-1/2 w-[0.6cqw] -translate-x-1/2 bg-wood" />
        <span className="absolute inset-x-0 top-[55%] h-[0.6cqw] bg-wood" />
      </div>
      <div className="mx-[-8%] h-[8%] rounded-sm bg-wood-deep shadow-[0_0.8cqw_1cqw_-0.4cqw_rgb(0_0_0/0.3)]" />
    </div>
  )
}

/** Planta con hojas que caen por delante de la repisa; se mece apenas. */
// Objetos decorativos armados con las piezas ilustradas originales (decor/decorObjects.tsx).
// Cada uno ocupa su caja en la escena; las hojas se mecen apenas desde su tallo
// y, al pasar el mouse por encima, hacen un vaivén corto (cada una con su demora y amplitud).
const RUSTLE_COOLDOWN_MS = 900

function rustle(svg: SVGSVGElement) {
  svg.querySelectorAll<SVGGElement>('[data-leaf]').forEach((leaf) => {
    leaf.classList.remove('is-rustling')
    void leaf.getBoundingClientRect() // reinicia la animación
    leaf.classList.add('is-rustling')
  })
}

function DecorArt({ object, style, delay }: { object: { viewBox: string; art: ReactNode }; style: CSSProperties; delay: string }) {
  const last = useRef(0)
  return (
    <div
      aria-hidden="true"
      style={{ ...style, animationDelay: delay }}
      className="absolute [animation:scene-in_0.9s_var(--ease-soft)_backwards]"
      onPointerOver={(e) => {
        const target = e.target as Element
        if (!target.closest('[data-leaf]')) return
        const now = performance.now()
        if (now - last.current < RUSTLE_COOLDOWN_MS) return
        last.current = now
        const svg = target.closest('svg')
        if (svg) rustle(svg)
      }}
      onAnimationEnd={(e) => (e.target as Element).classList.remove('is-rustling')}
    >
      <svg viewBox={object.viewBox} className="h-full w-full overflow-visible dark:brightness-[0.88]">
        {object.art}
      </svg>
    </div>
  )
}

/** Planta de hojas largas en maceta celeste (repisa de abajo) */
export function Plant({ style }: { style: CSSProperties }) {
  return <DecorArt object={POTTED_PLANT} style={style} delay="0.5s" />
}

/** Florero celeste con flores amarillas (repisa de arriba) */
export function Vase({ style }: { style: CSSProperties }) {
  return <DecorArt object={FLOWER_VASE} style={style} delay="0.7s" />
}

/** Planta colgante en maceta rosa: sus guías caen por delante de la repisa */
export function HangingPlant({ style }: { style: CSSProperties }) {
  return <DecorArt object={HANGING_PLANT} style={style} delay="0.65s" />
}

export function LampHint({ style }: { style: CSSProperties }) {
  const { t } = useI18n()
  return (
    <div aria-hidden="true" style={style} className="pointer-events-none absolute [animation:scene-in_1s_var(--ease-soft)_1.6s_backwards]">
      <svg viewBox="0 0 80 40" className="mt-[-5%] ml-[55%] w-[48%] -scale-x-100 rotate-120 overflow-visible">
        <path d="M2 30 C 26 36, 52 28, 72 8" fill="none" className="stroke-rose-deep" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M62 8 L73 7 L71 18" fill="none" className="stroke-rose-deep" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="font-hand text-[3.1cqw] leading-none text-rose-deep -rotate-6 mt-[15%] ml-[-10%]">{t('scene.pullHint')}</p>
      
    </div>
  )
}
