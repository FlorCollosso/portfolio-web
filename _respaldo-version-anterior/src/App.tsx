import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Experience } from './components/sections/Experience'
import { Hero } from './components/sections/Hero'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'
import { portfolioData } from './data/portfolioData'

export default function App() {
  const { profile, projects, experience, education, skills, languages } = portfolioData

  return (
    <>
      <Header name={profile.name} />
      <main id="contenido">
        <Hero profile={profile} />
        <Projects projects={projects} />
        <About profile={profile} languages={languages} />
        <Experience experience={experience} education={education} />
        <Skills skills={skills} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  )
}
