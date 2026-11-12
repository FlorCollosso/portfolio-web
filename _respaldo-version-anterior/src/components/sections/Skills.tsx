import type { SkillGroup } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { Tag } from '../ui/Tag'

// Sin barras de porcentaje: un "80 % de React" no le dice nada a quien contrata.
export function Skills({ skills }: { skills: SkillGroup[] }) {
  return (
    <Section
      id="habilidades"
      eyebrow="Habilidades"
      title="Con qué trabajo"
      intro="Herramientas que uso en proyectos reales, agrupadas por disciplina."
      className="bg-ink text-paper [&_h2]:text-paper [&_p]:text-paper/70"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {skills.map((group, i) => (
          <Reveal key={group.id} delay={i * 80}>
            <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-lg font-bold text-teal">{group.title}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <Tag tone="dark">{item}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
