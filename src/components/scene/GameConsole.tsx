import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react'
import type { AttentionHandlers } from './ProjectObjects'
import { useI18n } from '../../i18n/useI18n'

// El minijuego se descarga recién cuando hace falta: no pesa en el portfolio mientras está cerrado
const loadGame = () => import('../game/NamiExe')
const NamiExe = lazy(loadGame)

interface GameConsoleProps extends AttentionHandlers {
  style: CSSProperties
  reduced: boolean
}

type Mode = 'idle' | 'awake' | 'boot'

// Pantalla: 16 × 12 "píxeles" de 1.75 unidades
const PX = 1.75
const SCREEN = { x: 9, y: 9 }
const INK = '#3f6b4c'

// Sprites en pixel art: cada "#" es un píxel encendido
const HEART = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...']
const CAT_FACE = ['#.....#', '##...##', '#######', '#.###.#', '#######', '##.#.##', '.#####.']
const CAT_FACE_BLINK = ['#.....#', '##...##', '#######', '#######', '#######', '##.#.##', '.#####.']
const STAR = ['...#...', '..###..', '#######', '.#####.', '.##.##.', '.#...#.']

function Sprite({ rows, x, y, fill = INK }: { rows: string[]; x: number; y: number; fill?: string }) {
  return (
    <g>
      {rows.flatMap((row, r) =>
        [...row].map((c, col) =>
          c === '#' ? <rect key={`${r}-${col}`} x={SCREEN.x + (x + col) * PX} y={SCREEN.y + (y + r) * PX} width={PX + 0.02} height={PX + 0.02} fill={fill} /> : null,
        ),
      )}
    </g>
  )
}

