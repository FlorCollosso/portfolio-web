import { useEffect, useRef } from 'react'

interface CatFaceProps {
  className?: string
  /** Si es true, las pupilas siguen al puntero */
  follow?: boolean
}

// Cabecita del gato, para la estampilla de la postal y el que se asoma en el footer.
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
        const dy = e.clientY - (r.top + r.height * 0.55)
        const d = Math.hypot(dx, dy) || 1
        const k = Math.min(1, d / 200)
        svg.querySelectorAll('[data-pupil]').forEach((p) =>
          p.setAttribute('transform', `translate(${((dx / d) * 2.6 * k).toFixed(2)} ${((dy / d) * 2.2 * k).toFixed(2)})`),
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
    <svg ref={svgRef} viewBox="0 0 64 52" className={`overflow-visible ${className}`} aria-hidden="true">
      <path d="M6 30 L8 2 L28 18 Z M58 30 L56 2 L36 18 Z" fill="var(--color-fur)" />
      <path d="M11 24 L12 10 L23 19 Z M53 24 L52 10 L41 19 Z" fill="#d88da0" opacity="0.85" />
      <ellipse cx="32" cy="32" rx="28" ry="21" fill="var(--color-fur)" />
      <path d="M26 12.5 Q27.5 18 29 20 M32 11.5 V19.5 M38 12.5 Q36.5 18 35 20" stroke="var(--color-fur-stripe)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse cx="32" cy="42" rx="8.5" ry="5.5" className="fill-[#fbf1e3] dark:fill-[#e2d3bf]" opacity="0.9" />
      {[21, 43].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy="31" rx="6" ry="6.4" className="fill-[#f5c84a] dark:fill-[#ffd95e]" />
          <g data-pupil="">
            <ellipse cx={cx} cy="31" rx="2.2" ry="4.8" fill="#141414" />
            <circle cx={cx - 1.6} cy="28.8" r="1.2" fill="#fff" />
          </g>
        </g>
      ))}
      <path d="M29.5 39 L34.5 39 L32 42 Z" fill="#e7a0b0" />
    </svg>
  )
}
