import { Fragment } from 'react'

/** Muestra un texto traducido que marca énfasis con <b>…</b>, sin usar HTML crudo */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(<b>.*?<\/b>)/g).map((part, i) =>
        part.startsWith('<b>') ? <b key={i}>{part.slice(3, -4)}</b> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  )
}
