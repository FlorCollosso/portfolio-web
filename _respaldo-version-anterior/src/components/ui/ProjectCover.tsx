import type { Project } from '../../types/portfolio'
import { ResponsiveImage } from './ResponsiveImage'

const accents: Record<NonNullable<Project['accent']>, string> = {
  teal: 'from-teal-deep via-teal to-teal-soft text-white',
  rose: 'from-rose-deep via-rose to-rose-soft text-white',
  ink: 'from-ink via-ink-soft to-teal-deep text-white',
}

interface ProjectCoverProps {
  project: Project
  sizes: string
  className?: string
}

// Muestra la imagen del proyecto; si todavía no tiene, una portada tipográfica con la paleta de marca.
export function ProjectCover({ project, sizes, className = '' }: ProjectCoverProps) {
  if (project.image) {
    return <ResponsiveImage image={project.image} sizes={sizes} className={`h-full w-full object-cover ${className}`} />
  }

  return (
    <div
      aria-hidden="true"
      className={`relative flex h-full w-full items-end overflow-hidden bg-linear-135 p-6 ${accents[project.accent ?? 'ink']} ${className}`}
    >
      <span className="absolute -top-10 -right-10 size-48 rounded-full bg-white/15 blur-2xl" />
      <span className="relative text-3xl leading-none font-extrabold tracking-tight sm:text-4xl">{project.title}</span>
    </div>
  )
}
