import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { FiCode, FiExternalLink, FiX } from 'react-icons/fi'
import { useI18n } from '../../i18n/useI18n'
import type { CaseSection, CaseStudyData } from '../../types/caseStudy'
import type { Project } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'
import { Handnote } from '../ui/Handnote'
import { ProjectCover } from '../ui/ProjectCover'
import { Reveal } from '../ui/Reveal'
import { CaseBlock } from './CaseBlocks'
import { CaseLightbox, type LightboxState } from './CaseLightbox'
import { CaseMedia } from './CaseMedia'
import { isBlockVisible, isSectionVisible, LightboxContext, resolveMedia, type MediaMap, type ResolvedMedia } from './mediaResolver'

interface CaseStudyProps {
  study: CaseStudyData
  project: Project
  titleId: string
  onClose: () => void
}

const tones: Record<NonNullable<CaseSection['tone']>, string> = {
  paper: 'bg-card',
  wall: 'bg-wall/70',
  teal: 'bg-teal-soft/45',
  rose: 'bg-rose-soft/35',
}

const gutter = 'px-5 sm:px-8 lg:px-14 xl:px-20'
const sectionDomId = (id: string) => `caso-${id}`

export function CaseStudy({ study, project, titleId, onClose }: CaseStudyProps) {
  const { lang } = useI18n()
  const scrollRootRef = useRef<HTMLDivElement>(null)
  const media = useMemo(() => resolveMedia(study, lang), [study, lang])
  const sections = useMemo(() => study.sections.filter((s) => isSectionVisible(s, media)), [study, media])
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)
  const openLightbox = useMemo(() => (items: ResolvedMedia[], index: number) => setLightbox({ items, index }), [])

  return (
    <LightboxContext.Provider value={openLightbox}>
      {/* La ventana no scrollea: el menú ocupa su borde superior y solo el área de abajo se desplaza. */}
      <article className="mx-auto flex h-full w-full max-w-[92rem] flex-col overflow-clip bg-card text-ink shadow-2xl lg:rounded-[0.6rem]">
        <CaseBar title={project.title} sections={sections} scrollRootRef={scrollRootRef} onClose={onClose} />
        <div
          ref={scrollRootRef}
          data-modal-scroll
          role="region"
          aria-labelledby={titleId}
          tabIndex={0}
          className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain outline-none"
        >
          <CaseHero study={study} project={project} media={media} titleId={titleId} />

          {sections.map((section, i) => (
            <CaseSectionView key={section.id} section={section} index={i + 1} media={media} project={project} />
          ))}

          <CaseClosing study={study} project={project} />
        </div>
      </article>
      <CaseLightbox
        state={lightbox}
        onMove={(index) => setLightbox((s) => (s ? { ...s, index } : s))}
        onClose={() => setLightbox(null)}
      />
    </LightboxContext.Provider>
  )
}

