// La habitación de NAMI.EXE: una sola pantalla de 256 × 192 en vista 3/4.
// Arriba la pared (estanterías, ventana, cuadros), abajo el piso por donde camina Nami.

export const VIEW = { w: 256, h: 192 }
export const HUD_H = 15

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}
export interface Point {
  x: number
  y: number
}

/** Zona donde pueden estar las patitas de Nami */
export const FLOOR = { x: 8, y: 80, w: 240, h: 104 }

/** Escritorio con el monitor y la consolita (bloquea el paso) */
export const DESK = { x: 176, y: 116, w: 60, h: 22 }

/** Lugares fijos donde aparecen incidencias de pared y plantas.
 *  draw = dónde se dibuja, use = dónde se para Nami para atenderla */
export interface Slot {
  draw: Point
  use: Point
  /** Tamaño de lo que glitchea (cuadros y monitor) */
  size?: { w: number; h: number }
  /** Si está, se puede atender desde cualquier lado de esta zona (escritorio, macetas) */
  zone?: Rect
}

/** Cuadros y monitor que pueden glitchear */
export const GLITCH_SLOTS: Slot[] = [
  { draw: { x: 64, y: 26 }, use: { x: 78, y: 86 }, size: { w: 28, h: 22 } }, // Magic Bloom
  { draw: { x: 152, y: 30 }, use: { x: 164, y: 86 }, size: { w: 24, h: 20 } }, // cuadrito de Ocha
  { draw: { x: 198, y: 93 }, use: { x: 206, y: 150 }, size: { w: 16, h: 11 }, zone: { x: 176, y: 116, w: 60, h: 26 } }, // monitor del escritorio
]

/** Estrellas apagadas: en las estanterías y en el alféizar */
export const STAR_SLOTS: Slot[] = [
  { draw: { x: 12, y: 21 }, use: { x: 20, y: 86 } },
  { draw: { x: 36, y: 41 }, use: { x: 42, y: 86 } },
  { draw: { x: 117, y: 47 }, use: { x: 122, y: 86 } },
  { draw: { x: 214, y: 23 }, use: { x: 220, y: 86 } },
  { draw: { x: 236, y: 43 }, use: { x: 240, y: 86 } },
]

/** Plantas en el piso (también obstáculos chiquitos) */
export const PLANT_SLOTS: Slot[] = [
  { draw: { x: 14, y: 118 }, use: { x: 36, y: 134 } },
  { draw: { x: 120, y: 160 }, use: { x: 146, y: 176 } },
  { draw: { x: 232, y: 152 }, use: { x: 222, y: 174 } },
].map((p) => ({ ...p, zone: { x: p.draw.x + 1, y: p.draw.y + 8, w: 12, h: 7 } }))
export const PLANT_SIZE = { w: 14, h: 14 }

/** Obstáculos para las patitas: escritorio y macetas */
export const OBSTACLES: Rect[] = [
  { x: DESK.x, y: DESK.y + 6, w: DESK.w, h: DESK.h - 4 },
  ...PLANT_SLOTS.map((p) => ({ x: p.draw.x + 2, y: p.draw.y + 9, w: 10, h: 5 })),
]

/** Puntos del piso donde pueden caer libros, lanas y corazones */
export const FLOOR_SPOTS: Point[] = (() => {
  const spots: Point[] = []
  for (let y = 96; y <= 176; y += 16) {
    for (let x = 24; x <= 232; x += 20) {
      const blocked = OBSTACLES.some((o) => x > o.x - 10 && x < o.x + o.w + 10 && y > o.y - 12 && y < o.y + o.h + 10)
      if (!blocked) spots.push({ x, y })
    }
  }
  return spots
})()

export const START = { x: 128, y: 120 }
