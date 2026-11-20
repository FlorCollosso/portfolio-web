import type { PortfolioData, Project, TimelineItem } from '../types/portfolio'
import { portfolioData as es } from './portfolioData'

// English version of the content. It reuses everything that doesn't change between languages
// (ids, links, images, tags, brand names) and only overrides the text, matched by id.
// To edit a translation, change it here; to add a project, add it to portfolioData.ts and give it an entry below.

type ProjectText = Pick<Project, 'summary' | 'role'> & Partial<Pick<Project, 'title' | 'year' | 'challenge' | 'process' | 'highlights' | 'tags'>> & { alt?: string }
type TimelineText = Partial<Pick<TimelineItem, 'title' | 'organization' | 'period' | 'bullets'>>

const projects: Record<string, ProjectText> = {
  'mr-obras': {
    year: '2024 – present',
    summary: 'Corporate website for a construction company in Córdoba that specializes in steel framing and dry construction.',
    role: 'UX/UI design and frontend development',
    challenge: 'The company needed to show its services, past builds and home models, and receive quote requests from mobile phones.',
    process: [
      'Content architecture and prototype in Figma',
      'Built with React, TypeScript, Vite and Tailwind CSS',
      '360° tours of finished builds with Photo Sphere Viewer',
      'Section-based navigation with React Router',
    ],
    highlights: ['Titles and meta descriptions written with search engines in mind', 'Alt text on every image', 'Responsive design, mobile first'],
    alt: 'Laptop on a brick wall at a steel-framing construction site, showing the MR Obras homepage',
  },
  rodanteros: {
    summary: 'An app for people traveling in motorhomes, vans and campers: plan routes, discover places and connect with other travelers.',
    role: 'Research, UX/UI design and prototyping',
    challenge: 'People who travel in RVs don’t have one platform that gathers the information they actually need for that kind of trip.',
    process: [
      'Competitive analysis based on real reviews from Google Maps and Lambus',
      'User personas and points of view (POV)',
      'Storyboard and user flows',
      'Wireframes and a clickable prototype based on Material Design',
    ],
    alt: 'Rodanteros cover: an RV on a road through the woods and a phone showing the app’s feed and map',
  },
  spark: {
    summary: 'An app that helps creative people through creative blocks with short challenges, turning creativity into a daily habit.',
    role: 'UX/UI design and prototyping',
    process: ['Research', 'Problem definition', 'Ideation', 'Prototyping', 'User testing'],
    tags: ['Figma', 'Prototyping', 'Usability testing'],
    alt: 'Spark cover: the green logo on a black background and three phones showing the sign-in screen and creative challenges',
  },
  'magic-bloom': {
    summary: 'Brand identity.',
    role: 'Identity design',
    alt: 'Magic Bloom logo in white over a purple night landscape with mountains and glowing flowers',
  },
  ocha: {
    title: 'O’Cha, tea house',
    summary: 'Cards and an invitation for the opening of a tea house in Güemes, Córdoba.',
    role: 'Graphic design',
    alt: 'Three O’Cha cards: one with a torii cut out over tea leaves, an invitation with photos, and one with a green tea texture',
  },
  'al-borde-llama': {
    summary: 'Product catalog for llama-wool rugs and cushions, designed in Argentina.',
    role: 'Editorial design',
    alt: 'Open Al Borde Llama catalog with photos of rugs, a llama and price tables',
  },
  fpfix: {
    summary: 'Logo for a phone repair service.',
    role: 'Identity design',
    alt: 'Embossed FPfix logo: the letters F and P in a blue gradient and a phone with a wrench',
  },
  crafting: {
    summary: 'Thank-you card for a small handmade goods business.',
    role: 'Graphic design',
    alt: 'Orange card with the Crafting logo, and its back with the message “Muchas gracias” (thank you very much)',
  },
}

