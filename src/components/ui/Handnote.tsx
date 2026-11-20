
import type { ReactNode } from 'react'

type Arrow = 'left' | 'right' | 'down' | 'up' | 'none'
type Trail = 'curl-down' | 'hook-up'

interface HandnoteProps {
  children: ReactNode
  arrow?: Arrow | Trail
  className?: string
  tilt?: number

  // Nuevas propiedades opcionales
  lineRotate?: number
  headRotate?: number
  rotate?: number
}

type TrailConfig = {
  viewBox: string
  w: number
  h: number
  line: string
  head: string
  place: string

  // Rotación general original
  rotate: number

  // Rotaciones independientes
  lineRotate: number
  headRotate: number

  // Punto donde se une la punta con la curva
  headPivot: [number, number]

  // Punto de rotación de la curva
  linePivot: [number, number]
}

const arrowRotation: Record<Arrow, number> = {
  right: 0,
  down: 80,
  left: 180,
  up: -80,
  none: 0,
}

// Configuración de las flechas manuscritas
const TRAILS: Record<Trail, TrailConfig> = {
  'curl-down': {
    viewBox: '0 0 44 58',
    w: 44,
    h: 58,

    line:
      'M2 9.5 C 11 4, 25.5 3.5, 32.5 13 C 39.5 23, 36.5 37.5, 25.5 50.5',

    head:
      'M17.6 46.4 L25.4 50.9 L27.6 42.4',

    place: 'top-[0.18em]',

    // Ángulo original de toda la flecha
    rotate: 30,

    // Ajustes individuales
    lineRotate: 0,
    headRotate: 55,

    // Punto de unión de la punta
    headPivot: [25.4, 50.9],

    // Inicio de la curva
    linePivot: [2, 9.5],
  },

  'hook-up': {
    viewBox: '0 0 42 58',
    w: 42,
    h: 58,

    line:
      'M2 48.5 C 13.5 51.5, 29 45.5, 31.5 32.5 C 33.5 21, 26 10.5, 13 6.5',

    head:
      'M19.6 1.6 L12.6 6.6 L18.2 12.4',

    place: 'bottom-[0.32em]',

    rotate: 0,

    lineRotate: 0,
    headRotate: 20,

    headPivot: [12.6, 6.6],
    linePivot: [2, 48.5],
  },
}

const isTrail = (
  arrow: HandnoteProps['arrow']
): arrow is Trail =>
  arrow === 'curl-down' || arrow === 'hook-up'

// Componente principal
export function Handnote({
  children,
  arrow = 'none',
  className = '',
  tilt = -3,
  lineRotate,
  headRotate,
  rotate,
}: HandnoteProps) {

  // Flechas curvas
  if (isTrail(arrow)) {
    return (
      <TrailNote
        trail={arrow}
        className={className}
        tilt={tilt}
        lineRotate={lineRotate}
        headRotate={headRotate}
        rotate={rotate}
      >
        {children}
      </TrailNote>
    )
  }

  // Flechas simples
  const arrowEl = arrow !== 'none' && (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 24"
      className="h-6 w-12 shrink-0 overflow-visible"
      style={{
        transform: `rotate(${rotate ?? arrowRotation[arrow]}deg)`,
      }}
    >
      <path
        d="M2 16 C 14 22, 30 20, 44 8"
        fill="none"
        className="stroke-current"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d="M35 6 L45 7 L42 16"
        fill="none"
        className="stroke-current"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  return (
    <p
      className={`inline-flex items-center gap-1 font-hand text-xl leading-tight text-rose-deep ${className}`}
      style={{
        transform: `rotate(${tilt}deg)`,
      }}
    >
      {arrow === 'left' || arrow === 'up'
        ? arrowEl
        : null}

      <span>{children}</span>

      {arrow === 'right' || arrow === 'down'
        ? arrowEl
        : null}
    </p>
  )
}

interface TrailNoteProps {
  trail: Trail
  children: ReactNode
  className: string
  tilt: number
  lineRotate?: number
  headRotate?: number
  rotate?: number
}

// Anotación con flecha que nace de la última palabra
function TrailNote({
  trail,
  children,
  className,
  tilt,
  lineRotate,
  headRotate,
  rotate,
}: TrailNoteProps) {

  const t = TRAILS[trail]

  // Usar valores personalizados o los predeterminados
  const currentLineRotate = lineRotate ?? t.lineRotate
  const currentHeadRotate = headRotate ?? t.headRotate
  const currentRotate = rotate ?? t.rotate

  const text =
    typeof children === 'string'
      ? children
      : null

  const cut = text
    ? text.lastIndexOf(' ') + 1
    : 0

  const svg = (
    <svg
      aria-hidden="true"
      viewBox={t.viewBox}
      width={t.w}
      height={t.h}
      className={`
        pointer-events-none
        absolute
        left-full
        ml-1
        overflow-visible
        ${t.place}
      `}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: `rotate(${currentRotate}deg)`,
      }}
    >
      {/* CURVA DE LA FLECHA */}
      <path
        d={t.line}
        className="stroke-current"
        strokeWidth="1.5"
        transform={`
          rotate(
            ${currentLineRotate}
            ${t.linePivot[0]}
            ${t.linePivot[1]}
          )
        `}
      />

      {/* PUNTA DE LA FLECHA */}
      <path
        d={t.head}
        className="stroke-current"
        strokeWidth="1.5"
        transform={`
          rotate(
            ${currentHeadRotate}
            ${t.headPivot[0]}
            ${t.headPivot[1]}
          )
        `}
      />
    </svg>
  )

  return (
    <p
      className={`
        font-hand
        leading-tight
        text-balance
        text-rose-deep
        ${className}
      `}
      style={{
        transform: `rotate(${tilt}deg)`,
        paddingRight: `${t.w + 6}px`,
      }}
    >
      {text ? (
        <>
          {text.slice(0, cut)}

          <span className="relative whitespace-nowrap">
            {text.slice(cut)}
            {svg}
          </span>
        </>
      ) : (
        <span className="relative">
          {children}
          {svg}
        </span>
      )}
    </p>
  )
}
