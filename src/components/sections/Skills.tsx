import type { SkillGroup } from '../../types/portfolio'
import { Handnote } from '../ui/Handnote'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

const drawerTones = ['bg-teal-soft', 'bg-rose-soft', 'bg-[#f3e4c4] dark:bg-[#3a3022]', 'bg-wall']

// Sin barras de porcentaje: un "80 % de React" no le dice nada a quien contrata.
// Cada disciplina es un cajón etiquetado de la caja de herramientas.
export function Skills({ skills, languages }: { skills: SkillGroup[]; languages: string[] }) {
  return (
    <Section
      id="herramientas"
      number="03"
      eyebrow="Herramientas"
      title={<>La caja de <em>herramientas</em></>}
      intro="Lo que uso en proyectos reales, ordenado por disciplina. Sin porcentajes: prefiero mostrarlo en el trabajo."
      aside={
        <Handnote arrow="down" tilt={4}>
          lo que más uso: Figma + React
        </Handnote>
      }
    >
      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2">
        {skills.map((group, i) => (
          <Reveal key={group.id} delay={i * 90}>
            <div className={`group relative h-full rounded-[0.4rem] p-7 pt-12 transition-transform duration-500 ease-[var(--ease-swing)] hover:-translate-y-1 sm:p-9 sm:pt-14 ${drawerTones[i % drawerTones.length]}`}>
              {/* Portaetiquetas de cajón */}
              <span className="absolute top-0 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-[0.2rem] border border-ink/15 bg-card px-4 py-1.5 shadow-sm">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-ink/30" />
                <h3 className="font-serif text-base whitespace-nowrap italic">{group.title}</h3>
                <span aria-hidden="true" className="size-1.5 rounded-full bg-ink/30" />
              </span>
              <span aria-hidden="true" className="absolute top-4 right-5 font-serif text-sm text-muted">
                {String(group.items.length).padStart(2, '0')}
              </span>
              <ul className="flex flex-wrap gap-x-1 gap-y-2 text-lg text-ink-soft">
                {group.items.map((item, j) => (
                  <li key={item} className="flex items-center">
                    <span className="rounded-sm bg-linear-to-t from-rose/45 from-35% to-transparent to-35% bg-size-[0%_100%] bg-no-repeat px-0.5 transition-[background-size] duration-500 ease-[var(--ease-soft)] hover:bg-size-[100%_100%]">
                      {item}
                    </span>
                    {j < group.items.length - 1 && (
                      <span aria-hidden="true" className="ml-1 text-muted/60">
                        ·
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200} className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line pt-6">
        <h3 className="font-serif text-sm text-teal-deep italic">Idiomas</h3>
        <p className="text-ink-soft">{languages.join('  ·  ')}</p>
      </Reveal>
    </Section>
  )
}
