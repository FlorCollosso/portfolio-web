import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { books, box, frames, lyingBooks, petFrames, SCENE } from '../../data/scene'
import { useFinePointer, useReducedMotion } from '../../hooks/useMediaQuery'
import type { PetPortrait, Profile, Project, SecretNote as SecretNoteData } from '../../types/portfolio'
import { asset } from '../../utils/asset'
import { Cat } from './Cat'
import { LampHint, Mug, Plant, SceneWindow, Vase } from './Decor'
import { Lamp } from './Lamp'
import { PetFrame } from './PetFrame'
import { Book, Frame, SceneLabel, type AttentionHandlers } from './ProjectObjects'
import { SecretNote } from './SecretNote'
import { Yarn } from './Yarn'

interface LibrarySceneProps {
  projects: Project[]
  profile: Profile
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
const LAMP_PIVOT = `${((440 + 48) / SCENE.width) * 100}% 0%`

// Capa con parallax: se desplaza apenas según la posición del mouse (variables --px / --py).
const layer = (depth: number): CSSProperties => ({
  transform: `translate3d(calc(var(--px, 0) * ${-depth}px), calc(var(--py, 0) * ${-depth * 0.6}px), 0)`,
})

// El estudio: pared, ventana, repisas, libros-proyecto, cuadros, el gato y la lámpara.
export function LibraryScene({ projects, profile, note, pets, onOpenProject }: LibrarySceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const [noteEl, setNoteEl] = useState<HTMLButtonElement | null>(null)
  const [focusEl, setFocusEl] = useState<HTMLElement | null>(null)
  const [hintUsed, setHintUsed] = useState(readHintUsed)
  const [openPet, setOpenPet] = useState<string | null>(null)
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

  // La notita de una gatita se guarda al tocar afuera o con Escape
  useEffect(() => {
    if (!openPet) return
    const onDown = (e: globalThis.PointerEvent) => {
      if (!(e.target instanceof Element) || !e.target.closest('[data-pet-frame]')) setOpenPet(null)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenPet(null)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [openPet])

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!fine || reduced || !sceneRef.current) return
      const r = sceneRef.current.getBoundingClientRect()
      sceneRef.current.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
      sceneRef.current.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
    },
    [fine, reduced],
  )

  const resetParallax = () => {
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
      aria-label="Mi estudio: cada libro con título y cada cuadro de la pared es un proyecto"
      onPointerMove={onPointerMove}
      onPointerLeave={resetParallax}
      className="library-scene relative aspect-[600/660] w-full overflow-hidden bg-wall [container-type:inline-size] [border-radius:50%_50%_1.6rem_1.6rem/18%_18%_1.6rem_1.6rem] shadow-[inset_0_0_0_1px_var(--color-line),0_2.5rem_4rem_-2.5rem_rgb(20_20_20/0.35)] transition-colors duration-700"
    >
      {/* Textura de pared: rayas finísimas y una sombra en el piso */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70 [background-image:repeating-linear-gradient(90deg,color-mix(in_oklab,var(--color-ink)_4%,transparent)_0_1px,transparent_1px_2.6cqw)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[16%] bg-linear-to-t from-ink/8 to-transparent" />

      {/* Luz de la lámpara (solo de noche). Comparte el parallax de la lámpara y su balanceo
          (.lamp-rig, con el mismo punto de apoyo en el techo), así la luz sale siempre de ella. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 transition-transform duration-700 ease-out" style={layer(9)}>
        <div className="lamp-rig absolute inset-0" style={{ transformOrigin: LAMP_PIVOT }}>
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-1000 dark:opacity-100"
            style={{
              background:
                'radial-gradient(ellipse 46% 40% at 81% 30%, rgb(255 215 154 / 0.34), rgb(255 215 154 / 0.1) 55%, transparent 75%)',
            }}
          />
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 mix-blend-screen transition-transform duration-700 ease-out" style={layer(9)}>
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
      <div className="pointer-events-none absolute inset-0 transition-transform duration-700 ease-out" style={layer(4)}>
        <SceneWindow style={box(42, 50, 108, 168)} />
      </div>

      {/* Capa principal: repisas y todo lo que se puede tocar */}
      <div className="pointer-events-none absolute inset-0 transition-transform duration-700 ease-out" style={layer(9)}>
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
        <Vase style={box(300, shelfTop - 78, 36, 78)} />
        <Book slot={lyingBooks[0]} lying baseY={shelfTop} order={8} />
        <Book slot={lyingBooks[1]} project={byId(lyingBooks[1].projectId)} lying baseY={shelfTop - lyingBooks[0].h} order={9} onOpen={onOpenProject} {...attention} />
        <Shelf y={shelfTop} />

        <Cat
          focusEl={focusEl}
          noteEl={noteEl}
          playEl={yarnEl}
          playing={catPlaying}
          batKey={batKey}
          style={box(426, shelfTop - lyingBooks[0].h - lyingBooks[1].h - 130, 118, 130)}
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
                open={openPet === pet.id}
                onToggle={(id) => setOpenPet((cur) => (cur === id ? null : id))}
                {...attention}
              />
            )
          )
        })}
        <Mug style={box(344, shelfBottom - 82, 46, 82)} />
        <a
          href={asset(profile.cvUrl)}
          download
          aria-label="Descargar mi CV en PDF"
          style={box(408, shelfBottom - 34, 140, 34)}
          {...attention}
          className="group absolute pointer-events-auto [animation:scene-in_0.8s_var(--ease-soft)_0.8s_backwards] hover:z-20 focus-visible:z-20"
        >
          <span className="relative flex h-full w-full items-center rounded-[3px] bg-[#c9a77c] shadow-[inset_0_-0.4cqw_0_rgb(0_0_0/0.15)] transition-transform duration-500 ease-[var(--ease-swing)] group-hover:-translate-y-[18%] group-hover:-rotate-2 dark:bg-[#8e7556]">
            <span className="absolute inset-y-0 right-[16%] w-[3%] bg-ink/70" />
            <span className="ml-[10%] rounded-[2px] bg-[#fbf6ea] px-[4%] font-hand text-[3cqw] leading-none text-ink-soft dark:text-[#2c2c2c]">CV · PDF</span>
          </span>
          <SceneLabel title="Mi CV" detail="Descargar en PDF" />
        </a>
        <Shelf y={shelfBottom} />
        <Yarn ref={setYarnEl} sceneRef={sceneRef} reduced={reduced} onNear={setCatPlaying} onBat={() => setBatKey((k) => k + 1)} />
      </div>

      {/* Capa delantera: la planta, que tapa un poco el borde */}
      <div className="pointer-events-none absolute inset-0 transition-transform duration-700 ease-out" style={layer(15)}>
        <Plant style={box(28, shelfBottom - 126, 92, 194)} />
      </div>

      {/* Viñeta muy sutil para dar profundidad */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 shadow-[inset_0_0_6cqw_rgb(0_0_0/0.08)] dark:shadow-[inset_0_0_10cqw_rgb(0_0_0/0.45)]" />

      <div className="pointer-events-none absolute inset-0 transition-transform duration-700 ease-out" style={layer(9)}>
        <Lamp style={box(440, 0, 96, 172)} onUse={markLampUsed} />
      </div>
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
