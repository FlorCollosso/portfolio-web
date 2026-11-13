import { useState, type CSSProperties, type MouseEvent } from 'react'
import { useTheme } from '../../hooks/useTheme'

interface LampProps {
  style?: CSSProperties
  onUse?: () => void
}

// Lámpara colgante: tirar de la cuerda enciende la noche en todo el sitio.
// Lo visual (luz, halo) depende del CSS de data-theme, así la transición circular
// captura el estado final sin esperar a React.
export function Lamp({ style, onUse }: LampProps) {
  const { theme, toggle } = useTheme()
  const [pulling, setPulling] = useState(false)
  const on = theme === 'dark'

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const bulb = e.currentTarget.querySelector('[data-bulb]')?.getBoundingClientRect()
    setPulling(true)
    window.setTimeout(() => setPulling(false), 450)
    toggle(bulb ? { x: bulb.left + bulb.width / 2, y: bulb.top + bulb.height / 2 } : { x: e.clientX, y: e.clientY })
    onUse?.()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={on}
      aria-label={on ? 'Apagar la lámpara y volver al modo día' : 'Encender la lámpara: modo noche'}
      title={on ? 'Apagar la lámpara' : 'Encender la lámpara'}
      style={style}
      className="lamp-button group/lamp absolute cursor-pointer pointer-events-auto rounded-b-[40%] focus-visible:outline-offset-4"
    >
      <svg viewBox="0 0 96 172" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <radialGradient id="lamp-halo">
            <stop offset="0" stopColor="#fff1cf" stopOpacity="0.95" />
            <stop offset="0.35" stopColor="#ffd79a" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ffd79a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Se balancea apenas al pasar el mouse; el haz de luz de la escena gira con ella (ver .lamp-rig) */}
        <g className="lamp-rig" style={{ transformOrigin: '48px 0px' }}>
          <line x1="48" y1="-40" x2="48" y2="100" className="stroke-ink-soft" strokeWidth="1.2" />
          <rect x="42" y="94" width="12" height="9" rx="2" fill="#b8893a" />

          {/* Halo de luz: solo de noche */}
          <circle cx="48" cy="144" r="46" fill="url(#lamp-halo)" className="opacity-0 transition-opacity duration-700 dark:opacity-100" />

          <path d="M8 144 C 10 118, 28 101, 48 101 C 68 101, 86 118, 88 144 Z" fill="#2c5a58" />
          <path d="M18 128 C 24 114, 34 107, 44 105" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="48" cy="144" rx="40" ry="4.5" className="fill-[#1d3f3e] transition-colors duration-700 dark:fill-[#ffe3ae]" />
          <circle data-bulb="" cx="48" cy="146" r="7.5" className="fill-[#efe6d6] transition-colors duration-700 dark:fill-[#fff4d6]" />

          {/* Cuerda para tirar */}
          <g style={{ animation: pulling ? 'cord-pull 0.45s var(--ease-swing)' : 'none' }}>
            <line x1="72" y1="140" x2="72" y2="162" className="stroke-ink-soft" strokeWidth="1" />
            <circle cx="72" cy="165" r="3.6" fill="#b8893a" className="transition-transform group-hover/lamp:scale-125" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
          </g>
        </g>
      </svg>
    </button>
  )
}
