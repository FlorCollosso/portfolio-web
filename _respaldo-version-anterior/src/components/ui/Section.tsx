import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionProps {
  id: string
  eyebrow: string
  title: string
  intro?: string
  children: ReactNode
  className?: string
}

export function Section({ id, eyebrow, title, intro, children, className = '' }: SectionProps) {
  const headingId = `${id}-title`

  return (
    <section id={id} aria-labelledby={headingId} className={`px-4 py-20 sm:px-6 md:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold tracking-[0.2em] text-rose-deep uppercase">{eyebrow}</p>
          <h2 id={headingId} className="mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {intro && <p className="mt-4 max-w-2xl text-lg text-muted text-pretty">{intro}</p>}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}
