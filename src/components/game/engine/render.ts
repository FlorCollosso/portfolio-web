// Dibujo de NAMI.EXE: lee el estado del juego (game.ts) y lo pinta en el canvas de 256 × 192.
// La habitación fija se pinta una sola vez en un lienzo aparte.
import { drawSprite, drawText, rect, spriteCanvas, textWidth, type Ctx } from './draw'
import { LICK_AFTER, TYPE_COLOR, urgency, type Game, type Incident } from './game'
import { NAMI, NAMI_H } from './namiSprites'
import { BOOK_COLORS, PAL } from './palette'
import { DESK, GLITCH_SLOTS, HUD_H, PLANT_SLOTS, VIEW } from './room'
import { CHAOS_MAX, COMBO_WINDOW, PURR, RULES, comboMultiplier } from './rules'
import { HEART, MICHI_PEEK, PLANT_OK, PLANT_SAD, SPARK, STAR, YARN } from './sprites'

const PLANT_COLORS = { l: PAL.sageDark, L: PAL.sage, t: PAL.teal, T: PAL.tealDeep, b: '#8a7a52', B: '#a8955f' }
const YARN_COLORS = { r: PAL.rose, R: PAL.roseDeep }
const HEART_COLORS = { h: '#e2607a', H: '#ffc2cf' }
const STAR_OFF = { y: '#6e6a78', Y: '#8a8694', W: '#a6a2b0', s: '#45424f' }
const WALL_BOTTOM = 76
const LAMP_X = 186

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')!] as const
}

// ————— Habitación (se pinta una vez) —————

function bookshelf(ctx: Ctx, x: number, w: number, seed: number) {
  rect(ctx, x, 16, w, WALL_BOTTOM - 14, PAL.woodDeep)
  rect(ctx, x + 2, 18, w - 4, WALL_BOTTOM - 18, '#2e2433')
  for (const sy of [32, 52, 72]) {
    rect(ctx, x + 2, sy, w - 4, 3, PAL.wood)
    rect(ctx, x + 2, sy, w - 4, 1, PAL.woodLight)
    // Libros parados (dejan huecos donde aparecen las estrellas)
    let bx = x + 4
    let i = seed + sy
    while (bx < x + w - 6) {
      const gap = (i * 7) % 11 === 0
      const bw = 3 + (i % 2)
      const bh = 9 + ((i * 5) % 6)
      if (!gap) {
        const [c, band] = BOOK_COLORS[i % BOOK_COLORS.length]
        rect(ctx, bx, sy - bh, bw, bh, c)
        rect(ctx, bx, sy - bh + 2, bw, 1, band)
        rect(ctx, bx + bw - 1, sy - bh, 1, bh, 'rgba(0,0,0,0.2)')
      }
      bx += bw + (gap ? 9 : 0)
      i++
    }
  }
}

function frameArt(ctx: Ctx, index: number) {
  const { draw, size } = GLITCH_SLOTS[index]
  const { x, y } = draw
  const { w, h } = size!
  if (index === 2) return // el monitor se dibuja con el escritorio
  // Hilo y clavito
  rect(ctx, x + w / 2, y - 6, 1, 1, PAL.grey)
  for (let i = 1; i < 6; i++) {
    rect(ctx, x + w / 2 - i * 2, y - 6 + i, 1, 1, PAL.greyDark)
    rect(ctx, x + w / 2 + i * 2, y - 6 + i, 1, 1, PAL.greyDark)
  }
  rect(ctx, x, y, w, h, PAL.woodDark)
  if (index === 0) {
    // Magic Bloom: flores sobre violeta
    rect(ctx, x + 2, y + 2, w - 4, h - 4, PAL.plum)
    for (const [fx, fy] of [[5, 13], [11, 8], [17, 14], [22, 7], [8, 17], [20, 17]]) {
      rect(ctx, x + fx, y + fy, 2, 2, PAL.plumLight)
      rect(ctx, x + fx + 1, y + fy + 1, 1, 1, PAL.rose)
    }
    rect(ctx, x + 5, y + 4, 13, 2, PAL.roseLight)
  } else {
    // Ocha: tacita de té sobre crema
    rect(ctx, x + 2, y + 2, w - 4, h - 4, PAL.cream)
    rect(ctx, x + 8, y + 8, 8, 6, PAL.sage)
    rect(ctx, x + 16, y + 9, 2, 3, PAL.sage)
    rect(ctx, x + 9, y + 6, 1, 2, PAL.greyDark)
    rect(ctx, x + 12, y + 5, 1, 3, PAL.greyDark)
    rect(ctx, x + 6, y + 14, 12, 1, PAL.woodDark)
  }
}

