import type { ProjectCategory } from '../types/portfolio'

export const categoryLabels: Record<ProjectCategory, string> = {
  web: 'Diseño y desarrollo web',
  ux: 'UX/UI',
  brand: 'Identidad gráfica',
}

export const navItems = [
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'contacto', label: 'Contacto' },
]
