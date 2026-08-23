import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CustomerProvider } from './context/CustomerContext.jsx'
import { ProductProvider } from "./context/ProductContext";
import { ThemeProvider } from "./pages/context/ThemeContext";

registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CustomerProvider>
          <ProductProvider>
            <App />
          </ProductProvider>
        </CustomerProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