function paintRoom() {
  const [c, ctx] = canvas(VIEW.w, VIEW.h)
  // Pared
  rect(ctx, 0, HUD_H, VIEW.w, WALL_BOTTOM - HUD_H, PAL.wall)
  for (let x = 3; x < VIEW.w; x += 7) rect(ctx, x, HUD_H, 1, WALL_BOTTOM - HUD_H, PAL.wallLine)
  rect(ctx, 0, HUD_H, VIEW.w, 2, PAL.wallDark)
  bookshelf(ctx, 4, 52, 1)
  bookshelf(ctx, 204, 48, 4)
  // Ventana con luna y estrellitas
  const wx = 102
  const wy = 18
  rect(ctx, wx, wy + 4, 40, 34, PAL.woodDark)
  rect(ctx, wx + 4, wy, 32, 6, PAL.woodDark)
  rect(ctx, wx + 3, wy + 4, 34, 31, PAL.glass)
  rect(ctx, wx + 6, wy + 2, 28, 4, PAL.glass)
  rect(ctx, wx + 3, wy + 22, 34, 13, PAL.glassLight)
  rect(ctx, wx + 19, wy + 2, 2, 33, PAL.woodDark)
  rect(ctx, wx + 3, wy + 20, 34, 2, PAL.woodDark)
  rect(ctx, wx + 25, wy + 7, 5, 7, PAL.moon)
  rect(ctx, wx + 24, wy + 8, 7, 5, PAL.moon)
  rect(ctx, wx + 23, wy + 7, 4, 6, PAL.glass)
  for (const [sx, sy] of [[8, 9], [13, 15], [31, 17], [9, 28], [30, 30]]) rect(ctx, wx + sx, wy + sy, 1, 1, PAL.twinkle)
  rect(ctx, wx - 3, wy + 38, 46, 3, PAL.wood)
  rect(ctx, wx - 3, wy + 41, 46, 1, PAL.woodDeep)
  frameArt(ctx, 0)
  frameArt(ctx, 1)
  // Notitas sueltas pegadas en la pared
  rect(ctx, 66, 54, 7, 7, '#f6e7a8')
  rect(ctx, 75, 56, 7, 7, PAL.roseLight)
  rect(ctx, 67, 56, 4, 1, PAL.greyDark)
  rect(ctx, 76, 58, 4, 1, PAL.greyDark)
  // Lámpara del techo
  rect(ctx, LAMP_X, HUD_H, 1, 12, PAL.greyDark)
  for (let r = 0; r < 7; r++) rect(ctx, LAMP_X - 3 - r, HUD_H + 12 + r, 7 + r * 2, 1, r === 0 ? '#3d7a77' : PAL.tealDark)
  rect(ctx, LAMP_X - 9, HUD_H + 19, 19, 1, PAL.glow)
  rect(ctx, LAMP_X - 2, HUD_H + 19, 5, 2, PAL.bulb)
  // Zócalo y piso de madera
  rect(ctx, 0, WALL_BOTTOM - 4, VIEW.w, 4, PAL.woodDeep)
  rect(ctx, 0, WALL_BOTTOM - 4, VIEW.w, 1, PAL.woodDark)
  rect(ctx, 0, WALL_BOTTOM, VIEW.w, VIEW.h - WALL_BOTTOM, PAL.floor)
  for (let y = WALL_BOTTOM + 9; y < VIEW.h; y += 10) {
    rect(ctx, 0, y, VIEW.w, 1, PAL.floorLine)
    for (let x = ((y / 10) % 2) * 20 + 8; x < VIEW.w; x += 40) rect(ctx, x, y - 9, 1, 9, PAL.floorLine)
  }
  rect(ctx, 0, WALL_BOTTOM, VIEW.w, 1, PAL.floorTop)
  // Alfombra rosa
  rect(ctx, 62, 122, 86, 34, PAL.roseDeep)
  rect(ctx, 64, 124, 82, 30, PAL.rose)
  rect(ctx, 68, 128, 74, 22, '#c97a8e')
  for (let x = 66; x < 146; x += 4) {
    rect(ctx, x, 120, 1, 2, PAL.roseLight)
    rect(ctx, x, 156, 1, 2, PAL.roseLight)
  }
  return c
}

