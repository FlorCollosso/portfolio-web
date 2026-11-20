// Lógica de NAMI.EXE (sin dibujo): estado, entrada, incidencias, caos, combos y puntaje.
// Avanza con paso fijo de 1/60 s; el render lee el estado y lo pinta (render.ts).
import type { Sfx } from './audio'
import type { Facing } from './namiSprites'
import { CANVAS_TEXT, type CanvasText } from './texts'
import { FLOOR, FLOOR_SPOTS, GLITCH_SLOTS, OBSTACLES, PLANT_SLOTS, STAR_SLOTS, START, type Point, type Rect } from './room'
import { CHAOS_MAX, COMBO_WINDOW, EFFICIENCY_POINTS, PHASES, PURR, QUICK, QUICK_BONUS, RULES, SURVIVAL_POINTS, YARN_RAIN, comboMultiplier, difficulty, type IncidentType } from './rules'

export type Mode = 'title' | 'playing' | 'paused' | 'over'
export const FPS = 60

export interface Incident {
  id: number
  type: IncidentType
  /** Índice del lugar fijo (cuadros, estrellas, plantas); -1 en el piso */
  slot: number
  draw: Point
  use: Point
  age: number
  /** Lana: velocidad con la que rueda */
  vx: number
  vy: number
  /** Libro: color */
  variant: number
  progress: number
  /** Zona desde donde se la puede atender (si no, alrededor de use) */
  zone?: Rect
}

export interface Popup {
  x: number
  y: number
  text: string
  color: string
  t: number
}
export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

export interface Summary {
  score: number
  base: number
  survival: number
  efficiency: number
  seconds: number
  resolved: number
  maxCombo: number
  /** Incidencias abiertas al terminar */
  open: number
  /** El tipo de incidencia que más caos sumó */
  worst: IncidentType
}

export interface GameEvents {
  onSfx: (name: Sfx) => void
  onOver: (summary: Summary) => void
}

const ACCEL = 0.32
const FRICTION = 0.7
const SPEED = 1.35
const REACH = 13
const TOUCH = 11
const FEET = { w: 10, h: 5 }

export const TYPE_COLOR: Record<IncidentType, string> = {
  book: '#d6a24a',
  yarn: '#d88da0',
  glitch: '#80bdbb',
  plant: '#a3c4a2',
  star: '#ffd27a',
  heart: '#ff8fab',
}

/** Distancia de un punto a un rectángulo (0 si está adentro) */
const toRect = (x: number, y: number, r: Rect) => Math.hypot(Math.max(r.x - x, 0, x - (r.x + r.w)), Math.max(r.y - y, 0, y - (r.y + r.h)))
const hit = (a: Rect, b: Rect) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
const emptyChaos = (): Record<IncidentType, number> => ({ book: 0, yarn: 0, glitch: 0, plant: 0, star: 0, heart: 0 })
const freshCat = () => ({
  x: START.x,
  y: START.y,
  vx: 0,
  vy: 0,
  /** Hacia dónde mira (elige el sprite) */
  dir: 'down' as Facing,
  walkT: 0,
  fixing: false,
  hopT: 0,
  happyT: 0,
  /** Cuadros seguidos sin ningún input (a los 3 s se lame la patita) */
  idleT: 0,
})
/** Cuadros sin input hasta que Nami se sienta a lamerse la patita */
export const LICK_AFTER = 3 * FPS

export class Game {
  mode: Mode = 'title'
  readonly input = { up: false, down: false, left: false, right: false, action: false, boost: false }
  /** Textos del canvas en el idioma del sitio; se puede cambiar en cualquier momento sin cortar el turno */
  texts: CanvasText = CANVAS_TEXT.es

  t = 0
  cat = freshCat()
  incidents: Incident[] = []
  /** Incidencia que Nami puede atender ahora (para mostrar la tecla) */
  target: Incident | null = null
  chaos = 0
  score = 0
  combo = 0
  comboT = 0
  maxCombo = 0
  boostStored = false
  purrT = 0
  resolved = 0
  spawned = 0
  popups: Popup[] = []
  particles: Particle[] = []
  banner = { text: '', t: 0 }
  shake = 0
  /** Caos que sumó cada tipo (para explicar por qué se perdió) */
  chaosBy = emptyChaos()
  summary: Summary | null = null
  /** Cuadros desde el final (para la animación de cansancio) */
  overT = 0

