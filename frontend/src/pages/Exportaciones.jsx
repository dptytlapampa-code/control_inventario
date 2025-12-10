import { useEffect, useMemo, useState } from 'react'
import ExportCard from '../components/ExportCard'
import {
  exportActas,
  exportAuditoria,
  exportEquipos,
  exportHospitales,
  exportHistorial,
  exportMantenimientos,
  exportOficinas,
  exportServicios,
  exportTiposEquipos,
  exportUsuarios,
  getHospitales,
  getOficinas,
  getServicios,
} from '../utils/api'

const exportHandlers = {
  equipos: exportEquipos,
  mantenimientos: exportMantenimientos,
  historial: exportHistorial,
  actas: exportActas,
  usuarios: exportUsuarios,
  auditoria: exportAuditoria,
  hospitales: exportHospitales,
  servicios: exportServicios,
  oficinas: exportOficinas,
  tipos_equipos: exportTiposEquipos,
}

function Exportaciones() {
  const [loadingKey, setLoadingKey] = useState(null)
  const [hospitales, setHospitales] = useState([])
  const [servicios, setServicios] = useState([])
  const [oficinas, setOficinas] = useState([])

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [hosp, serv, ofic] = await Promise.all([
          getHospitales(),
          getServicios(),
          getOficinas(),
        ])
        setHospitales(hosp.data || hosp)
        setServicios(serv.data || serv)
        setOficinas(ofic.data || ofic)
      } catch (error) {
        console.error('No se pudieron cargar filtros', error)
      }
    }

    loadFilters()
  }, [])

  const hospitalOptions = useMemo(
    () => hospitales.map((item) => ({ value: item.id, label: item.nombre })),
    [hospitales],
  )
  const servicioOptions = useMemo(
    () => servicios.map((item) => ({ value: item.id, label: item.nombre })),
    [servicios],
  )
  const oficinaOptions = useMemo(
    () => oficinas.map((item) => ({ value: item.id, label: item.nombre })),
    [oficinas],
  )

  const baseFilters = [
    { name: 'q', label: 'Búsqueda', type: 'text' },
    { name: 'hospital_id', label: 'Hospital', type: 'select', options: hospitalOptions },
    { name: 'servicio_id', label: 'Servicio', type: 'select', options: servicioOptions },
    { name: 'oficina_id', label: 'Oficina', type: 'select', options: oficinaOptions },
    { name: 'desde', label: 'Desde', type: 'date' },
    { name: 'hasta', label: 'Hasta', type: 'date' },
  ]

  const exportCards = [
    {
      key: 'equipos',
      title: 'Exportar equipos',
      description: 'Inventario detallado con trazabilidad y adjuntos.',
      filters: baseFilters,
    },
    {
      key: 'mantenimientos',
      title: 'Mantenimientos',
      description: 'Intervenciones preventivas y correctivas.',
      filters: baseFilters,
    },
    {
      key: 'historial',
      title: 'Historial de movimientos',
      description: 'Traslados y eventos registrados para cada equipo.',
      filters: baseFilters,
    },
    {
      key: 'actas',
      title: 'Actas generadas',
      description: 'Entrega, traslado, baja y préstamos oficiales.',
      filters: baseFilters,
    },
    {
      key: 'usuarios',
      title: 'Usuarios y permisos',
      description: 'Listado de usuarios con asignaciones y roles.',
      filters: [{ name: 'q', label: 'Búsqueda', type: 'text' }, baseFilters[1]],
    },
    {
      key: 'auditoria',
      title: 'Auditoría del sistema',
      description: 'Acciones críticas y huella digital.',
      filters: [baseFilters[0], baseFilters[4], baseFilters[5]],
    },
    {
      key: 'hospitales',
      title: 'Hospitales',
      description: 'Instituciones registradas y su estado.',
      filters: [baseFilters[0]],
    },
    {
      key: 'servicios',
      title: 'Servicios',
      description: 'Servicios y unidades de atención por hospital.',
      filters: [baseFilters[1], baseFilters[0]],
    },
    {
      key: 'oficinas',
      title: 'Oficinas',
      description: 'Dependencias internas y su jerarquía.',
      filters: [baseFilters[1], baseFilters[2], baseFilters[0]],
    },
    {
      key: 'tipos_equipos',
      title: 'Tipos de equipos',
      description: 'Catálogo de clasificación tecnológica.',
      filters: [],
    },
  ]

  const handleExport = async (key, params) => {
    const handler = exportHandlers[key]
    if (!handler) return
    setLoadingKey(key)
    try {
      const payload = { ...params }
      if (!payload.format) {
        payload.format = 'excel'
      }
      const blob = await handler(payload)
      const extension = payload.format === 'pdf' ? 'pdf' : payload.format === 'csv' ? 'csv' : 'xlsx'
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${key}-${new Date().toISOString().slice(0, 10)}.${extension}`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('No se pudo exportar', error)
      alert('No se pudo generar la exportación. Intente nuevamente o contacte al administrador.')
    } finally {
      setLoadingKey(null)
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <p className="text-muted mb-1">Sistema / Exportaciones oficiales</p>
          <h2 className="mb-0">Exportaciones</h2>
          <p className="text-muted small mb-0">Descarga masiva en formatos Excel, CSV y PDF con filtros avanzados.</p>
        </div>
        <div className="text-end">
          <span className="badge bg-success-subtle text-success">Administrador</span>
        </div>
      </div>
      <div className="row g-3">
        {exportCards.map((item) => (
          <div className="col-lg-6" key={item.key}>
            <ExportCard
              title={item.title}
              description={item.description}
              filtersConfig={item.filters}
              loading={loadingKey === item.key}
              onExport={(params) => handleExport(item.key, params)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Exportaciones
