import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './app/App'
import './index.css'
import { registerSW } from './app/pwa'

// Sembunyikan splash boot segera setelah React mount
function hideSplash() {
  document.getElementById('boot-splash')?.classList.add('hide')
  setTimeout(() => document.getElementById('boot-splash')?.remove(), 300)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)

hideSplash()
registerSW()
