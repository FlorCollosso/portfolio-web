import { useTheme } from '../../hooks/useTheme'

// Interruptor compacto del header: la misma lámpara de la escena, en miniatura.
export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const on = theme === 'dark'

  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
      aria-pressed={on}
      aria-label={on ? 'Volver al modo día' : 'Activar el modo noche'}
      title={on ? 'Modo día' : 'Modo noche'}
      className="group grid size-11 place-items-center rounded-full transition-colors hover:bg-ink/5"
    >
      <svg viewBox="0 0 24 24" className="size-6 overflow-visible" aria-hidden="true">
        <circle cx="12" cy="15.5" r="7" fill="#ffd79a" className="opacity-0 blur-[3px] transition-opacity duration-500 dark:opacity-80" />
        <line x1="12" y1="0" x2="12" y2="7" className="stroke-ink-soft" strokeWidth="1.2" />
        <path d="M4.5 15 C 5 10.5, 8 8, 12 8 C 16 8, 19 10.5, 19.5 15 Z" fill="#2c5a58" className="origin-top transition-transform duration-500 group-hover:rotate-6" />
        <circle cx="12" cy="15.6" r="2.2" className="fill-[#efe6d6] transition-colors dark:fill-[#fff4d6]" />
      </svg>
    </button>
  )
}
