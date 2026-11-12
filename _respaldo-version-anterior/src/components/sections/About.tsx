import type { Profile } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

export function About({ profile, languages }: { profile: Profile; languages: string[] }) {
  return (
    <Section id="sobre-mi" eyebrow="Sobre mí" title="Del diseño gráfico al código" className="bg-white">
      <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
        <Reveal className="space-y-5 text-lg text-muted text-pretty">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>

        <Reveal delay={120}>
          <dl className="grid gap-6 rounded-3xl bg-teal-soft p-8">
            <div>
              <dt className="text-sm font-semibold text-teal-deep">Base</dt>
              <dd className="mt-1 font-medium">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-teal-deep">Enfoque</dt>
              <dd className="mt-1 font-medium">UX/UI, diseño de interfaces y desarrollo frontend</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-teal-deep">Idiomas</dt>
              <dd className="mt-1 font-medium">{languages.join(' · ')}</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </Section>
  )
}
