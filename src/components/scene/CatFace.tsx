import { useEffect, useRef } from 'react'
import { EAR_LEFT, EAR_RIGHT, HEAD, MOUTH_CLOSED } from './cat/catParts'

interface CatFaceProps {
  className?: string
  /** Si es true, los ojos siguen al puntero */
  follow?: boolean
}

// Cabecita del gato (las mismas piezas que el gato de la biblioteca),
// para la estampilla de la postal y el que se asoma en el footer.
export function CatFace({ className = '', follow = false }: CatFaceProps) {
  const eyesRef = useRef<SVGGElement>(null)

  useEffect(() => {
    if (!follow) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const eyes = eyesRef.current
        const svg = eyes?.ownerSVGElement
        if (!eyes || !svg) return
        const r = svg.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height * 0.62)
        const d = Math.hypot(dx, dy) || 1
        const k = Math.min(1, d / 200)
        eyes.setAttribute('transform', `translate(${((dx / d) * 11 * k).toFixed(2)} ${((dy / d) * 8 * k).toFixed(2)})`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [follow])

  return (
    <svg viewBox="0 0 332 270" className={`overflow-visible ${className}`} aria-hidden="true">
      {EAR_LEFT}
      {EAR_RIGHT}
      {HEAD}
      <g ref={eyesRef}>
        <ellipse fill="#aa6433" cx="113.09" cy="171.45" rx="14.12" ry="16.94" />
        <ellipse fill="#aa6433" cx="218.03" cy="171.45" rx="14.12" ry="16.94" />
      </g>
      {MOUTH_CLOSED}
    </svg>
  )
}
