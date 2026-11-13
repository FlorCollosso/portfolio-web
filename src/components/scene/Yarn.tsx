import { forwardRef, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type RefObject } from 'react'
import { box, catPlayZone, SCENE, yarnHome } from '../../data/scene'

interface YarnProps {
  /** La escena, para pasar píxeles a unidades de la escena */
  sceneRef: RefObject<HTMLDivElement | null>
  reduced: boolean
  /** Avisa cuando la lana entra o sale de la zona del gato */
  onNear: (near: boolean) => void
  /** El gato le da un zarpazo */
  onBat: () => void
}

type Mode = 'rest' | 'drag' | 'fly' | 'return'

const S = yarnHome.size
// Adonde llega la lana cuando se la "lanza" al gato con un toque o con el teclado
const TOSS = { dx: catPlayZone.x - 82 - yarnHome.x, dy: 300 - yarnHome.y }

const isNear = (dx: number, dy: number) =>
  Math.hypot(yarnHome.x + dx + S / 2 - catPlayZone.x, yarnHome.y + dy + S / 2 - catPlayZone.y) < catPlayZone.radius

// Bolita de lana: se puede agarrar y llevar hasta el gato para que juegue.
export const Yarn = forwardRef<HTMLButtonElement, YarnProps>(function Yarn({ sceneRef, reduced, onNear, onBat }, ref) {
  const [pos, setPos] = useState({ dx: 0, dy: 0, rot: 0 })
  const [mode, setMode] = useState<Mode>('rest')
  const drag = useRef<{ id: number; sx: number; sy: number; dx: number; dy: number; rot: number; scale: number; moved: boolean } | null>(null)
  const near = useRef(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))

  const setNear = (value: boolean) => {
    if (near.current === value) return
    near.current = value
    onNear(value)
  }

  // Vuelve rodando a su lugar en la repisa
  const goHome = (rot: number) => {
    setMode('return')
    setPos({ dx: 0, dy: 0, rot: rot - 360 })
    later(() => {
      setMode('rest')
      setPos({ dx: 0, dy: 0, rot: 0 })
    }, 950)
  }

  // Cerca del gato: zarpazo, la lana salta un poquito y después vuelve a la repisa
  const play = (dx: number, dy: number, rot: number) => {
    setNear(true)
    later(onBat, reduced ? 0 : 260)
    later(() => {
      setMode('fly')
      setPos({ dx: dx - 26, dy: dy - 34, rot: rot - 140 })
    }, reduced ? 0 : 380)
    later(() => {
      setNear(false)
      goHome(rot - 140)
    }, reduced ? 200 : 900)
  }

  const toss = () => {
    if (mode !== 'rest') return
    setMode('fly')
    setPos({ dx: TOSS.dx, dy: TOSS.dy, rot: 300 })
    later(() => play(TOSS.dx, TOSS.dy, 300), reduced ? 0 : 650)
  }

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (mode !== 'rest' || !sceneRef.current || (e.pointerType === 'mouse' && e.button !== 0)) return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // sin captura igual funciona mientras el puntero siga sobre la lana
    }
    drag.current = {
      id: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      dx: pos.dx,
      dy: pos.dy,
      rot: pos.rot,
      scale: sceneRef.current.getBoundingClientRect().width / SCENE.width,
      moved: false,
    }
  }

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const mx = e.clientX - d.sx
    const my = e.clientY - d.sy
    if (!d.moved && Math.hypot(mx, my) < 5) return
    if (!d.moved) {
      d.moved = true
      setMode('drag')
    }
    // Se mantiene dentro de la escena
    const dx = Math.max(-yarnHome.x, Math.min(SCENE.width - S - yarnHome.x, d.dx + mx / d.scale))
    const dy = Math.max(-yarnHome.y, Math.min(SCENE.height - S - yarnHome.y, d.dy + my / d.scale))
    // Rueda según cuánto se mueve en horizontal
    const rot = d.rot + ((dx - d.dx) / (S / 2)) * (180 / Math.PI)
    setPos({ dx, dy, rot })
    setNear(isNear(dx, dy))
  }

  const onPointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    if (!d.moved) return toss()
    if (isNear(pos.dx, pos.dy)) play(pos.dx, pos.dy, pos.rot)
    else {
      setNear(false)
      goHome(pos.rot)
    }
  }

  const onPointerCancel = () => {
    if (!drag.current) return
    drag.current = null
    setNear(false)
    goHome(pos.rot)
  }

  // Solo el teclado llega por click (los toques ya se resuelven en pointerup)
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.detail === 0) toss()
  }
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Escape' && drag.current) onPointerCancel()
  }

  const transition = {
    rest: 'none',
    drag: 'none',
    fly: 'transform 0.6s cubic-bezier(0.3, 0.7, 0.4, 1)',
    return: 'transform 0.9s var(--ease-swing)',
  }[mode]

  return (
    <button
      ref={ref}
      type="button"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onLostPointerCapture={onPointerCancel}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-label="Bolita de lana: llevala hasta el gato para que juegue"
      style={{
        ...box(yarnHome.x, yarnHome.y, S, S),
        transform: `translate(${(pos.dx / S) * 100}%, ${(pos.dy / S) * 100}%)`,
        transition,
      }}
      className={`group/yarn absolute pointer-events-auto touch-none select-none [animation:scene-in_0.9s_var(--ease-soft)_0.75s_backwards] before:absolute before:-inset-[45%] before:content-[''] ${
        mode === 'drag' ? 'z-40 cursor-grabbing' : mode === 'rest' ? 'z-10 cursor-grab' : 'z-40'
      }`}
    >
      {/* Hilo suelto apoyado en la repisa (solo cuando descansa) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible transition-opacity duration-300 ${mode === 'rest' ? 'opacity-100' : 'opacity-0'}`}
      >
        <path d="M30 34 C 40 40, 46 37, 52 39.5 C 58 41.5, 60 39, 63 40" fill="none" stroke="#c97a8e" strokeWidth="1.4" strokeLinecap="round" />
      </svg>

      <span
        className={`block h-full w-full transition-transform duration-500 ease-[var(--ease-swing)] ${mode === 'drag' ? 'scale-[1.12] drop-shadow-[0_0.8cqw_0.8cqw_rgb(0_0_0/0.3)]' : 'group-hover/yarn:-translate-y-[10%]'}`}
      >
        <svg aria-hidden="true" viewBox="0 0 40 40" className="h-full w-full overflow-visible" style={{ transform: `rotate(${pos.rot}deg)`, transition }}>
          <circle cx="20" cy="20" r="17" fill="#d88da0" className="dark:fill-[#b9768a]" />
          <g fill="none" stroke="#b05f78" strokeWidth="1.3" strokeLinecap="round" opacity="0.75">
            <path d="M6 14 C 14 20, 26 22, 35 13" />
            <path d="M4.5 21 C 14 28, 28 29, 36.5 20" />
            <path d="M8 30 C 16 33, 26 34, 32 30" />
            <path d="M13 5 C 9 14, 10 27, 16 36" />
            <path d="M22 3.5 C 18 14, 19 26, 26 36" />
          </g>
          <path d="M11 9 C 14 6.5, 18 5.5, 22 5.8" fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>

      {/* Pista manuscrita al pasar el mouse */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-[calc(100%+0.35rem)] left-1/2 -translate-x-1/2 translate-y-1 font-hand text-[clamp(0.95rem,3cqw,1.25rem)] leading-none whitespace-nowrap text-rose-deep opacity-0 transition-all duration-300 ${
          mode === 'rest' ? 'group-focus-visible/yarn:translate-y-0 group-focus-visible/yarn:opacity-100 [@media(hover:hover)]:group-hover/yarn:translate-y-0 [@media(hover:hover)]:group-hover/yarn:opacity-100' : ''
        }`}
      >
        ¿se la llevás al gato?
      </span>
    </button>
  )
})
