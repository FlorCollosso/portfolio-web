import { LANGS, useI18n } from '../../i18n/useI18n'

// Selector ES | EN: dos botones con estado presionado. El activo va en tinta con un trazo rosa
// "a mano" debajo (el mismo gesto que el link activo del menú); el otro queda en gris.
export function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n()

  return (
    <div role="group" aria-label={t('lang.label')} className={`flex items-center ${className}`}>
      {LANGS.map((code, i) => {
        const active = lang === code
        return (
          <span key={code} className="flex items-center">
            {i > 0 && (
              <span aria-hidden="true" className="h-3.5 w-px rotate-12 bg-ink/25" />
            )}
            <button
              type="button"
              lang={code}
              onClick={() => setLang(code)}
              aria-pressed={active}
              aria-label={t(`lang.${code}`)}
              title={t(`lang.${code}`)}
              className={`group relative grid h-11 min-w-9 place-items-center rounded-full px-1.5 text-xs font-semibold tracking-[0.12em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose-deep ${
                active ? 'text-ink' : 'text-muted hover:bg-ink/5 hover:text-ink'
              }`}
            >
              {code.toUpperCase()}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 6"
                className={`absolute inset-x-2 bottom-2 h-1.5 overflow-visible text-rose transition-[clip-path] duration-500 ease-[var(--ease-soft)] ${
                  active ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_100%_0_0)]'
                }`}
                preserveAspectRatio="none"
              >
                <path d="M1 4 C 7 1.5, 15 5, 23 2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
            </button>
          </span>
        )
      })}
    </div>
  )
}