function paintLight() {
  const [c, ctx] = canvas(VIEW.w, VIEW.h)
  const top = HUD_H + 20
  for (let y = top; y < VIEW.h; y += 2) {
    const k = (y - top) / (VIEW.h - top)
    const half = 8 + Math.round(k * 46)
    ctx.globalAlpha = 0.12 - k * 0.07
    rect(ctx, LAMP_X - half, y, half * 2 + 1, 2, PAL.glow)
  }
  ctx.globalAlpha = 1
  return c
}

// ————— Render por cuadro —————

export class Renderer {
  private ctx: Ctx
  private room = paintRoom()
  private light = paintLight()
  private reduced: boolean

  constructor(canvasEl: HTMLCanvasElement, reduced: boolean) {
    this.ctx = canvasEl.getContext('2d')!
    this.ctx.imageSmoothingEnabled = false
    this.reduced = reduced
  }

  draw(g: Game) {
    const ctx = this.ctx
    const t = g.t + (g.mode === 'over' ? g.overT : 0)
    ctx.save()
    if (g.shake > 0 && !this.reduced) ctx.translate(Math.round((Math.random() - 0.5) * 3), Math.round((Math.random() - 0.5) * 3))
    ctx.drawImage(this.room, 0, 0)
    this.michi(ctx, t)

    // Pared: cuadros con glitch y estrellas apagadas
    const live = g.mode === 'title' ? [] : g.incidents
    for (const inc of live) if (inc.type === 'glitch') this.glitch(ctx, inc, t)
    if (g.mode === 'title') this.titleGlitch(ctx, t)
    for (const inc of live) if (inc.type === 'star') this.star(ctx, inc, t)

    // Piso: marcas de dónde pararse para lo que está en la pared
    for (const inc of live) if (inc.type === 'glitch' || inc.type === 'star') this.useMark(ctx, inc, t)

    // Objetos del piso ordenados por profundidad (más abajo = más adelante)
    const items: { y: number; paint: () => void }[] = []
    items.push({ y: DESK.y + DESK.h, paint: () => this.desk(ctx, g, t) })
    PLANT_SLOTS.forEach((slot, i) => {
      const sad = live.find((inc) => inc.type === 'plant' && inc.slot === i)
      items.push({ y: slot.draw.y + 14, paint: () => this.plant(ctx, slot.draw.x, slot.draw.y, sad, t) })
    })
    for (const inc of live) {
      if (inc.type === 'book' || inc.type === 'yarn' || inc.type === 'heart') items.push({ y: inc.use.y, paint: () => this.floorItem(ctx, inc, t) })
    }
    if (g.mode !== 'title') items.push({ y: g.cat.y, paint: () => this.nami(ctx, g, t) })
    items.sort((a, b) => a.y - b.y).forEach((it) => it.paint())

    // Indicadores sobre las incidencias
    for (const inc of live) this.badge(ctx, inc, g, t)

    for (const p of g.particles) rect(ctx, p.x, p.y, p.life > 10 ? 2 : 1, p.life > 10 ? 2 : 1, p.color)
    ctx.drawImage(this.light, 0, 0)
    for (const p of g.popups) this.popup(ctx, p.text, p.x, p.y, p.color, p.t)

    if (g.mode === 'title') this.title(ctx, t)
    else {
      this.chaosVignette(ctx, g, t)
      this.bannerText(ctx, g)
      if (g.mode === 'over') rect(ctx, 0, HUD_H, VIEW.w, VIEW.h - HUD_H, 'rgba(18,16,30,0.55)')
      if (g.mode === 'paused') rect(ctx, 0, HUD_H, VIEW.w, VIEW.h - HUD_H, 'rgba(18,16,30,0.6)')
    }
    ctx.restore()
    if (g.mode !== 'title') this.hud(ctx, g, t)
  }

