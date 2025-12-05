import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Dashboard from './pages/Dashboard'
import InstitucionesList from './pages/InstitucionesList'
import InstitucionesServicios from './pages/InstitucionesServicios'
import InstitucionesOficinas from './pages/InstitucionesOficinas'
import PageTemplate from './pages/PageTemplate'
import EquiposTipos from './pages/EquiposTipos'
import EquiposTiposForm from './pages/EquiposTiposForm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="instituciones/listado"
            element={<InstitucionesList />}
          />
          <Route
            path="instituciones/servicios"
            element={<InstitucionesServicios />}
          />
          <Route
            path="instituciones/oficinas"
            element={<InstitucionesOficinas />}
          />
          <Route path="oficinas" element={<Navigate to="/instituciones/oficinas" replace />} />
          <Route
            path="equipos/listado"
            element={<PageTemplate title="Equipos" description="Inventario y estado de equipos." />}
          />
          <Route
            path="equipos/tipos"
            element={<EquiposTipos />}
          />
          <Route path="equipos/tipos/nuevo" element={<EquiposTiposForm />} />
          <Route
            path="equipos/tipos/editar/:id"
            element={<EquiposTiposForm />}
          />
          <Route
            path="asignaciones"
            element={<PageTemplate title="Asignaciones" description="Relación entre equipos, servicios y responsables." />}
          />
          <Route
            path="mantenimientos/historial"
            element={<PageTemplate title="Historial de mantenimiento" description="Registro y trazabilidad de intervenciones." />}
          />
          <Route
            path="mantenimientos/programar"
            element={<PageTemplate title="Programar mantenimiento" description="Planificación preventiva y calendarización." />}
          />
          <Route
            path="mantenimientos/servicios-externos"
            element={<PageTemplate title="Servicios técnicos externos" description="Seguimiento de proveedores y contratos." />}
          />
          <Route
            path="actas/listado"
            element={<PageTemplate title="Actas" description="Actas generadas y en revisión." />}
          />
          <Route
            path="actas/nueva"
            element={<PageTemplate title="Nueva acta" description="Creación guiada de una nueva acta." />}
          />
          <Route
            path="reportes"
            element={<PageTemplate title="Reportes" description="Indicadores y reportes ejecutivos." />}
          />
          <Route
            path="administracion/usuarios"
            element={<PageTemplate title="Usuarios" description="Gestión de cuentas y accesos." />}
          />
          <Route
            path="administracion/roles-permisos"
            element={<PageTemplate title="Roles y permisos" description="Definición de permisos y perfiles." />}
          />
          <Route
            path="configuracion/modulos"
            element={<PageTemplate title="Módulos por institución" description="Activación y configuración modular." />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
