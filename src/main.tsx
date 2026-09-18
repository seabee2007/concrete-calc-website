import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <HelmetProvider>
      <App initialPathname={window.location.pathname} />
    </HelmetProvider>
  </StrictMode>
)

// Prerendered pages (scripts/prerender.mjs) ship their markup inside #root and
// are hydrated; the dev server and the 404 page start from an empty root.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
