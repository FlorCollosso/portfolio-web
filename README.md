# Portfolio · Florencia Collosso

Portfolio personal reconstruido desde cero con **React 19, TypeScript, Vite y Tailwind CSS v4**. Reemplaza la versión anterior en Angular + Spring Boot (Argentina Programa).

## Cómo levantarlo

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:5173
npm run build      # compila a /dist
npm run preview    # sirve la versión compilada
npm run lint       # revisa el código con oxlint
```

## Estructura

```
portfolio/
├── public/
│   ├── cv/CV_Florencia_Collosso.pdf      # CV descargable (reemplazar por la versión nueva)
│   ├── images/                            # WebP optimizados en 640 y 1280 px
│   │   ├── profile-img-{640,1280}.webp
│   │   └── projects/*.webp
│   └── favicon.svg
├── scripts/
│   └── optimize-images.mjs                # JPG/PNG originales → WebP livianos
└── src/
    ├── data/
    │   ├── portfolioData.ts               # TODO el contenido del sitio
    │   └── labels.ts                      # navegación y nombres de categorías
    ├── types/portfolio.ts                 # contrato de datos (listo para un CMS)
    ├── hooks/
    │   ├── useActiveSection.ts            # marca la sección visible en el menú
    │   └── useInView.ts                   # dispara las animaciones de aparición
    ├── components/
    │   ├── layout/   Header, Footer
    │   ├── sections/ Hero, Projects, About, Experience, Skills, Contact
    │   └── ui/       Section, Reveal, ProjectCard, ProjectCover, ProjectModal,
    │                 ResponsiveImage, ButtonLink, Tag, SocialIcon
    ├── App.tsx
    ├── main.tsx
    └── index.css                          # tokens de color y tipografía (@theme)
```

## Cómo editar el contenido

Todo el texto vive en `src/data/portfolioData.ts`; los componentes solo lo leen.

- **Agregar un proyecto:** sumá un objeto al array `projects`. Con `featured: true` aparece arriba, en grande.
- **Agregar imágenes:** poné los originales en una carpeta y corré:

  ```bash
  node scripts/optimize-images.mjs ./originales public/images/projects
  ```

  Después referencialas sin sufijo: `image: { base: '/images/projects/mi-imagen', alt: '…' }`.
  Si el recorte corta algo importante, sumá `position` (por ejemplo `'left center'`, como en Spark).
  Si un proyecto no tiene imagen, se muestra una portada tipográfica con los colores de marca.
- **Pasar a un CMS:** reemplazá el import de `portfolioData` por un fetch que devuelva objetos con la forma de `src/types/portfolio.ts`.

## La biblioteca del inicio

El inicio es un estudio ilustrado (`src/components/scene/`): cada libro con título, cada cuadro, el portarretratos y la postal abren un proyecto; el cuaderno descarga el CV.

- **Mover proyectos en la escena:** `src/data/scene.ts` define qué proyecto va en cada libro o cuadro, con posiciones en una grilla de 600 × 660.
- **Lámpara:** cambia entre modo día y noche (`src/hooks/useTheme.ts`); el tema se guarda en el navegador y respeta la preferencia del sistema en la primera visita.
- **Gato:** `Cat.tsx`. Sigue el cursor, parpadea, mira el libro señalado, se duerme tras ~20 s sin actividad y ronronea si lo tocás.
- **Nota secreta:** el texto está en `secretNote`, dentro de `portfolioData.ts`.
- Con "reducir movimiento" activado, el gato y la escena se quedan quietos y el cambio de tema es instantáneo.

La versión anterior del sitio quedó guardada en `_respaldo-version-anterior/` (se puede borrar cuando ya no haga falta).

## Qué cambió respecto a la versión anterior

| Antes (Angular + Spring Boot) | Ahora |
| --- | --- |
| Contenido en un backend en Render que hoy no responde: el sitio quedaba vacío | Datos locales tipados, sin servidor |
| Build de 36 MB: JPG de hasta 9,6 MB y 7360 px, video de portada de 8 MB | Build de 1,1 MB; imágenes en WebP de 13 a 165 KB |
| Unos 25 MB de imágenes publicadas sin uso directo en el código | Solo se publica lo que se usa |
| jsPDF + html2canvas para generar el CV en el navegador (bundle principal de 1,1 MB) | PDF estático; JS de 80 KB comprimido |
| Panel de login y edición dentro del sitio público | Eliminado: se edita el archivo de datos |
| Íconos SVG/PNG cargados a mano, Google Fonts con 18 pesos + Typekit | `react-icons` y Libre Franklin variable autoalojada |
| Fondos `background-attachment: fixed` (fallan en celular) y tamaños en `vw` | Layout responsive con Tailwind, probado a 375 px |
| Barras de porcentaje de habilidades | Habilidades agrupadas por disciplina |

## Accesibilidad

- Link "Saltar al contenido", navegación por teclado y foco visible.
- Modal con `<dialog>` nativo: atrapa el foco, cierra con Escape y devuelve el foco a la tarjeta.
- Menú móvil con `aria-expanded` y cierre con Escape.
- Colores de texto con contraste AA (variantes `*-deep` de la paleta).
- Respeta "reducir movimiento" del sistema: sin animaciones ni scroll suave.
- Todas las imágenes con texto alternativo descriptivo.

## Pendiente

- [x] Agregar portadas reales para MR Obras, Rodanteros, Spark y Magic Bloom (`public/images/projects`).
- [ ] Reemplazar `public/cv/CV_Florencia_Collosso.pdf` por el CV nuevo.
- [ ] Completar el resumen de Magic Bloom y el detalle del trabajo en el Ministerio.
