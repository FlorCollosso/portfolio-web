import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import {
  BODY,
  EAR_LEFT,
  EAR_LEFT_DOWN,
  EAR_RIGHT,
  EAR_RIGHT_DOWN,
  EYE_CLOSED_LEFT,
  EYE_CLOSED_RIGHT,
  EYE_SQUINT_LEFT,
  EYE_SQUINT_RIGHT,
  HEAD,
  LEG_LEFT,
  LEG_RIGHT,
  LOVE,
  MOUTH,
  MOUTH_HAPPY,
  PUPIL_HUNT_LEFT,
  PUPIL_HUNT_RIGHT,
  PUPIL_LEFT,
  PUPIL_RIGHT,
  PUPIL_SOFT_LEFT,
  PUPIL_SOFT_RIGHT,
  SOCKET_LEFT,
  SOCKET_RIGHT,
  SPARKLE,
  SURPRISE_LINES,
  TAIL,
  TAIL_CURLED,
  WHISKERS_LEFT,
  WHISKERS_RIGHT,
} from './cat/catParts'
import { useI18n } from '../../i18n/useI18n'
import type { MessageKey } from '../../locales/es'

interface CatProps {
  /** Lo que el gato mira con atención (el libro o cuadro bajo el mouse) */
  focusEl: HTMLElement | null
  /** La nota escondida: de vez en cuando la mira de reojo */
  noteEl: HTMLElement | null
  /** La bolita de lana: cuando está cerca, el gato entra en modo juego */
  playEl?: HTMLElement | null
  playing?: boolean
  /** Cambia cada vez que el gato tiene que darle un zarpazo a la lana */
  batKey?: number
  style?: CSSProperties
  className?: string
}

type Eyes = 'open' | 'soft' | 'slit' | 'squint' | 'happy' | 'sleepy'

// Frases del globito: claves de src/locales/ (cat.sayN cuando lo acarician, cat.playN cuando juega)
const PHRASES = ['cat.say1', 'cat.say2', 'cat.say3', 'cat.say4'] as const
const PLAY_PHRASES = ['cat.play1', 'cat.play2', 'cat.play3', 'cat.play4'] as const
const SLEEP_AFTER_MS = 22000
// Puntos de articulación, en las coordenadas de la ilustración ("Gato completo normal", viewBox 0 0 331 362)
const PIVOT = {
  base: '134.7px 351px', // donde se apoya en los libros (base del cuerpo)
  neck: '134.7px 172px',
  tail: '229px 332px',
  earLeft: '80px 72px',
  earRight: '190px 72px',
  legLeft: '111px 254px',
  whiskersLeft: '70px 140px',
  whiskersRight: '198px 140px',
}
// Centro de la mirada (entre los ojos), como fracción de la caja del gato
const EYE_X = 134.7 / 331
const EYE_Y = 101 / 362
const pickHappyEars = () => {
  const r = Math.random()
  return r < 0.4 ? 'left' : r < 0.8 ? 'right' : 'both'
}
const fade = (on: boolean, reduced: boolean): CSSProperties => ({ opacity: on ? 1 : 0, transition: reduced ? 'none' : 'opacity 180ms ease-out' })

