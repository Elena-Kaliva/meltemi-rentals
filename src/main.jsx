import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const canonical = document.querySelector('#canonical-url')
if (canonical) canonical.href = `${window.location.origin}${window.location.pathname}`

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
