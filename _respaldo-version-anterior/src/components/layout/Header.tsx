import { useEffect, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { navItems } from '../../data/labels'
import { useActiveSection } from '../../hooks/useActiveSection'

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

  const linkClass = (id: string) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      active === id ? 'bg-ink text-paper' : 'text-ink-soft hover:bg-ink/5'
    }`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
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
        <a href="#inicio" className="text-base font-extrabold tracking-tight">
          {name}
          <span className="text-rose">.</span>
        </a>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={linkClass(item.id)} aria-current={active === item.id ? 'true' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

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

      <nav
        id="menu-movil"
        aria-label="Principal"
        hidden={!open}
        className="border-t border-line px-4 pt-2 pb-6 md:hidden"
      >
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className={`block ${linkClass(item.id)} py-3 text-base`}
                aria-current={active === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
