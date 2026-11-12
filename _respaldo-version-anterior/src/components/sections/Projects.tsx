import { useState } from 'react'
import { categoryLabels } from '../../data/labels'
import type { Project, ProjectCategory } from '../../types/portfolio'
import { ProjectCard } from '../ui/ProjectCard'
import { ProjectModal } from '../ui/ProjectModal'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

type Filter = 'all' | ProjectCategory

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Project | null>(null)

  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured && (filter === 'all' || p.category === filter))
  const filters: Filter[] = ['all', ...new Set(projects.filter((p) => !p.featured).map((p) => p.category))]

  return (
    <Section
      id="proyectos"
      eyebrow="Proyectos"
      title="Diseño que se puede usar, código que se puede ver"
      intro="Primero, los proyectos donde se ve el puente entre diseño y desarrollo. Después, trabajos de identidad y diseño gráfico."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {featured.map((project, i) => (
          <Reveal key={project.id} delay={i * 80} className={i === 0 ? 'md:col-span-2' : ''}>
            <ProjectCard project={project} onOpen={setSelected} large={i === 0} />
          </Reveal>
        ))}
      </div>

      <div className="mt-20 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="text-2xl font-bold tracking-tight">Más trabajos</h3>
        {filters.length > 2 && (
          <div role="group" aria-label="Filtrar proyectos" className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                  filter === f ? 'border-ink bg-ink text-paper' : 'border-line bg-white hover:border-ink'
                }`}
              >
                {f === 'all' ? 'Todos' : categoryLabels[f]}
              </button>
            ))}
          </div>
        )}
      </div>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {rest.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} onOpen={setSelected} />
          </li>
        ))}
      </ul>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </Section>
  )
}
