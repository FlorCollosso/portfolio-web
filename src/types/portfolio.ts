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

/** La nota escondida entre los libros del inicio */
export interface SecretNote {
  greeting: string
  body: string[]
  signature: string
  postscript?: string
}

/** Cuadritos de las gatitas en el estante de abajo del inicio */
export interface PetPortrait {
  id: string
  name: string
  /** Frase corta de la notita que aparece al tocar el cuadro */
  note: string
  /**
   * Foto real (opcional). Ruta base sin sufijo, igual que los proyectos:
   * "/images/gatitas/micha" → micha-640.webp. Si no hay foto, se muestra un retrato ilustrado.
   */
  photo?: ResponsiveImage
  /** Colores del retrato ilustrado (mientras no haya foto) */
  fur: string
  /** Color de las manchas o rayitas del pelaje */
  patch?: string
  /** Dibujo del pelaje: una mancha sobre un ojo, o "smoking" (hocico y pechito claros) */
  markings?: 'patch' | 'tuxedo'
  eyes: string
}

export interface PortfolioData {
  profile: Profile
  projects: Project[]
  experience: TimelineItem[]
  education: TimelineItem[]
  skills: SkillGroup[]
  languages: string[]
  secretNote: SecretNote
  pets: PetPortrait[]
}
