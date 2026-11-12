import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useMediaQuery'

interface CatProps {
  /** Lo que el gato mira con atención (el libro o cuadro bajo el mouse) */
  focusEl: HTMLElement | null
  /** La nota escondida: de vez en cuando la mira de reojo */
  noteEl: HTMLElement | null
  style?: CSSProperties
  className?: string
}

const PHRASES = ['mrrp', 'prrr…', 'miau (o sea: hola)', '¿encontraste la nota?']
const SLEEP_AFTER_MS = 22000

// Gatito ilustrado en SVG. Sigue el cursor con la mirada, parpadea, mueve la cola
// y las orejas, se duerme si nadie le presta atención y ronronea si lo tocás.
export function Cat({ focusEl, noteEl, style, className = '' }: CatProps) {
  const reduced = useReducedMotion()
  const svgRef = useRef<SVGSVGElement>(null)
  const headRef = useRef<SVGGElement>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const focusRef = useRef<HTMLElement | null>(null)
  const glanceRef = useRef<HTMLElement | null>(null)
  const noteRef = useRef<HTMLElement | null>(null)
  const sleepingRef = useRef(false)
  const frame = useRef(0)
  const petCount = useRef(0)

  const [blink, setBlink] = useState(false)
  const [ear, setEar] = useState(false)
  const [flick, setFlick] = useState(false)
  const [sleeping, setSleeping] = useState(false)
  const [happy, setHappy] = useState(false)
  const [bubble, setBubble] = useState<{ text: string; key: number } | null>(null)

  const alert = Boolean(focusEl)

  // Calcula hacia dónde mirar y mueve pupilas y cabeza (sin re-render, directo al DOM).
  const aim = useCallback(() => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const svg = svgRef.current
      const head = headRef.current
      if (!svg || !head || sleepingRef.current) return
      const r = svg.getBoundingClientRect()
      const ex = r.left + r.width * 0.5
      const ey = r.top + r.height * 0.38
      const el = focusRef.current ?? glanceRef.current
      let tx = ex
      let ty = ey
      if (el) {
        const b = el.getBoundingClientRect()
        tx = b.left + b.width / 2
        ty = b.top + b.height / 2
      } else if (pointer.current) {
        tx = pointer.current.x
        ty = pointer.current.y
      }
      const dx = tx - ex
      const dy = ty - ey
      const dist = Math.hypot(dx, dy) || 1
      const k = Math.min(1, dist / (r.width * 2))
      const ox = (dx / dist) * 3.1 * k
      const oy = (dy / dist) * 2.6 * k
      svg.querySelectorAll<SVGGElement>('[data-pupil]').forEach((p) => p.setAttribute('transform', `translate(${ox.toFixed(2)} ${oy.toFixed(2)})`))
      head.style.transform = `translate(${(ox * 0.6).toFixed(2)}px, ${(oy * 0.4).toFixed(2)}px) rotate(${(ox * 1.2).toFixed(2)}deg)`
    })
  }, [])

  useEffect(() => {
    focusRef.current = focusEl
    noteRef.current = noteEl
    aim()
  }, [focusEl, noteEl, aim])

  // Mirada que sigue al puntero + siesta cuando no hay actividad.
  useEffect(() => {
    let idle = window.setTimeout(() => setSleeping(true), SLEEP_AFTER_MS)
    const wake = () => {
      window.clearTimeout(idle)
      idle = window.setTimeout(() => setSleeping(true), SLEEP_AFTER_MS)
      if (sleepingRef.current) setSleeping(false)
    }
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY }
      wake()
      aim()
    }
    const onScroll = () => aim()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    window.addEventListener('keydown', wake)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(idle)
      cancelAnimationFrame(frame.current)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      window.removeEventListener('keydown', wake)
      window.removeEventListener('scroll', onScroll)
    }
  }, [aim])

  useEffect(() => {
    sleepingRef.current = sleeping
    if (sleeping && headRef.current) headRef.current.style.transform = 'translate(0px, 3px) rotate(-5deg)'
    if (!sleeping) aim()
  }, [sleeping, aim])

  // Pequeños comportamientos al azar para que se sienta vivo.
  useEffect(() => {
    if (reduced) return
    const timers: number[] = []
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms))

    const doBlink = () => {
      setBlink(true)
      later(() => setBlink(false), 150)
      if (Math.random() < 0.3) {
        later(() => setBlink(true), 320)
        later(() => setBlink(false), 460)
      }
    }
    const behaviours = [
      { weight: 0.42, run: doBlink },
      {
        weight: 0.2,
        run: () => {
          setEar(true)
          later(() => setEar(false), 500)
        },
      },
      {
        weight: 0.2,
        run: () => {
          setFlick(true)
          later(() => setFlick(false), 750)
        },
      },
      {
        weight: 0.18,
        run: () => {
          if (!noteRef.current || focusRef.current) return doBlink()
          glanceRef.current = noteRef.current
          aim()
          later(() => {
            glanceRef.current = null
            aim()
          }, 1300)
        },
      },
    ]

    const schedule = () => {
      later(() => {
        if (!sleepingRef.current) {
          let r = Math.random()
          const pick = behaviours.find((b) => (r -= b.weight) < 0) ?? behaviours[0]
          pick.run()
        }
        schedule()
      }, 2400 + Math.random() * 4200)
    }
    schedule()
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [reduced, aim])

  const pet = () => {
    setSleeping(false)
    setHappy(true)
    const text = PHRASES[petCount.current % PHRASES.length]
    petCount.current += 1
    setBubble({ text, key: petCount.current })
    window.setTimeout(() => setHappy(false), 1500)
  }

  const tailAnimation = reduced
    ? 'none'
    : flick
      ? 'tail-flick 0.75s var(--ease-soft)'
      : `tail-idle ${alert ? 1.3 : sleeping ? 6 : 3.6}s ease-in-out infinite`

  const eyeStyle = (cx: number): CSSProperties => ({
    transformOrigin: `${cx}px 50px`,
    transform: blink ? 'scaleY(0.08)' : 'scaleY(1)',
    transition: 'transform 90ms ease-in-out',
  })

  const pupilStyle: CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: 'center',
    transform: alert ? 'scale(1.35, 1.12)' : 'scale(1)',
    transition: 'transform 300ms var(--ease-soft)',
  }

  const closedEyes = sleeping || happy

  return (
    <button
      type="button"
      onClick={pet}
      aria-label={sleeping ? 'El gato está durmiendo la siesta. Despertarlo con una caricia' : 'Acariciar al gato'}
      style={style}
      className={`group/cat absolute cursor-pointer rounded-[40%] pointer-events-auto ${className}`}
    >
      {bubble && (
        <span
          key={bubble.key}
          aria-live="polite"
          onAnimationEnd={() => setBubble(null)}
          className="pointer-events-none absolute bottom-[96%] left-1/2 z-10 rounded-full border border-line bg-card px-3 py-1 font-hand text-[clamp(0.95rem,3.4cqw,1.35rem)] whitespace-nowrap text-ink shadow-sm [animation:bubble_1.9s_var(--ease-soft)_forwards]"
        >
          {bubble.text}
        </span>
      )}

      <svg ref={svgRef} viewBox="0 0 120 132" className="h-full w-full overflow-visible" aria-hidden="true">
        {/* Cola, detrás del cuerpo */}
        <g style={{ transformOrigin: '86px 120px', animation: tailAnimation }}>
          <path
            d="M84 124 C 110 126, 122 104, 114 82 C 110 70, 100 68, 101 77 C 108 96, 104 112, 82 114 Z"
            fill="var(--color-fur)"
          />
          <path d="M111 79 C 109 72, 103 70, 102 76 C 104 80, 108 82, 111 79 Z" className="fill-[#f3ede4] dark:fill-[#d9d2c7]" />
        </g>

        {/* Cuerpo, con respiración muy suave */}
        <g style={{ transformOrigin: '60px 130px', animation: reduced ? 'none' : `breathe ${sleeping ? 5 : 3.8}s ease-in-out infinite` }}>
          <path d="M28 130 C 18 100, 30 70, 60 66 C 90 70, 102 100, 92 130 Z" fill="var(--color-fur)" />
          <path d="M47 130 C 45 108, 52 92, 60 90 C 68 92, 75 108, 73 130 Z" className="fill-[#f3ede4] dark:fill-[#d9d2c7]" />
          <ellipse cx="48" cy="128" rx="9" ry="5" className="fill-[#f3ede4] dark:fill-[#d9d2c7]" />
          <ellipse cx="72" cy="128" rx="9" ry="5" className="fill-[#f3ede4] dark:fill-[#d9d2c7]" />
          <path d="M45 127 v3 M48 126.5 v3.5 M51 127 v3 M69 127 v3 M72 126.5 v3.5 M75 127 v3" stroke="#00000022" strokeWidth="0.8" />

          {/* Cabeza: gira levemente hacia donde mira */}
          <g ref={headRef} style={{ transformOrigin: '60px 72px', transition: 'transform 420ms var(--ease-soft)' }}>
            <g style={{ transformOrigin: '42px 36px', animation: ear && !reduced ? 'ear-twitch 0.5s ease-in-out' : 'none' }}>
              <path d="M33 40 L35 11 L56 28 Z" fill="var(--color-fur)" />
              <path d="M37.5 34 L38.5 18 L50 28 Z" fill="#d88da0" opacity="0.85" />
            </g>
            <g style={{ transformOrigin: '78px 36px', transform: alert ? 'rotate(4deg)' : 'none', transition: 'transform 300ms' }}>
              <path d="M87 40 L85 11 L64 28 Z" fill="var(--color-fur)" />
              <path d="M82.5 34 L81.5 18 L70 28 Z" fill="#d88da0" opacity="0.85" />
            </g>
            <ellipse cx="60" cy="50" rx="31" ry="26.5" fill="var(--color-fur)" />
            <path d="M52 27 Q60 33 68 27" stroke="#00000030" strokeWidth="1.4" fill="none" strokeLinecap="round" />

            {closedEyes ? (
              <g stroke="#f3ede4" strokeWidth="2" strokeLinecap="round" fill="none">
                {happy ? (
                  <>
                    <path d="M41 53 Q47.5 45 54 53" />
                    <path d="M66 53 Q72.5 45 79 53" />
                  </>
                ) : (
                  <>
                    <path d="M41 50 Q47.5 55 54 50" />
                    <path d="M66 50 Q72.5 55 79 50" />
                  </>
                )}
              </g>
            ) : (
              <>
                <g style={eyeStyle(47.5)}>
                  <ellipse cx="47.5" cy="50" rx="7" ry="7.4" className="fill-[#a9d9cf] dark:fill-[#c8f2df]" />
                  <g data-pupil="">
                    <ellipse cx="47.5" cy="50" rx="2.5" ry="5.6" fill="#141414" style={pupilStyle} />
                    <circle cx="45.6" cy="47.4" r="1.4" fill="#ffffff" />
                  </g>
                </g>
                <g style={eyeStyle(72.5)}>
                  <ellipse cx="72.5" cy="50" rx="7" ry="7.4" className="fill-[#a9d9cf] dark:fill-[#c8f2df]" />
                  <g data-pupil="">
                    <ellipse cx="72.5" cy="50" rx="2.5" ry="5.6" fill="#141414" style={pupilStyle} />
                    <circle cx="70.6" cy="47.4" r="1.4" fill="#ffffff" />
                  </g>
                </g>
              </>
            )}

            <circle cx="40" cy="61" r="4.5" fill="#d88da0" opacity={happy ? 0.55 : 0.22} style={{ transition: 'opacity 300ms' }} />
            <circle cx="80" cy="61" r="4.5" fill="#d88da0" opacity={happy ? 0.55 : 0.22} style={{ transition: 'opacity 300ms' }} />
            <path d="M57 58.5 L63 58.5 L60 62 Z" fill="#e7a0b0" />
            <path d="M60 62 Q57.5 66 54.5 64 M60 62 Q62.5 66 65.5 64" stroke="#f3ede4" strokeOpacity="0.7" strokeWidth="1.1" fill="none" strokeLinecap="round" />
            <g stroke="#f3ede4" strokeOpacity="0.45" strokeWidth="0.8" strokeLinecap="round">
              <path d="M43 60 L22 56 M43 63 L22 65" />
              <path d="M77 60 L98 56 M77 63 L98 65" />
            </g>
          </g>
        </g>

        {sleeping && !reduced && (
          <g className="fill-ink-soft font-hand" fontSize="13">
            <text x="88" y="30" style={{ animation: 'zzz 3s ease-out infinite' }}>
              z
            </text>
            <text x="96" y="20" fontSize="10" style={{ animation: 'zzz 3s ease-out 1.4s infinite' }}>
              z
            </text>
          </g>
        )}
      </svg>
    </button>
  )
}
