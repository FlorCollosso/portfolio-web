// Bucle del juego: paso fijo de 1/60 s sobre requestAnimationFrame (la lógica no depende de los fps)
export function runLoop(step: () => void, draw: () => void) {
  const STEP = 1000 / 60
  let raf = 0
  let last = 0
  let acc = 0
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    if (!last) last = now
    acc += Math.min(now - last, 100)
    last = now
    let steps = 0
    while (acc >= STEP && steps < 5) {
      step()
      acc -= STEP
      steps++
    }
    if (steps === 5) acc = 0
    draw()
  }
  raf = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(raf)
}
