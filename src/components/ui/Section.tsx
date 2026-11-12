import type { ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'
import { Reveal } from './Reveal'

interface SectionProps {
  id: string
  /** Número de capítulo, p. ej. "01" */
  number: string
  eyebrow: string
  /** Puede incluir <em> para la palabra en cursiva */
  title: ReactNode
  intro?: string
  /** Nota manuscrita al margen del título */
  aside?: ReactNode
  children: ReactNode
  className?: string
}

// Encabezado de capítulo: número en serif, título que sube como una línea de libro.
export function Section({ id, number, eyebrow, title, intro, aside, children, className = '' }: SectionProps) {
  const headingId = `${id}-title`
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section id={id} aria-labelledby={headingId} className={`relative px-4 py-24 sm:px-6 md:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div ref={ref} className="grid gap-6 md:grid-cols-[7rem_1fr] md:gap-10">
          <p
            className={`flex items-baseline gap-3 font-serif text-sm text-muted transition-all duration-700 ease-[var(--ease-soft)] md:flex-col md:gap-1 ${
              inView ? 'opacity-100' : 'motion-safe:opacity-0'
            }`}
          >
            <span className="text-5xl leading-none font-light text-rose-deep italic md:text-6xl">{number}</span>
            <span className="tracking-wide">{eyebrow}</span>
          </p>
          <div className="relative">
            <h2 id={headingId} className="max-w-4xl font-serif text-4xl leading-[1.02] font-normal tracking-[-0.02em] text-balance sm:text-5xl md:text-6xl [&_em]:text-rose-deep">
              <span className="block overflow-hidden pb-[0.12em]">
                <span
                  className={`block transition-transform duration-[1100ms] ease-[var(--ease-soft)] ${
                    inView ? 'translate-y-0' : 'motion-safe:translate-y-[105%]'
                  }`}
                >
                  {title}
                </span>
              </span>
            </h2>
            {intro && (
              <Reveal delay={150}>
                <p className="mt-5 max-w-2xl text-lg text-muted text-pretty">{intro}</p>
              </Reveal>
            )}
            {aside && <div className="mt-4 lg:absolute lg:top-0 lg:right-0 lg:mt-0">{aside}</div>}
          </div>
        </div>
        <div className="mt-14 md:mt-20">{children}</div>
      </div>
    </section>
  )
}
