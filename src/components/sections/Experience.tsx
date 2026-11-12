import type { TimelineItem } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { Tag } from '../ui/Tag'

// Trayectoria como índice de libro: período, puntos guía y título.
function Ledger({ title, items, detailed = false }: { title: string; items: TimelineItem[]; detailed?: boolean }) {
  return (
    <div>
      <h3 className="border-b border-ink pb-3 font-serif text-2xl font-normal italic">{title}</h3>
      <ol>
        {items.map((item, i) => (
          <li key={item.id} className="border-b border-line py-7">
            <Reveal delay={i * 80}>
              <div className="flex items-baseline gap-3">
                <h4 className="font-serif text-xl leading-snug sm:text-2xl">{item.title}</h4>
                <span aria-hidden="true" className="mb-1.5 hidden flex-1 border-b border-dotted border-muted/50 sm:block" />
                <p className="hidden shrink-0 text-sm text-muted tabular-nums sm:block">{item.period}</p>
              </div>
              <p className="mt-1 text-muted">
                <span className="font-medium text-teal-deep">{item.organization}</span>
                {item.location && ` · ${item.location}`}
                <span className="sm:hidden"> · {item.period}</span>
              </p>
              {detailed && item.bullets && (
                <ul className="mt-4 space-y-2 text-muted">
                  {item.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-rose" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {detailed && item.tags && (
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tecnologías">
                  {item.tags.map((tag) => (
                    <li key={tag}>
                      <Tag>{tag}</Tag>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Experience({ experience, education }: { experience: TimelineItem[]; education: TimelineItem[] }) {
  return (
    <Section id="trayectoria" number="04" eyebrow="Trayectoria" title={<>Dónde trabajé, <em>dónde aprendí</em></>} className="bg-card/60">
      <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <Ledger title="Experiencia" items={experience} detailed />
        <Ledger title="Formación" items={education} />
      </div>
    </Section>
  )
}