// Barra superior de la ventana: título, índice del caso y cierre siempre a mano.
function CaseBar({ title, sections, scrollRootRef, onClose }: { title: string; sections: CaseSection[]; scrollRootRef: RefObject<HTMLDivElement | null>; onClose: () => void }) {
  const { t, lang } = useI18n()
  const [active, setActive] = useState('')

  useEffect(() => {
    const root = scrollRootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((e) => e.isIntersecting)
        if (current) setActive(current.target.id)
        else setActive((prev) => (entries.some((e) => e.target.id === prev) ? '' : prev))
      },
      { root, rootMargin: '-25% 0px -70% 0px' },
    )
    sections.forEach((s) => {
      const el = document.getElementById(sectionDomId(s.id))
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections, scrollRootRef])

  const goTo = (id: string) => {
    const el = document.getElementById(id)
    const root = scrollRootRef.current
    if (!el || !root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const top = root.scrollTop + el.getBoundingClientRect().top - root.getBoundingClientRect().top
    root.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
    el.focus({ preventScroll: true })
  }

  return (
    <div className={`flex h-16 shrink-0 items-center gap-4 border-b border-line bg-card/92 backdrop-blur-md ${gutter}`}>
      <button type="button" onClick={onClose} className="order-last ml-auto grid size-11 shrink-0 place-items-center rounded-full border border-ink/15 bg-card transition-colors hover:border-ink lg:ml-0">
        <FiX aria-hidden="true" className="size-5" />
        <span className="sr-only">{t('modal.close')}</span>
      </button>
      <p className="shrink-0 font-serif text-xl tracking-tight" aria-hidden="true">{title}</p>

      <nav aria-label={t('case.sections')} className="ml-auto hidden lg:block">
        <ul className="flex items-center gap-1 xl:gap-2">
          {sections.map((s) => {
            const id = sectionDomId(s.id)
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => goTo(id)}
                  aria-current={active === id ? 'true' : undefined}
                  className={`min-h-11 px-2.5 text-sm underline-offset-[0.45em] transition-colors ${active === id ? 'font-medium text-ink underline decoration-rose decoration-2' : 'text-muted hover:text-ink'}`}
                >
                  {s.nav[lang]}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <label className="ml-auto min-w-0 lg:hidden">
        <span className="sr-only">{t('case.jump')}</span>
        <select
          value={active}
          onChange={(e) => e.target.value && goTo(e.target.value)}
          className="h-11 max-w-36 rounded-full border border-ink/15 bg-card px-3 text-sm sm:max-w-48"
        >
          <option value="">{t('case.index')}</option>
          {sections.map((s) => (
            <option key={s.id} value={sectionDomId(s.id)}>
              {s.nav[lang]}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

function CaseHero({ study, project, media, titleId }: { study: CaseStudyData; project: Project; media: MediaMap; titleId: string }) {
  const { t, lang } = useI18n()
  const cover = media.get(study.cover)
  const facts = [
    { label: t('case.period'), value: project.year },
    { label: t('case.role'), value: study.role[lang] },
    { label: t('case.type'), value: study.type[lang] },
  ]

  return (
    <header className={`pt-10 pb-14 sm:pt-14 lg:pb-20 ${gutter}`}>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-teal-deep uppercase">{t('case.eyebrow')}</p>
          <h2 id={titleId} className="mt-3 font-serif text-6xl leading-[0.92] font-normal tracking-[-0.03em] sm:text-7xl lg:text-8xl">
            {project.title}
          </h2>
          <p className="mt-5 max-w-2xl font-serif text-xl leading-snug font-light text-ink-soft text-pretty sm:text-2xl">{study.subtitle[lang]}</p>
        </div>
        <ul className="flex flex-wrap gap-2 lg:col-span-4 lg:justify-end">
          {study.disciplines.map((d) => (
            <li key={d.es} className="rounded-full border border-ink/20 px-3 py-1.5 text-xs font-medium">
              {d[lang]}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-10 lg:mt-12">
        <span aria-hidden="true" className="absolute inset-0 rotate-1 rounded-[0.4rem] bg-teal-soft" />
        {cover?.available ? (
          <CaseMedia item={cover} sizes="(min-width: 1472px) 84rem, 100vw" className="relative" />
        ) : (
          <div className="relative aspect-4/3 overflow-hidden rounded-[0.4rem] shadow-[0_1.5rem_3rem_-1.8rem_rgb(20_20_20/0.5)] sm:aspect-16/9">
            <ProjectCover project={project} sizes="(min-width: 1472px) 84rem, 100vw" />
          </div>
        )}
      </div>

      <dl className="mt-10 grid gap-6 border-t border-ink pt-6 sm:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="font-serif text-sm text-teal-deep italic">{fact.label}</dt>
            <dd className="mt-1 text-pretty">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </header>
  )
}

function CaseSectionView({ section, index, media, project }: { section: CaseSection; index: number; media: MediaMap; project: Project }) {
  const { lang } = useI18n()
  const headingId = `${sectionDomId(section.id)}-title`

  return (
    <section
      id={sectionDomId(section.id)}
      aria-labelledby={headingId}
      tabIndex={-1}
      className={`py-16 outline-none sm:py-20 lg:py-28 ${gutter} ${tones[section.tone ?? 'paper']}`}
    >
      <Reveal className="mb-10 grid gap-5 lg:mb-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="flex items-baseline gap-3 text-xs font-semibold tracking-[0.16em] text-teal-deep uppercase">
            <span className="font-serif text-xl font-normal tracking-normal text-rose-deep normal-case italic">{String(index).padStart(2, '0')}</span>
            {section.eyebrow[lang]}
          </p>
          <h2 id={headingId} className="mt-3 font-serif text-4xl leading-[1.02] font-normal tracking-[-0.02em] text-balance sm:text-5xl lg:text-6xl">
            {section.titleA[lang]} <em className="text-rose-deep">{section.titleB[lang]}</em>
          </h2>
        </div>
        {(section.intro || section.note) && (
          <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
            {section.intro && <p className="text-lg text-muted text-pretty">{section.intro[lang]}</p>}
            {section.note && (
              <Handnote className="mt-3" tilt={-2}>
                {section.note[lang]}
              </Handnote>
            )}
          </div>
        )}
      </Reveal>

      <div className="space-y-16 lg:space-y-24">
        {section.blocks
          .filter((block) => isBlockVisible(block, media))
          .map((block, i) => (
            <CaseBlock key={`${block.type}-${i}`} block={block} media={media} project={project} />
          ))}
      </div>
    </section>
  )
}

function CaseClosing({ study, project }: { study: CaseStudyData; project: Project }) {
  const { t, lang } = useI18n()
  const { live, code } = project.links
  if (!live && !code) return null

  return (
    <footer className={`border-t border-line bg-rose-soft/40 py-14 lg:py-20 ${gutter}`}>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-serif text-4xl leading-none font-normal tracking-[-0.02em] sm:text-5xl">
            {study.closing.titleA[lang]} <em className="text-rose-deep">{study.closing.titleB[lang]}</em>
          </h2>
          <p className="mt-3 text-muted">{study.closing.text[lang]}</p>
          <Handnote className="mt-2" tilt={-2}>
            {study.closing.note[lang]}
          </Handnote>
        </div>
        <div className="flex flex-wrap gap-3">
          {live && (
            <ButtonLink href={live} external icon={<FiExternalLink aria-hidden="true" />}>
              {t('modal.live')}
            </ButtonLink>
          )}
          {code && (
            <ButtonLink href={code} external variant="secondary" icon={<FiCode aria-hidden="true" />}>
              {t('modal.code')}
            </ButtonLink>
          )}
        </div>
      </div>
    </footer>
  )
}
