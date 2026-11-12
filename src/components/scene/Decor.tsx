import type { CSSProperties } from 'react'

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
export function Plant({ style }: { style: CSSProperties }) {
  return (
    <div aria-hidden="true" style={style} className="absolute [animation:scene-in_0.9s_var(--ease-soft)_0.5s_backwards]">
      <svg viewBox="0 0 90 190" className="h-full w-full overflow-visible">
        <g className="origin-[45px_74px] [animation:sway_7s_ease-in-out_infinite]">
          <path d="M45 74 C 30 50, 12 46, 6 30 C 26 30, 40 46, 45 74 Z" fill="#5f8f6f" />
          <path d="M45 74 C 50 44, 66 30, 84 26 C 80 46, 62 58, 45 74 Z" fill="#76a585" />
          <path d="M45 74 C 42 46, 46 22, 54 6 C 60 28, 54 52, 45 74 Z" fill="#4f7d5f" />
        </g>
        <g className="origin-[20px_118px] [animation:sway_9s_ease-in-out_-2s_infinite]">
          <path d="M20 118 C 8 136, 14 156, 6 182" stroke="#5f8f6f" strokeWidth="2" fill="none" />
          {[130, 146, 162, 176].map((y, i) => (
            <ellipse key={y} cx={i % 2 ? 15 : 7} cy={y} rx="6" ry="3.6" fill={i % 2 ? '#76a585' : '#5f8f6f'} transform={`rotate(${i % 2 ? 30 : -30} ${i % 2 ? 15 : 7} ${y})`} />
          ))}
        </g>
        <path d="M16 74 H74 L67 126 H23 Z" fill="#d88da0" className="dark:fill-[#a86a7b]" />
        <path d="M13 70 H77 V80 H13 Z" fill="#c97a8e" className="dark:fill-[#955a6a]" />
        <path d="M28 96 Q45 104 62 96" stroke="#f7f0e8" strokeOpacity="0.6" strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}

/** Taza con lápices y un pincel. */
export function Mug({ style }: { style: CSSProperties }) {
  return (
    <div aria-hidden="true" style={style} className="absolute [animation:scene-in_0.9s_var(--ease-soft)_0.6s_backwards]">
      <svg viewBox="0 0 54 82" className="h-full w-full overflow-visible">
        <rect x="14" y="4" width="4" height="46" rx="1" fill="#d6a24a" transform="rotate(-8 16 50)" />
        <rect x="24" y="0" width="4" height="50" rx="1" fill="#24605e" transform="rotate(4 26 50)" />
        <path d="M33 10 L35 50" stroke="#8f6948" strokeWidth="2.6" transform="rotate(10 34 50)" />
        <path d="M31 4 C 33 0, 37 0, 38 6 L 35 12 Z" fill="#141414" transform="rotate(10 34 50)" />
        <path d="M6 38 H44 V74 Q44 82 36 82 H14 Q6 82 6 74 Z" className="fill-[#f7f0e8] dark:fill-[#cfc7bb]" />
        <path d="M44 46 Q54 46 54 56 Q54 66 44 66" stroke="#f7f0e8" strokeWidth="4" fill="none" className="dark:stroke-[#cfc7bb]" />
        <path d="M6 52 H44" stroke="#d88da0" strokeWidth="3" />
      </svg>
    </div>
  )
}

/** Jarroncito con una ramita seca. */
export function Vase({ style }: { style: CSSProperties }) {
  return (
    <div aria-hidden="true" style={style} className="absolute [animation:scene-in_0.9s_var(--ease-soft)_0.7s_backwards]">
      <svg viewBox="0 0 40 90" className="h-full w-full overflow-visible">
        <g className="origin-[20px_46px] [animation:sway_8s_ease-in-out_-3s_infinite]">
          <path d="M20 50 C 18 30, 22 18, 16 2" stroke="#8f6948" strokeWidth="1.2" fill="none" />
          {[8, 16, 24, 32].map((y, i) => (
            <ellipse key={y} cx={i % 2 ? 22 : 14} cy={y} rx="4" ry="2" fill="#d6a24a" opacity="0.9" transform={`rotate(${i % 2 ? 35 : -35} ${i % 2 ? 22 : 14} ${y})`} />
          ))}
        </g>
        <path d="M14 46 H26 Q26 54 32 62 Q36 70 32 80 Q28 90 20 90 Q12 90 8 80 Q4 70 8 62 Q14 54 14 46 Z" fill="#80bdbb" className="dark:fill-[#5c8f8d]" />
        <path d="M11 70 Q20 76 29 70" stroke="#f7f0e8" strokeOpacity="0.55" strokeWidth="1.6" fill="none" />
      </svg>
    </div>
  )
}

/** Pista manuscrita para descubrir la lámpara. */
export function LampHint({ style }: { style: CSSProperties }) {
  return (
    <div aria-hidden="true" style={style} className="pointer-events-none absolute [animation:scene-in_1s_var(--ease-soft)_1.6s_backwards]">
      <p className="font-hand text-[3.1cqw] leading-none text-rose-deep -rotate-6">psst… tirá de la cuerda</p>
      <svg viewBox="0 0 80 40" className="mt-[2%] ml-[48%] w-[48%] overflow-visible">
        <path d="M2 30 C 26 36, 52 28, 72 8" fill="none" className="stroke-rose-deep" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M62 8 L73 7 L71 18" fill="none" className="stroke-rose-deep" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
