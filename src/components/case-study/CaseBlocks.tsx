import { useRef } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useI18n } from '../../i18n/useI18n'
import type { CaseBlock as CaseBlockData, GallerySpan } from '../../types/caseStudy'
import type { Project } from '../../types/portfolio'
import { Handnote } from '../ui/Handnote'
import { Reveal } from '../ui/Reveal'
import { CaseMedia } from './CaseMedia'
import { visibleMedia, type MediaMap } from './mediaResolver'

interface BlockProps {
  block: CaseBlockData
  media: MediaMap
  project: Project
}

export function CaseBlock({ block, media, project }: BlockProps) {
  switch (block.type) {
    case 'needs':
      return <Needs block={block} />
    case 'process':
      return <Process steps={project.process} />
    case 'gallery':
      return <Gallery block={block} media={media} />
    case 'story':
      return <Story block={block} media={media} />
    case 'phones':
      return <Phones block={block} media={media} />
    case 'principle':
      return <Principle block={block} />
    case 'carousel':
      return <Carousel block={block} media={media} />
    case 'stack':
      return <Stack block={block} />
    case 'highlights':
      return <Highlights items={project.highlights} />
  }
}

type Of<T extends CaseBlockData['type']> = Extract<CaseBlockData, { type: T }>

function Needs({ block }: { block: Of<'needs'> }) {
  const { lang } = useI18n()
  return (
    <Reveal>
      <ul className="grid border-y border-ink md:grid-cols-3">
        {block.items.map((item, i) => (
          <li key={item.title.es} className="border-line py-6 max-md:not-last:border-b md:px-7 md:py-8 md:not-last:border-r md:first:pl-0">
            <span className="font-serif text-sm text-rose-deep italic">0{i + 1}</span>
            <h3 className="mt-2 font-serif text-3xl font-normal tracking-tight">{item.title[lang]}</h3>
            <p className="mt-2 text-muted text-pretty">{item.text[lang]}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

function Process({ steps }: { steps?: string[] }) {
  const { t } = useI18n()
  if (!steps?.length) return null
  return (
    <Reveal>
      <h3 className="font-serif text-lg text-teal-deep italic">{t('modal.process')}</h3>
      <ol className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3 text-sm text-muted">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-teal-soft text-xs font-bold text-teal-deep">{i + 1}</span>
            <span className="text-pretty">{step}</span>
          </li>
        ))}
      </ol>
    </Reveal>
  )
}

const spans: Record<GallerySpan, string> = {
  full: 'col-span-2 md:col-span-12',
  wide: 'col-span-2 md:col-span-8',
  side: 'col-span-2 md:col-span-4',
  half: 'col-span-2 md:col-span-6',
  third: 'col-span-1 md:col-span-4',
  small: 'col-span-1 md:col-span-2',
}

const spanSizes: Record<GallerySpan, string> = {
  full: '(min-width: 1024px) 80rem, 100vw',
  wide: '(min-width: 768px) 60vw, 100vw',
  side: '(min-width: 768px) 30vw, 100vw',
  half: '(min-width: 768px) 45vw, 100vw',
  third: '(min-width: 768px) 30vw, 50vw',
  small: '(min-width: 768px) 16vw, 50vw',
}

// Composición asimétrica: cada pieza define su ancho y, si quiere, baja un poco para romper la grilla.
function Gallery({ block, media }: { block: Of<'gallery'>; media: MediaMap }) {
  const items = visibleMedia(block.items.map((i) => i.id), media)
  if (!items.length) return null
  const layout = (id: string) => block.items.find((i) => i.id === id)!

  return (
    <div className="grid grid-cols-2 items-start gap-4 sm:gap-6 md:grid-cols-12 lg:gap-8">
      {items.map((item) => {
        const { span, drop } = layout(item.id)
        const solo = items.length === 1
        return (
          <Reveal key={item.id} className={`${solo ? spans.full : spans[span]} ${drop && !solo ? 'md:mt-14' : ''}`}>
            <CaseMedia item={item} group={items} sizes={spanSizes[solo ? 'full' : span]} caption />
          </Reveal>
        )
      })}
    </div>
  )
}

function Story({ block, media }: { block: Of<'story'>; media: MediaMap }) {
  const { lang } = useI18n()
  const [main] = visibleMedia([block.media], media)
  const [companion] = block.companion ? visibleMedia([block.companion], media) : []
  if (!main) return null
  const group = companion ? [main, companion] : [main]

  const content = (
    <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <Reveal className={`relative lg:col-span-8 ${block.flip ? 'lg:order-2' : ''} ${companion ? 'pb-0 lg:pb-12' : ''}`}>
        <div className={companion ? 'lg:mr-[19%]' : ''}>
          <CaseMedia item={main} group={group} sizes="(min-width: 1024px) 58vw, 100vw" />
        </div>
        {companion && (
          <CaseMedia
            item={companion}
            group={group}
            sizes="(min-width: 1024px) 13rem, 45vw"
            className="mx-auto mt-6 w-[48%] max-w-52 lg:absolute lg:right-0 lg:bottom-0 lg:mt-0 lg:w-[23%]"
          />
        )}
      </Reveal>
      <Reveal delay={100} className={`lg:col-span-4 ${block.flip ? 'lg:order-1' : ''}`}>
        <p className={`text-xs font-semibold tracking-[0.16em] uppercase ${block.dark ? 'text-[#93d3d0]' : 'text-teal-deep'}`}>{block.label[lang]}</p>
        <h3 className="mt-3 font-serif text-3xl leading-[1.05] font-normal tracking-[-0.015em] text-balance sm:text-4xl">{block.title[lang]}</h3>
        <p className={`mt-4 text-pretty ${block.dark ? 'text-[#d7e4e2]' : 'text-muted'}`}>{block.text[lang]}</p>
        {block.points && (
          <ul className="mt-5 space-y-2 text-sm">
            {block.points.map((point) => (
              <li key={point.es} className="flex items-baseline gap-2">
                <span aria-hidden="true" className="text-[#f2abbc]">✦</span>
                {point[lang]}
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </div>
  )

  if (!block.dark) return content
  return <div className="-mx-5 bg-[#12302f] px-5 py-12 text-[#f7f6f5] sm:-mx-8 sm:px-8 sm:py-16 lg:mx-0 lg:rounded-[0.5rem] lg:p-14">{content}</div>
}

function Phones({ block, media }: { block: Of<'phones'>; media: MediaMap }) {
  const { lang } = useI18n()
  const items = visibleMedia(block.media, media)
  if (!items.length) return null

  return (
    <div className="grid items-center gap-8 rounded-[0.5rem] bg-rose-soft/45 p-5 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-12">
      <Reveal className="lg:col-span-4">
        <p className="text-xs font-semibold tracking-[0.16em] text-rose-deep uppercase">{block.label[lang]}</p>
        <h3 className="mt-3 font-serif text-3xl leading-[1.05] font-normal tracking-[-0.015em] text-balance sm:text-4xl">{block.title[lang]}</h3>
        <p className="mt-4 text-muted text-pretty">{block.text[lang]}</p>
      </Reveal>
      <Reveal delay={100} className="lg:col-span-8">
        <div className="mx-auto grid max-w-2xl grid-cols-3 items-start gap-2 sm:gap-6">
          {items.map((item, i) => (
            <CaseMedia key={item.id} item={item} group={items} sizes="(min-width: 768px) 13rem, 30vw" className={i === 1 ? 'mt-5 sm:mt-10' : ''} />
          ))}
        </div>
      </Reveal>
    </div>
  )
}

function Principle({ block }: { block: Of<'principle'> }) {
  const { lang } = useI18n()
  return (
    <Reveal className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-semibold tracking-[0.16em] text-teal-deep uppercase">{block.label[lang]}</p>
      <p className="mt-4 font-serif text-3xl leading-[1.15] font-light text-balance sm:text-4xl">{block.text[lang]}</p>
      <Handnote className="mt-4" tilt={-2}>
        {block.note[lang]}
      </Handnote>
    </Reveal>
  )
}

// Carrusel con scroll nativo: funciona con el dedo, el trackpad y los botones.
function Carousel({ block, media }: { block: Of<'carousel'>; media: MediaMap }) {
  const { t } = useI18n()
  const trackRef = useRef<HTMLUListElement>(null)
  const items = visibleMedia(block.items, media)
  if (!items.length) return null

  const move = (direction: number) => {
    const track = trackRef.current
    if (!track) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' })
  }
  const button = 'grid size-11 place-items-center rounded-full border border-ink/20 bg-card transition-colors hover:border-ink'

  return (
    <Reveal>
      <section aria-roledescription="carousel" aria-label={t('case.carousel')}>
        <ul ref={trackRef} className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:thin] sm:-mx-8 sm:gap-6 sm:px-8 lg:mx-0 lg:px-0">
          {items.map((item) => (
            <li key={item.id} className="w-[72%] shrink-0 snap-center sm:w-[42%] lg:w-[29%] lg:snap-start">
              <CaseMedia item={item} group={items} sizes="(min-width: 1024px) 26vw, (min-width: 640px) 42vw, 72vw" caption />
            </li>
          ))}
        </ul>
        {items.length > 1 && (
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={() => move(-1)} className={button}>
              <FiChevronLeft aria-hidden="true" className="size-5" />
              <span className="sr-only">{t('case.carouselPrev')}</span>
            </button>
            <button type="button" onClick={() => move(1)} className={button}>
              <FiChevronRight aria-hidden="true" className="size-5" />
              <span className="sr-only">{t('case.carouselNext')}</span>
            </button>
          </div>
        )}
      </section>
    </Reveal>
  )
}

function Stack({ block }: { block: Of<'stack'> }) {
  const { t, lang } = useI18n()
  return (
    <Reveal>
      <h3 className="font-serif text-lg text-teal-deep italic">{t('modal.tools')}</h3>
      <ul className="mt-4 grid grid-cols-2 border-t border-l border-ink/15 lg:grid-cols-3">
        {block.items.map((item) => (
          <li key={item.name} className="border-r border-b border-ink/15 p-4 sm:p-5">
            <p className="font-serif text-lg leading-tight sm:text-2xl">{item.name}</p>
            <p className="mt-1 text-xs text-muted sm:text-sm">{item.value[lang]}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

function Highlights({ items }: { items?: string[] }) {
  const { t } = useI18n()
  if (!items?.length) return null
  return (
    <Reveal className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-8">
      <h3 className="shrink-0 font-serif text-lg text-teal-deep italic">{t('modal.highlights')}</h3>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        {items.map((item) => (
          <li key={item} className="flex items-baseline gap-2">
            <span aria-hidden="true" className="text-rose">✦</span>
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}
