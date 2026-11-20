import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { FiPause, FiPlay, FiRotateCcw, FiVolume2, FiVolumeX, FiX } from 'react-icons/fi'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { Sound } from './engine/audio'
import { drawText, spriteCanvas, textWidth } from './engine/draw'
import { Game, type Summary } from './engine/game'
import { NAMI } from './engine/namiSprites'
import { runLoop } from './engine/loop'
import { Renderer } from './engine/render'
import { VIEW } from './engine/room'
import { CANVAS_TEXT } from './engine/texts'
import { Rich } from '../../i18n/content'
import { useI18n } from '../../i18n/useI18n'
import type { MessageKey } from '../../locales/es'
import { SPARK } from './engine/sprites'

type Screen = 'title' | 'playing' | 'paused' | 'over'
type Control = 'up' | 'down' | 'left' | 'right' | 'action' | 'boost'

const KEYS: Record<string, Control> = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  Space: 'action',
  KeyE: 'action',
  KeyJ: 'action',
  KeyQ: 'boost',
  ShiftLeft: 'boost',
  ShiftRight: 'boost',
  KeyK: 'boost',
}
const BEST_KEY = 'nami-exe-best'
/** Frases de Nami al terminar (claves de src/locales/) */
const OVER_LINES = ['game.line1', 'game.line2', 'game.line3', 'game.line4'] as const satisfies readonly MessageKey[]

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

interface NamiExeProps {
  onClose: () => void
}