// Mi consolita: en reposo late un corazoncito en la pantalla y respira la luz de encendido.
// Al pasar el mouse se "despierta" un gatito; al tocarla se enciende y abre NAMI.EXE.
export function GameConsole({ style, reduced, ...handlers }: GameConsoleProps) {
  const { t } = useI18n()
  const [mode, setMode] = useState<Mode>('idle')
  const [open, setOpen] = useState(false)
  const timer = useRef(0)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Se enciende la pantalla y, al terminar la animación, se abre el juego
  const play = () => {
    if (mode === 'boot' || open) return
    void loadGame()
    setMode('boot')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(true), reduced ? 120 : 750)
  }

  const closeGame = () => {
    setOpen(false)
    setMode('idle')
    buttonRef.current?.focus({ preventScroll: true })
  }

  const anim = (value: string) => (reduced ? undefined : value)
  const screenFill = mode === 'idle' ? '#bcd9c4' : mode === 'boot' ? '#eafff0' : '#d3ecd8'

  return (
    <>
    <button
      ref={buttonRef}
      type="button"
      onClick={play}
      onPointerEnter={(e) => {
        void loadGame()
        if (mode === 'idle') setMode('awake')
        handlers.onPointerEnter(e)
      }}
      onPointerLeave={() => {
        if (mode === 'awake') setMode('idle')
        handlers.onPointerLeave()
      }}
      onFocus={(e) => {
        if (mode === 'idle') setMode('awake')
        handlers.onFocus(e)
      }}
      onBlur={() => {
        if (mode === 'awake') setMode('idle')
        handlers.onBlur()
      }}
      aria-label={t('scene.console')}
      aria-haspopup="dialog"
      style={style}
      className="group/console absolute pointer-events-auto cursor-pointer [animation:scene-in_0.9s_var(--ease-soft)_0.6s_backwards] hover:z-20 focus-visible:z-20"
    >
      <span className="block h-full w-full origin-bottom -rotate-[4deg] transition-transform duration-500 ease-[var(--ease-swing)] group-hover/console:-translate-y-[7%] group-hover/console:-rotate-[1deg] group-focus-visible/console:-translate-y-[7%]">
        <svg viewBox="0 0 46 70" className="h-full w-full overflow-visible drop-shadow-[0_0.6cqw_0.6cqw_rgb(0_0_0/0.18)] dark:brightness-[0.9]" aria-hidden="true">
          {/* Cuerpo */}
          <rect width="46" height="70" rx="6" fill="#ecc5cb" />
          <rect x="40" y="3" width="4" height="64" rx="2" fill="#e0b0b8" />
          <rect x="3" y="2" width="30" height="1.6" rx="0.8" fill="#ffffff" opacity="0.45" />

          <defs>
            <clipPath id="console-screen">
              <rect x={SCREEN.x} y={SCREEN.y} width="28" height="21" />
            </clipPath>
          </defs>
          {/* Pantalla */}
          <rect x="5" y="5.5" width="36" height="28.5" rx="3" fill="#5a5560" />
          <circle cx="7.2" cy="12" r="1" fill="#f2abbc" style={{ animation: anim('console-led 2.6s ease-in-out infinite') }} />
          <rect x={SCREEN.x} y={SCREEN.y} width="28" height="21" fill={screenFill} style={{ transition: 'fill 300ms ease-out' }} />

          {mode === 'idle' && (
            <g className="console-pulse" style={{ animation: anim('console-pulse 1.8s ease-in-out infinite') }}>
              <Sprite rows={HEART} x={4.5} y={3} fill="#c56478" />
            </g>
          )}

          {mode === 'awake' && (
            <g>
              <g style={{ animation: anim('console-blink-open 3s steps(1) infinite') }}>
                <Sprite rows={CAT_FACE} x={4.5} y={2.5} />
              </g>
              <g style={{ opacity: 0, animation: anim('console-blink-closed 3s steps(1) infinite') }}>
                <Sprite rows={CAT_FACE_BLINK} x={4.5} y={2.5} />
              </g>
            </g>
          )}

          {mode === 'boot' && (
            <g clipPath="url(#console-screen)">
              {/* Encendido: destello, línea que se abre como un televisor viejo y aparece una estrella */}
              <rect x={SCREEN.x} y={SCREEN.y} width="28" height="21" fill="#ffffff" style={{ animation: anim('console-boot-flash 0.75s ease-out forwards') }} />
              <rect
                x={SCREEN.x}
                y={SCREEN.y + 10}
                width="28"
                height="1"
                fill="#f2abbc"
                style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: anim('console-boot-line 0.75s ease-out forwards') }}
              />
              <g style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: anim('console-boot-star 0.75s var(--ease-swing) forwards') }}>
                <Sprite rows={STAR} x={4.5} y={3.5} fill="#d6a24a" />
              </g>
            </g>
          )}

          {/* Reflejo del vidrio */}
          <path d={`M${SCREEN.x} ${SCREEN.y} h9 l-9 9 Z`} fill="#ffffff" opacity="0.22" />

          {/* Cruceta */}
          <rect x="6.5" y="45.2" width="11" height="3.6" rx="0.8" fill="#5a5560" />
          <rect x="10.2" y="41.5" width="3.6" height="11" rx="0.8" fill="#5a5560" />
          {/* Botones A y B: el A se hunde al encenderla */}
          <circle cx="29" cy="49" r="3.4" fill="#c56478" />
          <circle
            cx="36"
            cy="44.5"
            r="3.4"
            fill="#c56478"
            style={{ transform: mode === 'boot' ? 'translateY(0.6px)' : 'none', filter: mode === 'boot' ? 'brightness(0.85)' : 'none', transition: 'transform 120ms, filter 120ms' }}
          />
          {/* Start y select */}
          <rect x="16" y="58" width="5.5" height="1.8" rx="0.9" fill="#b98a92" transform="rotate(-25 18.75 58.9)" />
          <rect x="23.5" y="58" width="5.5" height="1.8" rx="0.9" fill="#b98a92" transform="rotate(-25 26.25 58.9)" />
          {/* Parlante */}
          <g stroke="#d9a3ac" strokeWidth="1" strokeLinecap="round">
            <path d="M35 64 l5 -5 M37.5 65.5 l4.5 -4.5 M32.5 62.5 l5 -5" />
          </g>
        </svg>
      </span>

      {/* Pista manuscrita */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-[calc(100%+0.35rem)] left-1/2 -translate-x-1/2 translate-y-1 font-hand text-[clamp(0.95rem,3cqw,1.25rem)] leading-none whitespace-nowrap text-rose-deep opacity-0 transition-all duration-300 ${
          mode === 'boot' ? '' : 'group-focus-visible/console:translate-y-0 group-focus-visible/console:opacity-100 [@media(hover:hover)]:group-hover/console:translate-y-0 [@media(hover:hover)]:group-hover/console:opacity-100'
        }`}
      >
        {t('scene.consoleHint')}
      </span>
    </button>

    {/* Fuera del botón: la ventana del juego va en un portal y sus eventos no deben llegar a la consola */}
    {open && (
      <Suspense fallback={null}>
        <NamiExe onClose={closeGame} />
      </Suspense>
    )}
    </>
  )
}
