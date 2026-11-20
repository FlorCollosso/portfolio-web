import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)

// Un saludo para quien abre la consola: también es de las personas que miran los detalles.
console.log(
  '%c¡Hola! / Hi! %cSi estás leyendo esto, te fijás en los detalles. Me caés bien. / If you’re reading this, you notice the details. I like you already. → florcollosso@gmail.com',
  'font: 600 16px Georgia, serif; color: #93354f',
  'font: 14px sans-serif; color: #24605e',
)
