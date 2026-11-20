import { useState } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Experience } from './components/sections/Experience'
import { Hero } from './components/sections/Hero'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'
import { ProjectModal } from './components/ui/ProjectModal'
import { usePortfolioData } from './i18n/usePortfolioData'

export default function App() {
  const { profile, projects, experience, education, skills, languages, secretNote, pets } = usePortfolioData()
  // Un solo modal de proyecto: se abre desde la biblioteca del inicio o desde la sección de proyectos.
  // Se guarda el id (no el objeto) para que, si cambia el idioma con el modal abierto, se traduzca también.
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = projects.find((p) => p.id === selectedId) ?? null
  const open = (project: { id: string }) => setSelectedId(project.id)
  const studying = education.find((e) => e.ongoing)

  return (
    <>
      <Header name={profile.name} />
      <main id="contenido">
        <Hero profile={profile} projects={projects} note={secretNote} pets={pets} onOpenProject={open} />
        <About profile={profile} languages={languages} studying={studying} />
        <Projects projects={projects} onOpen={open} />
        <Skills skills={skills} languages={languages} />
        <Experience experience={experience} education={education} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
      <ProjectModal project={selected} onClose={() => setSelectedId(null)} />
    </>
  )
}
