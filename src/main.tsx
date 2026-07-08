import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/cascadia-code/400.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/space-mono/400.css'
import '@fontsource/ibm-plex-mono/400.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
