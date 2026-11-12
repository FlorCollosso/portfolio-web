import { forwardRef, useEffect, useRef, useState, type CSSProperties } from 'react'
import type { SecretNote as SecretNoteData } from '../../types/portfolio'
import type { AttentionHandlers } from './ProjectObjects'

interface SecretNoteProps extends AttentionHandlers {
  note: SecretNoteData
  style: CSSProperties
}

// Papelito asomado entre dos libros. Al tocarlo se despliega una nota escrita a mano.
export const SecretNote = forwardRef<HTMLButtonElement, SecretNoteProps>(function SecretNote({ note, style, ...handlers }, ref) {
  const [open, setOpen] = useState(false)
  const [found, setFound] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={() => {
          setOpen(true)
          setFound(true)
        }}
        aria-label={found ? 'Volver a leer la nota escondida' : 'Hay un papelito escondido entre los libros'}
        style={style}
        {...handlers}
        className="group absolute pointer-events-auto cursor-pointer [animation:scene-in_0.8s_var(--ease-soft)_0.9s_backwards]"
      >
        <span className="block h-full w-full origin-bottom rotate-[7deg] transition-transform duration-500 ease-[var(--ease-swing)] group-hover:-translate-y-[22%] group-hover:rotate-[2deg] group-hover:[animation:wiggle_0.6s_ease-in-out] group-focus-visible:-translate-y-[22%]">
          <span className="relative block h-full w-full rounded-[1px] bg-[#fbf6ea] shadow-[0_0_0_0.5px_rgb(0_0_0/0.08),0.4cqw_0.4cqw_0.8cqw_rgb(0_0_0/0.15)] dark:bg-[#e9e1d0]">
            <span className="absolute inset-x-[18%] top-[14%] h-px bg-rose/70" />
            <span className="absolute inset-x-[18%] top-[24%] h-px bg-ink/15" />
            <span className="absolute inset-x-[18%] top-[32%] h-px bg-ink/15" />
            <span className="absolute top-0 right-0 size-[34%] bg-linear-to-bl from-[#e8dfcc] from-50% to-transparent to-50%" />
          </span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialogRef.current && setOpen(false)}
        aria-labelledby="nota-secreta-titulo"
        className="m-auto w-[min(100%-2rem,30rem)] overflow-visible bg-transparent p-0"
      >
        <div className="relative -rotate-1 bg-[#fbf6ea] px-7 pt-10 pb-8 text-[#2c2a26] shadow-2xl [animation:unfold_0.7s_var(--ease-soft)] [background-image:repeating-linear-gradient(transparent_0_1.95rem,rgb(128_189_187/0.35)_1.95rem_2rem)] [background-position:0_0.42rem] sm:px-10">
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

          <form method="dialog" className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-full border border-[#2c2a26]/20 px-4 py-2 text-sm font-semibold text-[#2c2a26] transition-colors hover:border-[#2c2a26] hover:bg-[#2c2a26] hover:text-[#fbf6ea]"
            >
              Doblar la nota
            </button>
          </form>
        </div>
      </dialog>
    </>
  )
})
