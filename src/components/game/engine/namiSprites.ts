// Sprites de Nami (gatita gris) por dirección, dibujados píxel a píxel con la paleta PAL.
// "." es transparente. Frente y espalda: 16 × 17. Perfil: 18 × 17 (mira a la derecha; la izquierda se espeja).
// Todas apoyan las patitas en la última fila: se dibujan centradas en x y con la base en y.

export type Facing = 'down' | 'up' | 'left' | 'right'

const set = (rows: string[], r: number, c: number, ch: string) => {
  rows[r] = rows[r].slice(0, c) + ch + rows[r].slice(c + 1)
}
const patch = (base: string[], edits: [number, number, string][]) => {
  const rows = [...base]
  for (const [r, c, ch] of edits) set(rows, r, c, ch)
  return rows
}
const withRows = (base: string[], rows: Record<number, string>) => base.map((row, i) => rows[i] ?? row)
/** Baja todo el sprite un píxel (rebote al caminar), sin cambiar el tamaño */
const bob = (rows: string[]) => ['.'.repeat(rows[0].length), ...rows.slice(0, -1)]

// ————— De frente (caminando hacia abajo) —————

const FRONT_HEAD = [
  '...o........o...',
  '..oPo......oPo..',
  '..oPGooooooGPo..',
  '.oGGGgGGGGgGGGo.',
  '.oGGGGGggGGGGGo.',
  '.oGGkkGGGGkkGGo.',
  '.oGGkkGGGGkkGGo.',
  '.oLwwwwPPwwwwLo.',
  '..oLwwwwwwwwLo..',
]
const FRONT_STAND = [
  ...FRONT_HEAD,
  '...ooGwwwwGoo...',
  '...oGGwwwwGGo...',
  '..oGGGwwwwGGGo..',
  '..oGgGwwwwGgGo..',
  '..oGGGGwwGGGGo..',
  '..oGoLo..oLoGo..',
  '..oLoLo..oLoLo..',
  '..ooooo..ooooo..',
]
// Paso: una pata adelante (más larga) y la otra levantada
const FRONT_STEP_A = withRows(FRONT_STAND, {
  14: '..oGoLo..oLoGo..',
  15: '..oLoLo..ooooo..',
  16: '..ooooo.........',
})
const FRONT_STEP_B = withRows(FRONT_STAND, {
  14: '..oGoLo..oLoGo..',
  15: '..ooooo..oLoLo..',
  16: '.........ooooo..',
})
const blinkFront = (rows: string[]) => withRows(rows, { 5: '.oGGGGGGGGGGGGo.', 6: '.oGGkkGGGGkkGGo.' })
const happyFront = (rows: string[]) => withRows(rows, { 5: '.oGGkkGGGGkkGGo.', 6: '.oGkGGkGGkGGkGo.' })

// ————— De espaldas (caminando hacia arriba) —————

const BACK_STAND = [
  '...o........o...',
  '..oGo......oGo..',
  '..oGGooooooGGo..',
  '.oGGGgGGGGgGGGo.',
  '.oGGGGgGGgGGGGo.',
  '.oGGGGGggGGGGGo.',
  '.oGgGGGGGGGGgGo.',
  '.oGGGGGGGGGGGGo.',
  '..oLGGGGGGGGLo..',
  '...ooGGGGGGoo...',
  '.o.oGGgGGgGGo...',
  'oLoGGGGggGGGGo..',
  'oLoGgGGGGGGgGo..',
  'oGoGGGGGGGGGGo..',
  'oGoGoGo..oGoGo..',
  '.ooLoLo..oLoLo..',
  '..ooooo..ooooo..',
]
// Cola parada al costado: más alta o más baja según el cuadro (se mece)
const BACK_TAIL_HIGH = { 9: '.o.ooGGGGGGoo...', 10: 'oLooGGgGGgGGo...' }
const BACK_STEP_A = withRows(withRows(BACK_STAND, BACK_TAIL_HIGH), {
  15: '.ooLoLo..ooooo..',
  16: '..ooooo.........',
})
const BACK_STEP_B = withRows(BACK_STAND, {
  15: '.oooooo..oLoLo..',
  16: '.........ooooo..',
})

