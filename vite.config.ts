import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { existsSync, readdirSync } from 'node:fs'
import { defineConfig } from 'vite'

// PDF disponibles en public/cv/: el sitio elige el CV de cada idioma sin arriesgar enlaces rotos (src/data/cv.ts).
const cvFiles = existsSync('public/cv') ? readdirSync('public/cv').filter((f) => f.endsWith('.pdf')) : []

// Imágenes y videos de los casos de estudio: solo se muestran los que existen (src/components/case-study/mediaResolver.ts).
const projectsDir = 'public/images/projects'
const caseStudyFiles = existsSync(projectsDir)
  ? readdirSync(projectsDir, { recursive: true, encoding: 'utf8' })
      .map((f) => f.replaceAll('\\', '/'))
      .filter((f) => /\.(webp|mp4)$/.test(f))
  : []

// https://vite.dev/config/
export default defineConfig({
  // El workflow de GitHub Pages define BASE_PATH según el nombre del repo.
  base: process.env.BASE_PATH ?? '/',
  define: { __CV_FILES__: JSON.stringify(cvFiles), __CASE_STUDY_FILES__: JSON.stringify(caseStudyFiles) },
  plugins: [react(), tailwindcss()],
})
