import type { PortfolioData } from '../types/portfolio'

// Única fuente de contenido del sitio. Para editar textos, proyectos o links,
// se cambia este archivo; los componentes solo leen.

export const portfolioData: PortfolioData = {
  profile: {
    name: 'Florencia Collosso',
    role: 'Diseñadora UX/UI y Desarrolladora Frontend',
    location: 'Córdoba, Argentina',
    email: 'florcollosso@gmail.com',
    headline: 'Diseño interfaces en Figma y las llevo a producción con React.',
    summary:
      'Combino criterio visual de diseñadora gráfica con desarrollo frontend: investigo, prototipo y construyo productos digitales claros, accesibles y responsivos.',
    about: [
      'Soy diseñadora UX/UI y desarrolladora frontend en Córdoba. Vengo del diseño gráfico, y eso se nota en cómo cuido la tipografía, el color y la jerarquía visual.',
      'Me formé en desarrollo web full stack en Argentina Programa y en UX/UI en Coderhouse. Hoy diseño y desarrollo el sitio de MR Obras, de punta a punta: del prototipo en Figma al código en React y TypeScript.',
      'Me interesan los equipos donde diseño y desarrollo trabajan juntos desde el principio, porque ahí es donde mejor funciono.',
    ],
    photo: { base: '/images/profile-img', alt: 'Florencia Collosso sonriendo, con un saco celeste' },
    cvUrl: '/cv/CV_Florencia_Collosso.pdf',
    socials: [
      { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/florencia-collosso/' },
      { id: 'github', label: 'GitHub', url: 'https://github.com/FlorCollosso' },
      { id: 'behance', label: 'Behance', url: 'https://www.behance.net/florcollos491e' },
    ],
  },

  projects: [
    {
      id: 'mr-obras',
      title: 'MR Obras',
      category: 'web',
      year: '2024 – actualidad',
      summary:
        'Sitio corporativo para una constructora de Córdoba especializada en steel framing y construcción en seco.',
      role: 'Diseño UX/UI y desarrollo frontend',
      challenge:
        'La empresa necesitaba mostrar sus servicios, obras y tipologías de vivienda, y recibir pedidos de presupuesto desde el celular.',
      process: [
        'Arquitectura de contenidos y prototipo en Figma',
        'Desarrollo con React, TypeScript, Vite y Tailwind CSS',
        'Recorridos 360° de obras terminadas con Photo Sphere Viewer',
        'Navegación por secciones con React Router',
      ],
      highlights: [
        'Títulos y meta descripciones pensados para buscadores',
        'Texto alternativo en todas las imágenes',
        'Diseño responsive, priorizando el uso en celular',
      ],
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Figma'],
      image: {
        base: '/images/projects/mr-obras',
        alt: 'Notebook sobre un muro de ladrillos en una obra de steel framing, mostrando la portada del sitio de MR Obras',
        position: '65% center',
      },
      accent: 'teal',
      links: {
        live: 'https://mrobras.com.ar',
        code: 'https://github.com/FlorCollosso/web-mr-obras',
      },
      featured: true,
    },
    {
      id: 'rodanteros',
      title: 'Rodanteros',
      category: 'ux',
      year: '2025',
      summary:
        'App para viajeros en motorhomes, vans y campers: planificar rutas, descubrir lugares y conectar con otros viajeros.',
      role: 'Investigación, diseño UX/UI y prototipado',
      challenge:
        'Quienes viajan en casas rodantes no tienen una plataforma que centralice información útil para su tipo de viaje.',
      process: [
        'Análisis de competencia a partir de reseñas reales de Google Maps y Lambus',
        'User personas y puntos de vista (POV)',
        'Storyboard y flujos de usuario',
        'Wireframes y prototipo navegable basado en Material Design',
      ],
      tags: ['Design Thinking', 'Figma', 'Material Design', 'User research'],
      image: {
        base: '/images/projects/rodanteros',
        alt: 'Portada de Rodanteros: una casa rodante en una ruta entre bosques y un celular con el feed y el mapa de la app',
      },
      accent: 'rose',
      links: {
        caseStudy: 'https://florcollosso.myportfolio.com/rodanteros-proyecto-final-de-diseno-uxui-coderhouse',
        prototype:
          'https://www.figma.com/proto/BVsRtO0phklPSM1YxWMmwA/Rodanteros-Prototipo?node-id=182-3225&starting-point-node-id=182%3A3225',
      },
      featured: true,
    },
    {
      id: 'spark',
      title: 'Spark',
      category: 'ux',
      year: '2025',
      summary:
        'App que acompaña a personas creativas en momentos de bloqueo con retos breves, para convertir la creatividad en un hábito diario.',
      role: 'Diseño UX/UI y prototipado',
      process: ['Investigación', 'Definición del problema', 'Ideación', 'Prototipado', 'Testeo con usuarios'],
      tags: ['Figma', 'Prototipado', 'Testeo de usabilidad'],
      image: {
        base: '/images/projects/spark',
        alt: 'Portada de Spark: el logo en verde sobre fondo negro y tres celulares con la pantalla de inicio de sesión y retos creativos',
        position: 'left center',
      },
      accent: 'ink',
      links: {
        caseStudy: 'https://florcollosso.myportfolio.com/trabajo-final-spark-prototipado-coderhouse',
        prototype:
          'https://www.figma.com/proto/Zz2qMaKB7aYvyGVqhPx2NG/Spark-App?node-id=281-3528&starting-point-node-id=449%3A2526',
      },
      featured: true,
    },
    {
      id: 'magic-bloom',
      title: 'Magic Bloom',
      category: 'brand',
      year: '2024',
      summary: 'Identidad visual de marca.',
      role: 'Diseño de identidad',
      tags: ['Branding', 'Illustrator'],
      image: {
        base: '/images/projects/magic-bloom',
        alt: 'Logotipo de Magic Bloom en blanco sobre un paisaje nocturno violeta con montañas y flores luminosas',
      },
      accent: 'rose',
      links: { caseStudy: 'https://florcollosso.myportfolio.com/magic-bloom-proyecto-final-coderhouse' },
    },
    {
      id: 'ocha',
      title: "O'Cha, casa de té",
      category: 'brand',
      year: '2022',
      summary: 'Tarjetas e invitación para la inauguración de una casa de té en barrio Güemes, Córdoba.',
      role: 'Diseño gráfico',
      tags: ['Editorial', 'Illustrator', 'Photoshop'],
      image: {
        base: '/images/projects/ocha-mockup',
        alt: "Tres tarjetas de O'Cha: una con un torii recortado sobre hojas de té, una invitación con fotos y una con textura de té verde",
      },
      links: { caseStudy: 'https://florcollosso.myportfolio.com/tarjetas-de-evento-para-casa-de-te-trabajo-practico' },
    },
    {
      id: 'al-borde-llama',
      title: 'Al Borde Llama',
      category: 'brand',
      summary: 'Catálogo de productos en lana de llama: alfombras y almohadones de diseño argentino.',
      role: 'Diseño editorial',
      tags: ['Editorial', 'InDesign'],
      image: {
        base: '/images/projects/catalogo-al-borde-llama',
        alt: 'Catálogo abierto de Al Borde Llama con fotos de alfombras, una llama y tablas de precios',
      },
      links: {},
    },
    {
      id: 'fpfix',
      title: 'FPfix',
      category: 'brand',
      summary: 'Logotipo para un servicio técnico de celulares.',
      role: 'Diseño de identidad',
      tags: ['Branding', 'Illustrator'],
      image: {
        base: '/images/projects/fpfix-logo-mockup',
        alt: 'Logo de FPfix en relieve: letras F y P con degradé azul y un celular con una llave',
      },
      links: {},
    },
    {
      id: 'crafting',
      title: 'Crafting',
      category: 'brand',
      summary: 'Tarjeta de agradecimiento para un emprendimiento de productos hechos a mano.',
      role: 'Diseño gráfico',
      tags: ['Branding', 'Photoshop'],
      image: {
        base: '/images/projects/crafting-business-card',
        alt: 'Tarjeta naranja con el logo de Crafting y su reverso con el mensaje "Muchas gracias"',
      },
      links: {},
    },
  ],

  experience: [
    {
      id: 'mr-obras',
      title: 'Diseñadora UX/UI y Desarrolladora Frontend',
      organization: 'MR Obras',
      period: 'Dic 2024 – actualidad',
      location: 'Córdoba',
      bullets: [
        'Diseñé y desarrollé el sitio corporativo mrobras.com.ar, del prototipo en Figma al código.',
        'Implementé recorridos 360° de obras y navegación por secciones con React Router.',
        'Diseño piezas gráficas y campañas de publicidad digital y redes sociales.',
      ],
      tags: ['React', 'TypeScript', 'Tailwind CSS'],
    },
    {
      id: 'ministerio',
      title: 'Desarrolladora y Diseñadora Web',
      organization: 'Ministerio de Desarrollo Social',
      period: 'Abr 2023 – Sep 2023',
      bullets: [
        'Prototipé interfaces para la aplicación del equipo.',
        'Maqueté e implementé estilos CSS en una aplicación desarrollada en React.',
        'Ajusté y mejoré componentes existentes junto al equipo de desarrollo.',
      ],
      tags: ['React', 'CSS'],
    },
  ],

  education: [
    {
      id: 'coderhouse',
      title: 'Carrera de Desarrollo UX/UI',
      organization: 'Coderhouse',
      period: '2023 – 2025',
    },
    {
      id: 'argentina-programa',
      title: 'Web Full Stack Jr.',
      organization: 'Argentina Programa 4.0',
      period: '2022 – 2023',
    },
    {
      id: 'ies',
      title: 'Tecnicatura en Diseño Gráfico y Publicitario',
      organization: 'Colegio Universitario IES',
      period: 'En curso',
    },
  ],

  skills: [
    {
      id: 'frontend',
      title: 'Frontend',
      items: ['HTML', 'CSS', 'Sass', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'React', 'React Router', 'Angular', 'Vite'],
    },
    {
      id: 'ux',
      title: 'UX/UI',
      items: ['Figma', 'Adobe XD', 'Design Thinking', 'User personas', 'Wireframes', 'Prototipado', 'Material Design'],
    },
    {
      id: 'graphic',
      title: 'Diseño gráfico y motion',
      items: ['Illustrator', 'Photoshop', 'InDesign', 'After Effects'],
    },
    {
      id: 'tools',
      title: 'Herramientas',
      items: ['Git', 'GitHub', 'MySQL'],
    },
  ],

  languages: ['Español nativo', 'Inglés intermedio (B1)'],
}
