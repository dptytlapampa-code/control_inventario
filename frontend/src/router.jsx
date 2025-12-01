import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Hospitales from './pages/Hospitales'
import Servicios from './pages/Servicios'
import Oficinas from './pages/Oficinas'
import Equipos from './pages/Equipos'
import Mantenimientos from './pages/Mantenimientos'
import Actas from './pages/Actas'
import Configuracion from './pages/Configuracion'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="hospitales" element={<Hospitales />} />
      <Route path="servicios" element={<Servicios />} />
      <Route path="oficinas" element={<Oficinas />} />
      <Route path="equipos" element={<Equipos />} />
      <Route path="mantenimientos" element={<Mantenimientos />} />
      <Route path="actas" element={<Actas />} />
      <Route path="configuracion" element={<Configuracion />} />
    </Route>
  )
)

export default router
