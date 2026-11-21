import { useCallback, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { books, box, frames, lyingBooks, petFrames, SCENE } from '../../data/scene'
import { useFinePointer, useReducedMotion } from '../../hooks/useMediaQuery'
import type { PetPortrait, Project, SecretNote as SecretNoteData } from '../../types/portfolio'
import { Cat } from './Cat'
import { HangingPlant, LampHint, Plant, SceneWindow, Vase } from './Decor'
import { GameConsole } from './GameConsole'
import { Lamp } from './Lamp'
import { PetFrame } from './PetFrame'
import { Book, Frame, SceneLabel, type AttentionHandlers } from './ProjectObjects'
import { SecretNote } from './SecretNote'
import { Yarn } from './Yarn'
import { useCv } from '../../i18n/useCv'
import { useI18n } from '../../i18n/useI18n'

interface LibrarySceneProps {
  projects: Project[]
  note: SecretNoteData
  pets: PetPortrait[]
  onOpenProject: (project: Project) => void
}

const HINT_KEY = 'fc-lamp-used'
const readHintUsed = () => {
  try {
    return localStorage.getItem(HINT_KEY) === '1'
  } catch {
    return false
  }
}

const { shelfTop, shelfBottom } = SCENE
// Donde cuelga la lámpara del techo (x = 440 + 48 de la escena): eje del balanceo de lámpara y luz
const LAMP_X = 440 + 48
const LAMP_PIVOT = `${(LAMP_X / SCENE.width) * 100}% 0%`

// El estudio: pared, ventana, repisas, libros-proyecto, cuadros, el gato y la lámpara.
export function LibraryScene({ projects, note, pets, onOpenProject }: LibrarySceneProps) {
  const { t } = useI18n()
  const cv = useCv()
  const sceneRef = useRef<HTMLDivElement>(null)
  // La "cámara": todo lo que está dentro se mueve junto, como una sola pieza
  const stageRef = useRef<HTMLDivElement>(null)
  // Zona de 600 × 660 unidades donde se ubica todo; a los costados queda pared libre (aire)
  const contentRef = useRef<HTMLDivElement>(null)
  const [noteEl, setNoteEl] = useState<HTMLButtonElement | null>(null)
  const [focusEl, setFocusEl] = useState<HTMLElement | null>(null)
  const [hintUsed, setHintUsed] = useState(readHintUsed)
  const [yarnEl, setYarnEl] = useState<HTMLButtonElement | null>(null)
  const [catPlaying, setCatPlaying] = useState(false)
  const [batKey, setBatKey] = useState(0)
  const fine = useFinePointer()
  const reduced = useReducedMotion()

  const byId = (id?: string) => projects.find((p) => p.id === id)

  const attention: AttentionHandlers = {
    onPointerEnter: (e) => setFocusEl(e.currentTarget),
    onPointerLeave: () => setFocusEl(null),
    onFocus: (e) => setFocusEl(e.currentTarget),
    onBlur: () => setFocusEl(null),
  }

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!fine || reduced || !sceneRef.current) return
      const r = sceneRef.current.getBoundingClientRect()
      sceneRef.current.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
      sceneRef.current.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
    },
    [fine, reduced],
  )

  const resetView = () => {
    sceneRef.current?.style.setProperty('--px', '0')
    sceneRef.current?.style.setProperty('--py', '0')
  }

  const markLampUsed = () => {
    setHintUsed(true)
    try {
      localStorage.setItem(HINT_KEY, '1')
    } catch {
      // sin almacenamiento: la pista vuelve a aparecer en la próxima visita
    }
  }

  return (
    <div
      ref={sceneRef}
      role="group"
      aria-label={t('scene.label')}
      onPointerMove={onPointerMove}
      onPointerLeave={resetView}
      className="library-scene relative aspect-[6721/7134] w-full overflow-hidden bg-wall [container-type:inline-size] [border-radius:50%_50%_1.6rem_1.6rem/18%_18%_1.6rem_1.6rem] shadow-[inset_0_0_0_1px_var(--color-line),0_2.5rem_4rem_-2.5rem_rgb(20_20_20/0.35)] transition-colors duration-700"
    >
      {/* Escenario: pared, luz, repisas y objetos quedan fijos entre sí. Al mover el mouse se mueve
          la vista entera (.scene-stage), como mirar por una ventana desde otro ángulo. */}
      <div ref={stageRef} className="scene-stage absolute inset-0">
        <div aria-hidden="true" className="absolute inset-0 bg-wall transition-colors duration-700" />
        {/* Textura de pared: rayas finísimas y una sombra en el piso */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70 [background-image:repeating-linear-gradient(90deg,color-mix(in_oklab,var(--color-ink)_4%,transparent)_0_1px,transparent_1px_2.6cqw)]"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[16%] bg-linear-to-t from-ink/8 to-transparent" />

        {/* Contenido de la escena (600 × 660 unidades). Alrededor queda pared libre: ya contando el zoom de la
            cámara (.scene-stage, ×1.055), entre lo más saliente (la planta a la izquierda, la repisa a la derecha,
            sus patas abajo) y el borde se ve una bolita de lana de aire; arriba se suma una bolita sobre la ventana */}
        <div ref={contentRef} className="absolute top-[4.486%] right-[3.499%] bottom-[3%] left-[7.234%] [container-type:inline-size]">

          {/* Luz de la lámpara (solo de noche).
              a) Halo sobre la pared: luz ambiente, quieta. Es una elipse que se apaga del todo antes del borde
                 de su caja, así nunca muestra un corte.
              b) Haz: sale de la pantalla de la lámpara y se balancea con ella (.lamp-rig, mismo punto de apoyo). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute opacity-0 transition-opacity duration-1000 dark:opacity-100"
            style={{
              ...box(LAMP_X - 330, 190 - 270, 660, 540),
              background: 'radial-gradient(closest-side, rgb(255 215 154 / 0.3), rgb(255 215 154 / 0.12) 50%, rgb(255 215 154 / 0.04) 78%, transparent)',
            }}
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 mix-blend-screen">
            <div className="lamp-rig absolute inset-0" style={{ transformOrigin: LAMP_PIVOT }}>
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-1000 dark:opacity-100"
                style={{
                  background: 'linear-gradient(to bottom, rgb(255 222 166 / 0.28), rgb(255 222 166 / 0.02))',
                  clipPath: 'polygon(74.5% 21.8%, 87.5% 21.8%, 100% 58%, 62% 58%)',
                }}
              >
                {!reduced &&
                  [0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="absolute size-[0.6cqw] rounded-full bg-[#fff1cf]"
                      style={
                        {
                          left: `${72 + i * 4}%`,
                          top: `${26 + (i % 3) * 7}%`,
                          '--dx': `${i % 2 ? -12 : 10}px`,
                          animation: `mote ${5 + i}s linear ${i * 1.1}s infinite`,
                        } as CSSProperties
                      }
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Capa del fondo: ventana */}
          <div className="pointer-events-none absolute inset-0">
            <SceneWindow style={box(42, 50, 108, 168)} />
            {/* Planta colgante sobre la repisa de la ventana: las guías caen por la izquierda */}
            <HangingPlant style={box(36 - 30.9 * 0.73, 204.6 - (39.33 + 58.4) * 0.73, 90.36 * 0.73, 216.35 * 0.73)} />
          </div>

          {/* Capa principal: repisas y todo lo que se puede tocar */}
          <div className="pointer-events-none absolute inset-0">
            {frames.map((slot, i) => {
              const project = byId(slot.projectId)
              return project && <Frame key={slot.projectId} slot={slot} project={project} order={i} onOpen={onOpenProject} {...attention} />
            })}

            {!hintUsed && <LampHint style={box(318, 168, 120, 40)} />}

            {/* Repisa de arriba */}
            <SecretNote ref={setNoteEl} note={note} style={box(176, 194, 22, 46)} {...attention} />
            {books.map((slot, i) => (
              <Book key={slot.x} slot={slot} project={byId(slot.projectId)} baseY={shelfTop} order={i} onOpen={onOpenProject} {...attention} />
            ))}
            <Vase style={box(318, shelfTop - 110.3, 39.6, 111.5)} />
            <Book slot={lyingBooks[0]} lying baseY={shelfTop} order={8} />
            <Book slot={lyingBooks[1]} project={byId(lyingBooks[1].projectId)} lying baseY={shelfTop - lyingBooks[0].h} order={9} onOpen={onOpenProject} {...attention} />
            <Shelf y={shelfTop} />

            <Cat
              focusEl={focusEl}
              noteEl={noteEl}
              playEl={yarnEl}
              playing={catPlaying}
              batKey={batKey}
              // La base del cuerpo (y = 351 de 362 en la ilustración) se hunde una unidad en el libro: bien sentado, sin espacio
              style={box(436.2, shelfTop - lyingBooks[0].h - lyingBooks[1].h + 1 - 136.5 * (351 / 362), 124.7, 136.5)}
              className="z-10 [animation:peek-in_1.1s_var(--ease-soft)_1.1s_backwards]"
            />

            {/* Repisa de abajo: mis gatitas, la lana, la taza y el CV */}
            {petFrames.map((slot, i) => {
              const pet = pets.find((p) => p.id === slot.petId)
              return (
                pet && (
                  <PetFrame
                    key={slot.petId}
                    slot={slot}
                    pet={pet}
                    order={i}
                    {...attention}
                  />
                )
              )
            })}
            <Plant style={box(0.9, shelfBottom - 146.5, 131.1, 148.2)} />
            <GameConsole style={box(348, shelfBottom - 64, 42, 64)} reduced={reduced} {...attention} />
            <a
              href={cv.href}
              download={cv.fileName}
              aria-label={t('scene.cvAria')}
              style={box(408, shelfBottom - 34, 140, 34)}
              {...attention}
              className="group absolute pointer-events-auto [animation:scene-in_0.8s_var(--ease-soft)_0.8s_backwards] hover:z-20 focus-visible:z-20"
            >
              <span className="relative flex h-full w-full items-center rounded-[3px] bg-[#c9a77c] shadow-[inset_0_-0.4cqw_0_rgb(0_0_0/0.15)] transition-transform duration-500 ease-[var(--ease-swing)] group-hover:-translate-y-[18%] group-hover:-rotate-2 dark:bg-[#8e7556]">
                <span className="absolute inset-y-0 right-[16%] w-[3%] bg-ink/70" />
                <span className="ml-[10%] rounded-[2px] bg-[#fbf6ea] px-[4%] font-hand text-[3cqw] leading-none text-ink-soft dark:text-[#2c2c2c]">CV · PDF</span>
              </span>
              <SceneLabel title={t('scene.cvTitle')} detail={t('scene.cvDetail')} at={408 + 70} />
            </a>
            <Shelf y={shelfBottom} />
            <Yarn ref={setYarnEl} sceneRef={contentRef} reduced={reduced} onNear={setCatPlaying} onBat={() => setBatKey((k) => k + 1)} />
          </div>

          <div className="pointer-events-none absolute inset-0">
            <Lamp style={box(440, 0, 96, 172)} onUse={markLampUsed} />
          </div>
        </div>
      </div>

      {/* Viñeta muy sutil en el borde de la "ventana": no se mueve con la vista */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 shadow-[inset_0_0_6cqw_rgb(0_0_0/0.08)] dark:shadow-[inset_0_0_10cqw_rgb(0_0_0/0.45)]" />
    </div>
  )
}

function Shelf({ y }: { y: number }) {
  return (
    <div aria-hidden="true" className="absolute" style={box(26, y, 548, 16)}>
      <div className="h-full rounded-[2px] bg-wood shadow-[0_1.6cqw_1.6cqw_-1cqw_rgb(0_0_0/0.3)] transition-colors duration-700" />
      <div className="absolute inset-x-0 top-0 h-[28%] rounded-t-[2px] bg-white/18" />
      <div className="absolute top-full left-[8%] h-[180%] w-[2.2%] rounded-b-sm bg-wood-deep" />
      <div className="absolute top-full right-[8%] h-[180%] w-[2.2%] rounded-b-sm bg-wood-deep" />
    </div>
  )
}
