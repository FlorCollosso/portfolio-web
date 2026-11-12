import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

// El tema vive en <html data-theme="…">: así el CSS lo lee sin esperar a React
// y el script de index.html lo aplica antes del primer pintado.

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'fc-theme'
const listeners = new Set<() => void>()

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#14151b' : '#f7f6f5')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Sin almacenamiento (modo privado): el tema dura lo que dure la visita.
  }
  listeners.forEach((l) => l())
}

/** Cambia el tema. Si se pasa un origen, la luz nueva se expande en círculo desde ahí. */
export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!document.startViewTransition || reduced) {
    applyTheme(next)
    return
  }

  const x = origin?.x ?? window.innerWidth / 2
  const y = origin?.y ?? 0
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

  const transition = document.startViewTransition(() => flushSync(() => applyTheme(next)))
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 950, easing: 'cubic-bezier(0.65, 0, 0.25, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
    .catch(() => {})
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'light' as Theme)
  return { theme, toggle: toggleTheme }
}
