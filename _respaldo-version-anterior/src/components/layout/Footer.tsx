import type { Profile } from '../../types/portfolio'
import { SocialIcon } from '../ui/SocialIcon'

const year = new Date().getFullYear()

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-white/10 bg-ink px-4 py-10 text-paper/70 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-sm sm:flex-row">
        <p>
          © {year} {profile.name}. Diseñado y desarrollado por mí con React y Tailwind CSS.
        </p>
        <ul className="flex gap-2">
          {profile.socials.map((social) => (
            <li key={social.id}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-11 place-items-center rounded-full transition-colors hover:bg-white/10 hover:text-paper"
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