  // ————— Nami —————

  /** Elige el cuadro de Nami según el estado: caminar por dirección, arreglar, festejar, quieta o lamerse la patita */
  private namiFrame(g: Game, t: number): { rows: string[]; flip: boolean } {
    const c = g.cat
    const flip = c.dir === 'left'
    const side = c.dir === 'left' || c.dir === 'right'
    const view: 'side' | 'up' | 'down' = side ? 'side' : c.dir === 'up' ? 'up' : 'down'
    const blink = t % 200 < 7 ? 1 : 0
    if (g.mode === 'over') return { rows: NAMI.tired, flip: false }
    if (c.fixing) return { rows: NAMI.fix[c.dir === 'up' ? 'up' : 'side'][Math.floor(t / 7) % 2], flip }
    if (c.happyT > 0) return { rows: NAMI.happy[side ? 'side' : 'down'][Math.floor(t / 10) % 2], flip }
    if (Math.hypot(c.vx, c.vy) > 0.25) return { rows: NAMI.walk[view][Math.floor(c.walkT / 6) % 4], flip }
    if (g.mode === 'playing' && c.idleT >= LICK_AFTER) return { rows: this.lickFrame(c.idleT - LICK_AFTER, t), flip: false }
    if (view === 'up') return { rows: NAMI.idle.up[this.reduced ? 0 : Math.floor(t / 40) % 2], flip }
    return { rows: NAMI.idle[view][blink], flip }
  }

  /** Sentada de frente: primero se acomoda, después se lame la patita con pausas para parpadear */
  private lickFrame(k: number, t: number) {
    if (k < 14 || this.reduced) return NAMI.sit[t % 200 < 7 ? 1 : 0]
    const p = (k - 14) % 130
    if (p < 80) return NAMI.lick[Math.floor(p / 10) % 2]
    return NAMI.sit[p < 88 ? 1 : 0]
  }

  private nami(ctx: Ctx, g: Game, t: number) {
    const c = g.cat
    const { rows, flip } = this.namiFrame(g, t)
    const w = rows[0].length
    const hop = c.hopT > 0 && !this.reduced ? Math.round(Math.sin((c.hopT / 16) * Math.PI) * 5) : 0
    const x = Math.round(c.x) - Math.floor(w / 2)
    const y = Math.round(c.y) - NAMI_H + 1 - hop
    rect(ctx, c.x - 7, c.y - 1, 14, 2, 'rgba(0,0,0,0.28)')
    // Ronroneo: aura rosa y corazoncitos
    if (g.purrT > 0) {
      const a = (Math.sin(t / 4) + 1) / 2
      ctx.globalAlpha = 0.25 + a * 0.25
      rect(ctx, x + 1, y + 2, w - 2, NAMI_H - 2, '#ff8fab')
      ctx.globalAlpha = 1
      if (!this.reduced && t % 14 === 0) g.particles.push({ x: c.x + (Math.random() - 0.5) * 12, y: c.y - 14, vx: 0, vy: -0.6, life: 26, color: '#ff8fab' })
    }
    drawSprite(ctx, rows, x, y, { flip })
    // Gotita de nervios si el caos está alto
    if (g.mode === 'playing' && g.chaos > 78 && Math.floor(t / 15) % 2) {
      const dx = flip ? x + 1 : x + w - 1
      rect(ctx, dx, y + 1, 1, 2, '#9fd3ff')
      rect(ctx, dx - 1, y + 3, 3, 2, '#9fd3ff')
    }
    // Cansada: zzz
    if (g.mode === 'over') {
      const k = Math.floor(t / 30) % 3
      for (let i = 0; i <= k; i++) drawText(ctx, 'Z', x + w + 1 + i * 5, y + 2 - i * 5, { color: PAL.twinkle })
    }
  }

