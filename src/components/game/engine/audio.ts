// Efectos de sonido retro sintetizados al vuelo (WebAudio): sin archivos ni servicios externos.
// El contexto de audio se crea recién con el primer gesto del usuario.

export type Sfx =
  | 'pick'
  | 'book'
  | 'fixed'
  | 'bloom'
  | 'star'
  | 'heart'
  | 'heartIn'
  | 'boost'
  | 'combo'
  | 'break'
  | 'warn'
  | 'over'
  | 'phase'
  | 'spawn'
  | 'glitch'
  | 'zap'
  | 'water'
  | 'miss'
  | 'button'

import { Music } from './music'

const MUTE_KEY = 'nami-exe-muted'

export class Sound {
  private ctx: AudioContext | null = null
  private music: Music | null = null
  muted: boolean

  constructor() {
    let muted = false
    try {
      muted = localStorage.getItem(MUTE_KEY) === '1'
    } catch {
      // sin almacenamiento: arranca con sonido
    }
    this.muted = muted
  }

  /** Llamar desde un gesto (clic, tecla): habilita el audio respetando el autoplay del navegador */
  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume()
      return
    }
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (AC) this.ctx = new AC()
  }

  setMuted(muted: boolean) {
    this.muted = muted
    this.music?.setMuted(muted)
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
    } catch {
      // sin almacenamiento: vale solo para esta visita
    }
  }

  tone(freq: number, dur: number, opts: { type?: OscillatorType; vol?: number; to?: number; at?: number } = {}) {
    const ctx = this.ctx
    if (!ctx) return
    const t = ctx.currentTime + (opts.at ?? 0)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = opts.type ?? 'square'
    osc.frequency.setValueAtTime(freq, t)
    if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, t + dur)
    const vol = opts.vol ?? 0.05
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(vol, t + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + dur + 0.02)
  }

  play(name: Sfx) {
    if (this.muted || !this.ctx || this.ctx.state !== 'running') return
    const seq = (notes: number[], gap: number, opts: Parameters<Sound['tone']>[2] = {}) =>
      notes.forEach((f, i) => this.tone(f, opts.to ? 0.08 : 0.09, { ...opts, at: i * gap }))
    switch (name) {
      case 'pick': // lana: blip corto y alegre
        this.tone(880, 0.06, { to: 1320, vol: 0.03 })
        break
      case 'book': // libro acomodado: golpecito de madera
        this.tone(220, 0.07, { type: 'triangle', vol: 0.06 })
        this.tone(330, 0.06, { at: 0.05, type: 'triangle', vol: 0.04 })
        break
      case 'fixed': // glitch reparado
        seq([523, 784, 1047], 0.05, { vol: 0.035 })
        break
      case 'bloom': // planta contenta
        seq([392, 523, 659], 0.06, { type: 'triangle', vol: 0.045 })
        break
      case 'star':
        seq([988, 1319, 1760, 2093], 0.055, { type: 'triangle', vol: 0.04 })
        break
      case 'heart':
        seq([659, 880], 0.08, { type: 'triangle', vol: 0.045 })
        break
      case 'heartIn':
        this.tone(1175, 0.05, { type: 'triangle', vol: 0.02 })
        break
      case 'boost': // ronroneo
        this.tone(110, 0.5, { type: 'sawtooth', to: 140, vol: 0.025 })
        seq([523, 659, 784, 1047, 1319], 0.06, { vol: 0.03 })
        break
      case 'combo':
        seq([784, 988, 1175, 1568], 0.045, { vol: 0.035 })
        break
      case 'break':
        this.tone(330, 0.18, { to: 165, type: 'triangle', vol: 0.04 })
        break
      case 'warn': // caos alto: tic suave
        this.tone(1480, 0.03, { vol: 0.018 })
        break
      case 'over':
        seq([523, 440, 349, 262], 0.14, { type: 'triangle', vol: 0.05 })
        break
      case 'phase':
        seq([659, 659, 988], 0.09, { vol: 0.03 })
        break
      case 'spawn':
        this.tone(1047, 0.03, { type: 'triangle', vol: 0.015 })
        break
      case 'glitch':
        this.tone(140, 0.12, { type: 'sawtooth', to: 90, vol: 0.025 })
        break
      case 'zap':
        this.tone(600 + Math.random() * 300, 0.03, { vol: 0.015 })
        break
      case 'water':
        this.tone(500 + Math.random() * 200, 0.04, { type: 'triangle', to: 900, vol: 0.02 })
        break
      case 'miss':
        this.tone(180, 0.05, { vol: 0.02 })
        break
      case 'button':
        this.tone(660, 0.045, { vol: 0.03 })
        break
    }
  }

  // ————— Música de fondo (engine/music.ts) —————

  /** Arranca la música (una sola instancia) o, si ya suena, la lleva a su volumen normal */
  startMusic() {
    if (!this.ctx) return
    this.music ??= new Music(this.ctx, this.muted)
    this.music.start()
  }

  /** Baja o sube la música suavemente (pausa, final del turno) */
  musicLevel(level: number, seconds?: number) {
    if (this.music?.playing) this.music.fade(level, seconds)
  }

  /** Pestaña oculta: congela todo el audio para no gastar recursos; al volver, sigue donde estaba */
  suspend() {
    if (this.ctx?.state === 'running') void this.ctx.suspend()
  }

  resume() {
    if (this.ctx?.state === 'suspended') void this.ctx.resume()
  }

  /** Al cerrar el juego: fundido cortito y se libera el contexto de audio */
  dispose() {
    const ctx = this.ctx
    this.ctx = null
    if (!ctx) return
    if (this.music) {
      this.music.stop(0.12)
      this.music = null
      window.setTimeout(() => void ctx.close(), 160)
    } else void ctx.close()
  }
}
