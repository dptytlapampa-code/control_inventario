import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, HardDrive, Laptop2, Monitor, Pencil, Plus, Printer, Router, Server, Trash2 } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'

const iconComponents = { Printer, Monitor, Laptop2, Router, Server, HardDrive, Camera }

const initialTypes = [
  { id: 1, nombre: 'Impresora', icono: 'Printer', descripcion: 'Dispositivos de impresión', estado: 'Activo' },
  { id: 2, nombre: 'Monitor', icono: 'Monitor', descripcion: 'Pantallas LED/LCD', estado: 'Activo' },
  { id: 3, nombre: 'Notebook', icono: 'Laptop2', descripcion: 'Equipos portátiles', estado: 'Inactivo' },
]

function EquiposTipos() {
  const navigate = useNavigate()
  const [tipos] = useState(initialTypes)

  const columns = useMemo(
    () => [
      {
        label: 'Icono',
        key: 'icono',
        render: (row) => {
          const IconComponent = iconComponents[row.icono] || Laptop2
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="text-sm text-slate-800">{row.icono}</div>
            </div>
          )
        },
      },
      { label: 'Nombre del tipo', accessor: 'nombre' },
      {
        label: 'Descripción',
        key: 'descripcion',
        render: (row) => <p className="text-slate-700">{row.descripcion}</p>,
      },
      {
        label: 'Estado',
        key: 'estado',
        render: (row) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              row.estado === 'Activo' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            {row.estado}
          </span>
        ),
      },
      {
        label: 'Acciones',
        key: 'acciones',
        render: (row) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/equipos/tipos/editar/${row.id}`)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </button>
            <button
              type="button"
              onClick={() => window.alert('Simulación: eliminar tipo de equipo')}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  )

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">Tipos de Equipos</h1>
          <p className="text-sm text-slate-600">Clasifica y gestiona las plantillas de equipos con íconos consistentes.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/equipos/tipos/nuevo')}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <Plus className="h-5 w-5" />
          Agregar tipo de equipo
        </button>
      </div>

      <Card title="Listado de tipos" actions={null}>
        <Table columns={columns} data={tipos} emptyMessage="Aún no hay tipos registrados." />
      </Card>
    </section>
  )
}

export default EquiposTipos
