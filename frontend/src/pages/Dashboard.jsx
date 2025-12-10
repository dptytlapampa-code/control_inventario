import { useEffect, useMemo, useState } from 'react'
import { Activity, Building2, Cpu, Layers, Stethoscope, Wrench } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import Error from '../components/Error'
import GraficoEquiposPorEstado from '../components/GraficoEquiposPorEstado'
import GraficoEquiposPorHospital from '../components/GraficoEquiposPorHospital'
import GraficoEquiposPorTipo from '../components/GraficoEquiposPorTipo'
import GraficoMantenimientosPorMes from '../components/GraficoMantenimientosPorMes'
import KpiCard from '../components/KpiCard'
import Loader from '../components/Loader'
import { getDashboardKpis, getEquiposPorEstado, getEquiposPorHospital, getEquiposPorTipo, getMantenimientosPorMes } from '../utils/api'

function Dashboard() {
  const [kpis, setKpis] = useState(null)
  const [equiposPorTipo, setEquiposPorTipo] = useState([])
  const [equiposPorEstado, setEquiposPorEstado] = useState([])
  const [mantenimientosPorMes, setMantenimientosPorMes] = useState([])
  const [equiposPorHospital, setEquiposPorHospital] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasPermission, setHasPermission] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError('')
        const [kpiData, tipoData, estadoData, mantenimientoData, hospitalData] = await Promise.all([
          getDashboardKpis(),
          getEquiposPorTipo(),
          getEquiposPorEstado(),
          getMantenimientosPorMes(),
          getEquiposPorHospital(),
        ])
        setKpis(kpiData)
        setEquiposPorTipo(tipoData)
        setEquiposPorEstado(estadoData)
        setMantenimientosPorMes(mantenimientoData)
        setEquiposPorHospital(hospitalData)
      } catch (err) {
        const status = err?.response?.status
        if (status === 403) {
          setHasPermission(false)
          setError('No tienes permisos para visualizar el dashboard.')
        } else {
          setError('No pudimos cargar la información del dashboard.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const estadoCounts = useMemo(() => {
    const mapa = Object.entries(kpis?.equipos_por_estado || {}).reduce((acc, [estado, total]) => {
      acc[estado.toLowerCase()] = total
      return acc
    }, {})

    const getValue = (estado) => mapa[estado.toLowerCase()] || 0

    return {
      operativo: getValue('Operativo'),
      mantenimiento: getValue('En mantenimiento'),
      fueraServicio: getValue('Fuera de servicio'),
      baja: getValue('Dado de baja'),
    }
  }, [kpis])

  if (loading) {
    return (
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600 mb-0">Resumen ejecutivo del inventario y mantenimientos.</p>
        </div>
        <Loader text="Preparando panel" />
      </section>
    )
  }

  if (!hasPermission) {
    return (
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600 mb-0">Resumen ejecutivo del inventario y mantenimientos.</p>
        </div>
        <EmptyState
          title="Acceso restringido"
          message="Tu usuario no tiene el permiso dashboard:view. Solicita acceso al administrador para visualizar las métricas."
        />
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600 mb-0">Resumen ejecutivo del inventario y mantenimientos.</p>
      </div>

      {error && <Error title="No se pudo cargar" message={error} />}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-3">
        <div className="col">
          <KpiCard title="Total de equipos" value={kpis?.total_equipos ?? 0} icon={Cpu} />
        </div>
        <div className="col">
          <KpiCard title="Operativos" value={estadoCounts.operativo} icon={Activity} variant="success" />
        </div>
        <div className="col">
          <KpiCard title="En mantenimiento" value={estadoCounts.mantenimiento} icon={Wrench} variant="warning" />
        </div>
        <div className="col">
          <KpiCard title="Fuera de servicio" value={estadoCounts.fueraServicio} icon={Layers} variant="danger" />
        </div>
        <div className="col">
          <KpiCard title="Dados de baja" value={estadoCounts.baja} icon={Layers} variant="danger" />
        </div>
        <div className="col">
          <KpiCard
            title="Mantenimientos del mes"
            value={kpis?.mantenimientos_mes ?? 0}
            icon={Wrench}
            variant="info"
          />
        </div>
        <div className="col">
          <KpiCard title="Hospitales" value={kpis?.total_hospitales ?? 0} icon={Building2} />
        </div>
        <div className="col">
          <KpiCard title="Servicios" value={kpis?.total_servicios ?? 0} icon={Stethoscope} />
        </div>
        <div className="col">
          <KpiCard title="Oficinas" value={kpis?.total_oficinas ?? 0} icon={Layers} />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-6">
          <GraficoEquiposPorTipo data={equiposPorTipo} />
        </div>
        <div className="col-12 col-xl-6">
          <GraficoEquiposPorEstado data={equiposPorEstado} />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-6">
          <GraficoMantenimientosPorMes data={mantenimientosPorMes} />
        </div>
        <div className="col-12 col-xl-6">
          <GraficoEquiposPorHospital data={equiposPorHospital} />
        </div>
      </div>
    </section>
  )
}

export default Dashboard
