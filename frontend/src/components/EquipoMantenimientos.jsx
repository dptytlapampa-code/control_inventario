import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import Table from './Table'

const estadoStyles = {
  Abierto: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  'En curso': 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
  Cerrado: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
}

function EquipoMantenimientos({ mantenimientos = [] }) {
  const [filtros, setFiltros] = useState({ tipo: '', estado: '', buscar: '' })
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const dataFiltrada = useMemo(() => {
    return mantenimientos.filter((item) => {
      const coincideTipo = !filtros.tipo || item.tipoMantenimiento === filtros.tipo
      const coincideEstado = !filtros.estado || item.estado === filtros.estado
      const coincideBusqueda =
        !filtros.buscar || item.comentario.toLowerCase().includes(filtros.buscar.toLowerCase())

      return coincideTipo && coincideEstado && coincideBusqueda
    })
  }, [filtros, mantenimientos])

  const columns = useMemo(
    () => [
      { key: 'fecha', label: 'Fecha', accessor: 'fecha' },
      { key: 'tipo', label: 'Tipo', accessor: 'tipoMantenimiento' },
      {
        key: 'estado',
        label: 'Estado',
        render: (row) => {
          const variant = estadoStyles[row.estado] || 'bg-slate-50 text-slate-700 ring-1 ring-slate-200'
          return (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${variant}`}>
              {row.estado}
            </span>
          )
        },
      },
      { key: 'responsable', label: 'Responsable', accessor: 'responsable' },
      { key: 'comentario', label: 'Comentario', accessor: 'comentario' },
    ],
    []
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Mantenimientos</h3>
          <p className="text-sm text-slate-600">Planificación y seguimiento de intervenciones.</p>
        </div>
        <button
          type="button"
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <Plus size={16} />
          Nuevo mantenimiento
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <select
          value={filtros.tipo}
          onChange={(e) => setFiltros((prev) => ({ ...prev, tipo: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
        >
          <option value="">Tipo de mantenimiento</option>
          <option value="Correctivo">Correctivo</option>
          <option value="Preventivo">Preventivo</option>
          <option value="Servicio técnico externo">Servicio técnico externo</option>
        </select>
        <select
          value={filtros.estado}
          onChange={(e) => setFiltros((prev) => ({ ...prev, estado: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
        >
          <option value="">Estado</option>
          <option value="Abierto">Abierto</option>
          <option value="En curso">En curso</option>
          <option value="Cerrado">Cerrado</option>
        </select>
        <input
          type="text"
          value={filtros.buscar}
          onChange={(e) => setFiltros((prev) => ({ ...prev, buscar: e.target.value }))}
          placeholder="Buscar en comentario"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
        />
      </div>

      {mostrarFormulario && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-900">Formulario de mantenimiento (mock)</h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="space-y-1 text-sm">
              <label className="font-semibold text-slate-800">Tipo de mantenimiento</label>
              <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none">
                <option>Correctivo</option>
                <option>Preventivo</option>
                <option>Servicio técnico externo</option>
              </select>
            </div>
            <div className="space-y-1 text-sm">
              <label className="font-semibold text-slate-800">Fecha</label>
              <input
                type="date"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
              />
            </div>
            <div className="space-y-1 text-sm">
              <label className="font-semibold text-slate-800">Comentario</label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                placeholder="Detalle de la intervención"
              />
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">Simulación de carga de mantenimiento. No guarda datos.</p>
        </div>
      )}

      <Table
        columns={columns}
        data={dataFiltrada}
        emptyMessage="No hay mantenimientos registrados para este equipo."
      />
    </div>
  )
}

export default EquipoMantenimientos
