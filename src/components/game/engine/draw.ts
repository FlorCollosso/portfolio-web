// Utilidades de dibujo en píxeles: convierte las grillas de texto en lienzos (una sola vez)
// y escribe con las fuentes de píxeles.
import { PAL } from './palette'
import { FONT_BIG, FONT_SMALL } from './sprites'

export type Ctx = CanvasRenderingContext2D
export type Colors = Record<string, string>

const BASE: Colors = PAL as unknown as Colors

const cache = new Map<string[], Map<string, HTMLCanvasElement>>()

/** Lienzo con el sprite pintado (se cachea por grilla y colores) */
export function spriteCanvas(rows: string[], colors: Colors = {}, key = '') {
  let byColors = cache.get(rows)
  if (!byColors) cache.set(rows, (byColors = new Map()))
  const hit = byColors.get(key)
  if (hit) return hit
  const c = document.createElement('canvas')
  c.width = rows[0].length
  c.height = rows.length
  const ctx = c.getContext('2d')!
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x]
      if (ch === '.') continue
      ctx.fillStyle = colors[ch] ?? BASE[ch] ?? '#ff00ff'
      ctx.fillRect(x, y, 1, 1)
    }
  })
  byColors.set(key, c)
  return c
}

/** Dibuja un sprite en coordenadas enteras; flip lo espeja horizontalmente */
export function drawSprite(ctx: Ctx, rows: string[], x: number, y: number, opts: { flip?: boolean; colors?: Colors; key?: string } = {}) {
  const img = spriteCanvas(rows, opts.colors, opts.key)
  x = Math.round(x)
  y = Math.round(y)
  if (!opts.flip) {
    ctx.drawImage(img, x, y)
    return
  }
  ctx.save()
  ctx.translate(x + img.width, y)
  ctx.scale(-1, 1)
  ctx.drawImage(img, 0, 0)
  ctx.restore()
}

export function rect(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

function glyphs(font: Record<string, string[]>, text: string) {
  return [...text.toUpperCase()].map((ch) => font[ch] ?? font[' '])
}

export function textWidth(text: string, size: 'big' | 'small', scale = 1) {
  const font = size === 'big' ? FONT_BIG : FONT_SMALL
  return glyphs(font, text).reduce((w, g) => w + (g[0].length + 1) * scale, -scale)
}

/** Texto en píxeles; shadow agrega una sombra dura de 1 píxel (escalado) */
export function drawText(ctx: Ctx, text: string, x: number, y: number, opts: { size?: 'big' | 'small'; scale?: number; color: string; shadow?: string }) {
  const size = opts.size ?? 'big'
  const s = opts.scale ?? 1
  const font = size === 'big' ? FONT_BIG : FONT_SMALL
  const paint = (ox: number, oy: number, color: string) => {
    ctx.fillStyle = color
    let cx = Math.round(x) + ox
    for (const g of glyphs(font, text)) {
      g.forEach((row, gy) => {
        for (let gx = 0; gx < row.length; gx++) if (row[gx] === '#') ctx.fillRect(cx + gx * s, Math.round(y) + oy + gy * s, s, s)
      })
      cx += (g[0].length + 1) * s
    }
  }
  if (opts.shadow) paint(s, s, opts.shadow)
  paint(0, 0, opts.color)
}
