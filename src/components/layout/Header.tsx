import { useEffect, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { navItems } from '../../data/labels'
import { useActiveSection } from '../../hooks/useActiveSection'
import { ThemeToggle } from '../ui/ThemeToggle'

// "inicio" se observa para que ningún link quede marcado mientras se ve el hero.
const sectionIds = ['inicio', ...navItems.map((item) => item.id)]

export function Header({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(sectionIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Subrayado "a mano" que se dibuja en el link activo o al pasar el mouse.
  const linkClass = (id: string) =>
    `group relative inline-flex min-h-11 items-center px-3 text-sm font-medium transition-colors ${
      active === id ? 'text-ink' : 'text-muted hover:text-ink'
    }`

  const underline = (id: string) => (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      className={`absolute right-3 bottom-2 left-3 h-1.5 overflow-visible text-rose transition-[clip-path] duration-500 ease-[var(--ease-soft)] ${
        active === id ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)]'
      }`}
    >
      <path d="M1 5 C 25 2, 55 7, 99 3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled || open ? 'border-b border-line bg-paper/85 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <a
        href="#contenido"
        className="sr-only rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#inicio" className="font-serif text-lg tracking-tight">
          {name}
          <span className="text-rose">.</span>
        </a>

        <div className="flex items-center gap-1">
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={linkClass(item.id)} aria-current={active === item.id ? 'true' : undefined}>
                    {item.label}
                    {underline(item.id)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            className="grid size-11 place-items-center rounded-full hover:bg-ink/5 md:hidden"
          >
            {open ? <FiX aria-hidden="true" className="size-6" /> : <FiMenu aria-hidden="true" className="size-6" />}
            <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>
        </div>
      </div>

      <nav id="menu-movil" aria-label="Principal" hidden={!open} className="border-t border-line px-4 pt-2 pb-6 md:hidden">
        <ul className="flex flex-col">
          {navItems.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-b border-line py-4 font-serif text-2xl"
                aria-current={active === item.id ? 'true' : undefined}
              >
                <span className="text-sm text-rose-deep italic">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