  // ————— Incidencias —————

  private glitch(ctx: Ctx, inc: Incident, t: number) {
    const { w, h } = GLITCH_SLOTS[inc.slot].size!
    const { x, y } = inc.draw
    const u = urgency(inc)
    const seed = Math.floor(t / (u > 0.99 ? 3 : 6))
    // Franjas corridas y ruido de colores
    for (let r = 0; r < h - 4; r += 2) {
      const n = (seed * 31 + r * 17) % 13
      if (n < 5) rect(ctx, x + 2 + (n % 3) - 1, y + 2 + r, w - 4, 2, n % 2 ? '#3fe0d0' : '#ff5fa2')
      else if (n < 7) rect(ctx, x + 2, y + 2 + r, w - 4, 1, '#1b1d2e')
    }
    for (let i = 0; i < 5; i++) {
      const n = (seed * 13 + i * 29) % 97
      rect(ctx, x + 2 + (n % (w - 5)), y + 2 + ((n * 3) % (h - 5)), 2, 1, PAL.twinkle)
    }
  }

  private titleGlitch(ctx: Ctx, t: number) {
    if (this.reduced || Math.floor(t / 90) % 3 !== 0) return
    this.glitch(ctx, { draw: GLITCH_SLOTS[0].draw, slot: 0, type: 'glitch', age: 0 } as Incident, t)
  }

  private star(ctx: Ctx, inc: Incident, t: number) {
    const u = urgency(inc)
    // Parpadea cuando está por apagarse del todo
    if (u > 0.75 && Math.floor(t / 6) % 2) return
    drawSprite(ctx, STAR, inc.draw.x, inc.draw.y, { colors: STAR_OFF, key: 'off' })
  }

  private plant(ctx: Ctx, x: number, y: number, sad: Incident | undefined, t: number) {
    const droop = sad && !this.reduced ? Math.floor(t / 30) % 2 : 0
    drawSprite(ctx, sad ? PLANT_SAD : PLANT_OK, x, y + droop, { colors: PLANT_COLORS, key: 'plant' })
  }

  private floorItem(ctx: Ctx, inc: Incident, t: number) {
    const { x, y } = inc.draw
    if (inc.type === 'book') {
      const [c, band] = BOOK_COLORS[inc.variant]
      rect(ctx, x - 1, y + 6, 11, 1, 'rgba(0,0,0,0.3)')
      rect(ctx, x - 1, y + 1, 11, 5, c)
      rect(ctx, x - 1, y + 1, 11, 1, 'rgba(255,255,255,0.25)')
      rect(ctx, x + 1, y + 1, 1, 5, band)
      rect(ctx, x + 9, y + 2, 1, 3, PAL.cream)
      // Una hojita suelta al lado
      rect(ctx, x + 11, y + 4, 4, 3, PAL.twinkle)
    } else if (inc.type === 'yarn') {
      rect(ctx, x, y + 7, 7, 1, 'rgba(0,0,0,0.3)')
      const frame = Math.floor((inc.draw.x + inc.draw.y) / 3) % 2
      drawSprite(ctx, YARN[frame], x, y, { colors: YARN_COLORS, key: 'yarn' })
      // Hilito que queda atrás
      rect(ctx, x - Math.sign(inc.vx || 1) * 3, y + 5, 3, 1, PAL.rose)
    } else {
      const bob = this.reduced ? 0 : Math.round(Math.sin(t / 10) * 1.5)
      rect(ctx, x, y + 7, 7, 1, 'rgba(0,0,0,0.3)')
      if (urgency(inc) > 0.7 && Math.floor(t / 5) % 2) return
      drawSprite(ctx, HEART, x, y - 1 + bob, { colors: HEART_COLORS, key: 'heart' })
    }
  }

