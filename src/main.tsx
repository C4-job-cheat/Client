import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import { PersonaProvider } from './hooks/usePersona'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersonaProvider>
      <App />
    </PersonaProvider>
  </StrictMode>,
)
