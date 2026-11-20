// Música de NAMI.EXE: "Turno de noche", una pieza original chiptune / lo-fi compuesta para el juego
// y sintetizada en vivo con WebAudio (sin archivos ni licencias de terceros).
//
// Fa mayor, 88 BPM, 16 compases (~44 s) que se repiten sin cortes:
//   A (1-8):  Fmaj7 · Am7 · Dm7 · Cadd9 · Bbmaj7 · Am7 · Gm7 · C7     → la melodía pregunta y responde
//   B (9-16): Dm7 · Bbmaj7 · Fmaj7 · Cadd9 · Gm7 · Am7 · Bbmaj7 · C7sus4 → más calma; vuelve a Fa al repetir
// Voces: melodía en onda de pulso (con eco suave), arpegio cuadrado filtrado, colchón triangular,
// bajo triangular y una percusión muy discreta. En cada vuelta la melodía alterna de timbre para que no canse.

const BPM = 88
const STEP = 60 / BPM / 4 // semicorchea
const BAR = 16
const LOOKAHEAD = 0.15 // segundos que se agendan por adelantado

const midi = (n: number) => 440 * 2 ** ((n - 69) / 12)

interface Chord {
  /** Notas del acorde (midi), de grave a agudo */
  notes: number[]
  /** Fundamental del bajo (midi) */
  bass: number
}
const F7: Chord = { notes: [53, 57, 60, 64], bass: 41 }
const Am7: Chord = { notes: [57, 60, 64, 67], bass: 45 }
const Dm7: Chord = { notes: [50, 53, 57, 60], bass: 50 }
const Cadd9: Chord = { notes: [48, 52, 55, 62], bass: 48 }
const Bb7: Chord = { notes: [46, 50, 53, 57], bass: 46 }
const Gm7: Chord = { notes: [55, 58, 62, 65], bass: 43 }
const C7: Chord = { notes: [52, 55, 58, 60], bass: 48 }
const C7sus: Chord = { notes: [53, 55, 58, 60], bass: 48 }

const CHORDS = [F7, Am7, Dm7, Cadd9, Bb7, Am7, Gm7, C7, Dm7, Bb7, F7, Cadd9, Gm7, Am7, Bb7, C7sus]

/** Melodía: por compás, [semicorchea, nota midi, duración en semicorcheas] */
const MELODY: [number, number, number][][] = [
  // A
  [[0, 69, 3], [4, 72, 2], [6, 76, 4], [12, 74, 2], [14, 72, 2]],
  [[0, 76, 6], [8, 72, 2], [10, 69, 6]],
  [[2, 69, 2], [4, 72, 2], [6, 74, 2], [8, 77, 4], [12, 76, 2], [14, 74, 2]],
  [[0, 76, 4], [4, 74, 2], [6, 72, 6], [14, 67, 2]],
  [[0, 69, 3], [4, 70, 2], [6, 74, 4], [10, 77, 2], [12, 76, 2], [14, 74, 2]],
  [[0, 72, 4], [4, 76, 2], [6, 79, 4], [10, 76, 6]],
  [[0, 77, 2], [2, 76, 2], [4, 74, 4], [8, 70, 2], [10, 74, 2], [12, 77, 4]],
  [[0, 76, 6], [10, 67, 2], [12, 69, 2], [14, 70, 2]],
  // B
  [[0, 69, 6], [6, 65, 2], [8, 69, 2], [10, 72, 6]],
  [[0, 74, 6], [6, 72, 2], [8, 70, 4], [12, 69, 4]],
  [[0, 72, 2], [2, 69, 2], [4, 72, 2], [6, 77, 6], [12, 76, 4]],
  [[0, 74, 8], [10, 72, 2], [12, 74, 2], [14, 76, 2]],
  [[0, 77, 4], [4, 74, 2], [6, 70, 4], [10, 74, 2], [12, 72, 4]],
  [[0, 72, 2], [2, 76, 2], [4, 79, 6], [10, 76, 2], [12, 72, 4]],
  [[0, 74, 4], [4, 72, 2], [6, 70, 2], [8, 69, 4], [12, 67, 4]],
  [[0, 67, 8], [12, 65, 2], [14, 67, 2]],
]

/** Arpegio en corcheas sobre las notas del acorde (una octava arriba) */
const ARP = [0, 2, 1, 3, 2, 1, 3, 2]
/** Bajo: [semicorchea, intervalo desde la fundamental, duración] */
const BASS: [number, number, number][] = [
  [0, 0, 5],
  [6, 0, 2],
  [8, 7, 4],
  [12, 12, 2],
  [14, 7, 2],
]

/** Onda de pulso (más suave que la cuadrada al 50 %), típica de consola de 8 bits */
function pulseWave(ctx: AudioContext, duty: number) {
  const n = 32
  const real = new Float32Array(n)
  const imag = new Float32Array(n)
  for (let i = 1; i < n; i++) real[i] = (2 / (i * Math.PI)) * Math.sin(i * Math.PI * duty)
  return ctx.createPeriodicWave(real, imag)
}

export class Music {
  private ctx: AudioContext
  /** Volumen general de la música (fundidos y "ducking" en pausa / final) */
  private bus: GainNode
  private mute: GainNode
  private echo: GainNode
  private pulse: PeriodicWave
  private thin: PeriodicWave
  private noise: AudioBuffer
  private timer = 0
  private step = 0
  private next = 0
  private loop = 0

