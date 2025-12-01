import Card from '../components/Card'

function Dashboard() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">Resumen general del inventario.</p>
      </div>
      <Card>
        <div className="h-24 flex items-center justify-center text-slate-500">
          Contenido del dashboard pendiente de implementar.
        </div>
      </Card>
    </section>
  )
}

export default Dashboard
