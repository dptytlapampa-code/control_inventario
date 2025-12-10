import { Filter, RotateCcw, Search } from 'lucide-react'

function AuditoriaFilter({ filters, onChange, onReset, usuarios = [], modulos = [], acciones = [] }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-4">
      <div className="flex items-center gap-3 mb-4 text-slate-700">
        <Filter className="w-5 h-5" />
        <div>
          <p className="font-semibold text-sm">Filtros avanzados</p>
          <p className="text-xs text-slate-500">Refina la búsqueda de eventos de auditoría</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-slate-500">Usuario</label>
          <select
            value={filters.usuario || ''}
            onChange={(e) => handleChange('usuario', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todos</option>
            {usuarios.map((usuario) => (
              <option key={usuario.value} value={usuario.value}>
                {usuario.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500">Módulo</label>
          <select
            value={filters.modulo || ''}
            onChange={(e) => handleChange('modulo', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todos</option>
            {modulos.map((modulo) => (
              <option key={modulo.value} value={modulo.value}>
                {modulo.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500">Acción</label>
          <select
            value={filters.accion || ''}
            onChange={(e) => handleChange('accion', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todas</option>
            {acciones.map((accion) => (
              <option key={accion.value} value={accion.value}>
                {accion.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500">Buscar</label>
          <div className="mt-1 flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
              placeholder="Usuario, acción o módulo"
              className="flex-1 text-sm outline-none"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500">Fecha desde</label>
          <input
            type="date"
            value={filters.desde || ''}
            onChange={(e) => handleChange('desde', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">Fecha hasta</label>
          <input
            type="date"
            value={filters.hasta || ''}
            onChange={(e) => handleChange('hasta', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Resultados filtrados automáticamente</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" />
            Limpiar
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuditoriaFilter
