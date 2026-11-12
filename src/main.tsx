import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Un saludo para quien abre la consola: también es de las personas que miran los detalles.
console.log(
  '%c¡Hola! %cSi estás leyendo esto, te fijás en los detalles. Me caés bien. → florcollosso@gmail.com',
  'font: 600 16px Georgia, serif; color: #93354f',
  'font: 14px sans-serif; color: #24605e',
)
