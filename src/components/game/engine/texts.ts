// Textos que NAMI.EXE dibuja dentro del canvas (con la fuente de píxeles: solo mayúsculas sin tildes).
// El resto de la interfaz del juego se traduce en src/locales/ (claves game.*).

export interface CanvasText {
  /** Carteles de cada etapa del turno, en el mismo orden que PHASES (rules.ts) */
  phases: string[]
  yarnRain: string
  starOff: string
  comboBroken: string
  purr: string
  boost: string
  combo: string
  /** Etiqueta del medidor del HUD */
  chaos: string
}

export const CANVAS_TEXT: Record<'es' | 'en', CanvasText> = {
  es: {
    phases: ['TURNO DE NAMI', 'GLITCHES!', 'PLANTAS SEDIENTAS', 'ESTRELLAS APAGADAS', 'HORA PICO', 'CAOS TOTAL'],
    yarnRain: 'LLUVIA DE LANA!',
    starOff: 'SE APAGO',
    comboBroken: 'COMBO ROTO',
    purr: 'RONRONEO X2',
    boost: 'BOOST!',
    combo: 'COMBO X',
    chaos: 'CAOS',
  },
  en: {
    phases: ['NAMI ON DUTY', 'GLITCHES!', 'THIRSTY PLANTS', 'STARS FADING', 'RUSH HOUR', 'TOTAL CHAOS'],
    yarnRain: 'YARN STORM!',
    starOff: 'FADED',
    comboBroken: 'COMBO LOST',
    purr: 'PURR X2',
    boost: 'BOOST!',
    combo: 'COMBO X',
    chaos: 'CHAOS',
  },
}
