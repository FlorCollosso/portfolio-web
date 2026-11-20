import { useEffect, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { navItems } from '../../data/labels'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useI18n } from '../../i18n/useI18n'
import { LangSwitch } from '../ui/LangSwitch'
import { ThemeToggle } from '../ui/ThemeToggle'

// "inicio" se observa para que ningún link quede marcado mientras se ve el hero.
const sectionIds = ['inicio', ...navItems]

// Ancho desde el que entra el menú completo con aire, medido con el idioma más largo (español):
// logo + separación + 5 links + filete + ES|EN + lámpara ≈ 54rem, más los márgenes de la página.
// Por debajo, menú compacto (hamburguesa) en vez de apretar los links. Si cambia, cambiar también min-[64rem] abajo.
const WIDE = '(min-width: 64rem)'

// Subrayado "a mano": vive dentro del texto del link, así mide lo mismo que la palabra (en cualquier idioma)
// y no incluye el padding del área táctil.
function HandUnderline({ on }: { on: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      className={`absolute inset-x-0 -bottom-1.5 h-1.5 w-full overflow-visible text-rose transition-[clip-path] duration-500 ease-[var(--ease-soft)] ${
        on
          ? '[clip-path:inset(-2px_0_-2px_0)]'
          : '[clip-path:inset(-2px_100%_-2px_0)] group-hover:[clip-path:inset(-2px_0_-2px_0)] group-focus-visible:[clip-path:inset(-2px_0_-2px_0)]'
      }`}
    >
      <path d="M1 5 C 25 2, 55 7, 99 3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function Header({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(sectionIds)
  const { t } = useI18n()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // El menú compacto se cierra con Escape y también si la ventana se agranda hasta el menú completo
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const wide = window.matchMedia(WIDE)
    const onWide = () => wide.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    wide.addEventListener('change', onWide)
    return () => {
      window.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  return (
    <header
      // Con el menú abierto el fondo aparece de inmediato (si no, el texto de la página se ve a través del panel)
      className={`fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] ${open ? '' : 'transition-all duration-500'} ${
        scrolled || open ? 'border-b border-line bg-paper/85 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <a
        href="#contenido"
        className="sr-only rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        {t('header.skip')}
      </a>

      {/* Logo | (aire mínimo garantizado) | navegación · filete · idioma · lámpara · menú compacto */}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-[max(1rem,env(safe-area-inset-left))] sm:gap-10 sm:px-6">
        <a href="#inicio" className="shrink-0 font-serif text-lg tracking-tight whitespace-nowrap">
          {name}
          <span className="text-rose">.</span>
        </a>

        <div className="flex min-w-0 items-center">
          <nav aria-label={t('header.nav')} className="hidden min-[64rem]:block">
            <ul className="flex items-center gap-1">
              {navItems.map((id) => {
                const on = active === id
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      aria-current={on ? 'true' : undefined}
                      className={`group inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose-deep ${
                        on ? 'text-ink' : 'text-muted hover:text-ink'
                      }`}
                    >
                      <span className="relative">
                        {t(`nav.${id}`)}
                        <HandUnderline on={on} />
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Controles: separados de la navegación por un filete y un poco de aire */}
          <span aria-hidden="true" className="mx-4 hidden h-5 w-px bg-line min-[64rem]:block" />
          {/* Sin gap: cada control ya trae su área táctil de 44 px con aire propio */}
          <div className="flex items-center">
            <LangSwitch className="mr-1 hidden min-[23.4rem]:flex" />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              className="grid size-11 place-items-center rounded-full transition-colors hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose-deep min-[64rem]:hidden"
            >
              {open ? <FiX aria-hidden="true" className="size-6" /> : <FiMenu aria-hidden="true" className="size-6" />}
              <span className="sr-only">{open ? t('header.menuClose') : t('header.menuOpen')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menú compacto: panel desplegable con los links numerados como un índice */}
      <nav
        id="menu-movil"
        aria-label={t('header.nav')}
        hidden={!open}
        className="max-h-[calc(100dvh-4rem-env(safe-area-inset-top))] overflow-y-auto overscroll-contain border-t border-line px-[max(1rem,env(safe-area-inset-left))] pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 min-[64rem]:hidden"
      >
        <ul className="mx-auto flex max-w-6xl flex-col">
          {navItems.map((id, i) => {
            const on = active === id
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  aria-current={on ? 'true' : undefined}
                  className={`group flex min-h-14 items-baseline gap-4 border-b border-line py-4 font-serif text-2xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose-deep ${
                    on ? 'text-ink' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  <span className={`text-sm italic ${on ? 'text-rose-deep' : 'text-muted'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="relative">
                    {t(`nav.${id}`)}
                    <HandUnderline on={on} />
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
        {/* En pantallas muy angostas el selector no entra en la barra: queda acá, con su nombre */}
        <div className="mx-auto flex max-w-6xl items-center justify-between pt-4 min-[23.4rem]:hidden">
          <span className="font-serif text-sm text-muted italic">{t('lang.label')}</span>
          <LangSwitch />
        </div>
      </nav>
    </header>
  )
}
