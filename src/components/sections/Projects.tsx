import { useRef, useState, type PointerEvent } from 'react'
import { FiArrowUpRight, FiExternalLink } from 'react-icons/fi'
import { categoryLabels } from '../../data/labels'
import { useFinePointer } from '../../hooks/useMediaQuery'
import type { Project, ProjectCategory } from '../../types/portfolio'
import { asset } from '../../utils/asset'
import { buttonBase, ButtonLink } from '../ui/ButtonLink'
import { Handnote } from '../ui/Handnote'
import { ProjectCover } from '../ui/ProjectCover'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

type Filter = 'all' | ProjectCategory

interface ProjectsProps {
  projects: Project[]
  onOpen: (project: Project) => void
}

export function Projects({ projects, onOpen }: ProjectsProps) {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <Section
      id="proyectos"
      number="02"
      eyebrow="La colección"
      title={<>Diseño que se puede usar, <em>código que se puede ver</em></>}
      intro="Primero, los proyectos donde se ve el puente entre diseño y desarrollo. Después, el archivo de identidad y diseño gráfico."
      className="bg-card/60"
    >
      <div className="space-y-24 md:space-y-36">
        {featured.map((project, i) => (
          <FeaturedProject key={project.id} project={project} index={i} onOpen={onOpen} />
        ))}
      </div>

      <Archive projects={rest} onOpen={onOpen} startAt={featured.length + 1} />
    </Section>
  )
}

const pad = (n: number) => String(n).padStart(2, '0')

// Proyecto destacado, maquetado como una doble página de revista.
function FeaturedProject({ project, index, onOpen }: { project: Project; index: number; onOpen: (p: Project) => void }) {
  const flip = index % 2 === 1

  return (
    <article className="grid items-center gap-8 md:grid-cols-12 md:gap-10">
      <Reveal className={`md:col-span-7 ${flip ? 'md:order-2' : ''}`}>
        <button type="button" onClick={() => onOpen(project)} className="group relative block w-full text-left" aria-label={`Abrir ${project.title}`}>
          <span
            aria-hidden="true"
            className={`absolute inset-0 rounded-[0.4rem] transition-transform duration-700 ease-[var(--ease-swing)] ${
              project.accent === 'rose' ? 'bg-rose-soft' : project.accent === 'ink' ? 'bg-ink/10' : 'bg-teal-soft'
            } ${flip ? '-rotate-2 group-hover:-rotate-4' : 'rotate-2 group-hover:rotate-4'}`}
          />
          <span className="relative block aspect-16/11 overflow-hidden rounded-[0.4rem] shadow-[0_1.5rem_3rem_-1.8rem_rgb(20_20_20/0.5)]">
            <ProjectCover
              project={project}
              sizes="(min-width: 768px) 58vw, 100vw"
              className="transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.04]"
            />
          </span>
          {/* Sello que aparece al pasar el mouse */}
          <span
            aria-hidden="true"
            className={`absolute -bottom-5 grid size-20 scale-75 rotate-[-12deg] place-items-center rounded-full bg-ink text-center font-hand text-lg leading-none text-paper opacity-0 transition-all duration-500 ease-[var(--ease-swing)] group-hover:scale-100 group-hover:rotate-0 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 ${
              flip ? '-left-3' : '-right-3'
            }`}
          >
            abrir
            <br />
            el caso
          </span>
        </button>
      </Reveal>

      <Reveal delay={120} className={`md:col-span-5 ${flip ? 'md:order-1' : ''}`}>
        <p className="flex items-baseline gap-3 text-sm text-muted">
          <span className="font-serif text-2xl text-rose-deep italic">N.º {pad(index + 1)}</span>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
          <span>{project.year}</span>
        </p>
        <p className="mt-6 text-xs font-semibold tracking-[0.16em] text-teal-deep uppercase">{categoryLabels[project.category]}</p>
        <h3 className="mt-2 font-serif text-4xl leading-none font-normal tracking-[-0.02em] sm:text-5xl">{project.title}</h3>
        <p className="mt-5 text-lg text-muted text-pretty">{project.summary}</p>
        <p className="mt-5 text-sm">
          <span className="font-serif text-teal-deep italic">Mi rol — </span>
          {project.role}
        </p>
        <p className="mt-4 text-sm text-muted">{project.tags.join('  /  ')}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => onOpen(project)} className={`${buttonBase} border border-ink/20 bg-card hover:border-ink`}>
            Ver el proceso <FiArrowUpRight aria-hidden="true" />
          </button>
          {project.links.live && (
            <ButtonLink href={project.links.live} external variant="ghost" icon={<FiExternalLink aria-hidden="true" />}>
              Sitio en vivo
            </ButtonLink>
          )}
        </div>
      </Reveal>
    </article>
  )
}

