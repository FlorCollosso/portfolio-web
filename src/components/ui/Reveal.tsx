import type { ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

// Aparición al hacer scroll: sube, se enfoca y gana opacidad. Con "reducir movimiento", se ve sin animar.
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`motion-safe:transition-[opacity,translate,filter] motion-safe:duration-[900ms] motion-safe:ease-[var(--ease-soft)] ${
        inView ? 'opacity-100' : 'motion-safe:translate-y-8 motion-safe:opacity-0 motion-safe:blur-[3px]'
      } ${className}`}
    >
      {children}
    </div>
  )
}
