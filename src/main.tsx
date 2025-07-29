import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from '@/context/AuthContext.tsx'
import './index.css'
import L from 'leaflet'
import Container from '@/components/Container.tsx'
import { Provider } from 'react-redux'
import store from '@/store'

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <Container>
            <App />
          </Container>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
