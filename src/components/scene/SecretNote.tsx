import { forwardRef, useEffect, useRef, useState, type AnimationEvent, type CSSProperties } from 'react'
import type { SecretNote as SecretNoteData } from '../../types/portfolio'
import type { AttentionHandlers } from './ProjectObjects'
import { useI18n } from '../../i18n/useI18n'

interface SecretNoteProps extends AttentionHandlers {
  note: SecretNoteData
  style: CSSProperties
}

type Phase = 'hidden' | 'open' | 'closing'

// Papelito asomado entre dos libros. Al tocarlo se despliega una nota escrita a mano;
// al guardarla, se achica y se desvanece deslizándose hacia su escondite.
export const SecretNote = forwardRef<HTMLButtonElement, SecretNoteProps>(function SecretNote({ note, style, ...handlers }, ref) {
  const { t } = useI18n()
  const [phase, setPhase] = useState<Phase>('hidden')
  const [found, setFound] = useState(false)
  // Cambia cada vez que la nota vuelve a su lugar, para que el papelito "la reciba"
  const [landed, setLanded] = useState(0)
  const [flight, setFlight] = useState({ x: 0, y: 0 })
  const dialogRef = useRef<HTMLDialogElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (phase === 'open' && !dialog.open) dialog.showModal()
    if (phase === 'hidden' && dialog.open) dialog.close()
  }, [phase])

  // Empieza a guardarse: calcula hacia dónde se desliza (el papelito entre los libros)
  const close = () => {
    if (phase !== 'open') return
    const paper = paperRef.current?.getBoundingClientRect()
    const home = triggerRef.current?.getBoundingClientRect()
    if (paper && home) {
      setFlight({
        x: home.left + home.width / 2 - (paper.left + paper.width / 2),
        y: home.top + home.height / 2 - (paper.top + paper.height / 2),
      })
    }
    setPhase('closing')
  }

  const onFolded = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.animationName !== 'note-away') return
    setPhase('hidden')
    setLanded((n) => n + 1)
  }

  const closing = phase === 'closing'

  return (
    <>
      <button
        ref={(el) => {
          triggerRef.current = el
          if (typeof ref === 'function') ref(el)
          else if (ref) ref.current = el
        }}
        type="button"
        onClick={() => {
          setPhase('open')
          setFound(true)
        }}
        aria-label={found ? t('scene.noteAgain') : t('scene.noteHidden')}
        aria-haspopup="dialog"
        style={style}
        {...handlers}
        className="group absolute pointer-events-auto cursor-pointer [animation:scene-in_0.8s_var(--ease-soft)_0.9s_backwards]"
      >
        <span
          key={landed}
          className={`block h-full w-full ${landed ? '[animation:note-home_0.6s_var(--ease-swing)]' : ''} ${phase === 'hidden' ? '' : 'opacity-0'}`}
        >
          <span className="block h-full w-full origin-bottom rotate-[7deg] transition-transform duration-500 ease-[var(--ease-swing)] group-hover:-translate-y-[22%] group-hover:rotate-[2deg] group-hover:[animation:wiggle_0.6s_ease-in-out] group-focus-visible:-translate-y-[22%]">
            <span className="relative block h-full w-full rounded-[1px] bg-[#fbf6ea] shadow-[0_0_0_0.5px_rgb(0_0_0/0.08),0.4cqw_0.4cqw_0.8cqw_rgb(0_0_0/0.15)] dark:bg-[#e9e1d0]">
              <span className="absolute inset-x-[18%] top-[14%] h-px bg-rose/70" />
              <span className="absolute inset-x-[18%] top-[24%] h-px bg-ink/15" />
              <span className="absolute inset-x-[18%] top-[32%] h-px bg-ink/15" />
              <span className="absolute top-0 right-0 size-[34%] bg-linear-to-bl from-[#e8dfcc] from-50% to-transparent to-50%" />
            </span>
          </span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        data-closing={closing || undefined}
        onCancel={(e) => {
          // Escape también la guarda con la animación en vez de cerrarla de golpe
          e.preventDefault()
          close()
        }}
        onClose={() => setPhase('hidden')}
        onClick={(e) => e.target === dialogRef.current && close()}
        aria-labelledby="nota-secreta-titulo"
        // pointer-events-auto: el diálogo vive dentro de la capa de la escena (pointer-events: none),
        // y sin esto heredaba ese valor y ningún clic llegaba a la nota ni a su botón.
        className="pointer-events-auto m-auto w-[min(100%-2rem,30rem)] overflow-visible bg-transparent p-0"
      >
        <div
          ref={paperRef}
          onAnimationEnd={onFolded}
          style={{ '--to-x': `${flight.x}px`, '--to-y': `${flight.y}px` } as CSSProperties}
          className={`relative bg-[#fbf6ea] px-7 pt-10 pb-8 text-[#2c2a26] shadow-2xl [background-image:repeating-linear-gradient(transparent_0_1.95rem,rgb(128_189_187/0.35)_1.95rem_2rem)] [background-position:0_0.42rem] sm:px-10 ${
            closing ? 'pointer-events-none [animation:note-away_0.42s_cubic-bezier(0.45,0,0.75,0.35)_forwards]' : '-rotate-1 [animation:unfold_0.7s_var(--ease-soft)]'
          }`}
        >
          {/* Cinta de papel */}
          <span aria-hidden="true" className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-2 bg-rose-soft/90 shadow-sm [clip-path:polygon(3%_0,97%_4%,100%_100%,0_92%)] dark:bg-[#f1d1d1]/90" />
          <span aria-hidden="true" className="absolute inset-y-0 left-6 w-px bg-rose/50 sm:left-8" />

          <h2 id="nota-secreta-titulo" className="font-hand text-3xl leading-8 font-semibold text-[#93354f]">
            {note.greeting}
          </h2>
          <div className="font-hand text-[1.45rem] leading-8">
            {note.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="text-right font-hand text-3xl leading-8 text-[#24605e]">— {note.signature}</p>
          {note.postscript && <p className="font-hand text-xl leading-8 text-[#55534f]">{note.postscript}</p>}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={close}
              disabled={closing}
              className="cursor-pointer rounded-full border border-[#2c2a26]/20 px-4 py-2 text-sm font-semibold text-[#2c2a26] transition-colors hover:border-[#2c2a26] hover:bg-[#2c2a26] hover:text-[#fbf6ea]"
            >
              {t('scene.noteFold')}
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
})
