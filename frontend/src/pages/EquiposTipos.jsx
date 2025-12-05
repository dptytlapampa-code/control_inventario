import { useMemo, useState } from 'react'
import { Laptop, Monitor, Pencil, Plus, Printer, Router, Trash2, X } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'

const iconComponents = { Printer, Monitor, Laptop, Router }

const iconOptions = ['Printer', 'Monitor', 'Laptop', 'Router']

const initialTypes = [
  {
    id: 1,
    nombre: 'Impresora',
    descripcion: 'Dispositivos de impresión láser y térmica.',
    icono: 'Printer',
    estado: 'Activo',
  },
  {
    id: 2,
    nombre: 'Monitor',
    descripcion: 'Pantallas LED y LCD para puestos fijos.',
    icono: 'Monitor',
    estado: 'Activo',
  },
  {
    id: 3,
    nombre: 'Notebook',
    descripcion: 'Equipos portátiles para trabajo remoto.',
    icono: 'Laptop',
    estado: 'Inactivo',
  },
  {
    id: 4,
    nombre: 'Router',
    descripcion: 'Dispositivos de red para sedes y oficinas.',
    icono: 'Router',
    estado: 'Activo',
  },
]

const modalInitialState = {
  id: null,
  nombre: '',
  descripcion: '',
  icono: 'Printer',
  estado: 'Activo',
}

function TipoEquipoModal({ isOpen, mode, formData, onChange, onClose, onSubmit, nameError }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {mode === 'edit' ? 'Editar tipo de equipo' : 'Nuevo tipo de equipo'}
            </h3>
            <p className="text-sm text-slate-600">Gestiona los tipos con descripciones claras e íconos consistentes.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
          className="space-y-4 px-6 py-5"
        >
          <div className="space-y-1">
            <label htmlFor="nombre" className="text-sm font-medium text-slate-700">
              Nombre del tipo
            </label>
            <input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={(e) => onChange({ ...formData, nombre: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Ej: Scanner, Proyector"
              required
            />
            {nameError && <p className="text-sm text-rose-600">{nameError}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="descripcion" className="text-sm font-medium text-slate-700">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={(e) => onChange({ ...formData, descripcion: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              rows={3}
              placeholder="Detalle para identificar el uso del equipo"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="icono" className="text-sm font-medium text-slate-700">
                Ícono
              </label>
              <select
                id="icono"
                name="icono"
                value={formData.icono}
                onChange={(e) => onChange({ ...formData, icono: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {iconOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="estado" className="text-sm font-medium text-slate-700">
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={(e) => onChange({ ...formData, estado: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EquiposTipos() {
  const [tipos, setTipos] = useState(initialTypes)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mode, setMode] = useState('create')
  const [formData, setFormData] = useState(modalInitialState)
  const [nameError, setNameError] = useState('')

  const handleNew = () => {
    setFormData(modalInitialState)
    setMode('create')
    setNameError('')
    setIsModalOpen(true)
  }

  const handleEdit = (tipo) => {
    setFormData({ ...tipo })
    setMode('edit')
    setNameError('')
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    setTipos((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSubmit = () => {
    if (!formData.nombre.trim()) {
      setNameError('El nombre es obligatorio.')
      return
    }

    setNameError('')

    if (mode === 'create') {
      const nextId = Math.max(0, ...tipos.map((item) => item.id)) + 1
      setTipos((prev) => [...prev, { ...formData, id: nextId }])
    } else {
      setTipos((prev) => prev.map((item) => (item.id === formData.id ? { ...item, ...formData } : item)))
    }

    setFormData(modalInitialState)
    setIsModalOpen(false)
  }

  const columns = useMemo(
    () => [
      {
        label: 'Ícono',
        key: 'icono',
        render: (row) => {
          const IconComponent = iconComponents[row.icono] || Laptop
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
      { label: 'Nombre', accessor: 'nombre' },
      {
        label: 'Descripción',
        key: 'descripcion',
        render: (row) => <p className="text-slate-700">{row.descripcion || 'Sin descripción'}</p>,
      },
      {
        label: 'Estado',
        key: 'estado',
        render: (row) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              row.estado === 'Activo'
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                : 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
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
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleEdit(row)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </button>
            <button
              type="button"
              onClick={() => handleDelete(row.id)}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          </div>
        ),
      },
    ],
    [handleDelete, handleEdit],
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
          onClick={handleNew}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <Plus className="h-5 w-5" />
          Agregar tipo de equipo
        </button>
      </div>

      <Card title="Listado de tipos">
        <Table columns={columns} data={tipos} emptyMessage="Aún no hay tipos registrados." />
      </Card>

      <TipoEquipoModal
        isOpen={isModalOpen}
        mode={mode}
        formData={formData}
        nameError={nameError}
        onChange={setFormData}
        onClose={() => {
          setIsModalOpen(false)
          setNameError('')
        }}
        onSubmit={handleSubmit}
      />
    </section>
  )
}

export default EquiposTipos
