import { useMemo, useState } from 'react'
import { Download, Laptop, Plus } from 'lucide-react'
import Card from '../components/Card'
import EquipmentFilters from '../components/EquipmentFilters'
import EquipmentTable from '../components/EquipmentTable'
import StatusBadge from '../components/StatusBadge'

const instituciones = [
  { id: '1', nombre: 'Hospital Lucio Molas' },
  { id: '2', nombre: 'Hospital René Favaloro' },
]

const servicios = {
  1: [
    { id: '1', nombre: 'Emergencias' },
    { id: '2', nombre: 'Terapia Intensiva' },
  ],
  2: [
    { id: '3', nombre: 'Pediatría' },
    { id: '4', nombre: 'Rayos X' },
  ],
}

const oficinas = {
  1: [
    { id: '1', nombre: 'Box 1' },
    { id: '2', nombre: 'Shock Room' },
  ],
  2: [{ id: '3', nombre: 'Oficina 1' }],
  3: [{ id: '4', nombre: 'Consultorio 3' }],
  4: [{ id: '5', nombre: 'Oficina RX' }],
}

const tipos = [
  { value: 'Computadora', label: 'Computadora' },
  { value: 'Monitor', label: 'Monitor' },
  { value: 'Impresora', label: 'Impresora' },
  { value: 'Equipo Médico', label: 'Equipo Médico' },
  { value: 'Servidor', label: 'Servidor' },
]

const estados = [
  { value: 'Activo', label: 'Activo' },
  { value: 'En Servicio Técnico', label: 'En Servicio Técnico' },
  { value: 'Baja', label: 'Baja' },
]

const equiposMock = [
  {
    id: 1,
    serie: 'SN-001245',
    bienPatrimonial: 'BP-1023',
    marca: 'HP',
    modelo: 'EliteBook 840 G9',
    tipo: 'Computadora',
    institucion: 'Hospital Lucio Molas',
    institucionId: '1',
    servicio: 'Emergencias',
    servicioId: '1',
    oficina: 'Box 1',
    oficinaId: '1',
    estado: 'Activo',
  },
  {
    id: 2,
    serie: 'SN-009911',
    bienPatrimonial: 'BP-2044',
    marca: 'Dell',
    modelo: 'P2419H',
    tipo: 'Monitor',
    institucion: 'Hospital Lucio Molas',
    institucionId: '1',
    servicio: 'Terapia Intensiva',
    servicioId: '2',
    oficina: 'Oficina 1',
    oficinaId: '3',
    estado: 'En Servicio Técnico',
  },
  {
    id: 3,
    serie: 'SN-007712',
    bienPatrimonial: 'BP-3301',
    marca: 'Epson',
    modelo: 'EcoTank L6270',
    tipo: 'Impresora',
    institucion: 'Hospital René Favaloro',
    institucionId: '2',
    servicio: 'Pediatría',
    servicioId: '3',
    oficina: 'Consultorio 3',
    oficinaId: '4',
    estado: 'Activo',
  },
  {
    id: 4,
    serie: 'SN-005432',
    bienPatrimonial: 'BP-5588',
    marca: 'Philips',
    modelo: 'IntelliVue MX700',
    tipo: 'Equipo Médico',
    institucion: 'Hospital René Favaloro',
    institucionId: '2',
    servicio: 'Rayos X',
    servicioId: '4',
    oficina: 'Oficina RX',
    oficinaId: '5',
    estado: 'Baja',
  },
  {
    id: 5,
    serie: 'SN-004404',
    bienPatrimonial: 'BP-7788',
    marca: 'Lenovo',
    modelo: 'ThinkServer TS140',
    tipo: 'Servidor',
    institucion: 'Hospital Lucio Molas',
    institucionId: '1',
    servicio: 'Emergencias',
    servicioId: '1',
    oficina: 'Shock Room',
    oficinaId: '2',
    estado: 'Activo',
  },
]

function EquiposList() {
  const [filters, setFilters] = useState({
    institucionId: '',
    servicioId: '',
    oficinaId: '',
    tipo: '',
    estado: '',
    search: '',
  })

  const filteredData = useMemo(() => {
    return equiposMock.filter((equipo) => {
      const matchesInstitution = !filters.institucionId || equipo.institucionId === filters.institucionId
      const matchesService = !filters.servicioId || equipo.servicioId === filters.servicioId
      const matchesOffice = !filters.oficinaId || equipo.oficinaId === filters.oficinaId
      const matchesType = !filters.tipo || equipo.tipo === filters.tipo
      const matchesStatus = !filters.estado || equipo.estado === filters.estado

      const searchTerm = filters.search.toLowerCase()
      const matchesSearch =
        !searchTerm ||
        [
          equipo.serie,
          equipo.bienPatrimonial,
          equipo.marca,
          equipo.modelo,
          equipo.tipo,
          equipo.institucion,
          equipo.servicio,
          equipo.oficina,
        ]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(searchTerm))

      return (
        matchesInstitution && matchesService && matchesOffice && matchesType && matchesStatus && matchesSearch
      )
    })
  }, [filters])

  const handleExport = () => {
    console.log('Exportando a Excel… (mock)')
  }

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Listado de Equipos</h1>
          <p className="text-sm text-slate-600">Inventario detallado, filtros dinámicos y acciones rápidas.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Download size={16} />
            Exportar Excel
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Laptop size={16} />
            Imprimir listado
          </button>
        </div>
      </header>

      <EquipmentFilters
        filters={filters}
        onChange={setFilters}
        instituciones={instituciones}
        servicios={servicios}
        oficinas={oficinas}
        tipos={tipos}
        estados={estados}
      />

      <Card
        title="Equipos registrados"
        actions={<StatusBadge status={`${filteredData.length} equipos`} />}
      >
        <EquipmentTable data={filteredData} />
      </Card>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Mostrando {filteredData.length} de {equiposMock.length} equipos</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 transition hover:bg-slate-50"
            disabled
          >
            Anterior
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 transition hover:bg-slate-50"
            disabled
          >
            Siguiente
          </button>
        </div>
      </div>

      <button
        type="button"
        className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
      >
        <Plus size={18} />
        Agregar equipo
      </button>
    </section>
  )
}

export default EquiposList