  /** Marca suave en el piso: ahí se para Nami para atender lo de la pared */
  private useMark(ctx: Ctx, inc: Incident, t: number) {
    const { x, y } = inc.use
    ctx.globalAlpha = 0.35 + (Math.floor(t / 20) % 2) * 0.15
    const color = TYPE_COLOR[inc.type]
    for (const [dx, dy] of [[-6, 0], [-4, -2], [-2, -2], [0, -2], [2, -2], [4, -2], [6, 0], [-4, 2], [-2, 2], [0, 2], [2, 2], [4, 2]]) rect(ctx, x + dx, y + dy - 1, 2, 1, color)
    ctx.globalAlpha = 1
  }

  /** "!" de urgencia, barra de progreso y tecla para atender */
  private badge(ctx: Ctx, inc: Incident, g: Game, t: number) {
    const rule = RULES[inc.type]
    const u = urgency(inc)
    const wall = inc.type === 'glitch' || inc.type === 'star'
    const size = inc.type === 'glitch' ? GLITCH_SLOTS[inc.slot].size! : { w: 9, h: 9 }
    const bx = Math.round(inc.draw.x + (wall ? size.w / 2 : inc.type === 'plant' ? 7 : 4)) - 3
    const by = Math.round(inc.draw.y - 9)
    if (g.target === inc && g.mode === 'playing') {
      // Tecla de acción (A) y progreso si hay que mantenerla
      rect(ctx, bx - 1, by - 1, 9, 9, '#93354f')
      rect(ctx, bx, by - 2, 7, 11, '#93354f')
      rect(ctx, bx, by, 7, 7, '#d88da0')
      drawText(ctx, 'A', bx + 1, by, { color: PAL.twinkle })
      if (rule.solve === 'hold') {
        rect(ctx, bx - 4, by + 11, 15, 3, '#141320')
        rect(ctx, bx - 3, by + 12, Math.round(13 * inc.progress), 1, '#9fffcf')
      }
      return
    }
    if (inc.type === 'yarn' || inc.type === 'heart') return
    if (u < 0.35) return
    const critical = u >= 1
    if (critical && Math.floor(t / 8) % 2) return
    const color = critical ? '#ff4d6d' : u > 0.7 ? '#ffb04d' : '#ffe08a'
    rect(ctx, bx + 1, by, 5, 8, '#141320')
    rect(ctx, bx + 2, by + 1, 3, 4, color)
    rect(ctx, bx + 2, by + 6, 3, 1, color)
  }

  // ————— Escritorio, consolita y monitor —————

  private desk(ctx: Ctx, g: Game, t: number) {
    const { x, y, w } = DESK
    // Cosas sobre el escritorio
    const mon = GLITCH_SLOTS[2]
    rect(ctx, mon.draw.x - 2, mon.draw.y - 2, mon.size!.w + 4, mon.size!.h + 4, '#3a3a46')
    rect(ctx, mon.draw.x, mon.draw.y, mon.size!.w, mon.size!.h, '#20384a')
    const glitching = g.incidents.some((i) => i.type === 'glitch' && i.slot === 2) && g.mode !== 'title'
    if (glitching) this.glitch(ctx, g.incidents.find((i) => i.type === 'glitch' && i.slot === 2)!, t)
    else {
      // Pantalla tranquila: líneas de código
      rect(ctx, mon.draw.x + 2, mon.draw.y + 2, 6, 1, '#80bdbb')
      rect(ctx, mon.draw.x + 4, mon.draw.y + 4, 8, 1, '#c9ef6b')
      rect(ctx, mon.draw.x + 4, mon.draw.y + 6, 5, 1, '#d88da0')
      if (Math.floor(t / 30) % 2) rect(ctx, mon.draw.x + 10, mon.draw.y + 6, 2, 1, PAL.twinkle)
    }
    rect(ctx, mon.draw.x + 6, mon.draw.y + mon.size!.h + 2, 4, 3, '#3a3a46')
    // Tabla
    rect(ctx, x, y - 6, w, 8, PAL.wood)
    rect(ctx, x, y - 6, w, 1, PAL.woodLight)
    rect(ctx, x + 1, y + 2, w - 2, 14, PAL.woodDark)
    rect(ctx, x + 3, y + 5, 22, 1, PAL.woodDeep)
    rect(ctx, x + 3, y + 10, 22, 1, PAL.woodDeep)
    rect(ctx, x + 12, y + 7, 4, 1, PAL.woodLight)
    rect(ctx, x + 2, y + 16, 3, 6, PAL.woodDeep)
    rect(ctx, x + w - 5, y + 16, 3, 6, PAL.woodDeep)
    // Taza y consolita rosa (con su corazón)
    rect(ctx, x + 4, y - 11, 5, 5, PAL.cream)
    rect(ctx, x + 9, y - 10, 1, 3, PAL.cream)
    rect(ctx, x + 47, y - 13, 8, 11, '#ecc5cb')
    rect(ctx, x + 48, y - 12, 6, 5, '#bcd9c4')
    rect(ctx, x + 50, y - 11, 1, 1, '#c56478')
    rect(ctx, x + 52, y - 11, 1, 1, '#c56478')
    rect(ctx, x + 50, y - 10, 3, 1, '#c56478')
    rect(ctx, x + 51, y - 9, 1, 1, '#c56478')
    rect(ctx, x + 49, y - 5, 2, 1, '#5a5560')
    rect(ctx, x + 53, y - 5, 1, 1, '#c56478')
  }

