import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App.jsx'
import './styles.css'

// Temporarily disable StrictMode to prevent double-mounting issues with socket connections
// In production, this won't be an issue as StrictMode only runs in development
createRoot(document.getElementById('root')).render(
  <App />
)


