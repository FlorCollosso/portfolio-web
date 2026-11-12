import { useState } from 'react'
import { FiCheck, FiCopy, FiDownload, FiMail } from 'react-icons/fi'
import type { Profile } from '../../types/portfolio'
import { asset } from '../../utils/asset'
import { ButtonLink, buttonBase } from '../ui/ButtonLink'
import { Reveal } from '../ui/Reveal'
import { SocialIcon } from '../ui/SocialIcon'

export function Contact({ profile }: { profile: Profile }) {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="px-4 py-20 sm:px-6 md:py-28">
      <Reveal className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-linear-135 from-teal-soft via-paper to-rose-soft p-8 sm:p-14">
        <p className="text-sm font-semibold tracking-[0.2em] text-rose-deep uppercase">Contacto</p>
        <h2 id="contacto-title" className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
          ¿Tenés un proyecto o una búsqueda abierta? Hablemos.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Escribime por mail o por LinkedIn, y si querés, llevate mi CV.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <ButtonLink href={`mailto:${profile.email}`} icon={<FiMail aria-hidden="true" />}>
            {profile.email}
          </ButtonLink>
          <button type="button" onClick={copyEmail} className={`${buttonBase} border border-ink/15 bg-white hover:border-ink`}>
            {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
            {copied ? 'Copiado' : 'Copiar mail'}
          </button>
          <ButtonLink href={asset(profile.cvUrl)} download variant="secondary" icon={<FiDownload aria-hidden="true" />}>
            Descargar CV
          </ButtonLink>
          <span role="status" className="sr-only">
            {copied ? 'Mail copiado al portapapeles' : ''}
          </span>
        </div>

        <ul className="mt-8 flex flex-wrap gap-3">
          {profile.socials.map((social) => (
            <li key={social.id}>
              <ButtonLink href={social.url} external variant="ghost" icon={<SocialIcon id={social.id} className="size-4" />}>
                {social.label}
              </ButtonLink>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
