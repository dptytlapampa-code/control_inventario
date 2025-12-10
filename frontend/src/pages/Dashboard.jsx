import Card from '../components/Card'
import EmptyState from '../components/EmptyState'

const kpis = [
  { title: 'Equipos operativos', value: '128', trend: '+5%' },
  { title: 'Mantenimientos del mes', value: '23', trend: 'Programados' },
  { title: 'Alertas abiertas', value: '4', trend: 'Revisar' },
  { title: 'Servicios activos', value: '18', trend: 'Sin cambios' },
]

function Dashboard() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">Resumen general del inventario y los mantenimientos.</p>
      </div>

      <div className="row g-3">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="col-12 col-md-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <p className="text-muted text-uppercase fw-semibold small mb-1">{kpi.title}</p>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fs-3 fw-bold text-secondary">{kpi.value}</span>
                  <span className="badge text-bg-light border">{kpi.trend}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-8">
          <Card title="Rendimiento por hospital">
            <div className="ratio ratio-16x9 bg-light rounded" style={{ minHeight: 280 }}>
              <div className="d-flex flex-column align-items-center justify-content-center text-secondary">
                <span className="fw-semibold">Área para gráfico Nivo (barras / líneas)</span>
                <small>Integrar datasource real cuando se conecte el backend.</small>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-12 col-xl-4">
          <Card title="Disponibilidad de equipos">
            <div className="ratio ratio-1x1 bg-light rounded" style={{ minHeight: 280 }}>
              <div className="d-flex flex-column align-items-center justify-content-center text-secondary">
                <span className="fw-semibold">Espacio para gráfico Nivo (donut)</span>
                <small>Placeholder listo para datos reales.</small>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card title="Actividades recientes">
        <EmptyState
          title="Sin datos en el dashboard"
          message="Cuando el backend esté conectado, verás la actividad reciente y los tickets de mantenimiento aquí."
        />
      </Card>
    </section>
  )
}

export default Dashboard
