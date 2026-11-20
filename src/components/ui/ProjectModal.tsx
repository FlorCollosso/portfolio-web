import { useEffect, useRef } from 'react'
import { FiCode, FiExternalLink, FiFigma, FiFileText, FiX } from 'react-icons/fi'
import type { Project } from '../../types/portfolio'
import { useI18n } from '../../i18n/useI18n'
import { ButtonLink } from './ButtonLink'
import { ProjectCover } from './ProjectCover'
import { Tag } from './Tag'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

// Usa <dialog> nativo: atrapa el foco, cierra con Escape y devuelve el foco al botón que lo abrió.
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { t } = useI18n()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (project && !dialog.open) dialog.showModal()
    if (!project && dialog.open) dialog.close()
  }, [project])

  useEffect(() => {
    document.body.style.overflow = project ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [project])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      aria-labelledby="project-modal-title"
      className="m-auto max-h-[90dvh] w-[min(100%-2rem,48rem)] overflow-y-auto rounded-[0.5rem] bg-card p-0 text-ink shadow-2xl motion-safe:transition-[opacity,translate] motion-safe:duration-200 motion-safe:starting:open:translate-y-3 motion-safe:starting:open:opacity-0"
    >
      {project && (
        <div>
          <div className={`relative overflow-hidden ${project.image ? 'aspect-16/9' : 'aspect-3/1'}`}>
            <ProjectCover project={project} sizes="(min-width: 768px) 48rem, 100vw" />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-[#fbf7f0]/90 text-[#141414] shadow transition hover:bg-[#fbf7f0]"
            >
              <FiX aria-hidden="true" className="size-5" />
              <span className="sr-only">{t('modal.close')}</span>
            </button>
          </div>

          <div className="space-y-8 p-6 sm:p-10">
            <header>
              <p className="text-xs font-semibold tracking-widest text-teal-deep uppercase">
                {t(`category.${project.category}`)}
                {project.year && <span className="text-muted"> · {project.year}</span>}
              </p>
              <h2 id="project-modal-title" className="mt-2 font-serif text-4xl font-normal tracking-[-0.02em]">
                {project.title}
              </h2>
              <p className="mt-3 text-lg text-muted text-pretty">{project.summary}</p>
            </header>

            <dl className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="font-serif text-sm text-teal-deep italic">{t('modal.role')}</dt>
                <dd className="mt-1 text-muted">{project.role}</dd>
              </div>
              {project.challenge && (
                <div>
                  <dt className="font-serif text-sm text-teal-deep italic">{t('modal.challenge')}</dt>
                  <dd className="mt-1 text-muted">{project.challenge}</dd>
                </div>
              )}
            </dl>

            {project.process && (
              <div>
                <h3 className="font-serif text-sm text-teal-deep italic">{t('modal.process')}</h3>
                <ol className="mt-3 space-y-2">
                  {project.process.map((step, i) => (
                    <li key={step} className="flex gap-3 text-muted">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-teal-soft text-xs font-bold text-teal-deep">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {project.highlights && (
              <div>
                <h3 className="font-serif text-sm text-teal-deep italic">{t('modal.highlights')}</h3>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-muted marker:text-rose">
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <ul className="flex flex-wrap gap-2" aria-label={t('modal.tools')}>
              {project.tags.map((tag) => (
                <li key={tag}>
                  <Tag>{tag}</Tag>
                </li>
              ))}
            </ul>

            {Object.keys(project.links).length > 0 && (
              <div className="flex flex-wrap gap-3 border-t border-line pt-6">
                {project.links.live && (
                  <ButtonLink href={project.links.live} external icon={<FiExternalLink aria-hidden="true" />}>
                    {t('modal.live')}
                  </ButtonLink>
                )}
                {project.links.code && (
                  <ButtonLink href={project.links.code} external variant="secondary" icon={<FiCode aria-hidden="true" />}>
                    {t('modal.code')}
                  </ButtonLink>
                )}
                {project.links.prototype && (
                  <ButtonLink href={project.links.prototype} external variant="secondary" icon={<FiFigma aria-hidden="true" />}>
                    {t('modal.prototype')}
                  </ButtonLink>
                )}
                {project.links.caseStudy && (
                  <ButtonLink href={project.links.caseStudy} external variant="secondary" icon={<FiFileText aria-hidden="true" />}>
                    {t('modal.caseStudy')}
                  </ButtonLink>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}
