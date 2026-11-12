// Contrato de datos del portfolio. Si mañana los datos vienen de un CMS o una API,
// alcanza con devolver objetos con esta forma: los componentes no cambian.

export type SocialId = 'linkedin' | 'github' | 'behance' | 'email'

export interface SocialLink {
  id: SocialId
  label: string
  url: string
}

export interface Profile {
  name: string
  role: string
  location: string
  email: string
  headline: string
  summary: string
  about: string[]
  photo: ResponsiveImage
  cvUrl: string
  socials: SocialLink[]
}

export interface ResponsiveImage {
  /** Ruta base sin sufijo de ancho, p. ej. "/images/projects/ocha-mockup" → -640.webp y -1280.webp */
  base: string
  alt: string
  /** Punto de encuadre al recortar (object-position), p. ej. "left" o "70% center". Por defecto, centrado. */
  position?: string
}

export type ProjectCategory = 'web' | 'ux' | 'brand'

export interface ProjectLinks {
  live?: string
  code?: string
  caseStudy?: string
  prototype?: string
}

export interface Project {
  id: string
  title: string
  category: ProjectCategory
  year?: string
  summary: string
  role: string
  /** Contexto o problema que resolvía el proyecto */
  challenge?: string
  /** Pasos o decisiones del proceso, en orden */
  process?: string[]
  highlights?: string[]
  tags: string[]
  image?: ResponsiveImage
  /** Color de la portada de respaldo cuando todavía no hay imagen */
  accent?: 'teal' | 'rose' | 'ink'
  links: ProjectLinks
  featured?: boolean
}

export interface TimelineItem {
  id: string
  title: string
  organization: string
  period: string
  location?: string
  bullets?: string[]
  tags?: string[]
}

export interface SkillGroup {
  id: string
  title: string
  items: string[]
}

export interface PortfolioData {
  profile: Profile
  projects: Project[]
  experience: TimelineItem[]
  education: TimelineItem[]
  skills: SkillGroup[]
  languages: string[]
}
