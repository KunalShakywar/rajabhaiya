import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CustomerProvider } from './context/CustomerContext.jsx'
import { ProductProvider } from "./context/ProductContext";

registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CustomerProvider>
        <ProductProvider>
          <App />
        </ProductProvider>
      </CustomerProvider>
    </AuthProvider>
  </StrictMode>,
)