  constructor(ctx: AudioContext, muted: boolean) {
    this.ctx = ctx
    // Cadena: voces → bus (volumen) → filtro cálido → mute → salida
    this.bus = ctx.createGain()
    this.bus.gain.value = 0
    const warm = ctx.createBiquadFilter()
    warm.type = 'lowpass'
    warm.frequency.value = 3400
    warm.Q.value = 0.4
    this.mute = ctx.createGain()
    this.mute.gain.value = muted ? 0 : 1
    this.bus.connect(warm).connect(this.mute).connect(ctx.destination)
    // Eco suave para la melodía (biblioteca de noche)
    const delay = ctx.createDelay(1)
    delay.delayTime.value = STEP * 3
    const feedback = ctx.createGain()
    feedback.gain.value = 0.28
    this.echo = ctx.createGain()
    this.echo.gain.value = 0.22
    this.echo.connect(delay)
    delay.connect(feedback).connect(delay)
    delay.connect(this.bus)
    this.pulse = pulseWave(ctx, 0.25)
    this.thin = pulseWave(ctx, 0.125)
    // Ruido blanco para la percusión
    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const data = this.noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }

  get playing() {
    return this.timer !== 0
  }

  /** Empieza (si no estaba sonando) con un fundido de entrada. Llamarla de nuevo no la duplica */
  start(level = 1) {
    if (!this.timer) {
      this.step = 0
      this.loop = 0
      this.next = this.ctx.currentTime + 0.08
      this.timer = window.setInterval(() => this.schedule(), 25)
      this.schedule()
    }
    this.fade(level, 2.5)
  }

  /** Cambia el volumen suavemente: 1 normal, menos para pausa o final */
  fade(level: number, seconds = 0.6) {
    const g = this.bus.gain
    const t = this.ctx.currentTime
    g.cancelScheduledValues(t)
    g.setValueAtTime(g.value, t)
    g.linearRampToValueAtTime(level * 0.55, t + seconds)
  }

  setMuted(muted: boolean) {
    const g = this.mute.gain
    const t = this.ctx.currentTime
    g.cancelScheduledValues(t)
    g.setValueAtTime(g.value, t)
    g.linearRampToValueAtTime(muted ? 0 : 1, t + 0.15)
  }

  /** Se detiene con un fundido corto y deja de agendar notas */
  stop(seconds = 0.15) {
    window.clearInterval(this.timer)
    this.timer = 0
    this.fade(0, seconds)
  }

  // ————— Secuenciador —————

  private schedule() {
    const now = this.ctx.currentTime
    // Si el contexto estuvo suspendido o la pestaña frenó los timers, retoma sin ráfaga de notas atrasadas
    if (this.next < now - 0.05) this.next = now + 0.05
    while (this.next < now + LOOKAHEAD) {
      this.playStep(this.step, this.next)
      this.next += STEP
      this.step++
      if (this.step === BAR * CHORDS.length) {
        this.step = 0
        this.loop++
      }
    }
  }

  private playStep(step: number, t: number) {
    const bar = Math.floor(step / BAR)
    const s = step % BAR
    const chord = CHORDS[bar]
    const softIntro = bar < 2 // los dos primeros compases respiran: sin redoblante

    // Colchón: tercera y séptima, todo el compás
    if (s === 0) for (const n of chord.notes.slice(1)) this.note(midi(n), t, STEP * 15, 'triangle', 0.012, 0.25)
    // Arpegio en corcheas
    if (s % 2 === 0) this.note(midi(chord.notes[ARP[s / 2]] + 12), t, STEP * 1.6, this.thin, 0.007, 0.004)
    // Bajo
    for (const [at, interval, len] of BASS) if (at === s) this.note(midi(chord.bass + interval), t, STEP * len * 0.9, 'triangle', 0.05, 0.006)
    // Melodía: en vueltas pares, pulso; en impares, triángulo una octava arriba (más suave)
    const even = this.loop % 2 === 0
    for (const [at, n, len] of MELODY[bar]) {
      if (at !== s) continue
      const f = midi(n + (even ? 0 : 12))
      this.note(f, t, STEP * len * 0.92, even ? this.pulse : 'triangle', even ? 0.02 : 0.026, 0.01, true)
    }
    // Percusión muy discreta
    if (s === 0 || s === 8) this.kick(t)
    if (!softIntro && (s === 4 || s === 12)) this.hit(t, 'bandpass', 1900, 0.012, 0.09)
    if (s % 4 === 2) this.hit(t, 'highpass', 7500, s === 14 ? 0.006 : 0.0045, 0.04)
  }

  private note(freq: number, t: number, dur: number, wave: OscillatorType | PeriodicWave, vol: number, attack: number, echo = false) {
    const ctx = this.ctx
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    if (wave instanceof PeriodicWave) osc.setPeriodicWave(wave)
    else osc.type = wave
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(vol, t + attack)
    gain.gain.setValueAtTime(vol, t + Math.max(attack, dur * 0.6))
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(gain).connect(this.bus)
    if (echo) gain.connect(this.echo)
    osc.start(t)
    osc.stop(t + dur + 0.02)
  }

  private kick(t: number) {
    const ctx = this.ctx
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(120, t)
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12)
    gain.gain.setValueAtTime(0.05, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16)
    osc.connect(gain).connect(this.bus)
    osc.start(t)
    osc.stop(t + 0.18)
  }

  private hit(t: number, type: BiquadFilterType, freq: number, vol: number, dur: number) {
    const ctx = this.ctx
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const filter = ctx.createBiquadFilter()
    filter.type = type
    filter.frequency.value = freq
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(vol, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(filter).connect(gain).connect(this.bus)
    src.start(t, Math.random() * 0.5)
    src.stop(t + dur + 0.01)
  }
}
