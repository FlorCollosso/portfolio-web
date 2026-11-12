import type { ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

// Aparición suave al hacer scroll. Con "reducir movimiento" activado, el contenido se ve sin animar.
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`motion-safe:transition motion-safe:duration-700 motion-safe:ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'motion-safe:translate-y-6 motion-safe:opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}
