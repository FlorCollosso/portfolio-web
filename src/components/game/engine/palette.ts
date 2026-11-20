// Paleta limitada de NAMI.EXE: la biblioteca del portfolio, de noche y en pixel art.
export const PAL = {
  // Nami (gatita gris)
  o: '#1c1a24', // contorno
  G: '#9896a4', // gris medio
  g: '#6c6979', // rayas
  L: '#c9c7d2', // gris claro
  w: '#efe8de', // crema (cachetes y pecho)
  P: '#e79aa8', // rosa (orejas y nariz)
  k: '#1c1a24', // ojos
  O: '#e8924a', // naranja (Michi, que espía por la ventana)
  // Estrella
  y: '#ffd27a',
  Y: '#ffe7a8',
  W: '#fff8e6',
  s: '#b8743a',
  // Biblioteca
  night: '#1b1d2e',
  wall: '#222538',
  wallLine: '#272b41',
  wallDark: '#191b2a',
  floor: '#6b4a3a',
  floorTop: '#8a6450',
  floorLine: '#573a2e',
  wood: '#c49b74',
  woodLight: '#d9b48c',
  woodDark: '#8f6948',
  woodDeep: '#5e4433',
  glass: '#2c3260',
  glassLight: '#3a427a',
  moon: '#f3ead2',
  twinkle: '#fff6dc',
  sage: '#7da383',
  sageDark: '#557a5d',
  sageLight: '#a3c4a2',
  rose: '#d88da0',
  roseLight: '#f1d1d1',
  roseDeep: '#93354f',
  teal: '#80bdbb',
  tealDeep: '#24605e',
  tealDark: '#2c5a58',
  cream: '#ece2d2',
  ochre: '#d6a24a',
  ink: '#1d1d21',
  lime: '#c9ef6b',
  plum: '#5b3f78',
  plumLight: '#b98ad6',
  grey: '#9a948e',
  greyDark: '#6e6863',
  glow: '#ffd79a',
  bulb: '#fff4d6',
} as const

/** Libros con los colores de mis proyectos (los mismos de la biblioteca) */
export const BOOK_COLORS: [string, string][] = [
  [PAL.rose, PAL.roseLight],
  [PAL.tealDeep, PAL.ochre], // MR Obras
  [PAL.cream, PAL.teal],
  ['#c97a8e', PAL.roseLight], // Rodanteros
  [PAL.ink, PAL.lime], // Spark
  [PAL.ochre, PAL.woodDark],
  [PAL.teal, '#f7f0e8'],
]