  private events: GameEvents
  private nextId = 1
  private spawnT = 0
  private phase = -1
  private rained = false
  private prevAction = false
  private prevBoost = false
  private warnT = 0

  constructor(events: GameEvents) {
    this.events = events
  }

  get seconds() {
    return this.t / FPS
  }

  /** Empieza (o reinicia) un turno */
  play() {
    this.clear()
    this.mode = 'playing'
    // Arranca tranquilo: un libro y una lana para aprender
    this.spawn('book')
    this.spawn('yarn')
  }

  /** Vuelve a la pantalla de inicio: corta el turno y no deja nada pendiente */
  menu() {
    this.clear()
    this.mode = 'title'
  }

  /** Deja todo el estado del turno como recién creado */
  private clear() {
    this.t = 0
    this.cat = freshCat()
    this.incidents = []
    this.target = null
    this.chaos = 0
    this.score = 0
    this.combo = 0
    this.comboT = 0
    this.maxCombo = 0
    this.boostStored = false
    this.purrT = 0
    this.resolved = 0
    this.spawned = 0
    this.popups = []
    this.particles = []
    this.banner = { text: '', t: 0 }
    this.shake = 0
    this.chaosBy = emptyChaos()
    this.summary = null
    this.overT = 0
    this.spawnT = 2 * FPS
    this.phase = -1
    this.rained = false
    this.warnT = 0
    this.prevAction = this.input.action
    this.prevBoost = this.input.boost
  }

  pause() {
    if (this.mode === 'playing') this.mode = 'paused'
  }

  resume() {
    if (this.mode === 'paused') {
      this.mode = 'playing'
      this.prevAction = this.input.action
      this.prevBoost = this.input.boost
    }
  }

  step() {
    if (this.mode === 'paused') return
    this.tickFx()
    if (this.mode === 'title') {
      this.t++
      return
    }
    if (this.mode === 'over') {
      this.overT++
      return
    }
    this.t++
    const s = this.seconds
    const diff = difficulty(s)

    // Etapas del turno
    let next = -1
    PHASES.forEach((p, i) => {
      if (s >= p.at) next = i
    })
    if (next > this.phase) {
      this.phase = next
      this.say(this.texts.phases[next])
      if (next > 0) this.events.onSfx('phase')
    }
    if (!this.rained && s >= YARN_RAIN.at) {
      this.rained = true
      this.say(this.texts.yarnRain)
      for (let i = 0; i < YARN_RAIN.count; i++) this.spawn('yarn')
      this.events.onSfx('phase')
    }

    // Aparecen incidencias
    if (--this.spawnT <= 0) {
      this.spawnT = diff.spawnEvery * FPS * (0.75 + Math.random() * 0.5)
      if (this.incidents.length < diff.maxActive) this.spawn(this.pickType(s))
    }

    this.moveCat()
    this.handleActions()

    // Las incidencias suman caos; algunas se apagan solas
    const purr = this.purrT > 0 ? 0.5 : 1
    let gain = 0
    for (const inc of [...this.incidents]) {
      const rule = RULES[inc.type]
      inc.age++
      const age = inc.age / FPS
      const crit = rule.critical > 0 && age > rule.critical
      const g = (rule.chaos * (crit ? 2 : 1) * diff.chaosMult * purr) / FPS
      gain += g
      this.chaosBy[inc.type] += g
      if (rule.life > 0 && age > rule.life) {
        this.remove(inc)
        if (inc.type === 'star') this.popup(inc.draw.x + 4, inc.draw.y, this.texts.starOff, '#9a948e')
      }
      if (inc.type === 'yarn') this.rollYarn(inc)
    }
    this.chaos = Math.min(CHAOS_MAX, this.chaos + gain)

    // Combo: si pasa mucho sin resolver nada, se corta
    if (this.comboT > 0) {
      this.comboT--
      if (this.comboT === 0) {
        if (this.combo >= 3) {
          this.events.onSfx('break')
          this.popup(this.cat.x, this.cat.y - 26, this.texts.comboBroken, '#9a948e')
        }
        this.combo = 0
      }
    }
    if (this.purrT > 0) this.purrT--

    // Aviso de caos alto
    if (this.chaos > 75) {
      if (--this.warnT <= 0) {
        this.warnT = FPS
        this.events.onSfx('warn')
      }
    } else this.warnT = 0

    if (this.chaos >= CHAOS_MAX) this.gameOver()
  }

