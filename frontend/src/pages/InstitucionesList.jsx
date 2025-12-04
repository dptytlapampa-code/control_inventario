import { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'

const initialInstituciones = [
  {
    id: 1,
    nombre: 'Hospital Lucio Molas',
    tipo: 'Hospital',
    servicios: 12,
    oficinas: 45,
    estado: 'Activa',
    comentarios: '',
  },
  {
    id: 2,
    nombre: 'Hospital René Favaloro',
    tipo: 'Hospital',
    servicios: 8,
    oficinas: 30,
    estado: 'Activa',
    comentarios: '',
  },
  {
    id: 3,
    nombre: 'Ministerio de Salud La Pampa',
    tipo: 'Ministerio',
    servicios: 5,
    oficinas: 10,
    estado: 'Activa',
    comentarios: '',
  },
]

// TODO: reemplazar por fetch a API /instituciones cuando exista el backend.

const modalInitialState = {
  id: null,
  nombre: '',
  tipo: 'Hospital',
  estado: 'Activa',
  comentarios: '',
}

function InstitutionModal({ isOpen, mode, formData, onChange, onClose, onSubmit, nameError }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {mode === 'edit' ? 'Editar institución' : 'Nueva institución'}
            </h3>
            <p className="text-sm text-slate-600">Completa los datos para gestionar la institución.</p>
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
              Nombre de la institución
            </label>
            <input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={(e) => onChange({ ...formData, nombre: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Ej: Hospital Provincial"
              required
            />
            {nameError && <p className="text-sm text-rose-600">{nameError}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="tipo" className="text-sm font-medium text-slate-700">
                Tipo
              </label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={(e) => onChange({ ...formData, tipo: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="Hospital">Hospital</option>
                <option value="Ministerio">Ministerio</option>
                <option value="Organismo">Organismo</option>
                <option value="Otro">Otro</option>
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
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="comentarios" className="text-sm font-medium text-slate-700">
              Comentarios (opcional)
            </label>
            <textarea
              id="comentarios"
              name="comentarios"
              value={formData.comentarios}
              onChange={(e) => onChange({ ...formData, comentarios: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              rows={3}
              placeholder="Notas internas o contexto del organismo"
            />
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
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function InstitucionesList() {
  const [instituciones, setInstituciones] = useState(initialInstituciones)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(modalInitialState)
  const [mode, setMode] = useState('create')
  const [nameError, setNameError] = useState('')
  const [configMessage, setConfigMessage] = useState('')

  const filteredInstituciones = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return instituciones
    return instituciones.filter((inst) => inst.nombre.toLowerCase().includes(term))
  }, [instituciones, search])

  const handleEdit = (institucion) => {
    setFormData({ ...institucion })
    setMode('edit')
    setNameError('')
    setIsModalOpen(true)
  }

  const handleConfigure = (institucion) => {
    setConfigMessage(`Configuración de ${institucion.nombre} disponible próximamente.`)
  }

  const handleToggleEstado = (id) => {
    setInstituciones((prev) =>
      prev.map((inst) =>
        inst.id === id ? { ...inst, estado: inst.estado === 'Activa' ? 'Inactiva' : 'Activa' } : inst,
      ),
    )
  }

  const handleSubmit = () => {
    if (!formData.nombre.trim()) {
      setNameError('El nombre es obligatorio.')
      return
    }

    setNameError('')

    if (mode === 'create') {
      const nextId = Math.max(0, ...instituciones.map((inst) => inst.id)) + 1
      setInstituciones((prev) => [
        ...prev,
        {
          ...formData,
          id: nextId,
          servicios: formData.servicios || 0,
          oficinas: formData.oficinas || 0,
        },
      ])
    } else {
      setInstituciones((prev) => prev.map((inst) => (inst.id === formData.id ? { ...inst, ...formData } : inst)))
    }

    setFormData(modalInitialState)
    setIsModalOpen(false)
  }

  const handleNewInstitution = () => {
    setFormData(modalInitialState)
    setMode('create')
    setNameError('')
    setIsModalOpen(true)
  }

  const columns = [
    { key: 'nombre', label: 'Nombre de la institución', accessor: 'nombre' },
    { key: 'tipo', label: 'Tipo', accessor: 'tipo' },
    { key: 'servicios', label: 'Servicios', accessor: 'servicios' },
    { key: 'oficinas', label: 'Oficinas', accessor: 'oficinas' },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            row.estado === 'Activa'
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
              : 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
          }`}
        >
          {row.estado}
        </span>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) => (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleEdit(row)}
            className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => handleConfigure(row)}
            className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            Configurar
          </button>
          <button
            type="button"
            onClick={() => handleToggleEstado(row.id)}
            className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            {row.estado === 'Activa' ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      ),
    },
  ]

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Instituciones</h1>
        <p className="text-sm text-slate-600">
          Gestión centralizada de hospitales, ministerios y otros organismos.
        </p>
      </div>

      <Card
        title="Instituciones"
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:w-64"
            />
            <button
              type="button"
              onClick={handleNewInstitution}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <Plus className="h-4 w-4" />
              Nueva institución
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {configMessage && (
            <div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
              <span>{configMessage}</span>
              <button
                type="button"
                onClick={() => setConfigMessage('')}
                className="rounded-md p-1 text-indigo-600 transition hover:bg-indigo-100"
                aria-label="Cerrar mensaje de configuración"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <Table columns={columns} data={filteredInstituciones} emptyMessage="No se encontraron instituciones." />
        </div>
      </Card>

      <InstitutionModal
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

export default InstitucionesList