  /** Easter egg: Michi, el gato naranja de la biblioteca, espía por la ventana */
  private michi(ctx: Ctx, t: number) {
    const k = t % 1500
    if (k > 200) return
    const rise = Math.min(4, Math.floor(k / 6), Math.floor((200 - k) / 6))
    ctx.save()
    ctx.beginPath()
    ctx.rect(105, 22, 34, 34)
    ctx.clip()
    drawSprite(ctx, MICHI_PEEK, 108, 56 - rise)
    ctx.restore()
  }

  // ————— Interfaz —————

  private hud(ctx: Ctx, g: Game, t: number) {
    rect(ctx, 0, 0, VIEW.w, HUD_H, '#141320')
    rect(ctx, 0, HUD_H - 1, VIEW.w, 1, '#2c2a3c')
    // Puntaje
    drawText(ctx, String(g.score).padStart(6, '0'), 4, 4, { color: PAL.twinkle })
    // Combo y su ventanita de tiempo
    if (g.combo > 1) {
      const mult = comboMultiplier(g.combo) * (g.purrT > 0 ? PURR.multiplier : 1)
      drawText(ctx, `X${mult % 1 ? mult.toFixed(2).replace(/0$/, '') : mult}`, 46, 3, { color: g.purrT > 0 ? '#ff8fab' : PAL.roseLight })
      rect(ctx, 46, 11, Math.round(26 * (g.comboT / (COMBO_WINDOW * 60))), 1, PAL.roseLight)
    }
    // Caos
    const cx = 80
    drawText(ctx, g.texts.chaos, cx, 4, { color: g.chaos > 75 ? '#ff7b8f' : '#a6a2b0' })
    // La barra empieza después de la etiqueta y termina siempre en el mismo lugar ("CAOS" o "CHAOS")
    const bx = cx + textWidth(g.texts.chaos, 'big') + 2
    const bw = 181 - bx
    rect(ctx, bx - 1, 3, bw + 2, 9, '#2c2a3c')
    const k = g.chaos / CHAOS_MAX
    const color = k > 0.75 ? '#ff4d6d' : k > 0.5 ? '#ffb04d' : '#7fd1a0'
    const pulse = k > 0.75 && !this.reduced && Math.floor(t / 10) % 2
    rect(ctx, bx, 4, Math.round(bw * k), 7, pulse ? '#ff9aaa' : color)
    for (let i = 1; i < 4; i++) rect(ctx, bx + Math.round((bw * i) / 4), 4, 1, 7, 'rgba(20,19,32,0.6)')
    // Tiempo
    const s = Math.floor(g.seconds)
    drawText(ctx, `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`, 188, 4, { color: '#a6a2b0' })
    // Boost guardado (B)
    rect(ctx, 224, 2, 28, 11, '#2c2a3c')
    drawText(ctx, 'B', 227, 4, { color: g.boostStored ? PAL.roseLight : '#5a5868' })
    if (g.boostStored) {
      const blink = !this.reduced && Math.floor(t / 20) % 2
      drawSprite(ctx, HEART, 236, 4 - (blink ? 1 : 0), { colors: HEART_COLORS, key: 'heart' })
    } else {
      ctx.globalAlpha = 0.3
      drawSprite(ctx, HEART, 236, 4, { colors: { h: '#6e6a78', H: '#8a8694' }, key: 'heartOff' })
      ctx.globalAlpha = 1
    }
    if (g.purrT > 0) rect(ctx, 224, 13, Math.round(28 * (g.purrT / (PURR.seconds * 60))), 1, '#ff8fab')
  }