  // ————— Nami —————

  private moveCat() {
    const c = this.cat
    const i = this.input
    let dx = (i.right ? 1 : 0) - (i.left ? 1 : 0)
    let dy = (i.down ? 1 : 0) - (i.up ? 1 : 0)
    if (dx && dy) {
      dx *= Math.SQRT1_2
      dy *= Math.SQRT1_2
    }
    const max = SPEED * (this.purrT > 0 ? PURR.speed : 1)
    c.vx = dx ? c.vx + dx * ACCEL : c.vx * FRICTION
    c.vy = dy ? c.vy + dy * ACCEL : c.vy * FRICTION
    const v = Math.hypot(c.vx, c.vy)
    if (v > max) {
      c.vx *= max / v
      c.vy *= max / v
    }
    if (Math.abs(c.vx) < 0.03) c.vx = 0
    if (Math.abs(c.vy) < 0.03) c.vy = 0
    // Dirección: manda el eje con más input (en diagonal, el horizontal)
    if (dx || dy) c.dir = Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up'
    // Inactividad: cualquier tecla (o seguir deslizándose) la reinicia
    const busy = i.up || i.down || i.left || i.right || i.action || i.boost
    c.idleT = busy || Math.hypot(c.vx, c.vy) > 0.25 ? 0 : c.idleT + 1

    // Movimiento por ejes contra el borde del piso y los obstáculos (se desliza por los bordes)
    const feet = (x: number, y: number): Rect => ({ x: x - FEET.w / 2, y: y - FEET.h, w: FEET.w, h: FEET.h })
    let nx = Math.max(FLOOR.x + FEET.w / 2, Math.min(FLOOR.x + FLOOR.w - FEET.w / 2, c.x + c.vx))
    if (OBSTACLES.some((o) => hit(feet(nx, c.y), o))) {
      nx = c.x
      c.vx = 0
    }
    let ny = Math.max(FLOOR.y, Math.min(FLOOR.y + FLOOR.h, c.y + c.vy))
    if (OBSTACLES.some((o) => hit(feet(nx, ny), o))) {
      ny = c.y
      c.vy = 0
    }
    c.x = nx
    c.y = ny
    if (Math.hypot(c.vx, c.vy) > 0.25) c.walkT += this.purrT > 0 ? 2 : 1
    if (c.hopT > 0) c.hopT--
    if (c.happyT > 0) c.happyT--
  }

  private handleActions() {
    const c = this.cat
    const pressed = this.input.action && !this.prevAction
    const boostPressed = this.input.boost && !this.prevBoost
    this.prevAction = this.input.action
    this.prevBoost = this.input.boost

    // Lo que se resuelve con solo pasar (lana, corazón)
    for (const inc of [...this.incidents]) {
      if (RULES[inc.type].solve !== 'touch') continue
      if (Math.hypot(inc.use.x - c.x, inc.use.y - c.y) < TOUCH) this.resolve(inc)
    }

    // La más cercana que se puede atender con la tecla de acción
    let best: Incident | null = null
    let bestD = REACH
    for (const inc of this.incidents) {
      if (RULES[inc.type].solve === 'touch') continue
      // Cerca del lugar marcado o, si tiene zona (escritorio, macetas), pegada a ella por cualquier lado
      const near = Math.hypot(inc.use.x - c.x, inc.use.y - c.y)
      const d = inc.zone ? Math.min(near, toRect(c.x, c.y, inc.zone) + 3) : near
      if (d < bestD) {
        best = inc
        bestD = d
      }
    }
    if (this.target && this.target !== best) this.target.progress = 0
    this.target = best
    c.fixing = false
    if (best) {
      const rule = RULES[best.type]
      if (rule.solve === 'press' && pressed) this.resolve(best)
      else if (rule.solve === 'hold' && this.input.action) {
        c.fixing = true
        // Mira hacia lo que arregla: la pared (cuadros) de espaldas; escritorio y macetas de costado
        const wall = !best.zone && best.draw.y + 12 < c.y - 14
        c.dir = wall ? 'up' : best.draw.x + 6 >= c.x ? 'right' : 'left'
        best.progress += 1 / (rule.holdFrames ?? 30)
        if (this.t % 8 === 0) this.events.onSfx(best.type === 'plant' ? 'water' : 'zap')
        if (best.progress >= 1) this.resolve(best)
      } else if (rule.solve === 'hold') best.progress = Math.max(0, best.progress - 0.03)
    } else if (pressed) this.events.onSfx('miss')

    // Ronroneo: el boost guardado se usa cuando la jugadora quiere
    if (boostPressed) {
      if (this.boostStored) {
        this.boostStored = false
        this.purrT = PURR.seconds * FPS
        this.chaos = Math.max(0, this.chaos - PURR.relief)
        c.happyT = 40
        c.hopT = 16
        this.say(this.texts.purr)
        this.burst(c.x, c.y - 10, TYPE_COLOR.heart, 16)
        this.events.onSfx('boost')
      } else this.events.onSfx('miss')
    }
  }

