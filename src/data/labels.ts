import type { ProjectCategory } from '../types/portfolio'

export const categoryLabels: Record<ProjectCategory, string> = {
  web: 'Diseño y desarrollo web',
  ux: 'UX/UI',
  brand: 'Identidad gráfica',
}

export const navItems = [
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'herramientas', label: 'Herramientas' },
  { id: 'trayectoria', label: 'Trayectoria' },
  { id: 'contacto', label: 'Contacto' },
]
