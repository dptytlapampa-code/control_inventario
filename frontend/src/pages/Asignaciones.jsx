import { useMemo, useState } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'

const assignmentsMock = [
  {
    id: 1,
    institucion: 'Hospital Lucio Molas',
    servicio: 'Guardia',
    oficina: 'Oficina 1',
    tipo: 'Notebook',
    marcaModelo: 'Dell Latitude 7420',
    serie: 'DLT7420-001',
    bienPatrimonial: 'BP-2023-00125',
    usuario: 'Juan Pérez',
    estado: 'Operativo',
    ultimaActualizacion: '2024-05-12',
  },
  {
    id: 2,
    institucion: 'Hospital René Favaloro',
    servicio: 'Consultorios Externos',
    oficina: 'Oficina 2',
    tipo: 'PC',
    marcaModelo: 'HP ProDesk 600 G6',
    serie: 'HPD600-034',
    bienPatrimonial: 'BP-2022-01102',
    usuario: 'María Gómez',
    estado: 'En mantenimiento',
    ultimaActualizacion: '2024-04-28',
  },
  {
    id: 3,
    institucion: 'Ministerio de Salud',
    servicio: 'Dirección',
    oficina: 'Mesa de Entradas',
    tipo: 'Impresora',
    marcaModelo: 'Brother HL-L6400DW',
    serie: 'BRHLL-220',
    bienPatrimonial: 'BP-2021-00890',
    usuario: 'Secretaría General',
    estado: 'Operativo',
    ultimaActualizacion: '2024-06-02',
  },
  {
    id: 4,
    institucion: 'Hospital Lucio Molas',
    servicio: 'Sistemas',
    oficina: 'Oficina 2',
    tipo: 'Router',
    marcaModelo: 'Cisco Catalyst 9200',
    serie: 'CSC9200-078',
    bienPatrimonial: 'BP-2020-00456',
    usuario: 'Infraestructura',
    estado: 'En servicio técnico externo',
    ultimaActualizacion: '2024-05-30',
  },
  {
    id: 5,
    institucion: 'Hospital René Favaloro',
    servicio: 'Guardia',
    oficina: 'Oficina 1',
    tipo: 'Notebook',
    marcaModelo: 'Lenovo ThinkPad T14s',
    serie: 'LNT14S-502',
    bienPatrimonial: 'BP-2023-00421',
    usuario: 'Pedro Martínez',
    estado: 'Operativo',
    ultimaActualizacion: '2024-06-08',
  },
  {
    id: 6,
    institucion: 'Ministerio de Salud',
    servicio: 'Sistemas',
    oficina: 'Oficina 1',
    tipo: 'PC',
    marcaModelo: 'Dell OptiPlex 7090',
    serie: 'DLOP-190',
    bienPatrimonial: 'BP-2022-01560',
    usuario: 'Equipo Desarrollo',
    estado: 'En mantenimiento',
    ultimaActualizacion: '2024-05-18',
  },
  {
    id: 7,
    institucion: 'Hospital Lucio Molas',
    servicio: 'Consultorios Externos',
    oficina: 'Oficina 1',
    tipo: 'Impresora',
    marcaModelo: 'HP LaserJet Pro M404',
    serie: 'HPLJP-887',
    bienPatrimonial: 'BP-2019-00771',
    usuario: 'Recepción',
    estado: 'De baja',
    ultimaActualizacion: '2024-04-12',
  },
  {
    id: 8,
    institucion: 'Hospital René Favaloro',
    servicio: 'Dirección',
    oficina: 'Mesa de Entradas',
    tipo: 'Scanner',
    marcaModelo: 'Fujitsu fi-7160',
    serie: 'FJ7160-056',
    bienPatrimonial: 'BP-2021-00980',
    usuario: 'Documentación',
    estado: 'Operativo',
    ultimaActualizacion: '2024-05-05',
  },
  {
    id: 9,
    institucion: 'Ministerio de Salud',
    servicio: 'Guardia',
    oficina: 'Oficina 2',
    tipo: 'Monitor',
    marcaModelo: 'Samsung S24R350',
    serie: 'SMS24-333',
    bienPatrimonial: 'BP-2020-00234',
    usuario: 'Turnos Online',
    estado: 'Operativo',
    ultimaActualizacion: '2024-06-10',
  },
  {
    id: 10,
    institucion: 'Hospital Lucio Molas',
    servicio: 'Dirección',
    oficina: 'Oficina 2',
    tipo: 'PC',
    marcaModelo: 'Lenovo ThinkCentre M80',
    serie: 'LNM80-441',
    bienPatrimonial: 'BP-2022-01211',
    usuario: 'Dirección Médica',
    estado: 'Operativo',
    ultimaActualizacion: '2024-05-25',
  },
]

