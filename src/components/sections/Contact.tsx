import { useState } from 'react'
import { FiArrowUpRight, FiCheck, FiCopy, FiDownload } from 'react-icons/fi'
import type { Profile } from '../../types/portfolio'
import { asset } from '../../utils/asset'
import { CatFace } from '../scene/CatFace'
import { buttonBase } from '../ui/ButtonLink'
import { Reveal } from '../ui/Reveal'
import { SocialIcon } from '../ui/SocialIcon'

const YEAR = new Date().getFullYear()

// Contacto como postal: mensaje a la izquierda, dirección y estampilla a la derecha.
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
    <section id="contacto" aria-labelledby="contacto-title" className="px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="flex items-baseline gap-3 font-serif text-sm text-muted">
          <span className="text-5xl leading-none font-light text-rose-deep italic md:text-6xl">05</span>
          <span className="tracking-wide">Contacto</span>
        </p>

        <Reveal className="mt-10">
          <div className="group relative rotate-[-0.6deg] rounded-[0.4rem] border border-line bg-card shadow-[0_2rem_4rem_-2.5rem_rgb(20_20_20/0.45)] transition-transform duration-700 ease-[var(--ease-swing)] hover:rotate-0 motion-reduce:rotate-0">
            {/* Borde de correo aéreo */}
            <div
              aria-hidden="true"
              className="h-2.5 rounded-t-[0.4rem] [background:repeating-linear-gradient(-45deg,var(--color-rose)_0_12px,transparent_12px_24px,var(--color-teal)_24px_36px,transparent_36px_48px)]"
            />
            <div className="grid gap-10 p-7 sm:p-12 md:grid-cols-[1.2fr_1px_1fr] md:gap-12">
              <div>
                <h2 id="contacto-title" className="font-serif text-4xl leading-[1.04] font-light tracking-[-0.02em] text-balance sm:text-5xl md:text-6xl">
                  ¿Tenés un proyecto o una búsqueda abierta? <em className="font-normal text-rose-deep">Hablemos.</em>
                </h2>
                <p className="mt-6 max-w-md text-lg text-muted">Escribime por mail o por LinkedIn, y si querés, llevate mi CV.</p>
                <p className="mt-8 font-hand text-3xl text-teal-deep -rotate-2">con cariño, Flor</p>
              </div>

              <span aria-hidden="true" className="hidden bg-line md:block" />

              <div className="relative">
                {/* Estampilla y matasellos */}
                <div aria-hidden="true" className="absolute -top-2 right-0 flex items-start">
                  <div className="relative mt-6 mr-[-1.5rem] grid size-20 place-items-center rounded-full border-2 border-ink/25 font-serif text-[0.55rem] leading-tight tracking-widest text-ink/45 uppercase">
                    <span className="text-center">
                      Córdoba
                      <br />
                      {YEAR}
                    </span>
                  </div>
                  <div className="rotate-3 bg-card p-1.5 shadow-md [mask:radial-gradient(circle_at_center,#000_62%,transparent_64%)_-4px_-4px/8px_8px_round,linear-gradient(#000,#000)_4px_4px/calc(100%-8px)_calc(100%-8px)_no-repeat]">
                    <div className="grid size-16 place-items-center bg-teal-soft">
                      <CatFace className="w-11" />
                    </div>
                  </div>
                </div>

                <p className="font-serif text-sm text-muted italic">Para: vos</p>
                <ul className="mt-14 space-y-1">
                  <li className="border-b border-line pb-3">
                    <a href={`mailto:${profile.email}`} className="group/link inline-flex items-center gap-2 text-lg font-medium break-all hover:text-rose-deep sm:text-xl">
                      {profile.email}
                      <FiArrowUpRight aria-hidden="true" className="shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>
                  </li>
                  {profile.socials.map((social) => (
                    <li key={social.id} className="border-b border-line py-3">
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-3 text-ink-soft hover:text-rose-deep"
                      >
                        <SocialIcon id={social.id} className="size-4" />
                        {social.label}
                        <FiArrowUpRight aria-hidden="true" className="opacity-0 transition-opacity group-hover/link:opacity-100" />
                        <span className="sr-only">(se abre en una pestaña nueva)</span>
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="button" onClick={copyEmail} className={`${buttonBase} bg-ink text-paper hover:bg-rose-deep`}>
                    {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
                    {copied ? 'Copiado' : 'Copiar mail'}
                  </button>
                  <a href={asset(profile.cvUrl)} download className={`${buttonBase} border border-ink/20 bg-card hover:border-ink`}>
                    <FiDownload aria-hidden="true" /> Descargar CV
                  </a>
                  <span role="status" className="sr-only">
                    {copied ? 'Mail copiado al portapapeles' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