// Archivo: el resto de los trabajos como índice de catálogo, con vista previa que sigue al mouse.
function Archive({ projects, onOpen, startAt }: { projects: Project[]; onOpen: (p: Project) => void; startAt: number }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [hovered, setHovered] = useState<Project | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()

  const filters: Filter[] = ['all', ...new Set(projects.map((p) => p.category))]
  const visible = projects.filter((p) => filter === 'all' || p.category === filter)

  const movePreview = (e: PointerEvent<HTMLDivElement>) => {
    const list = listRef.current
    const preview = previewRef.current
    if (!list || !preview) return
    const r = list.getBoundingClientRect()
    preview.style.transform = `translate(${e.clientX - r.left + 28}px, ${e.clientY - r.top - 90}px)`
  }

  return (
    <div className="mt-28 md:mt-40">
      <Reveal className="flex flex-col gap-6 border-b border-ink pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-serif text-3xl font-normal tracking-tight sm:text-4xl">
            El <em className="text-rose-deep">archivo</em>
          </h3>
          <Handnote className="mt-1" tilt={-2}>
            identidad, editorial y piezas gráficas
          </Handnote>
        </div>
        {filters.length > 2 && (
          <div role="group" aria-label="Filtrar el archivo" className="flex flex-wrap gap-x-5 gap-y-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`min-h-11 text-sm font-medium underline-offset-[0.45em] transition-colors ${
                  filter === f ? 'text-ink underline decoration-rose decoration-2' : 'text-muted hover:text-ink'
                }`}
              >
                {f === 'all' ? 'Todo' : categoryLabels[f]}
              </button>
            ))}
          </div>
        )}
      </Reveal>

      <div ref={listRef} className="relative" onPointerMove={fine ? movePreview : undefined} onPointerLeave={() => setHovered(null)}>
        <ul aria-live="polite">
          {visible.map((project) => (
            <li key={project.id} className="border-b border-line">
              <button
                type="button"
                onClick={() => onOpen(project)}
                onPointerEnter={() => setHovered(project)}
                onFocus={() => setHovered(null)}
                className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-1 py-5 text-left transition-colors duration-300 hover:bg-rose-soft/40 sm:grid-cols-[3.5rem_minmax(0,1.2fr)_minmax(0,1fr)_5rem_2rem] sm:px-3"
              >
                <span className="font-serif text-sm text-muted italic">{pad(startAt + projects.indexOf(project))}</span>
                <span className="font-serif text-2xl leading-tight transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-2 sm:text-3xl">
                  {project.title}
                </span>
                <span className="col-start-2 text-sm text-muted sm:col-start-auto">
                  {project.role}
                  <span className="sr-only"> · {categoryLabels[project.category]}</span>
                </span>
                <span className="hidden text-sm text-muted sm:block">{project.year ?? '—'}</span>
                <FiArrowUpRight
                  aria-hidden="true"
                  className="col-start-3 row-span-2 row-start-1 size-5 text-rose-deep transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:col-start-auto sm:row-span-1"
                />
              </button>
            </li>
          ))}
        </ul>

        {fine && (
          <div
            ref={previewRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-10 w-64 transition-[transform] duration-200 ease-out will-change-transform"
          >
            <div
              className={`aspect-4/3 overflow-hidden rounded-[0.3rem] bg-card p-1.5 shadow-2xl transition-all duration-300 ease-[var(--ease-soft)] ${
                hovered?.image ? 'scale-100 rotate-2 opacity-100' : 'scale-90 rotate-0 opacity-0'
              }`}
            >
              {hovered?.image && (
                <img src={asset(`${hovered.image.base}-640.webp`)} alt="" className="h-full w-full rounded-[0.2rem] object-cover" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
