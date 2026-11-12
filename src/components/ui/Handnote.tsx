import type { ReactNode } from 'react'

type Arrow = 'left' | 'right' | 'down' | 'up' | 'none'

interface HandnoteProps {
  children: ReactNode
  arrow?: Arrow
  className?: string
  tilt?: number
}

const arrowRotation: Record<Exclude<Arrow, 'none'>, number> = { right: 0, down: 80, left: 180, up: -80 }

// Anotación manuscrita al margen, como las que se hacen sobre un boceto.
export function Handnote({ children, arrow = 'none', className = '', tilt = -3 }: HandnoteProps) {
  const arrowEl = arrow !== 'none' && (
    <svg aria-hidden="true" viewBox="0 0 48 24" className="h-6 w-12 shrink-0 overflow-visible" style={{ rotate: `${arrowRotation[arrow]}deg` }}>
      <path d="M2 16 C 14 22, 30 20, 44 8" fill="none" className="stroke-current" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M35 6 L45 7 L42 16" fill="none" className="stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <p className={`inline-flex items-center gap-1 font-hand text-xl leading-tight text-rose-deep ${className}`} style={{ rotate: `${tilt}deg` }}>
      {arrow === 'left' || arrow === 'up' ? arrowEl : null}
      <span>{children}</span>
      {arrow === 'right' || arrow === 'down' ? arrowEl : null}
    </p>
  )
}
