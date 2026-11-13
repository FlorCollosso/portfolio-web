import { FiArrowDown, FiDownload, FiMapPin } from 'react-icons/fi'
import type { PetPortrait, Profile, Project, SecretNote } from '../../types/portfolio'
import { asset } from '../../utils/asset'
import { LibraryScene } from '../scene/LibraryScene'
import { ButtonLink } from '../ui/ButtonLink'
import { Handnote } from '../ui/Handnote'

interface HeroProps {
  profile: Profile
  projects: Project[]
  note: SecretNote
  pets: PetPortrait[]
  onOpenProject: (project: Project) => void
}

// Entrada escalonada del texto del inicio
const enter = (delay: string) => ({ animation: `scene-in 1s var(--ease-soft) ${delay} backwards` })

export function Hero({ profile, projects, note, pets, onOpenProject }: HeroProps) {
  const firstName = profile.name.split(' ')[0]
  const [roleA, roleB] = profile.role.split(' y ')

  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative overflow-hidden px-4 pt-24 pb-20 sm:px-6 lg:pt-28">
      {/* Manchas de color heredadas del diseño original, ahora más quietas */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 size-120 rounded-full bg-teal/25 blur-3xl dark:bg-teal/10" />
        <div className="absolute top-1/2 right-[-10rem] size-112 rounded-full bg-rose/20 blur-3xl dark:bg-[#ffd79a]/8" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
        <div className="relative">
          <p style={enter("0ms")} className="inline-flex -rotate-1 items-center gap-2 rounded-[0.3rem] border border-ink/10 bg-card px-3 py-1.5 text-sm text-ink-soft shadow-[0.15rem_0.15rem_0_var(--color-teal)]">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-teal opacity-60 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-teal-deep" />
            </span>
            Abierta a nuevas oportunidades
          </p>

          <h1 id="hero-title" className="mt-8 font-serif text-6xl leading-[0.92] font-light tracking-[-0.03em] sm:text-7xl lg:text-[5.4rem]" style={enter("80ms")}>
            Hola, soy <em className="font-normal text-rose-deep">{firstName}</em>.
          </h1>

          <p className="mt-6 text-sm font-semibold tracking-[0.14em] text-teal-deep uppercase" style={enter("160ms")}>
            {roleA} <span className="font-serif font-normal tracking-normal text-muted normal-case italic">&amp;</span> {roleB}
          </p>

          <p className="mt-5 max-w-lg text-lg text-muted text-pretty sm:text-xl" style={enter("240ms")}>
            <span className="text-ink">{profile.headline}</span> {profile.summary}
          </p>

          <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted" style={enter("300ms")}>
            <FiMapPin aria-hidden="true" /> {profile.location}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3" style={enter("360ms")}>
            <ButtonLink href="#proyectos" icon={<FiArrowDown aria-hidden="true" />}>
              Ver proyectos
            </ButtonLink>
            <ButtonLink href={asset(profile.cvUrl)} download variant="secondary" icon={<FiDownload aria-hidden="true" />}>
              Descargar CV
            </ButtonLink>
          </div>

          <div className="mt-10 hidden lg:block" style={enter("1.4s")}>
          <Handnote arrow="right" tilt={-4}>
            pasá, este es mi estudio
          </Handnote>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-xl lg:mr-0 lg:max-w-[min(100%,calc((100svh-9rem)*0.909))]">
          <LibraryScene projects={projects} profile={profile} note={note} pets={pets} onOpenProject={onOpenProject} />
          <figcaption className="mt-4 flex items-start gap-2 px-2 text-sm text-muted">
            <span aria-hidden="true" className="mt-1.5 inline-block size-2 shrink-0 rotate-45 bg-rose" />
            <span>
              Cada libro con título y cada cuadro de la pared son proyectos: tocalos para abrirlos. Abajo están Micha y Nami, mis
              gatitas. La lámpara cambia la luz del sitio y la lana es para el gato. <span className="font-hand text-lg text-rose-deep">Y hay algo escondido.</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
