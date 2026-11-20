import { useEffect, useRef } from 'react'
import { EAR_LEFT, EAR_RIGHT, HEAD, MOUTH, PUPIL_LEFT, PUPIL_RIGHT, SOCKET_LEFT, SOCKET_RIGHT, WHISKERS_LEFT, WHISKERS_RIGHT } from './cat/catParts'

interface CatFaceProps {
  className?: string
  /** Si es true, las pupilas siguen al puntero */
  follow?: boolean
}

// Cabecita del gato (las mismas piezas que el gato de la biblioteca),
// para la estampilla de la postal y el que se asoma en el footer.
export function CatFace({ className = '', follow = false }: CatFaceProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!follow) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const svg = svgRef.current
        if (!svg) return
        const r = svg.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height * 0.56)
        const d = Math.hypot(dx, dy) || 1
        const k = Math.min(1, d / 200)
        svg.querySelectorAll('[data-pupil]').forEach((p) =>
          p.setAttribute('transform', `translate(${((dx / d) * 5.5 * k).toFixed(2)} ${((dy / d) * 4.5 * k).toFixed(2)})`),
        )
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [follow])

  return (
    <svg ref={svgRef} viewBox="28 -2 214 184" className={`overflow-visible ${className}`} aria-hidden="true">
      {EAR_LEFT}
      {EAR_RIGHT}
      {HEAD}
      {SOCKET_LEFT}
      <g data-pupil="">{PUPIL_LEFT}</g>
      {SOCKET_RIGHT}
      <g data-pupil="">{PUPIL_RIGHT}</g>
      {MOUTH}
      {WHISKERS_LEFT}
      {WHISKERS_RIGHT}
    </svg>
  )
}
