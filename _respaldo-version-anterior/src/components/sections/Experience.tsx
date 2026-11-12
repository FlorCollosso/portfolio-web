import { FiBookOpen, FiBriefcase } from 'react-icons/fi'
import type { ReactNode } from 'react'
import type { TimelineItem } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { Tag } from '../ui/Tag'

function Timeline({ title, icon, items }: { title: string; icon: ReactNode; items: TimelineItem[] }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-xl font-bold">
        <span className="grid size-9 place-items-center rounded-full bg-rose-soft text-rose-deep">{icon}</span>
        {title}
      </h3>
      <ol className="mt-8 space-y-10 border-l-2 border-line pl-6">
        {items.map((item, i) => (
          <li key={item.id} className="relative">
            <span aria-hidden="true" className="absolute top-1.5 -left-[1.95rem] size-3.5 rounded-full border-2 border-paper bg-teal-deep" />
            <Reveal delay={i * 80}>
              <p className="text-sm font-semibold text-teal-deep">{item.period}</p>
              <h4 className="mt-1 text-lg font-bold">{item.title}</h4>
              <p className="text-muted">
                {item.organization}
                {item.location && ` · ${item.location}`}
              </p>
              {item.bullets && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-muted marker:text-rose">
                  {item.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
              {item.tags && (
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
    <Section id="experiencia" eyebrow="Trayectoria" title="Experiencia y formación">
      <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr]">
        <Timeline title="Experiencia" icon={<FiBriefcase aria-hidden="true" />} items={experience} />
        <Timeline title="Formación" icon={<FiBookOpen aria-hidden="true" />} items={education} />
      </div>
    </Section>
  )
}