// ————— De perfil (mira a la derecha) —————

const SIDE_STAND = [
  '.oo.......o....o..',
  'oLo......oPo..oPo.',
  'oGo......oPGooGPo.',
  'oGo.....oGGgGgGGGo',
  '.oGo....oGGGGGGGGo',
  '.oGo....oGGGGkkGGo',
  '..oGo...oGGGGkkGLo',
  '..oGo...oLGGGwwwPo',
  '...oGo...oLwwwwwo.',
  '...oGooooGGGwwwo..',
  '...oGGGgGGGgGwwwo.',
  '...oGGgGGGgGGGwwo.',
  '...oLGGGGGGGGGGGo.',
  '...oGGoGGoooGGoGo.',
  '...oGo.oGo.oGooGo.',
  '...oLo.oLo.oLooLo.',
  '...ooo.ooo.oooooo.',
]
const SIDE_STEP_A = withRows(SIDE_STAND, {
  13: '...oGGoGGoooGGoGo.',
  14: '..oGo...oGooGo.oGo',
  15: '..oLo...oLooLo.oLo',
  16: '..ooo...oooooo.ooo',
})
const SIDE_STEP_B = withRows(SIDE_STAND, {
  13: '...oGGoGGoooGGoGo.',
  14: '....oGooGo...oGoGo',
  15: '....oLooLo...oLoLo',
  16: '....oooooo...ooooo',
})
// Cola hacia atrás (se mece al caminar)
const sideTailBack = (rows: string[]) =>
  patch(rows, [
    [0, 1, '.'],
    [0, 2, '.'],
    [1, 0, 'o'],
    [1, 1, 'o'],
    [1, 2, '.'],
    [2, 1, 'L'],
  ])
const blinkSide = (rows: string[]) => withRows(rows, { 5: '.oGo....oGGGGGGGGo', 6: '..oGo...oGGGGkkGLo' })
const happySide = (rows: string[]) => withRows(rows, { 5: '.oGo....oGGGGkGkGo', 6: '..oGo...oGGGkGGGLo' })

// ————— Sentada de frente (idle y lamerse la patita) —————

const SIT = [
  ...FRONT_HEAD,
  '...ooGwwwwGoo...',
  '...oGGwwwwGGo...',
  '..oGGGwwwwGGGo..',
  '..oGgGwwwwGgGo..',
  '..oGGoLwwLoGGo..',
  '.oGGGoLwwLoGGGoo',
  '.oLLLoLooLoLLLLo',
  '..oooooooooooooo',
]
// Ojitos cerrados de gusto
const lickEyes = { 5: '.oGGGGGGGGGGGGo.', 6: '.oGkkGGGGGGkkGo.' }
// Patita levantada hasta la boca, con la lengüita afuera
const LICK_A = withRows(SIT, {
  ...lickEyes,
  6: '.oGkkGooGGGkkGo.',
  7: '.oLwwoLLoPwwwLo.',
  8: '..oLwoLLoPwwLo..',
  9: '...oooLLoooo....',
  10: '...oGoLLoGGo....',
  11: '..oGGooooGGGo...',
  12: '..oGgGwwwwGgGo..',
  13: '..oGGGwwwLoGGo..',
})
const LICK_B = withRows(SIT, {
  ...lickEyes,
  6: '.oGkkGGooGGkkGo.',
  7: '.oLwwwoLLowwwLo.',
  8: '..oLwwoLLowwLo..',
  9: '...ooooLLooo....',
  10: '...oGGoLLoGo....',
  11: '..oGGGooooGGo...',
  12: '..oGgGwwwwGgGo..',
  13: '..oGGGwwwLoGGo..',
})

// ————— Arreglando —————