  private rollYarn(inc: Incident) {
    inc.draw.x += inc.vx
    inc.draw.y += inc.vy
    if (inc.draw.x < FLOOR.x + 2 || inc.draw.x > FLOOR.x + FLOOR.w - 9) inc.vx *= -1
    if (inc.draw.y < FLOOR.y - 6 || inc.draw.y > FLOOR.y + FLOOR.h - 8) inc.vy *= -1
    const box = { x: inc.draw.x, y: inc.draw.y + 3, w: 7, h: 4 }
    if (OBSTACLES.some((o) => hit(box, o))) {
      inc.draw.x -= inc.vx
      inc.draw.y -= inc.vy
      inc.vx *= -1
      inc.vy *= -1
    }
    inc.vx *= 0.996
    inc.vy *= 0.996
    inc.use = { x: inc.draw.x + 3, y: inc.draw.y + 7 }
  }

  // ————— Incidencias —————

  private pickType(s: number): IncidentType {
    const options = (Object.keys(RULES) as IncidentType[]).filter((type) => {
      if (s < RULES[type].unlock) return false
      if (type === 'heart' && (this.boostStored || this.incidents.some((i) => i.type === 'heart'))) return false
      return this.freeSlots(type).length > 0
    })
    let r = Math.random() * options.reduce((sum, t) => sum + RULES[t].weight, 0)
    for (const t of options) if ((r -= RULES[t].weight) < 0) return t
    return 'book'
  }

  private freeSlots(type: IncidentType) {
    const slots = type === 'glitch' ? GLITCH_SLOTS : type === 'star' ? STAR_SLOTS : type === 'plant' ? PLANT_SLOTS : null
    if (!slots) {
      const c = this.cat
      return FLOOR_SPOTS.map((_, i) => i).filter((i) => {
        const p = FLOOR_SPOTS[i]
        // Ni encima de otra cosa ni pegado a Nami
        if (Math.hypot(p.x - c.x, p.y - c.y) < 24) return false
        return !this.incidents.some((inc) => inc.slot === -1 && Math.hypot(inc.use.x - p.x, inc.use.y - p.y) < 16)
      })
    }
    return slots.map((_, i) => i).filter((i) => !this.incidents.some((inc) => inc.type === type && inc.slot === i))
  }

  private spawn(type: IncidentType) {
    const free = this.freeSlots(type)
    if (!free.length) return
    const pick = free[Math.floor(Math.random() * free.length)]
    const floor = type === 'book' || type === 'yarn' || type === 'heart'
    let draw: Point
    let use: Point
    let zone: Rect | undefined
    if (floor) {
      const p = FLOOR_SPOTS[pick]
      draw = { x: p.x - 4, y: p.y - 7 }
      use = { x: p.x, y: p.y }
    } else {
      const slot = (type === 'glitch' ? GLITCH_SLOTS : type === 'star' ? STAR_SLOTS : PLANT_SLOTS)[pick]
      draw = { ...slot.draw }
      use = { ...slot.use }
      zone = slot.zone
    }
    const angle = Math.random() * Math.PI * 2
    const speed = type === 'yarn' ? 0.3 + Math.random() * 0.25 : 0
    this.incidents.push({
      id: this.nextId++,
      type,
      slot: floor ? -1 : pick,
      draw,
      use,
      age: 0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.6,
      variant: Math.floor(Math.random() * 7),
      progress: 0,
      zone,
    })
    this.spawned++
    this.events.onSfx(type === 'glitch' ? 'glitch' : type === 'heart' ? 'heartIn' : 'spawn')
    if (type === 'glitch') this.shake = 4
  }