const experience: Record<string, TimelineText> = {
  'mr-obras': {
    title: 'UX/UI Designer & Frontend Developer',
    period: 'Dec 2024 – present',
    bullets: [
      'Designed and built the corporate website mrobras.com.ar, from the Figma prototype to the code.',
      'Implemented 360° tours of builds and section-based navigation with React Router.',
      'Design graphic pieces and digital advertising and social media campaigns.',
    ],
  },
  ministerio: {
    title: 'Web Developer & Designer',
    organization: 'Ministerio de Desarrollo Social (Ministry of Social Development)',
    period: 'Apr 2023 – Sep 2023',
    bullets: [
      'Prototyped interfaces for the team’s application.',
      'Built layouts and implemented CSS styles in a React application.',
      'Adjusted and improved existing components together with the development team.',
    ],
  },
}

const education: Record<string, TimelineText> = {
  coderhouse: { title: 'UX/UI Development Program' },
  'argentina-programa': { title: 'Full Stack Web Developer (Jr.)' },
  ies: { title: 'Associate Degree in Graphic and Advertising Design', period: 'In progress' },
}

const skillTitles: Record<string, string> = {
  graphic: 'Graphic design & motion',
  tools: 'Tools',
}
const skillItems: Record<string, string> = { Prototipado: 'Prototyping' }

const pick = <T extends { id: string }, O extends object>(items: T[], overrides: Record<string, O>, map: (item: T, o: O) => T) =>
  items.map((item) => (overrides[item.id] ? map(item, overrides[item.id]) : item))

export const portfolioDataEn: PortfolioData = {
  ...es,
  profile: {
    ...es.profile,
    role: 'UX/UI Designer and Frontend Developer',
    headline: 'I design interfaces in Figma and ship them with React.',
    summary:
      'I bring a graphic designer’s eye to frontend development: I research, prototype and build digital products that are clear, accessible and responsive.',
    about: [
      'I’m a UX/UI designer and frontend developer based in Córdoba, Argentina. I come from graphic design, and it shows in how I care for typography, color and visual hierarchy.',
      'I trained in full stack web development at Argentina Programa and in UX/UI at Coderhouse. Today I design and build the MR Obras website end to end: from the Figma prototype to the React and TypeScript code.',
      'I’m drawn to teams where design and development work together from day one, because that’s where I do my best work.',
    ],
    photo: { ...es.profile.photo, alt: 'Florencia Collosso smiling, wearing a light blue blazer' },
  },
  projects: pick(es.projects, projects, (p, o) => ({
    ...p,
    ...o,
    image: p.image && o.alt ? { ...p.image, alt: o.alt } : p.image,
  })),
  experience: pick(es.experience, experience, (item, o) => ({ ...item, ...o })),
  education: pick(es.education, education, (item, o) => ({ ...item, ...o })),
  skills: es.skills.map((group) => ({
    ...group,
    title: skillTitles[group.id] ?? group.title,
    items: group.items.map((item) => skillItems[item] ?? item),
  })),
  languages: ['Spanish (native)', 'English (intermediate, B1)'],
  secretNote: {
    greeting: 'Hello, curious one:',
    body: [
      'If you found this note, we’re probably alike: you notice the details almost nobody looks at.',
      'I put this corner together with things I love: books that keep piling up, warm light, and a cat that sits right on top of whatever you’re working on. To me, that’s what design is: caring about how it feels to be somewhere, even when that somewhere is a screen.',
      'Thanks for sticking around a little longer.',
    ],
    signature: 'Flor',
    postscript: 'P.S.: the cat still doesn’t have a name. Suggestions welcome by email.',
  },
  pets: es.pets.map((pet) =>
    pet.id === 'micha'
      ? {
          ...pet,
          note: 'Expert in sunny naps and in purring right when a video call starts.',
          photo: { ...pet.photo, alt: 'Micha, my orange cat, lying on a blanket' },
        }
      : pet.id === 'nami'
        ? {
            ...pet,
            note: 'Head of quality control: if she hasn’t sat on the keyboard, the design isn’t approved.',
            photo: { ...pet.photo, alt: 'Nami, my gray cat, sitting on the desk' },
          }
        : pet,
  ),
}
