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
import { portfolioData } from './data/portfolioData'
import type { Project } from './types/portfolio'

export default function App() {
  const { profile, projects, experience, education, skills, languages, secretNote, pets } = portfolioData
  // Un solo modal de proyecto: se abre desde la biblioteca del inicio o desde la sección de proyectos.
  const [selected, setSelected] = useState<Project | null>(null)
  const studying = education.find((e) => e.period === 'En curso')

  return (
    <>
      <Header name={profile.name} />
      <main id="contenido">
        <Hero profile={profile} projects={projects} note={secretNote} pets={pets} onOpenProject={setSelected} />
        <About profile={profile} languages={languages} studying={studying} />
        <Projects projects={projects} onOpen={setSelected} />
        <Skills skills={skills} languages={languages} />
        <Experience experience={experience} education={education} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  )
}
