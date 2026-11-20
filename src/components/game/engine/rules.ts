// Reglas de NAMI.EXE: tipos de incidencias, puntaje, combos y curva de dificultad.
// Todo lo que se ajusta para balancear el juego está acá.

export type IncidentType = 'book' | 'yarn' | 'glitch' | 'plant' | 'star' | 'heart'

export interface IncidentRule {
  /** Puntos base */
  points: number
  /** Caos por segundo mientras está sin resolver */
  chaos: number
  /** Segundos hasta ponerse crítica (el caos se duplica); 0 = nunca */
  critical: number
  /** Segundos hasta desaparecer sola; 0 = nunca */
  life: number
  /** Cómo se resuelve: tecla de acción, mantener apretada o con solo pasar */
  solve: 'press' | 'hold' | 'touch'
  /** Cuadros que hay que mantener la tecla (solo "hold") */
  holdFrames?: number
  /** Caos que se descuenta al resolverla */
  relief: number
  /** Desde qué segundo puede aparecer */
  unlock: number
  /** Peso al sortear cuál aparece */
  weight: number
}

export const RULES: Record<IncidentType, IncidentRule> = {
  book: { points: 100, chaos: 1, critical: 9, life: 0, solve: 'press', relief: 5, unlock: 0, weight: 3 },
  yarn: { points: 40, chaos: 0.45, critical: 0, life: 0, solve: 'touch', relief: 3, unlock: 0, weight: 2 },
  glitch: { points: 160, chaos: 1.7, critical: 6, life: 0, solve: 'hold', holdFrames: 40, relief: 8, unlock: 16, weight: 2.2 },
  plant: { points: 120, chaos: 0.75, critical: 9, life: 0, solve: 'hold', holdFrames: 28, relief: 6, unlock: 34, weight: 1.4 },
  star: { points: 300, chaos: 0, critical: 0, life: 9, solve: 'press', relief: 0, unlock: 52, weight: 1 },
  heart: { points: 60, chaos: 0, critical: 0, life: 7, solve: 'touch', relief: 0, unlock: 26, weight: 0.7 },
}

/** Resolver rápido (antes de esto, en segundos) da bonus de velocidad */
export const QUICK = 2.5
export const QUICK_BONUS = 1.5
/** Segundos para encadenar el combo */
export const COMBO_WINDOW = 3
export const comboMultiplier = (combo: number) => 1 + 0.25 * Math.min(Math.max(combo - 1, 0), 12)
/** Ronroneo (boost): duración, multiplicador y caos que limpia al activarse */
export const PURR = { seconds: 6, multiplier: 2, relief: 15, speed: 1.45 }
export const CHAOS_MAX = 100
/** Bonus del final */
export const SURVIVAL_POINTS = 10
export const EFFICIENCY_POINTS = 500

/** Curva de dificultad según los segundos jugados */
export function difficulty(s: number) {
  return {
    spawnEvery: Math.max(0.8, 2.7 - s * 0.013),
    maxActive: Math.min(9, 3 + Math.floor(s / 18)),
    // Arranque amable (aprendizaje), presión normal y, desde los 140 s, el cierre caótico
    chaosMult: s < 40 ? 0.55 + 0.45 * (s / 40) : s < 140 ? 1 : 1 + (s - 140) / 18,
  }
}

/** Etapas del turno (segundo en que empiezan). Sus carteles están en texts.ts, en el mismo orden */
export const PHASES: { at: number }[] = [{ at: 0 }, { at: 16 }, { at: 34 }, { at: 52 }, { at: 100 }, { at: 140 }]
/** Evento especial: lluvia de lanas para armar un combo largo */
export const YARN_RAIN = { at: 80, count: 5 }
