import type { CaseMediaCategory, CaseMediaItem, CaseStudyData, Localized } from '../../types/caseStudy'

// Caso de estudio de MR Obras: textos, orden e imágenes en un solo lugar.
// Para sumar una pieza: exportá el archivo a la carpeta indicada en `src` y completá sus textos.
// Las piezas sin archivo se ven como espacios punteados en desarrollo y no aparecen en producción.

const l = (es: string, en: string): Localized => ({ es, en })

const DESKTOP = '16 / 10'
const MOBILE = '390 / 844'

type Piece = Omit<CaseMediaItem, 'category' | 'order'>

// El orden dentro de cada lista es el orden de visualización.
const byCategory = (category: CaseMediaCategory, items: Piece[]): CaseMediaItem[] =>
  items.map((item, i) => ({ ...item, category, order: i + 1 }))

const media: CaseMediaItem[] = [
  ...byCategory('cover', [
    {
      id: 'cover',
      src: 'cover',
      ratio: '16 / 9',
      alt: l('Composición de la identidad y el sitio de MR Obras', 'Composition of the MR Obras identity and website'),
      title: l('Portada del proyecto', 'Project cover'),
    },
  ]),

  ...byCategory('branding', [
    { id: 'logo-main', src: 'branding/logo-principal', ratio: '4 / 3', alt: l('Logo principal de MR Obras', 'MR Obras primary logo'), title: l('Logo principal', 'Primary logo') },
    { id: 'logo-variants', src: 'branding/logo-variantes', ratio: '1 / 1', alt: l('Variantes del logo de MR Obras', 'MR Obras logo variations'), title: l('Variantes del logo', 'Logo variations') },
    { id: 'palette', src: 'branding/paleta', ratio: '1 / 1', alt: l('Paleta cromática de MR Obras', 'MR Obras color palette'), title: l('Paleta cromática', 'Color palette') },
    { id: 'typography', src: 'branding/tipografias', ratio: '4 / 3', alt: l('Sistema tipográfico de MR Obras', 'MR Obras type system'), title: l('Tipografías', 'Typography') },
    { id: 'graphic-elements', src: 'branding/elementos-graficos', ratio: '4 / 3', alt: l('Elementos gráficos complementarios de MR Obras', 'MR Obras supporting graphic elements'), title: l('Elementos gráficos', 'Graphic elements') },
    { id: 'applications', src: 'branding/aplicaciones', ratio: '16 / 9', alt: l('Aplicaciones de la identidad de MR Obras', 'MR Obras identity applications'), title: l('Aplicaciones de identidad', 'Identity applications') },
  ]),

  ...byCategory('ux-ui', [
    { id: 'architecture', src: 'ux-ui/arquitectura-contenidos', ratio: '16 / 10', alt: l('Arquitectura de contenidos del sitio', 'Website content architecture'), title: l('Arquitectura de contenidos', 'Content architecture') },
    { id: 'wireframes', src: 'ux-ui/wireframes', ratio: '4 / 3', alt: l('Wireframes del sitio de MR Obras', 'MR Obras website wireframes'), title: l('Wireframes', 'Wireframes') },
    { id: 'figma', src: 'ux-ui/prototipo-figma', ratio: '4 / 3', alt: l('Prototipo del sitio en Figma', 'Website prototype in Figma'), title: l('Prototipo en Figma', 'Figma prototype') },
    { id: 'home-desktop', src: 'ux-ui/home-desktop', ratio: DESKTOP, device: 'desktop', alt: l('Portada del sitio con el título “Especialistas en construcción en seco en Córdoba” y el botón Solicitar presupuesto', 'Website homepage with the headline “Specialists in dry construction in Córdoba” and a Request a quote button'), title: l('Portada en desktop', 'Homepage on desktop') },
    { id: 'services-desktop', src: 'ux-ui/servicios-desktop', ratio: DESKTOP, device: 'desktop', alt: l('Sección de servicios con una tarjeta grande de casas llave en mano y dos tarjetas menores', 'Services section with a large turnkey homes card and two smaller cards'), title: l('Servicios en desktop', 'Services on desktop') },
    { id: 'services-mobile', src: 'ux-ui/servicios-mobile', ratio: MOBILE, device: 'mobile', alt: l('Sección de servicios en un celular', 'Services section on a phone'), title: l('Servicios en mobile', 'Services on mobile') },
    { id: 'types-desktop', src: 'ux-ui/tipologias-desktop', ratio: DESKTOP, device: 'desktop', alt: l('Ficha de la tipología compacta de 36 m² con ambientes, botón de consulta y acceso al tour 360°', 'Card for the compact 36 m² home model with rooms, an inquiry button and access to the 360° tour'), title: l('Tipologías en desktop', 'Home models on desktop') },
    { id: 'home-mobile', src: 'ux-ui/home-mobile', ratio: MOBILE, device: 'mobile', alt: l('Portada del sitio en un celular', 'Website homepage on a phone'), title: l('Portada en mobile', 'Homepage on mobile') },
    { id: 'types-mobile', src: 'ux-ui/tipologias-mobile', ratio: MOBILE, device: 'mobile', alt: l('Sección de tipologías en un celular', 'Home models section on a phone'), title: l('Tipologías en mobile', 'Home models on mobile') },
    { id: 'contact-mobile', src: 'ux-ui/contacto-mobile', ratio: MOBILE, device: 'mobile', alt: l('Sección de contacto en un celular, con mapa y botón de WhatsApp', 'Contact section on a phone, with a map and WhatsApp button'), title: l('Contacto en mobile', 'Contact on mobile') },
    { id: 'contact-desktop', src: 'ux-ui/contacto-desktop', ratio: DESKTOP, device: 'desktop', alt: l('Formulario “Armá tu consulta guiada” con datos de contacto, tipo de obra y etapa del proyecto', 'Guided inquiry form with contact details, type of work and project stage'), title: l('Consulta guiada', 'Guided inquiry') },
  ]),

  ...byCategory('frontend', [
    { id: 'tour-desktop', src: 'frontend/tour-360-desktop', video: 'frontend/tour-360-demo.mp4', ratio: DESKTOP, device: 'desktop', alt: l('Tour 360° de la tipología de 36 m² abierto en el living, con controles y selector de ambientes', '360° tour of the 36 m² home model open in the living room, with controls and a room selector'), title: l('Tour 360° en desktop', '360° tour on desktop') },
    { id: 'tour-mobile', src: 'frontend/tour-360-mobile', ratio: MOBILE, device: 'mobile', alt: l('Tour 360° en un celular, con selector de ambientes', '360° tour on a phone, with a room selector'), title: l('Tour 360° en mobile', '360° tour on mobile') },
  ]),

  ...byCategory('marketing', [
    { id: 'instagram-posts', src: 'marketing/publicaciones-instagram', ratio: '4 / 5', alt: l('Publicaciones de Instagram de MR Obras', 'MR Obras Instagram posts'), title: l('Publicaciones de Instagram', 'Instagram posts') },
    { id: 'carousels', src: 'marketing/carrusel-informativo', ratio: '4 / 5', alt: l('Carrusel informativo de MR Obras', 'MR Obras educational carousel'), title: l('Carruseles informativos', 'Educational carousels') },
    { id: 'campaigns', src: 'marketing/campana-promocional', ratio: '4 / 5', alt: l('Campaña promocional de MR Obras', 'MR Obras promotional campaign'), title: l('Campañas promocionales', 'Promotional campaigns') },
    { id: 'ads', src: 'marketing/pieza-publicitaria', ratio: '4 / 5', alt: l('Pieza publicitaria de MR Obras', 'MR Obras advertising piece'), title: l('Piezas publicitarias', 'Advertising pieces') },
    { id: 'social-adaptations', src: 'marketing/adaptaciones-redes', ratio: '4 / 5', alt: l('Adaptaciones de la identidad para redes', 'Identity adaptations for social media'), title: l('Adaptaciones para redes', 'Social media adaptations') },
    { id: 'brand-applications', src: 'marketing/aplicaciones-marca', ratio: '4 / 5', alt: l('Otras aplicaciones de la marca MR Obras', 'Other MR Obras brand applications'), title: l('Otras aplicaciones', 'Other applications') },
  ]),

  ...byCategory('results', [
    { id: 'works-desktop', src: 'results/proyectos-desktop', ratio: DESKTOP, device: 'desktop', alt: l('Sección de obras realizadas con cinco proyectos en una grilla asimétrica', 'Completed works section with five projects in an asymmetric grid'), title: l('Obras realizadas', 'Completed works') },
    { id: 'works-mobile', src: 'results/proyectos-mobile', ratio: MOBILE, device: 'mobile', alt: l('Sección de obras realizadas en un celular', 'Completed works section on a phone'), title: l('Obras en mobile', 'Works on mobile') },
  ]),
]