  private chaosVignette(ctx: Ctx, g: Game, t: number) {
    if (g.chaos < 75 || g.mode !== 'playing') return
    const a = this.reduced ? 0.25 : 0.15 + ((Math.sin(t / 6) + 1) / 2) * 0.25
    ctx.globalAlpha = a
    rect(ctx, 0, HUD_H, VIEW.w, 3, '#ff4d6d')
    rect(ctx, 0, VIEW.h - 3, VIEW.w, 3, '#ff4d6d')
    rect(ctx, 0, HUD_H, 3, VIEW.h, '#ff4d6d')
    rect(ctx, VIEW.w - 3, HUD_H, 3, VIEW.h, '#ff4d6d')
    ctx.globalAlpha = 1
  }

  private bannerText(ctx: Ctx, g: Game) {
    const { text, t } = g.banner
    if (t <= 0 || g.mode !== 'playing') return
    const scale = textWidth(text, 'big', 2) < 220 ? 2 : 1
    const w = textWidth(text, 'big', scale)
    const slide = this.reduced ? 0 : Math.max(0, 10 - (110 - t)) * 4
    const x = Math.round((VIEW.w - w) / 2) + slide
    const y = 96
    ctx.globalAlpha = Math.min(1, t / 15)
    rect(ctx, 0, y - 5, VIEW.w, 7 * scale + 10, 'rgba(18,16,30,0.75)')
    drawText(ctx, text, x, y, { scale, color: PAL.roseLight, shadow: PAL.roseDeep })
    ctx.globalAlpha = 1
  }

  private popup(ctx: Ctx, text: string, x: number, y: number, color: string, t: number) {
    const numeric = /^[+\d]+$/.test(text)
    const size = numeric ? 'small' : 'big'
    const w = textWidth(text, size)
    ctx.globalAlpha = Math.min(1, t / 12)
    drawText(ctx, text, Math.round(x - w / 2), Math.round(y), { size, color, shadow: '#141320' })
    ctx.globalAlpha = 1
  }

  private title(ctx: Ctx, t: number) {
    rect(ctx, 0, 0, VIEW.w, VIEW.h, 'rgba(18,16,30,0.45)')
    const title = 'NAMI.EXE'
    const tw = textWidth(title, 'big', 3)
    const tx = Math.round((VIEW.w - tw) / 2)
    drawText(ctx, title, tx, 8, { scale: 3, color: PAL.roseLight, shadow: PAL.roseDeep })
    const sub = 'QUALITY CONTROL'
    drawText(ctx, sub, Math.round((VIEW.w - textWidth(sub, 'big')) / 2), 33, { color: PAL.teal, shadow: '#141320' })
    // Nami, al doble de tamaño, haciendo control de calidad
    // Nami sentada al doble de tamaño; de vez en cuando se lame la patita
    const k = t % 360
    const rows = !this.reduced && k >= 240 ? NAMI.lick[Math.floor(k / 10) % 2] : NAMI.sit[t % 200 < 7 ? 1 : 0]
    rect(ctx, 110, 74, 36, 3, 'rgba(0,0,0,0.3)')
    ctx.drawImage(spriteCanvas(rows), 112, 42, rows[0].length * 2, NAMI_H * 2)
    if (!this.reduced && Math.floor(t / 25) % 2) drawSprite(ctx, SPARK, 150, 46)
    drawSprite(ctx, STAR, tx - 14, 14)
    drawSprite(ctx, STAR, tx + tw + 5, 14)
  }
}