const statusStyles = {
  Operativo: 'bg-emerald-50 text-emerald-700',
  'En mantenimiento': 'bg-amber-50 text-amber-700',
  'En servicio técnico externo': 'bg-orange-50 text-orange-700',
  'De baja': 'bg-rose-50 text-rose-700',
}

const initialFilters = {
  institucion: '',
  servicio: '',
  oficina: '',
  estado: '',
  search: '',
}

function Asignaciones() {
  const [filters, setFilters] = useState(initialFilters)

  const filteredAssignments = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase()

    return assignmentsMock.filter((assignment) => {
      if (filters.institucion && assignment.institucion !== filters.institucion) return false
      if (filters.servicio && assignment.servicio !== filters.servicio) return false
      if (filters.oficina && assignment.oficina !== filters.oficina) return false
      if (filters.estado && assignment.estado !== filters.estado) return false

      if (!searchTerm) return true

      return [assignment.serie, assignment.bienPatrimonial, assignment.usuario]
        .some((field) => field.toLowerCase().includes(searchTerm))
    })
  }, [filters])

  const columns = useMemo(
    () => [
      { label: 'Institución', accessor: 'institucion' },
      { label: 'Servicio', accessor: 'servicio' },
      { label: 'Oficina', accessor: 'oficina' },
      { label: 'Tipo de equipo', accessor: 'tipo' },
      { label: 'Marca / Modelo', accessor: 'marcaModelo' },
      { label: 'N° de serie', accessor: 'serie' },
      { label: 'Bien patrimonial', accessor: 'bienPatrimonial' },
      { label: 'Usuario asignado', accessor: 'usuario' },
      {
        label: 'Estado',
        key: 'estado',
        render: (row) => (
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.estado] || ''}`}>
            {row.estado}
          </span>
        ),
      },
      { label: 'Última actualización', accessor: 'ultimaActualizacion' },
    ],
    [],
  )

  const handleClearFilters = () => {
    setFilters(initialFilters)
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">Asignaciones de equipos</h1>
          <p className="text-sm text-slate-600">
            Vista consolidada de equipos asignados por institución, servicio y oficina.
          </p>
        </div>
        <button
          type="button"
          onClick={() => console.log('Nueva asignación')}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          Nueva asignación
        </button>
      </div>

      <Card
        title="Filtros"
        actions={
          <button
            type="button"
            onClick={handleClearFilters}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Limpiar filtros
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="space-y-1">
            <label htmlFor="institucion" className="text-sm font-medium text-slate-700">
              Institución
            </label>
            <select
              id="institucion"
              value={filters.institucion}
              onChange={(e) => setFilters((prev) => ({ ...prev, institucion: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Todas</option>
              <option value="Hospital Lucio Molas">Hospital Lucio Molas</option>
              <option value="Hospital René Favaloro">Hospital René Favaloro</option>
              <option value="Ministerio de Salud">Ministerio de Salud</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="servicio" className="text-sm font-medium text-slate-700">
              Servicio
            </label>
            <select
              id="servicio"
              value={filters.servicio}
              onChange={(e) => setFilters((prev) => ({ ...prev, servicio: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Todos</option>
              <option value="Guardia">Guardia</option>
              <option value="Consultorios Externos">Consultorios Externos</option>
              <option value="Sistemas">Sistemas</option>
              <option value="Dirección">Dirección</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="oficina" className="text-sm font-medium text-slate-700">
              Oficina
            </label>
            <select
              id="oficina"
              value={filters.oficina}
              onChange={(e) => setFilters((prev) => ({ ...prev, oficina: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Todas</option>
              <option value="Oficina 1">Oficina 1</option>
              <option value="Oficina 2">Oficina 2</option>
              <option value="Mesa de Entradas">Mesa de Entradas</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="estado" className="text-sm font-medium text-slate-700">
              Estado del equipo
            </label>
            <select
              id="estado"
              value={filters.estado}
              onChange={(e) => setFilters((prev) => ({ ...prev, estado: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Todos</option>
              <option value="Operativo">Operativo</option>
              <option value="En mantenimiento">En mantenimiento</option>
              <option value="En servicio técnico externo">En servicio técnico externo</option>
              <option value="De baja">De baja</option>
            </select>
          </div>

          <div className="space-y-1 xl:col-span-2">
            <label htmlFor="search" className="text-sm font-medium text-slate-700">
              Buscar por serie, bien patrimonial o usuario
            </label>
            <input
              id="search"
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Ej: DLT7420-001, BP-2023-00125, Juan Pérez"
            />
          </div>
        </div>
      </Card>

      <Card title="Asignaciones registradas">
        <Table
          columns={columns}
          data={filteredAssignments}
          emptyMessage="No se encontraron asignaciones con los filtros seleccionados."
        />
      </Card>
    </section>
  )
}

export default Asignaciones