export const mrObrasCaseStudy: CaseStudyData = {
  projectId: 'mr-obras',
  basePath: '/images/projects/mr-obras',
  subtitle: l(
    'Identidad visual, diseño web y comunicación digital para una empresa de construcción.',
    'Visual identity, web design and digital communication for a construction company.',
  ),
  disciplines: [l('Identidad de marca', 'Brand Identity'), l('Diseño UX/UI', 'UX/UI Design'), l('Desarrollo frontend', 'Frontend Development'), l('Marketing digital', 'Digital Marketing')],
  role: l('Diseño gráfico, UX/UI y desarrollo frontend', 'Graphic design, UX/UI and frontend development'),
  type: l('Sitio web corporativo e identidad de marca', 'Corporate website and brand identity'),
  cover: 'cover',
  media,

  sections: [
    {
      id: 'contexto',
      nav: l('Contexto', 'Context'),
      eyebrow: l('Contexto y desafío', 'Context & challenge'),
      titleA: l('Una constructora,', 'One builder,'),
      titleB: l('una sola voz', 'one voice'),
      intro: l(
        'MR Obras es una empresa de Córdoba especializada en construcción en seco, steel framing y viviendas. El desafío fue construir una presencia digital coherente con su identidad, capaz de presentar sus servicios y acercar a quienes quieren construir.',
        'MR Obras is a construction company in Córdoba, Argentina, specializing in dry construction, steel framing and homes. The challenge was to build a digital presence true to its identity: one that explains its services and makes it easy for future clients to get in touch.',
      ),
      note: l('marca, web y redes, contando lo mismo', 'brand, web and social, telling one story'),
      tone: 'paper',
      blocks: [
        {
          type: 'needs',
          items: [
            { title: l('Mostrar', 'Show'), text: l('Servicios, obras y tipologías de vivienda en un solo lugar.', 'Services, past builds and home models, all in one place.') },
            { title: l('Explicar', 'Explain'), text: l('Una propuesta técnica, contada en un lenguaje claro.', 'A technical offering, told in plain language.') },
            { title: l('Conectar', 'Connect'), text: l('Un camino directo para pedir presupuesto desde el celular.', 'A direct path to request a quote from a phone.') },
          ],
        },
        { type: 'process' },
      ],
    },

    {
      id: 'identidad',
      nav: l('Identidad', 'Identity'),
      eyebrow: l('Identidad visual', 'Visual identity'),
      titleA: l('Una marca con', 'A brand with'),
      titleB: l('estructura propia', 'its own structure'),
      intro: l(
        'El sistema gráfico reúne logo, color, tipografía y recursos visuales para que MR Obras se reconozca en cada punto de contacto.',
        'The graphic system brings together logo, color, type and visual assets so MR Obras is recognizable at every touchpoint.',
      ),
      note: l('del logo a cada aplicación', 'from the logo to every application'),
      tone: 'rose',
      requiresMedia: true,
      blocks: [
        {
          type: 'gallery',
          items: [
            { id: 'logo-main', span: 'wide' },
            { id: 'logo-variants', span: 'side', drop: true },
            { id: 'palette', span: 'third' },
            { id: 'typography', span: 'half', drop: true },
            { id: 'graphic-elements', span: 'small' },
            { id: 'applications', span: 'full' },
          ],
        },
      ],
    },

    {
      id: 'ux-ui',
      nav: l('UX/UI', 'UX/UI'),
      eyebrow: l('Diseño UX/UI', 'UX/UI design'),
      titleA: l('Decisiones para', 'Decisions that'),
      titleB: l('construir confianza', 'build trust'),
      intro: l(
        'Organicé el sitio alrededor de las preguntas de quien piensa construir: qué hacen, qué opciones tengo y cómo los contacto.',
        'I organized the site around the questions of someone planning to build: what do they do, what are my options and how do I reach them?',
      ),
      tone: 'paper',
      blocks: [
        {
          type: 'gallery',
          items: [
            { id: 'architecture', span: 'wide' },
            { id: 'wireframes', span: 'side', drop: true },
            { id: 'figma', span: 'half' },
          ],
        },
        {
          type: 'story',
          media: 'home-desktop',
          label: l('Jerarquía de información', 'Information hierarchy'),
          title: l('Un mensaje, una acción', 'One message, one action'),
          text: l(
            'La portada resume la propuesta en un título y una acción principal. Quien llega entiende qué hace la empresa y cuál es el siguiente paso.',
            'The homepage distills the offer into one headline and one primary action, so visitors immediately see what the company does and what to do next.',
          ),
        },
        {
          type: 'story',
          media: 'services-desktop',
          companion: 'services-mobile',
          flip: true,
          label: l('Presentación de servicios', 'Service presentation'),
          title: l('El tamaño ordena la lectura', 'Scale sets the reading order'),
          text: l(
            'Casas llave en mano ocupa la tarjeta principal, mientras arquitectura y reformas la acompañan en un formato menor. La prioridad se entiende antes de leer el detalle.',
            'Turnkey homes take the lead card, with architecture and renovations in smaller formats. The priority is clear before anyone reads the details.',
          ),
        },
        {
          type: 'story',
          media: 'types-desktop',
          label: l('Navegación por tipologías', 'Browsing home models'),
          title: l('Fichas fáciles de comparar', 'Cards that are easy to compare'),
          text: l(
            'Las viviendas de 36 y 42 m² comparten la misma estructura: imagen, superficie, ambientes y dos caminos claros, consultar o recorrerla en 360°.',
            'The 36 and 42 m² homes share one structure: image, floor area, rooms and two clear paths, either ask about it or walk through it in 360°.',
          ),
        },
        {
          type: 'phones',
          media: ['home-mobile', 'types-mobile', 'contact-mobile'],
          label: l('Diseño responsive', 'Responsive design'),
          title: l('Pensado para la mano', 'Designed for the hand'),
          text: l(
            'En el celular, el contenido se reorganiza en una columna, con títulos legibles, acciones amplias y WhatsApp siempre a mano.',
            'On mobile, content reflows into a single column with readable headlines, generous tap targets and WhatsApp always within reach.',
          ),
        },
        {
          type: 'story',
          media: 'contact-desktop',
          flip: true,
          label: l('Facilidad de contacto', 'Easy contact'),
          title: l('Una consulta guiada', 'A guided inquiry'),
          text: l(
            'El formulario pregunta por el tipo de obra y la etapa del proyecto, y envía la consulta por WhatsApp, el canal más directo para iniciar la conversación.',
            'The form asks about the type of work and project stage, then sends the inquiry through WhatsApp, a direct way to start the conversation.',
          ),
        },
        {
          type: 'principle',
          label: l('Claridad visual', 'Visual clarity'),
          text: l(
            'Secciones que alternan fondos oscuros y claros, un mismo patrón de títulos y el turquesa de la marca para guiar la mirada.',
            'Alternating dark and light sections, one consistent heading pattern and the brand’s turquoise to guide the eye.',
          ),
          note: l('que la obra sea la protagonista', 'let the work take center stage'),
        },
      ],
    },

    {
      id: 'frontend',
      nav: l('Frontend', 'Frontend'),
      eyebrow: l('Desarrollo frontend', 'Frontend development'),
      titleA: l('Del prototipo', 'From prototype'),
      titleB: l('a la experiencia real', 'to real experience'),
      intro: l(
        'Llevé el diseño a un sitio en producción, cuidando que cada interacción sumara información útil para decidir.',
        'I turned the design into a live website, making sure every interaction gives people useful information to decide.',
      ),
      tone: 'teal',
      blocks: [
        {
          type: 'story',
          media: 'tour-desktop',
          companion: 'tour-mobile',
          dark: true,
          label: l('La función distintiva', 'The signature feature'),
          title: l('Entrar a la casa antes de construirla', 'Step inside before it’s built'),
          text: l(
            'Cada tipología incluye un recorrido 360° con Photo Sphere Viewer. Se puede arrastrar la vista y pasar de un ambiente a otro para entender mejor el espacio.',
            'Each home model includes a 360° tour built with Photo Sphere Viewer. Visitors can drag the view and move between rooms to get a real feel for the space.',
          ),
          points: [l('Living, habitaciones y baño', 'Living room, bedrooms and bathroom'), l('Arrastre, zoom y pantalla completa', 'Drag, zoom and full screen'), l('Funciona en desktop y mobile', 'Works on desktop and mobile')],
        },
        {
          type: 'stack',
          items: [
            { name: 'React', value: l('Componentes reutilizables', 'Reusable components') },
            { name: 'TypeScript', value: l('Datos y contenido tipados', 'Typed data and content') },
            { name: 'Tailwind CSS', value: l('Sistema visual responsive', 'Responsive visual system') },
            { name: 'Vite', value: l('Entorno y build del sitio', 'Dev environment and build') },
            { name: 'React Router', value: l('Páginas para cada obra', 'A page for each project') },
            { name: 'Photo Sphere Viewer', value: l('Recorridos 360°', '360° tours') },
          ],
        },
        { type: 'highlights' },
      ],
    },

    {
      id: 'marketing',
      nav: l('Marketing', 'Marketing'),
      eyebrow: l('Diseño gráfico y marketing digital', 'Graphic design & digital marketing'),
      titleA: l('La marca,', 'The brand,'),
      titleB: l('también en redes', 'on social too'),
      intro: l(
        'Publicaciones, carruseles y campañas que llevan la identidad de MR Obras a su comunicación diaria.',
        'Posts, carousels and campaigns that carry the MR Obras identity into its everyday communication.',
      ),
      note: l('deslizá para ver más', 'swipe to see more'),
      tone: 'wall',
      requiresMedia: true,
      blocks: [{ type: 'carousel', items: ['instagram-posts', 'carousels', 'campaigns', 'ads', 'social-adaptations', 'brand-applications'] }],
    },

    {
      id: 'resultado',
      nav: l('Resultado', 'Outcome'),
      eyebrow: l('Resultado final', 'Final outcome'),
      titleA: l('Una experiencia', 'One connected'),
      titleB: l('de marca conectada', 'brand experience'),
      intro: l(
        'El proyecto integró branding, experiencia de usuario, comunicación digital y desarrollo frontend en un mismo lenguaje, desde la identidad gráfica hasta el sitio publicado y las redes.',
        'The project brought branding, user experience, digital communication and frontend development into one language, from the visual identity to the live website and social media.',
      ),
      tone: 'paper',
      blocks: [
        {
          type: 'gallery',
          items: [
            { id: 'works-desktop', span: 'wide' },
            { id: 'works-mobile', span: 'side' },
          ],
        },
      ],
    },
  ],

  closing: {
    titleA: l('Miralo', 'See it'),
    titleB: l('funcionando', 'live'),
    text: l('El sitio está publicado y el código se puede revisar.', 'The website is live and the code is open to review.'),
    note: l('los 360° se disfrutan más ahí', 'the 360° tours are best in person'),
  },
}
