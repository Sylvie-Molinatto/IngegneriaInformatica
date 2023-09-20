import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import './index.css' // -> we do not want to include the default CSS file created by Vite

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