  private remove(inc: Incident) {
    this.incidents = this.incidents.filter((i) => i !== inc)
    if (this.target === inc) this.target = null
  }

  private resolve(inc: Incident) {
    const rule = RULES[inc.type]
    const c = this.cat
    this.remove(inc)
    const x = inc.draw.x + 4
    const y = inc.draw.y

    if (inc.type === 'heart') {
      if (this.boostStored) {
        this.addScore(150, x, y, TYPE_COLOR.heart)
        this.events.onSfx('star')
      } else {
        this.boostStored = true
        this.popup(x, y - 6, this.texts.boost, TYPE_COLOR.heart)
        this.events.onSfx('heart')
      }
      c.happyT = 24
      this.burst(x, y + 3, TYPE_COLOR.heart, 10)
      return
    }

    this.resolved++
    this.combo++
    this.maxCombo = Math.max(this.maxCombo, this.combo)
    this.comboT = COMBO_WINDOW * FPS
    const quick = inc.age / FPS < QUICK
    const mult = comboMultiplier(this.combo) * (this.purrT > 0 ? PURR.multiplier : 1)
    const pts = Math.round((rule.points * (quick ? QUICK_BONUS : 1) * mult) / 10) * 10
    this.addScore(pts, x, y, quick ? '#fff8e6' : TYPE_COLOR[inc.type])
    this.chaos = Math.max(0, this.chaos - rule.relief)
    this.burst(x, y + 4, TYPE_COLOR[inc.type], inc.type === 'star' ? 18 : 10)
    this.events.onSfx(inc.type === 'yarn' ? 'pick' : inc.type === 'book' ? 'book' : inc.type === 'star' ? 'star' : inc.type === 'plant' ? 'bloom' : 'fixed')
    if (this.combo > 1 && this.combo % 5 === 0) {
      c.hopT = 16
      c.happyT = 30
      this.say(`${this.texts.combo}${this.combo}`)
      this.events.onSfx('combo')
    }
  }

  private addScore(pts: number, x: number, y: number, color: string) {
    this.score += pts
    this.popup(x, y - 4, `+${pts}`, color)
  }

  private gameOver() {
    this.mode = 'over'
    const seconds = Math.floor(this.seconds)
    const survival = seconds * SURVIVAL_POINTS
    const efficiency = Math.round((this.resolved / Math.max(1, this.spawned)) * EFFICIENCY_POINTS)
    const base = this.score
    this.score += survival + efficiency
    const worst = (Object.keys(this.chaosBy) as IncidentType[]).sort((a, b) => this.chaosBy[b] - this.chaosBy[a])[0]
    this.summary = { score: this.score, base, survival, efficiency, seconds, resolved: this.resolved, maxCombo: this.maxCombo, open: this.incidents.length, worst }
    this.shake = 10
    this.events.onSfx('over')
    this.events.onOver(this.summary)
  }

  // ————— Feedback —————

  private say(text: string) {
    this.banner = { text, t: 110 }
  }

  private popup(x: number, y: number, text: string, color: string) {
    this.popups.push({ x, y, text, color, t: 50 })
  }

  private burst(x: number, y: number, color: string, n: number) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.4
      const v = 0.5 + Math.random() * 1
      this.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.5, life: 22 + Math.floor(Math.random() * 16), color })
    }
  }

  private tickFx() {
    this.popups = this.popups.filter((p) => {
      p.y -= 0.35
      return --p.t > 0
    })
    this.particles = this.particles.filter((p) => {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.05
      return --p.life > 0
    })
    if (this.banner.t > 0) this.banner.t--
    if (this.shake > 0) this.shake--
  }
}

/** Qué tan apurada está una incidencia (0 tranquila → 1 crítica o por apagarse) */
export function urgency(inc: Incident) {
  const rule = RULES[inc.type]
  const limit = rule.critical || rule.life
  if (!limit) return 0
  return Math.min(1, inc.age / FPS / limit)
}
