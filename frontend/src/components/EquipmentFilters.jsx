import { Search } from 'lucide-react'

function EquipmentFilters({
  filters,
  onChange,
  instituciones,
  servicios,
  oficinas,
  tipos,
  estados,
}) {
  const servicioOptions = servicios[filters.institucionId] || []
  const oficinaOptions = oficinas[filters.servicioId] || []

  const handleSelectChange = (name, value) => {
    if (name === 'institucionId') {
      onChange({ ...filters, institucionId: value, servicioId: '', oficinaId: '' })
      return
    }

    if (name === 'servicioId') {
      onChange({ ...filters, servicioId: value, oficinaId: '' })
      return
    }

    onChange({ ...filters, [name]: value })
  }

  const handleSearchChange = (event) => {
    onChange({ ...filters, search: event.target.value })
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Institución</label>
          <select
            className="w-full rounded-lg border-slate-200 text-sm focus:border-slate-400 focus:ring-0"
            value={filters.institucionId}
            onChange={(e) => handleSelectChange('institucionId', e.target.value)}
          >
            <option value="">Todas</option>
            {instituciones.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Servicio</label>
          <select
            className="w-full rounded-lg border-slate-200 text-sm focus:border-slate-400 focus:ring-0"
            value={filters.servicioId}
            onChange={(e) => handleSelectChange('servicioId', e.target.value)}
            disabled={!filters.institucionId}
          >
            <option value="">Todos</option>
            {servicioOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Oficina</label>
          <select
            className="w-full rounded-lg border-slate-200 text-sm focus:border-slate-400 focus:ring-0"
            value={filters.oficinaId}
            onChange={(e) => handleSelectChange('oficinaId', e.target.value)}
            disabled={!filters.servicioId}
          >
            <option value="">Todas</option>
            {oficinaOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Tipo de equipo</label>
          <select
            className="w-full rounded-lg border-slate-200 text-sm focus:border-slate-400 focus:ring-0"
            value={filters.tipo}
            onChange={(e) => handleSelectChange('tipo', e.target.value)}
          >
            <option value="">Todos</option>
            {tipos.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Estado</label>
          <select
            className="w-full rounded-lg border-slate-200 text-sm focus:border-slate-400 focus:ring-0"
            value={filters.estado}
            onChange={(e) => handleSelectChange('estado', e.target.value)}
          >
            <option value="">Todos</option>
            {estados.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Buscador</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              className="w-full rounded-lg border-slate-200 pl-9 text-sm focus:border-slate-400 focus:ring-0"
              placeholder="Buscar número de serie, marca, modelo..."
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EquipmentFilters
