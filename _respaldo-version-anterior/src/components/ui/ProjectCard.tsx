import { FiArrowUpRight } from 'react-icons/fi'
import type { Project } from '../../types/portfolio'
import { categoryLabels } from '../../data/labels'
import { ProjectCover } from './ProjectCover'
import { Tag } from './Tag'

interface ProjectCardProps {
  project: Project
  onOpen: (project: Project) => void
  large?: boolean
}

export function ProjectCard({ project, onOpen, large = false }: ProjectCardProps) {
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/5 ${
        large ? 'md:flex-row' : ''
      }`}
    >
      <div className={`overflow-hidden ${large ? 'aspect-16/10 md:aspect-auto md:w-[55%]' : 'aspect-4/3'}`}>
        <ProjectCover
          project={project}
          sizes={large ? '(min-width: 768px) 55vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
          className="transition-transform duration-500 motion-safe:group-hover:scale-105"
        />
      </div>

      <div className={`flex flex-1 flex-col gap-3 ${large ? 'p-6 md:p-10' : 'p-6'}`}>
        <p className="text-xs font-semibold tracking-widest text-teal-deep uppercase">
          {categoryLabels[project.category]}
          {project.year && <span className="text-muted"> · {project.year}</span>}
        </p>
        <h3 className={`font-bold tracking-tight ${large ? 'text-2xl' : 'text-xl'}`}>
          {/* El enlace cubre toda la tarjeta, pero el lector de pantalla anuncia solo el título */}
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none after:focus-visible:rounded-3xl after:focus-visible:outline-2 after:focus-visible:outline-rose-deep"
          >
            {project.title}
          </button>
        </h3>
        <p className="text-muted text-pretty">{project.summary}</p>
        <ul className="mt-auto flex flex-wrap gap-2 pt-2" aria-label="Herramientas">
          {project.tags.slice(0, large ? 5 : 3).map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-deep" aria-hidden="true">
          Ver detalle <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  )
}
