// Ubicación de cada proyecto dentro de la biblioteca del inicio.
// La escena mide 600 × 660 unidades; los componentes las pasan a porcentajes,
// así todo escala igual en celular y en escritorio.
// Para mover un proyecto a otro lugar, alcanza con cambiar su id acá.

export const SCENE = { width: 600, height: 660, shelfTop: 372, shelfBottom: 586 }

export interface BookSlot {
  /** Si tiene projectId es un proyecto (se puede abrir); si no, es decoración */
  projectId?: string
  x: number
  w: number
  h: number
  color: string
  ink: string
  band?: string
  /** Inclinación en grados (libros apoyados en el de al lado) */
  tilt?: number
}

export const books: BookSlot[] = [
  { x: 46, w: 24, h: 118, color: '#e7b8c0', ink: '#93354f', band: '#f7f0e8' },
  { projectId: 'mr-obras', x: 70, w: 46, h: 168, color: '#24605e', ink: '#f3dfb6', band: '#d6a24a' },
  { x: 116, w: 22, h: 136, color: '#ece2d2', ink: '#8f6948', band: '#80bdbb' },
  { projectId: 'rodanteros', x: 138, w: 46, h: 156, color: '#c97a8e', ink: '#fff6ef', band: '#f1d1d1' },
  { projectId: 'spark', x: 186, w: 42, h: 148, color: '#1d1d21', ink: '#c9ef6b', band: '#c9ef6b' },
  { x: 228, w: 26, h: 124, color: '#d6a24a', ink: '#5a3e1c', band: '#8f6948' },
  { x: 256, w: 24, h: 130, color: '#80bdbb', ink: '#18403f', band: '#f7f0e8', tilt: 13 },
]

/** Libros acostados (la pila donde se sube el gato) */
export const lyingBooks: BookSlot[] = [
  { x: 408, w: 156, h: 24, color: '#80bdbb', ink: '#18403f', band: '#d7ebea' },
  { projectId: 'al-borde-llama', x: 418, w: 138, h: 28, color: '#b97d5a', ink: '#fff3e3', band: '#e9c99c' },
]

export interface FrameSlot {
  projectId: string
  x: number
  y: number
  w: number
  h: number
  tilt: number
  variant: 'wall' | 'stand' | 'postcard'
}

export const frames: FrameSlot[] = [
  { projectId: 'magic-bloom', x: 178, y: 58, w: 156, h: 124, tilt: -1.5, variant: 'wall' },
  { projectId: 'ocha', x: 350, y: 80, w: 64, h: 82, tilt: 2, variant: 'wall' },
]

/** Cuadritos de las gatitas en la repisa de abajo (el id coincide con `pets` en portfolioData) */
export interface PetSlot {
  petId: string
  x: number
  y: number
  w: number
  h: number
  tilt: number
  variant: 'stand' | 'polaroid'
}

export const petFrames: PetSlot[] = [
  { petId: 'micha', x: 128, y: 494, w: 78, h: 92, tilt: -3, variant: 'stand' },
  { petId: 'nami', x: 218, y: 508, w: 70, h: 80, tilt: 5, variant: 'polaroid' },
]

/** Bolita de lana: su lugar de descanso en la repisa de abajo */
export const yarnHome = { x: 298, y: 554, size: 32 }

/** Zona del gato (centro de la cabeza) para saber cuándo la lana está cerca */
export const catPlayZone = { x: 482, y: 236, radius: 110 }

/** Convierte unidades de la escena en porcentajes para posicionar con CSS */
export function box(x: number, y: number, w: number, h: number) {
  return {
    left: `${(x / SCENE.width) * 100}%`,
    top: `${(y / SCENE.height) * 100}%`,
    width: `${(w / SCENE.width) * 100}%`,
    height: `${(h / SCENE.height) * 100}%`,
  }
}