// El gatito de la biblioteca, armado con las piezas originales de la ilustración
// (cola, cuerpo, patitas, cabeza, orejas y expresiones) para poder animar cada parte desde su articulación.
// Sigue el cursor con la mirada, parpadea, se deja acariciar, se duerme si nadie le presta atención
// y juega con la bolita de lana.
export function Cat({ focusEl, noteEl, playEl = null, playing = false, batKey = 0, style, className = '' }: CatProps) {
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const svgRef = useRef<SVGSVGElement>(null)
  const aimRef = useRef<SVGGElement>(null)
  const eyesRef = useRef<SVGGElement>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const focusRef = useRef<HTMLElement | null>(null)
  const glanceRef = useRef<HTMLElement | { x: number; y: number } | null>(null)
  const noteRef = useRef<HTMLElement | null>(null)
  const playRef = useRef<HTMLElement | null>(null)
  const yarnRef = useRef<HTMLElement | null>(null)
  const sleepingRef = useRef(false)
  const busyRef = useRef(false)
  const frame = useRef(0)
  const petCount = useRef(0)
  const stroke = useRef({ dist: 0, cooldownUntil: 0 })
  const timers = useRef<number[]>([])

  const [blink, setBlink] = useState(false)
  const [earTwitch, setEarTwitch] = useState<'left' | 'right' | null>(null)
  const [earDown, setEarDown] = useState<'left' | 'right' | null>(null)
  // Qué oreja baja cuando está contento: se elige en cada caricia
  const [happyEars, setHappyEars] = useState<'left' | 'right' | 'both'>('right')
  const [flick, setFlick] = useState(false)
  const [whisk, setWhisk] = useState(false)
  const [tilt, setTilt] = useState(0)
  const [resting, setResting] = useState(false)
  const [sleeping, setSleeping] = useState(false)
  const [happy, setHappy] = useState<null | 'pet' | 'stroke'>(null)
  const [near, setNear] = useState(false)
  const [spotted, setSpotted] = useState(false)
  const [batting, setBatting] = useState(false)
  const [cheer, setCheer] = useState(false)
  const [bubble, setBubble] = useState<{ text: MessageKey; key: number } | null>(null)
  const [deco, setDeco] = useState<{ kind: 'love' | 'sparkle' | 'lines'; key: number } | null>(null)

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const alert = near
  useEffect(() => {
    busyRef.current = playing || batting || Boolean(happy) || Boolean(focusEl)
  }, [playing, batting, happy, focusEl])

  // Calcula hacia dónde mirar: mueve los ojos dentro de la cara y gira apenas la cabeza (directo al DOM).
  const aim = useCallback(() => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const svg = svgRef.current
      const head = aimRef.current
      const eyes = eyesRef.current
      if (!svg || !head || !eyes) return
      if (sleepingRef.current) {
        eyes.querySelectorAll<SVGGElement>('[data-pupil]').forEach((p) => (p.style.transform = ''))
        // Dormido: la cabeza baja apenas, derecha, como en "gato orejas gachas completo"
        head.style.transform = 'translate(0px, 2px)'
        return
      }
      const r = svg.getBoundingClientRect()
      const ex = r.left + r.width * EYE_X
      const ey = r.top + r.height * EYE_Y
      const target = playRef.current ?? focusRef.current ?? glanceRef.current
      let tx = ex
      let ty = ey
      if (target instanceof HTMLElement) {
        const b = target.getBoundingClientRect()
        tx = b.left + b.width / 2
        ty = b.top + b.height / 2
      } else if (target) {
        tx = target.x
        ty = target.y
      } else if (pointer.current) {
        tx = pointer.current.x
        ty = pointer.current.y
      }
      const dx = tx - ex
      const dy = ty - ey
      const dist = Math.hypot(dx, dy) || 1
      const k = Math.min(1, dist / (r.width * (playRef.current ? 0.7 : 1.8)))
      const ox = (dx / dist) * k
      const oy = (dy / dist) * k
      // Las pupilas se mueven dentro de la cuenca amarilla; la cabeza acompaña apenas
      const pupil = `translate(${(ox * 5.5).toFixed(2)}px, ${(oy * 4.5).toFixed(2)}px)`
      eyes.querySelectorAll<SVGGElement>('[data-pupil]').forEach((p) => (p.style.transform = pupil))
      head.style.transform = `translate(${(ox * 4).toFixed(2)}px, ${(oy * 2.5).toFixed(2)}px) rotate(${(ox * 3).toFixed(2)}deg)`
    })
  }, [])

  useEffect(() => {
    focusRef.current = focusEl
    noteRef.current = noteEl
    yarnRef.current = playEl
    aim()
  }, [focusEl, noteEl, playEl, aim])

  // Mirada que sigue al puntero, atención cuando el cursor se acerca y siesta si no hay actividad.
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
      // Atención (ojos tiernos, orejas paradas): solo si el cursor se acerca al gato o a la lana
      const r = svgRef.current?.getBoundingClientRect()
      const y = yarnRef.current?.getBoundingClientRect()
      const nearCat = r ? Math.hypot(e.clientX - (r.left + r.width * EYE_X), e.clientY - (r.top + r.height * 0.42)) < r.width * 1.3 : false
      const nearYarn = y ? Math.hypot(e.clientX - (y.left + y.width / 2), e.clientY - (y.top + y.height / 2)) < Math.max(y.width * 3.2, 64) : false
      setNear(nearCat || nearYarn)
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

  // Modo juego: detecta la lana (sorpresa), y después la sigue cuadro a cuadro con mirada de cazador
  useEffect(() => {
    playRef.current = playing ? playEl : null
    if (!playing) {
      setSpotted(false)
      aim()
      return
    }
    setSleeping(false)
    setResting(false)
    setSpotted(true)
    setDeco({ kind: 'lines', key: Date.now() })
    const t = window.setTimeout(() => setSpotted(false), 520)
    let raf = 0
    const loop = () => {
      aim()
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      window.clearTimeout(t)
      cancelAnimationFrame(raf)
    }
  }, [playing, playEl, aim])

  // Zarpazo: levanta la patita, entrecierra los ojos y festeja
  useEffect(() => {
    if (!batKey) return
    setBatting(true)
    setDeco({ kind: 'sparkle', key: -batKey })
    setBubble({ text: PLAY_PHRASES[(batKey - 1) % PLAY_PHRASES.length], key: -batKey })
    const t1 = window.setTimeout(() => {
      setBatting(false)
      setCheer(true)
    }, 600)
    const t2 = window.setTimeout(() => setCheer(false), 1500)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [batKey])

  useEffect(() => {
    sleepingRef.current = sleeping
    aim()
  }, [sleeping, aim])

  // Bigotes: mientras lo acarician o juega con la lana, cada tantos segundos hace una doble sacudidita
  const excited = Boolean(happy) || playing || cheer
  useEffect(() => {
    if (!excited || reduced) return
    const own: number[] = []
    const twitch = () => {
      setWhisk(true)
      own.push(window.setTimeout(() => setWhisk(false), 560))
      own.push(window.setTimeout(twitch, 2600 + Math.random() * 1400))
    }
    own.push(window.setTimeout(twitch, 250))
    return () => {
      own.forEach((t) => window.clearTimeout(t))
      setWhisk(false)
    }
  }, [excited, reduced])

  // Acciones espontáneas, de vez en cuando y solo si nadie está jugando con él.
  useEffect(() => {
    if (reduced) return
    const own: number[] = []
    const after = (fn: () => void, ms: number) => own.push(window.setTimeout(fn, ms))

    const doBlink = () => {
      setBlink(true)
      after(() => setBlink(false), 140)
      if (Math.random() < 0.3) {
        after(() => setBlink(true), 300)
        after(() => setBlink(false), 440)
      }
    }
    const behaviours = [
      { weight: 0.32, run: doBlink },
      {
        // Baja una sola oreja un ratito, la otra queda parada
        weight: 0.1,
        run: () => {
          setEarDown(Math.random() < 0.5 ? 'left' : 'right')
          after(() => setEarDown(null), 2000 + Math.random() * 900)
        },
      },
      {
        weight: 0.14,
        run: () => {
          setEarTwitch(Math.random() < 0.5 ? 'left' : 'right')
          after(() => setEarTwitch(null), 520)
        },
      },
      {
        weight: 0.12,
        run: () => {
          setTilt(Math.random() < 0.5 ? -6 : 6)
          after(() => setTilt(0), 1600)
        },
      },
      {
        weight: 0.12,
        run: () => {
          // Mira para otro lado: a veces de reojo a la nota escondida, a veces a cualquier parte
          const r = svgRef.current?.getBoundingClientRect()
          if (noteRef.current && Math.random() < 0.5) glanceRef.current = noteRef.current
          else if (r) glanceRef.current = { x: r.left + (Math.random() < 0.5 ? -1 : 2) * r.width, y: r.top + Math.random() * r.height }
          aim()
          after(() => {
            glanceRef.current = null
            aim()
          }, 1400)
        },
      },
      {
        weight: 0.1,
        run: () => {
          setFlick(true)
          after(() => setFlick(false), 900)
        },
      },
      {
        weight: 0.1,
        run: () => {
          setResting(true)
          after(() => setResting(false), 2600 + Math.random() * 1200)
        },
      },
    ]

    const schedule = () => {
      after(() => {
        if (!sleepingRef.current && !busyRef.current) {
          let r = Math.random()
          const pick = behaviours.find((b) => (r -= b.weight) < 0) ?? behaviours[0]
          pick.run()
        }
        schedule()
      }, 2600 + Math.random() * 4400)
    }
    schedule()
    return () => own.forEach((t) => window.clearTimeout(t))
  }, [reduced, aim])

  // Tocarlo (click, tap o teclado): se pone contento y dice algo
  const pet = () => {
    setSleeping(false)
    setResting(false)
    setHappy('pet')
    setHappyEars(pickHappyEars())
    const text = PHRASES[petCount.current % PHRASES.length]
    petCount.current += 1
    setBubble({ text, key: petCount.current })
    if (petCount.current % 2 === 0) setDeco({ kind: 'love', key: Date.now() })
    later(() => setHappy((h) => (h === 'pet' ? null : h)), 1500)
  }

  // Caricia con el mouse sobre la cabeza: hace falta un recorrido suave, y después descansa un rato
  const onStroke = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== 'mouse' || playing) return
    const r = e.currentTarget.getBoundingClientRect()
    if (e.clientY > r.top + r.height * 0.62) return
    const s = stroke.current
    s.dist += Math.hypot(e.movementX, e.movementY)
    const now = performance.now()
    if (s.dist < 140 || now < s.cooldownUntil || happy) return
    s.dist = 0
    s.cooldownUntil = now + 3400
    setSleeping(false)
    setResting(false)
    setHappy('stroke')
    setHappyEars(pickHappyEars())
    if (Math.random() < 0.5) setDeco({ kind: 'love', key: Date.now() })
    later(() => setHappy((h) => (h === 'stroke' ? null : h)), 1900)
  }

  // Expresión según el momento
  const eyes: Eyes = sleeping
    ? 'sleepy'
    : batting
      ? 'squint'
      : happy
        ? 'happy'
        : playing
          ? spotted
            ? 'soft'
            : 'slit'
          : cheer || alert
            ? 'soft'
            : resting
              ? 'sleepy'
              : 'open'
  const mouthOpen = batting || cheer || happy === 'pet' || (playing && spotted)
  const eyesOpen = eyes === 'open' || eyes === 'soft' || eyes === 'slit'
  const blinkStyle: CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: 'center',
    transform: blink ? 'scaleY(0.1)' : 'none',
    transition: reduced ? 'none' : 'transform 80ms ease-in-out',
  }

  const tailAnimation = reduced
    ? 'none'
    : playing
      ? 'tail-play 0.7s ease-in-out infinite'
      : happy || cheer
        ? 'tail-play 1.1s ease-in-out infinite'
        : flick
          ? 'tail-flick 0.9s var(--ease-soft)'
          : `tail-idle ${alert ? 1.6 : sleeping || resting ? 6.5 : 4}s ease-in-out infinite`

  // Inclinación de la cabeza (curiosidad, acciones espontáneas, caricia)
  const headTilt = sleeping ? 0 : happy === 'stroke' ? 0 : alert && !playing ? (tilt || 4) : tilt
  const earPerk = (alert || playing) && !happy
  // Orejas bajas: una sola de vez en cuando en reposo; al acariciarlo, la derecha, la izquierda o ambas.
  // Dormido conserva las orejas paradas.
  const rightEarDown = !sleeping && (happy ? happyEars !== 'left' : earDown === 'right' && !alert)
  const leftEarDown = !sleeping && (happy ? happyEars !== 'right' : earDown === 'left' && !alert)

  return (
    <button
      type="button"
      onClick={pet}
      onPointerMove={onStroke}
      aria-label={sleeping ? t('cat.sleeping') : t('cat.pet')}
      style={style}
      className={`group/cat absolute cursor-pointer rounded-[40%] pointer-events-auto ${className}`}
    >
      {bubble && (
        <span
          key={bubble.key}
          aria-live="polite"
          onAnimationEnd={() => setBubble(null)}
          className="pointer-events-none absolute bottom-[96%] left-[37%] z-10 rounded-full border border-line bg-card px-3 py-1 font-hand text-[clamp(0.95rem,3.4cqw,1.35rem)] whitespace-nowrap text-ink shadow-sm [animation:bubble_1.9s_var(--ease-soft)_forwards]"
        >
          {t(bubble.text)}
        </span>
      )}

      <svg ref={svgRef} viewBox="0 0 331 362" className="h-full w-full overflow-visible dark:brightness-[0.94]" aria-hidden="true">
        {/* Todo el gato: se inclina hacia la lana desde donde se apoya, sin despegarse de los libros */}
        <g
          style={{
            transformOrigin: PIVOT.base,
            transform: playing && !spotted ? 'rotate(-3deg)' : 'none',
            transition: reduced ? 'none' : 'transform 450ms var(--ease-swing)',
          }}
        >
          <g style={{ transformOrigin: PIVOT.base, animation: reduced ? 'none' : `breathe ${sleeping ? 5.2 : 3.8}s ease-in-out infinite` }}>
            {/* Cola: gira desde donde se une al cuerpo (queda detrás) */}
            <g style={fade(!sleeping, reduced)}>
              <g style={{ transformOrigin: PIVOT.tail, animation: tailAnimation }}>{TAIL}</g>
            </g>

            {BODY}
            {/* Patita izquierda: es la que sale a darle el zarpazo a la lana */}
            <g style={{ transformOrigin: PIVOT.legLeft, animation: batting && !reduced ? 'cat-bat 0.6s var(--ease-soft)' : 'none' }}>{LEG_LEFT}</g>
            {LEG_RIGHT}
            {/* Dormido: la cola se enrosca por delante de las patitas */}
            <g style={fade(sleeping, reduced)}>{TAIL_CURLED}</g>

            {/* Cabeza: articula desde el cuello */}
            <g ref={aimRef} style={{ transformOrigin: PIVOT.neck, transition: reduced ? 'none' : 'transform 420ms var(--ease-soft)' }}>
              <g
                style={{
                  transformOrigin: PIVOT.neck,
                  transform: `rotate(${headTilt}deg)`,
                  transition: reduced ? 'none' : 'transform 600ms var(--ease-swing)',
                  animation: happy === 'stroke' && !reduced ? 'cat-nuzzle 1.8s ease-in-out' : 'none',
                }}
              >
                {/* Orejas: paradas (se mueven desde su base) o gachas (dormido, contento o de vez en cuando) */}
                <g
                  style={{
                    transformOrigin: PIVOT.earLeft,
                    transform: earPerk ? 'rotate(-4deg)' : 'none',
                    transition: 'transform 300ms var(--ease-soft)',
                    animation: earTwitch === 'left' && !reduced ? 'ear-twitch 0.5s ease-in-out' : 'none',
                  }}
                >
                  <g style={fade(!leftEarDown, reduced)}>{EAR_LEFT}</g>
                  <g style={fade(leftEarDown, reduced)}>{EAR_LEFT_DOWN}</g>
                </g>
                <g
                  style={{
                    transformOrigin: PIVOT.earRight,
                    transform: earPerk ? 'rotate(4deg)' : 'none',
                    transition: 'transform 300ms var(--ease-soft)',
                    animation: earTwitch === 'right' && !reduced ? 'ear-twitch-r 0.5s ease-in-out' : 'none',
                  }}
                >
                  <g style={fade(!rightEarDown, reduced)}>{EAR_RIGHT}</g>
                  <g style={fade(rightEarDown, reduced)}>{EAR_RIGHT_DOWN}</g>
                </g>

                {HEAD}

                {/* Ojos abiertos: cuenca amarilla + pupila (normal, tierna o de cazador), que sigue lo que mira */}
                <g ref={eyesRef} style={fade(eyesOpen, reduced)}>
                  {[
                    { socket: SOCKET_LEFT, pupils: [PUPIL_LEFT, PUPIL_SOFT_LEFT, PUPIL_HUNT_LEFT] },
                    { socket: SOCKET_RIGHT, pupils: [PUPIL_RIGHT, PUPIL_SOFT_RIGHT, PUPIL_HUNT_RIGHT] },
                  ].map(({ socket, pupils }, i) => (
                    <g key={i} style={blinkStyle}>
                      {socket}
                      <g data-pupil="" style={{ transition: reduced ? 'none' : 'transform 260ms var(--ease-soft)' }}>
                        <g style={fade(eyes === 'open', reduced)}>{pupils[0]}</g>
                        <g style={fade(eyes === 'soft', reduced)}>{pupils[1]}</g>
                        <g style={fade(eyes === 'slit', reduced)}>{pupils[2]}</g>
                      </g>
                    </g>
                  ))}
                </g>
                {/* Ojos cerrados: contento o durmiendo; cerrados fuerte (> <) en el zarpazo */}
                <g style={fade(eyes === 'happy' || eyes === 'sleepy', reduced)}>
                  {EYE_CLOSED_LEFT}
                  {EYE_CLOSED_RIGHT}
                </g>
                <g style={fade(eyes === 'squint', reduced)}>
                  {EYE_SQUINT_LEFT}
                  {EYE_SQUINT_RIGHT}
                </g>

                {/* Dormido no tiene boca: la cara queda más tranquila */}
                <g style={fade(!mouthOpen && !sleeping, reduced)}>{MOUTH}</g>
                <g style={fade(mouthOpen && !sleeping, reduced)}>{MOUTH_HAPPY}</g>
                <g style={{ transformOrigin: PIVOT.whiskersLeft, animation: whisk ? 'whisker-twitch 0.55s ease-in-out' : 'none' }}>{WHISKERS_LEFT}</g>
                <g style={{ transformOrigin: PIVOT.whiskersRight, animation: whisk ? 'whisker-twitch-r 0.55s ease-in-out' : 'none' }}>{WHISKERS_RIGHT}</g>
              </g>
            </g>
          </g>
        </g>

        {/* Pequeñas reacciones: corazón al acariciarlo, destellos al atrapar la lana, rayitas de sorpresa */}
        {deco && !reduced && (
          <g key={deco.key} className="cat-pop" onAnimationEnd={() => setDeco(null)}>
            {deco.kind === 'love' && <g transform="translate(224 -17) scale(1.1)">{LOVE}</g>}
            {deco.kind === 'sparkle' && <g transform="translate(-40 200) scale(0.7)">{SPARKLE}</g>}
            {deco.kind === 'lines' && <g transform="translate(92 -46) scale(0.9)">{SURPRISE_LINES}</g>}
          </g>
        )}

        {sleeping && !reduced && (
          <g className="fill-ink-soft font-hand" fontSize="46">
            <text x="236" y="60" style={{ animation: 'cat-zzz 3s ease-out infinite' }}>
              z
            </text>
            <text x="266" y="26" fontSize="34" style={{ animation: 'cat-zzz 3s ease-out 1.4s infinite' }}>
              z
            </text>
          </g>
        )}
      </svg>
    </button>
  )
}