// NAMI.EXE — Quality Control. Ventana flotante con forma de consola portátil.
// El juego vive en engine/ (lógica en game.ts, dibujo en render.ts); React solo maneja menús y controles.
export default function NamiExe({ onClose }: NamiExeProps) {
  const reduced = useReducedMotion()
  const { lang, t } = useI18n()
  const fmt = (n: number) => n.toLocaleString(lang === 'en' ? 'en-US' : 'es-AR')
  // Idioma actual en una ref: el motor lo toma al crearse sin depender de él (cambiar de idioma no reinicia el turno)
  const langRef = useRef(lang)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Game | null>(null)
  // Un solo objeto de sonido durante toda la vida de la ventana
  const [sound] = useState(() => new Sound())
  const [screen, setScreen] = useState<Screen>('title')
  const [muted, setMuted] = useState(() => sound.muted)
  const [best, setBest] = useState(readBest)
  const [result, setResult] = useState<{ summary: Summary; record: boolean; previous: number; line: MessageKey } | null>(null)
  // Confirmación para dejar una ronda en pausa y volver al menú
  const [confirmMenu, setConfirmMenu] = useState(false)
  const confirmRef = useRef(false)
  useEffect(() => {
    confirmRef.current = confirmMenu
  }, [confirmMenu])
  const pauseMenuRef = useRef<HTMLButtonElement>(null)
  // El estado de la pantalla también en una ref, para los listeners de teclado y foco
  const screenStateRef = useRef<Screen>('title')
  // Espera entre el final del turno y el resumen (se cancela si se reinicia antes)
  const overTimer = useRef(0)
  const show = useCallback((next: Screen) => {
    screenStateRef.current = next
    setScreen(next)
  }, [])

  // Abre la ventana (modal nativo: atrapa el foco y se cierra con Escape)
  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Motor: se crea al abrir y se apaga al cerrar
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const game = new Game({
      onSfx: (name) => sound.play(name),
      onOver: (summary) => {
        const previous = readBest()
        const record = summary.score > previous
        if (record) {
          try {
            localStorage.setItem(BEST_KEY, String(summary.score))
          } catch {
            // sin almacenamiento: el récord vale solo para esta visita
          }
        }
        setBest(Math.max(previous, summary.score))
        setResult({ summary, record, previous, line: OVER_LINES[Math.floor(Math.random() * OVER_LINES.length)] })
        // La música baja para que se escuche el efecto del final
        sound.musicLevel(0.3, 0.5)
        // Un respiro para ver a Nami cansada antes del resumen
        window.clearTimeout(overTimer.current)
        overTimer.current = window.setTimeout(() => show('over'), reduced ? 0 : 900)
      },
    })
    game.texts = CANVAS_TEXT[langRef.current]
    gameRef.current = game
    // Si el motor se recrea en medio de un turno (p. ej. cambia la preferencia de movimiento), lo retoma
    if (screenStateRef.current === 'playing' || screenStateRef.current === 'paused') game.play()
    if (screenStateRef.current === 'paused') game.pause()
    const renderer = new Renderer(canvas, reduced)
    const stop = runLoop(
      () => game.step(),
      () => renderer.draw(game),
    )
    return () => {
      stop()
      window.clearTimeout(overTimer.current)
      gameRef.current = null
    }
  }, [reduced, show, sound])

  useEffect(() => () => sound.dispose(), [sound])

  // Cambio de idioma con el juego abierto: solo cambian los textos, el turno sigue igual
  useEffect(() => {
    langRef.current = lang
    if (gameRef.current) gameRef.current.texts = CANVAS_TEXT[lang]
  }, [lang])

  const click = useCallback(() => {
    sound.unlock()
    sound.play('button')
  }, [sound])

  const start = useCallback(() => {
    click()
    window.clearTimeout(overTimer.current)
    gameRef.current?.play()
    sound.startMusic()
    setResult(null)
    setConfirmMenu(false)
    show('playing')
    screenRef.current?.focus()
  }, [show, click, sound])

  const pause = useCallback(() => {
    const game = gameRef.current
    if (!game || screenStateRef.current !== 'playing') return
    game.pause()
    for (const k of Object.keys(game.input) as Control[]) game.input[k] = false
    sound.musicLevel(0.35)
    show('paused')
  }, [show, sound])

  const resume = useCallback(() => {
    click()
    setConfirmMenu(false)
    gameRef.current?.resume()
    sound.musicLevel(1)
    show('playing')
    screenRef.current?.focus()
  }, [show, click, sound])

  /** Vuelve a la pantalla de inicio sin cerrar la consola: corta la ronda y limpia todo */
  const goMenu = useCallback(() => {
    click()
    window.clearTimeout(overTimer.current)
    const game = gameRef.current
    if (game) {
      for (const k of Object.keys(game.input) as Control[]) game.input[k] = false
      game.menu()
    }
    setResult(null)
    setConfirmMenu(false)
    // La música queda de fondo, un poco más baja que en el juego
    sound.musicLevel(0.6)
    show('title')
  }, [show, click, sound])

  /** Pausa → "Menú principal": primero pregunta, porque se pierde la ronda */
  const askMenu = () => {
    click()
    setConfirmMenu(true)
  }
  const cancelMenu = () => {
    click()
    setConfirmMenu(false)
    // De vuelta a la pausa, con el foco donde estaba
    requestAnimationFrame(() => pauseMenuRef.current?.focus())
  }

  const close = () => {
    click()
    dialogRef.current?.close()
  }

  // Teclado: mover, atender y ronronear sin que la página se desplace; P pausa
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const control = KEYS[e.code]
      const playing = screenStateRef.current === 'playing'
      if (control && playing) {
        e.preventDefault()
        sound.unlock()
        if (gameRef.current) gameRef.current.input[control] = e.type === 'keydown'
        return
      }
      // Con la confirmación abierta, solo responden sus botones
      if (confirmRef.current) return
      if (e.type === 'keydown' && e.code === 'KeyP') {
        if (playing) pause()
        else if (screenStateRef.current === 'paused') resume()
      }
      // R: reinicia la ronda (igual que el botón RESET de la consola)
      if (e.type === 'keydown' && e.code === 'KeyR' && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        start()
      }
    }
    window.addEventListener('keydown', onKey, true)
    window.addEventListener('keyup', onKey, true)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('keyup', onKey, true)
    }
  }, [pause, resume, start, sound])

  // Si la ventana del navegador pierde el foco, el turno se pausa
  useEffect(() => {
    const onHide = () => pause()
    // Pestaña oculta: pausa y congela el audio; al volver, la música sigue (bajita, porque está en pausa)
    const onVisibility = () => {
      if (document.hidden) {
        pause()
        sound.suspend()
      } else sound.resume()
    }
    window.addEventListener('blur', onHide)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('blur', onHide)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [pause, sound])

  const toggleMute = () => {
    sound.unlock()
    sound.setMuted(!sound.muted)
    setMuted(sound.muted)
    sound.play('button')
  }

  // Controles táctiles (también funcionan con el mouse)
  const hold = (control: Control) => {
    const release = () => {
      if (gameRef.current) gameRef.current.input[control] = false
    }
    return {
      onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
          // Mantiene el botón apretado aunque el dedo se corra un poco
          e.currentTarget.setPointerCapture(e.pointerId)
        } catch {
          // sin captura: igual funciona mientras el dedo siga encima
        }
        sound.unlock()
        if (gameRef.current && screenStateRef.current === 'playing') gameRef.current.input[control] = true
      },
      onPointerUp: release,
      onPointerCancel: release,
      onLostPointerCapture: release,
      onContextMenu: (e: ReactMouseEvent) => e.preventDefault(),
    }
  }

  const playing = screen === 'playing'
  const inTurn = playing || screen === 'paused'

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={(e) => {
        // Escape con la confirmación abierta: solo la cierra (vuelve a la pausa)
        if (confirmRef.current) {
          e.preventDefault()
          cancelMenu()
        }
      }}
      onClick={(e) => e.target === dialogRef.current && close()}
      aria-labelledby="mq-title"
      className="mq-dialog m-auto bg-transparent p-0 text-ink backdrop:bg-[#0d0c14]/70 backdrop:backdrop-blur-[2px]"
    >
      <div className={`mq-console ${reduced ? '' : 'mq-console-in'}`}>
        {/* Barra superior: luz, nombre y botones */}
        <div className="mq-head">
          <span aria-hidden="true" className={`mq-led-dot ${reduced ? '' : 'mq-led'}`} />
          <h2 id="mq-title" className="mq-label">
            NAMI.EXE <span className="opacity-70">— Quality Control</span>
          </h2>
          {inTurn && (
            <>
              <IconButton label={playing ? t('game.pause') : t('game.resume')} onClick={playing ? pause : resume}>
                {playing ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
              </IconButton>
              <IconButton label={t('game.restart')} onClick={start}>
                <FiRotateCcw aria-hidden="true" />
              </IconButton>
            </>
          )}
          <IconButton label={muted ? t('game.soundOn') : t('game.soundOff')} onClick={toggleMute}>
            {muted ? <FiVolumeX aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
          </IconButton>
          <IconButton label={t('game.close')} onClick={close}>
            <FiX aria-hidden="true" />
          </IconButton>
        </div>

        {/* Pantalla: proporción fija; el juego 4:3 arriba y la guía rápida abajo */}
        <div className="mq-bezel">
          <div ref={screenRef} tabIndex={-1} className="mq-screen" aria-label={t('game.screen')}>
            <canvas ref={canvasRef} width={VIEW.w} height={VIEW.h} className="mq-canvas" aria-hidden="true" />

            {/* Guía rápida debajo del juego (la pantalla es más alta que el 4:3 del canvas) */}
            {screen === 'playing' && (
              <div className="mq-strip" aria-hidden="true">
                <Actions />
                <Controls />
              </div>
            )}

            {screen === 'title' && (
              <div className="mq-info mq-info-title">
                {/* Zona 1: el título y Nami están dibujados en el canvas; esto les deja lugar */}
                <div className="mq-info-head" aria-hidden="true" />
                <div className="mq-info-body">
                  <p className="mq-goal">
                    <Rich text={t('game.goal')} />
                  </p>
                  <Actions />
                  <button type="button" autoFocus onClick={start} className="mq-btn mq-btn-main">
                    {t('game.play')}
                  </button>
                  <div className="mq-info-foot">
                    <Controls />
                    {best > 0 && <p className="mq-record">★ {t('game.best', { score: fmt(best) })}</p>}
                  </div>
                </div>
              </div>
            )}

            {screen === 'paused' && (
              <div className="mq-info mq-info-pause">
                <div className="mq-info-body">
                  <p className="mq-big mq-pause-title">{t('game.paused')}</p>
                  <p className="mq-goal mq-goal-soft">
                    <Rich text={t('game.goalPause')} />
                  </p>
                  <Actions />
                  <div className="mq-info-foot">
                    <Controls full />
                  </div>
                  <div className="mq-end-actions">
                    <button type="button" autoFocus onClick={resume} className="mq-btn mq-btn-main">
                      {t('game.continue')}
                    </button>
                    <button type="button" ref={pauseMenuRef} onClick={askMenu} className="mq-btn mq-btn-sm mq-btn-ghost">
                      {t('game.mainMenu')}
                    </button>
                  </div>
                </div>
                {confirmMenu && (
                  <div className="mq-confirm">
                    <div className="mq-confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="mq-confirm-title" aria-describedby="mq-confirm-text">
                      <p id="mq-confirm-title" className="mq-confirm-title">
                        {t('game.confirmTitle')}
                      </p>
                      <p id="mq-confirm-text" className="mq-confirm-text">
                        {t('game.confirmText')}
                      </p>
                      <div className="mq-confirm-actions">
                        <button type="button" autoFocus onClick={cancelMenu} className="mq-btn mq-btn-sm">
                          {t('game.keepPlaying')}
                        </button>
                        <button type="button" onClick={goMenu} className="mq-btn mq-btn-sm mq-btn-ghost">
                          {t('game.backToMenu')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {screen === 'over' && result && (
              <div className={`mq-info mq-info-over ${result.record ? 'is-record' : ''}`}>
                <div className="mq-info-body mq-over-body">
                  {/* Bloque 1: resultado y puntaje (protagonista) */}
                  <div className="mq-result" aria-live="polite">
                    <p className="mq-result-status">{result.record ? t('game.newRecord') : t('game.gameOver')}</p>
                    <div className="mq-score-wrap">
                      {result.record && <SpriteIcon rows={SPARK} className="mq-spark mq-spark-l" />}
                      <PixelText
                        text={fmt(result.summary.score)}
                        className="mq-score-px"
                        color="#fff8e6"
                        shadow={result.record ? '#93354f' : '#24605e'}
                        label={t('game.points', { score: fmt(result.summary.score) })}
                      />
                      {result.record && <SpriteIcon rows={SPARK} className="mq-spark mq-spark-r" />}
                    </div>
                    {/* Bloque 5: récord, discreto y sin repetir el puntaje */}
                    <p className="mq-result-best">
                      {result.record
                        ? result.previous > 0
                          ? t('game.previousBest', { score: fmt(result.previous) })
                          : t('game.firstRecord')
                        : t('game.bestScore', { score: fmt(best) })}
                    </p>
                  </div>

                  {/* Bloque 2: de dónde salió el puntaje */}
                  <ul className="mq-stats" aria-label={t('game.breakdown')}>
                    <Stat label={t('game.statIncidents')} value={`+${fmt(result.summary.base)}`} />
                    <Stat label={t('game.statTime', { s: result.summary.seconds })} value={`+${fmt(result.summary.survival)}`} />
                    <Stat label={t('game.statEfficiency')} value={`+${fmt(result.summary.efficiency)}`} />
                    <Stat label={t('game.statCombo')} value={`×${result.summary.maxCombo}`} />
                  </ul>

                  {/* Bloque 3: por qué terminó */}
                  <div className="mq-card mq-cause">
                    <p className="mq-card-label">{t('game.cause')}</p>
                    <p>
                      <Rich
                        text={t('game.causeText', {
                          open: result.summary.open === 1 ? t('game.openOne') : t('game.openMany', { n: result.summary.open }),
                          worst: t(`game.type.${result.summary.worst}`),
                        })}
                      />
                    </p>
                  </div>

                  {/* Bloque 4: comentario de Nami */}
                  <div className="mq-nami-says">
                    <SpriteIcon rows={NAMI.sit[0]} className="mq-nami-icon" />
                    <p className="mq-bubble">
                      <span className="sr-only">{t('game.namiSays')} </span>
                      {t(result.line)}
                    </p>
                  </div>

                  {/* Bloque 6: acciones (principal arriba, secundarias abajo) */}
                  <div className="mq-end-actions">
                    <button type="button" autoFocus onClick={start} className="mq-btn mq-btn-main">
                      {t('game.again')}
                    </button>
                    <div className="mq-end-secondary">
                      <button type="button" onClick={goMenu} className="mq-btn mq-btn-sm mq-btn-ghost">
                        {t('game.mainMenu')}
                      </button>
                      <button type="button" onClick={close} className="mq-btn mq-btn-sm mq-btn-alt">
                        {t('game.toPortfolio')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botonera de la consola: también son los controles táctiles */}
        <div className="mq-pad">
          <div className="mq-dpad" role="group" aria-label={t('game.padMove')}>
            <button type="button" className="mq-dpad-btn mq-dpad-up" aria-label={t('game.padUp')} {...hold('up')}>
              <span aria-hidden="true">▲</span>
            </button>
            <button type="button" className="mq-dpad-btn mq-dpad-left" aria-label={t('game.padLeft')} {...hold('left')}>
              <span aria-hidden="true">◀</span>
            </button>
            <span aria-hidden="true" className="mq-dpad-mid" />
            <button type="button" className="mq-dpad-btn mq-dpad-right" aria-label={t('game.padRight')} {...hold('right')}>
              <span aria-hidden="true">▶</span>
            </button>
            <button type="button" className="mq-dpad-btn mq-dpad-down" aria-label={t('game.padDown')} {...hold('down')}>
              <span aria-hidden="true">▼</span>
            </button>
          </div>

          {/* Botones de sistema: RESET reinicia la ronda, START empieza o pausa */}
          <div className="mq-sys">
            <div className="mq-sys-col">
              <button type="button" onClick={start} className="mq-pill mq-pill-reset" aria-label={t('game.resetAria')} title={t('game.resetTitle')}>
                <span aria-hidden="true" />
              </button>
              <span aria-hidden="true" className="mq-label mq-sys-label">
                <FiRotateCcw className="mq-sys-icon" /> reset
              </span>
            </div>
            <div className="mq-sys-col">
              <button
                type="button"
                onClick={screen === 'title' || screen === 'over' ? start : playing ? pause : resume}
                className="mq-pill"
                aria-label={screen === 'title' ? t('game.startAria') : playing ? t('game.pause') : screen === 'paused' ? t('game.resume') : t('game.againAria')}
              >
                <span aria-hidden="true" />
              </button>
              <span aria-hidden="true" className="mq-label mq-sys-label">
                start
              </span>
            </div>
          </div>

          <div className="mq-ab">
            <button type="button" className="mq-b" aria-label={t('game.purrAria')} {...hold('boost')}>
              <span aria-hidden="true">B</span>
            </button>
            <button type="button" className="mq-a" aria-label={t('game.actionAria')} {...hold('action')}>
              <span aria-hidden="true">A</span>
            </button>
          </div>
        </div>
      </div>
    </dialog>,
    document.body,
  )
}

const ACTIONS: { name: MessageKey; how: MessageKey; key?: 'A' | 'B'; color: string }[] = [
  { name: 'game.actBook', how: 'game.actBookHow', key: 'A', color: '#ffd27a' },
  { name: 'game.actGlitch', how: 'game.actGlitchHow', key: 'A', color: '#3fe0d0' },
  { name: 'game.actYarn', how: 'game.actYarnHow', color: '#f2abbc' },
  { name: 'game.actPurr', how: 'game.actPurrHow', key: 'B', color: '#ff8fab' },
]

/** Guía de acciones: nombre de la incidencia + cómo se resuelve (inicio y pausa) */
function Actions() {
  const { t } = useI18n()
  return (
    <ul className="mq-actions" aria-label={t('game.actionsLabel')}>
      {ACTIONS.map((a) => (
        <li key={a.name} className="mq-card mq-action" style={{ '--accent': a.color } as CSSProperties}>
          <span className="mq-action-name">{t(a.name)}</span>
          <span className="mq-action-how">
            {t(a.how)} {a.key && <kbd>{a.key}</kbd>}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** Controles en grupos: teclado en computadora, botones de la consola en pantallas táctiles */
function Controls({ full = false }: { full?: boolean }) {
  const { t } = useI18n()
  return (
    <>
      <ul className="mq-controls mq-controls-keys" aria-label={t('game.keysLabel')}>
        <li>
          <span>{t('game.keyMove')}</span> <kbd>←↑↓→</kbd> <kbd>WASD</kbd>
        </li>
        <li>
          <span>{t('game.keyA')}</span> <kbd>E</kbd> <kbd>{t('game.keySpace')}</kbd>
        </li>
        <li>
          <span>{t('game.keyB')}</span> <kbd>Q</kbd> <kbd>Shift</kbd>
        </li>
        {full && (
          <>
            <li>
              <span>{t('game.keyPause')}</span> <kbd>P</kbd>
            </li>
            <li>
              <span>{t('game.keyRestart')}</span> <kbd>R</kbd>
            </li>
          </>
        )}
      </ul>
      <ul className="mq-controls mq-controls-touch" aria-label={t('game.touchLabel')}>
        <li>
          <span>{t('game.keyMove')}</span> {t('game.touchDpad')}
        </li>
        <li>
          <kbd>A</kbd> {t('game.touchA')}
        </li>
        <li>
          <kbd>B</kbd> {t('game.touchB')}
        </li>
        {full && (
          <>
            <li>
              <span>START</span> {t('game.touchStart')}
            </li>
            <li>
              <span>RESET</span> {t('game.touchReset')}
            </li>
          </>
        )}
      </ul>
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <li className="mq-card mq-stat">
      <span className="mq-card-label">{label}</span>
      <span className="mq-stat-value">{value}</span>
    </li>
  )
}

/** Texto con la fuente de píxeles del juego (la misma del título) */
function PixelText({ text, color, shadow, className, label }: { text: string; color: string; shadow: string; className?: string; label: string }) {
  const src = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = textWidth(text, 'big') + 1
    c.height = 8
    drawText(c.getContext('2d')!, text, 0, 0, { color, shadow })
    return c.toDataURL()
  }, [text, color, shadow])
  return <img src={src} alt={label} className={className} />
}

/** Sprite del juego como imagen pixelada (decorativa) */
function SpriteIcon({ rows, className }: { rows: string[]; className?: string }) {
  const src = useMemo(() => spriteCanvas(rows).toDataURL(), [rows])
  return <img src={src} alt="" aria-hidden="true" className={className} />
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="mq-icon">
      {children}
    </button>
  )
}
