import type { Profile } from '../../types/portfolio'
import { CatFace } from '../scene/CatFace'
import { SocialIcon } from '../ui/SocialIcon'

const year = new Date().getFullYear()

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="relative mt-10 border-t border-line px-4 pt-14 pb-10 sm:px-6">
      {/* El gato se asoma por el borde del footer */}
      <div className="group absolute -top-[2.6rem] right-[12%] h-[2.6rem] w-20 overflow-hidden" aria-hidden="true">
        <CatFace follow className="w-20 translate-y-[38%] transition-transform duration-500 ease-[var(--ease-swing)] group-hover:translate-y-[4%]" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-sm text-muted sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-serif text-lg text-ink">
            {profile.name}
            <span className="text-rose">.</span>
          </p>
          <p className="mt-1">
            © {year} · Diseñado y desarrollado a mano en {profile.location.split(',')[0]}, con React, Tailwind CSS y un gato ilustrado
            supervisando.
          </p>
        </div>
        <ul className="flex gap-1">
          {profile.socials.map((social) => (
            <li key={social.id}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-11 place-items-center rounded-full text-ink-soft transition-colors hover:bg-rose-soft hover:text-rose-deep"
              >
                <SocialIcon id={social.id} />
                <span className="sr-only">{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
