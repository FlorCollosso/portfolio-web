import { FiArrowDown, FiDownload, FiMapPin } from 'react-icons/fi'
import type { Profile } from '../../types/portfolio'
import { asset } from '../../utils/asset'
import { ButtonLink } from '../ui/ButtonLink'
import { ResponsiveImage } from '../ui/ResponsiveImage'

// Reemplaza al video de portada de 8 MB del sitio anterior: el degradé es CSS puro.
export function Hero({ profile }: { profile: Profile }) {
  const firstName = profile.name.split(' ')[0]

  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative overflow-hidden px-4 pt-28 pb-20 sm:px-6 md:pt-36 md:pb-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 size-112 rounded-full bg-teal/45 blur-3xl motion-safe:animate-[drift_18s_ease-in-out_infinite]" />
        <div className="absolute top-40 -right-32 size-104 rounded-full bg-rose/40 blur-3xl motion-safe:animate-[drift_22s_ease-in-out_infinite_reverse]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-3 py-1 text-sm text-ink-soft backdrop-blur">
            <span className="size-2 rounded-full bg-teal-deep" aria-hidden="true" />
            Abierta a nuevas oportunidades
          </p>

          <h1 id="hero-title" className="mt-6 text-5xl leading-[0.95] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Hola, soy {firstName}.
            <span className="mt-3 block text-3xl font-bold text-ink-soft sm:text-4xl lg:text-5xl">{profile.role}</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted text-pretty sm:text-xl">
            {profile.headline} {profile.summary}
          </p>

          <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted">
            <FiMapPin aria-hidden="true" /> {profile.location}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#proyectos" icon={<FiArrowDown aria-hidden="true" />}>
              Ver proyectos
            </ButtonLink>
            <ButtonLink href={asset(profile.cvUrl)} download variant="secondary" icon={<FiDownload aria-hidden="true" />}>
              Descargar CV
            </ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto w-[calc(100%-1rem)] max-w-xs sm:max-w-sm">
          <div aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.5rem] bg-ink" />
          <ResponsiveImage
            image={profile.photo}
            sizes="(min-width: 768px) 24rem, 80vw"
            priority
            className="relative aspect-4/5 w-full rounded-[2.5rem] object-cover"
          />
        </div>
      </div>
    </section>
  )
}
