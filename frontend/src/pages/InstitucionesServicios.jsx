import { useMemo, useState } from 'react'
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'

const initialInstituciones = [
  {
    id: 1,
    nombre: 'Hospital Lucio Molas',
    servicios: [
      { id: 1, nombre: 'Guardia Central' },
      { id: 2, nombre: 'Laboratorio' },
      { id: 3, nombre: 'Diagnóstico por Imágenes' },
    ],
  },
  {
    id: 2,
    nombre: 'Hospital René Favaloro',
    servicios: [
      { id: 4, nombre: 'Consultorios Externos' },
      { id: 5, nombre: 'Farmacia' },
    ],
  },
  {
    id: 3,
    nombre: 'Ministerio de Salud',
    servicios: [
      { id: 6, nombre: 'Dirección de Epidemiología' },
      { id: 7, nombre: 'Coordinación Hospitalaria' },
    ],
  },
]

const modalInitialState = {
  servicioId: null,
  institucionId: initialInstituciones[0]?.id || '',
  previousInstitutionId: initialInstituciones[0]?.id || '',
  nombre: '',
}

function ServiceModal({
  isOpen,
  mode,
  formData,
  instituciones,
  onChange,
  onClose,
  onSubmit,
  nameError,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {mode === 'edit' ? 'Editar servicio' : 'Nuevo servicio'}
            </h3>
            <p className="text-sm text-slate-600">Selecciona la institución y define el nombre del servicio.</p>
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
            <label htmlFor="institucion" className="text-sm font-medium text-slate-700">
              Institución
            </label>
            <select
              id="institucion"
              name="institucion"
              value={formData.institucionId}
              onChange={(e) =>
                onChange({ ...formData, institucionId: Number(e.target.value) || '', previousInstitutionId: formData.previousInstitutionId })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {instituciones.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="nombre" className="text-sm font-medium text-slate-700">
              Nombre del servicio
            </label>
            <input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={(e) => onChange({ ...formData, nombre: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Ej: Guardia Central"
              required
            />
            {nameError && <p className="text-sm text-rose-600">{nameError}</p>}
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

function InstitucionesServicios() {
  const [instituciones, setInstituciones] = useState(initialInstituciones)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mode, setMode] = useState('create')
  const [formData, setFormData] = useState(modalInitialState)
  const [nameError, setNameError] = useState('')

  const filteredInstituciones = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return instituciones

    return instituciones
      .map((inst) => {
        const matchesInstitution = inst.nombre.toLowerCase().includes(term)
        const filteredServices = inst.servicios.filter((serv) => serv.nombre.toLowerCase().includes(term))

        if (matchesInstitution) {
          return inst
        }
        if (filteredServices.length > 0) {
          return { ...inst, servicios: filteredServices }
        }
        return null
      })
      .filter(Boolean)
  }, [instituciones, search])

  const tableData = useMemo(
    () =>
      filteredInstituciones.flatMap((inst) =>
        inst.servicios.map((servicio, index) => ({
          id: `${inst.id}-${servicio.id}`,
          institucion: inst.nombre,
          servicio: servicio.nombre,
          servicioId: servicio.id,
          institucionId: inst.id,
          showInstitution: index === 0,
        })),
      ),
    [filteredInstituciones],
  )

  const columns = [
    {
      key: 'institucion',
      label: 'Institución',
      render: (row) => (
        <span className={row.showInstitution ? 'font-semibold text-slate-900' : 'text-slate-500'}>
          {row.showInstitution ? row.institucion : '—'}
        </span>
      ),
    },
    { key: 'servicio', label: 'Servicio', accessor: 'servicio' },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleEdit(row)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.institucionId, row.servicioId)}
            className="inline-flex items-center gap-1 rounded-lg border border-rose-100 px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        </div>
      ),
    },
  ]

  const handleOpenCreate = () => {
    setMode('create')
    setFormData({ ...modalInitialState, institucionId: instituciones[0]?.id || '', previousInstitutionId: instituciones[0]?.id || '' })
    setNameError('')
    setIsModalOpen(true)
  }

  const handleEdit = (row) => {
    setMode('edit')
    setFormData({
      servicioId: row.servicioId,
      institucionId: row.institucionId,
      previousInstitutionId: row.institucionId,
      nombre: row.servicio,
    })
    setNameError('')
    setIsModalOpen(true)
  }

  const handleDelete = (institucionId, servicioId) => {
    setInstituciones((prev) =>
      prev.map((inst) =>
        inst.id === institucionId
          ? { ...inst, servicios: inst.servicios.filter((serv) => serv.id !== servicioId) }
          : inst,
      ),
    )
  }

  const handleSubmit = () => {
    const trimmedName = formData.nombre.trim()
    if (!trimmedName) {
      setNameError('El nombre es obligatorio.')
      return
    }

    if (mode === 'create') {
      setInstituciones((prev) => {
        const nextId =
          prev.reduce((max, inst) => Math.max(max, ...inst.servicios.map((serv) => serv.id)), 0) + 1
        return prev.map((inst) =>
          inst.id === formData.institucionId
            ? { ...inst, servicios: [...inst.servicios, { id: nextId, nombre: trimmedName }] }
            : inst,
        )
      })
    } else {
      setInstituciones((prev) =>
        prev.map((inst) => {
          if (inst.id === formData.institucionId) {
            const updatedServices =
              formData.previousInstitutionId === formData.institucionId
                ? inst.servicios.map((serv) =>
                    serv.id === formData.servicioId ? { ...serv, nombre: trimmedName } : serv,
                  )
                : [...inst.servicios, { id: formData.servicioId, nombre: trimmedName }]

            return { ...inst, servicios: updatedServices }
          }
          if (inst.id === formData.previousInstitutionId) {
            return { ...inst, servicios: inst.servicios.filter((serv) => serv.id !== formData.servicioId) }
          }
          return inst
        }),
      )
    }

    setIsModalOpen(false)
    setFormData(modalInitialState)
    setNameError('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Servicios de Instituciones</h1>
          <p className="text-slate-600">Organización jerárquica de servicios por institución.</p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <Plus className="h-4 w-4" />
          Nuevo servicio
        </button>
      </div>

      <Card>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por institución o servicio"
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <Table columns={columns} data={tableData} emptyMessage="No se encontraron servicios" />
      </Card>

      <ServiceModal
        isOpen={isModalOpen}
        mode={mode}
        formData={formData}
        instituciones={instituciones}
        onChange={setFormData}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        nameError={nameError}
      />
    </div>
  )
}

export default InstitucionesServicios
