import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './styles/variables.css'
import './styles/globals.css'
import './index.css' // keeping original index.css as a fallback or component specific, but arguably could remove if empty. Keeping for safety.
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Toaster position="top-right" />
  </StrictMode>,
)
