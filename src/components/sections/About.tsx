import { useI18n } from '../../i18n/useI18n'
import type { Profile, TimelineItem } from '../../types/portfolio'
import { Handnote } from '../ui/Handnote'
import { Reveal } from '../ui/Reveal'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import { Section } from '../ui/Section'

interface AboutProps {
  profile: Profile
  languages: string[]
  studying?: TimelineItem
}

export function About({ profile, languages, studying }: AboutProps) {
  const { t } = useI18n()
  const [first, ...rest] = profile.about
  // La segunda oración del primer párrafo funciona como cita destacada.
  const [intro, ...quoteParts] = first.split('. ')
  const quote = quoteParts.join('. ')

  return (
    <Section id="sobre-mi" number="01" eyebrow={t('about.eyebrow')} title={<>{t('about.titleA')} <em>{t('about.titleB')}</em></>}>
      <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* Polaroid con cinta */}
        <Reveal className="relative mx-auto w-full max-w-sm lg:mx-0">
          <div className="group relative -rotate-3 bg-card p-3 pb-14 shadow-[0_1.5rem_3rem_-1.5rem_rgb(20_20_20/0.45)] transition-transform duration-700 ease-[var(--ease-swing)] hover:rotate-0 motion-reduce:rotate-0">
            <span aria-hidden="true" className="absolute -top-3 left-1/2 z-10 h-7 w-28 -translate-x-1/2 rotate-3 bg-teal/60 [clip-path:polygon(2%_6%,98%_0,100%_94%,0_100%)]" />
            <ResponsiveImage image={profile.photo} sizes="(min-width: 1024px) 24rem, 80vw" className="aspect-4/5 w-full object-cover saturate-[0.92]" />
            <p className="absolute right-0 bottom-3 left-0 text-center font-hand text-2xl text-ink-soft">Flor · {profile.location.split(',')[0]}</p>
          </div>
          <Handnote arrow="hook-up" className="mt-7 ml-3 text-lg sm:ml-6 sm:text-xl" tilt={2}>
            {t('about.photoNote')}
          </Handnote>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-xl text-ink-soft text-pretty">{intro}.</p>
            {quote && (
              <blockquote className="relative mt-12 border-l-2 border-rose pl-6 font-serif text-3xl leading-[1.15] font-light text-ink text-balance italic sm:text-4xl">
                <span aria-hidden="true" className="absolute -top-10 -left-1 font-serif text-7xl leading-none text-rose/40 not-italic">
                  “
                </span>
                {quote}
              </blockquote>
            )}
          </Reveal>

          <Reveal delay={120} className="mt-10 grid gap-6 text-lg text-muted text-pretty md:grid-cols-2">
            {rest.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          {/* Ficha de catálogo */}
          <Reveal delay={200} className="mt-14">
            <dl className="relative rotate-[0.6deg] overflow-hidden rounded-[0.35rem] border border-line bg-card px-6 pt-10 pb-6 shadow-[0.4rem_0.4rem_0_var(--color-teal-soft)] [background-image:repeating-linear-gradient(transparent_0_2.45rem,var(--color-line)_2.45rem_2.5rem)] [background-position:0_2.2rem] sm:px-8">
              <span aria-hidden="true" className="absolute inset-x-0 top-7 h-px bg-rose/70" />
              <p aria-hidden="true" className="absolute top-2 left-6 font-serif text-xs tracking-[0.2em] text-muted uppercase sm:left-8">
                {t('about.card')}
              </p>
              <span aria-hidden="true" className="absolute top-3 right-5 size-3 rounded-full border border-line bg-paper" />
              {[
                [t('about.base'), profile.location],
                [t('about.focus'), t('about.focusValue')],
                [t('about.studying'), studying ? `${studying.title}, ${studying.organization}` : undefined],
                [t('about.languages'), languages.join(' · ')],
              ]
                .filter(([, value]) => value)
                .map(([term, value]) => (
                  <div key={term} className="grid min-h-10 items-baseline gap-x-6 py-0.5 sm:grid-cols-[8rem_1fr]">
                    <dt className="font-serif text-sm text-teal-deep italic">{term}</dt>
                    <dd className="font-medium text-ink">{value}</dd>
                  </div>
                ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
