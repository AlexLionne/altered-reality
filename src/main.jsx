import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Paper from "./Paper.jsx";
import App from "./App.jsx";
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
      <Paper />
  </StrictMode>,
)
