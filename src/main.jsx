// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

// Import your global CSS 
import './index.css'       

// Import the default export from Portfolio.jsx
import Portfolio from './Portfolio.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Portfolio />
  </React.StrictMode>,
)