// De espaldas con la patita estirada hacia la pared (cuadros, estrellas)
const FIX_UP_A = withRows(BACK_STAND, {
  5: '.oGGGGGggGGGGooo',
  6: '.oGgGGGGGGGGgoLo',
  7: '.oGGGGGGGGGGGoLo',
  8: '..oLGGGGGGGGLoLo',
  9: '...ooGGGGGGooGo.',
})
const FIX_UP_B = withRows(withRows(BACK_STAND, BACK_TAIL_HIGH), {
  3: '.oGGGgGGGGgGGooo',
  4: '.oGGGGgGGgGGGoLo',
  5: '.oGGGGGggGGGGoLo',
  6: '.oGgGGGGGGGGgoLo',
  7: '.oGGGGGGGGGGGoLo',
  8: '..oLGGGGGGGGLoGo',
  9: '.o.ooGGGGGGooGo.',
})
// De perfil con la patita de adelante levantada (escritorio, plantas)
const FIX_SIDE_A = withRows(SIDE_STAND, {
  12: '...oLGGGGGGGGGGGoo',
  13: '...oGGoGGoooGGooLo',
  14: '...oGo.oGo.oGo.oo.',
  15: '...oLo.oLo.oLo....',
  16: '...ooo.ooo.ooo....',
})
const FIX_SIDE_B = withRows(SIDE_STAND, {
  11: '...oGGgGGGgGGGwwoo',
  12: '...oLGGGGGGGGGGGoL',
  13: '...oGGoGGoooGGoGoo',
  14: '...oGo.oGo.oGo....',
  15: '...oLo.oLo.oLo....',
  16: '...ooo.ooo.ooo....',
})

// ————— Cansada (game over): echada con los ojos cerrados —————

const TIRED = [
  '................',
  '................',
  '................',
  '...o........o...',
  '..oPo......oPo..',
  '..oPGooooooGPo..',
  '.oGGGgGGGGgGGGo.',
  '.oGGGGGggGGGGGo.',
  '.oGGGGGGGGGGGGo.',
  '.oGkkkGGGGkkkGo.',
  '.oLwwwwPPwwwwLo.',
  '.ooLwwwwwwwwLooo',
  'oGGooooooooooGGo',
  'oGgGGGGGGGGGGgGo',
  'oLLoLLLooLLLoLLo',
  '.ooooooooooooooo',
  '................',
].slice(0, 17)

/** Cuadros de Nami, agrupados por estado y dirección */
export const NAMI = {
  /** Ciclo de caminata de 4 cuadros por dirección (paso, parada, otro paso, parada) */
  walk: {
    down: [FRONT_STEP_A, bob(FRONT_STAND), FRONT_STEP_B, bob(FRONT_STAND)],
    up: [BACK_STEP_A, bob(BACK_STAND), BACK_STEP_B, bob(BACK_STAND)],
    side: [sideTailBack(SIDE_STEP_A), bob(SIDE_STAND), sideTailBack(SIDE_STEP_B), bob(SIDE_STAND)],
  },
  /** Quieta (menos de 3 s) según hacia dónde mira; [normal, parpadeo o cola] */
  idle: {
    down: [FRONT_STAND, blinkFront(FRONT_STAND)],
    up: [BACK_STAND, withRows(BACK_STAND, BACK_TAIL_HIGH)],
    side: [SIDE_STAND, blinkSide(SIDE_STAND)],
  },
  /** Sentada de frente; [normal, parpadeo] */
  sit: [SIT, blinkFront(SIT)],
  /** Lamerse la patita, sentada de frente */
  lick: [LICK_A, LICK_B],
  fix: { up: [FIX_UP_A, FIX_UP_B], side: [FIX_SIDE_A, FIX_SIDE_B] },
  happy: { down: [happyFront(SIT), happyFront(FRONT_STAND)], side: [happySide(SIDE_STAND), happySide(SIDE_STEP_A)] },
  tired: TIRED,
}

/** Ancho de cada sprite (el alto es siempre 17) */
export const NAMI_H = 17
