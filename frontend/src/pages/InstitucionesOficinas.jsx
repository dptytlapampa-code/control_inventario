import { useMemo, useState } from 'react'
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'

const officeTypes = [
  'Oficina administrativa',
  'Consultorio',
  'Secretaría',
  'Depósito',
  'Sala técnica',
]

const officeStates = ['Operativa', 'En mantenimiento', 'Fuera de servicio']

const initialInstituciones = [
  {
    id: 1,
    nombre: 'Hospital Lucio Molas',
    servicios: [
      {
        id: 1,
        nombre: 'Guardia Central',
        oficinas: [
          {
            id: 1,
            nombre: 'Guardia - Box 1',
            tipo: 'Consultorio',
            piso: 'Planta baja',
            estado: 'Operativa',
          },
          {
            id: 2,
            nombre: 'Guardia - Box 2',
            tipo: 'Consultorio',
            piso: 'Planta baja',
            estado: 'Operativa',
          },
        ],
      },
      {
        id: 2,
        nombre: 'Diagnóstico por Imágenes',
        oficinas: [
          {
            id: 3,
            nombre: 'Sala de Informes',
            tipo: 'Oficina administrativa',
            piso: '1° piso',
            estado: 'Operativa',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    nombre: 'Hospital René Favaloro',
    servicios: [
      {
        id: 3,
        nombre: 'Consultorios Externos',
        oficinas: [
          {
            id: 4,
            nombre: 'Consultorio 1',
            tipo: 'Consultorio',
            piso: '1° piso',
            estado: 'Operativa',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    nombre: 'Ministerio de Salud',
    servicios: [
      {
        id: 4,
        nombre: 'Dirección de Epidemiología',
        oficinas: [
          {
            id: 5,
            nombre: 'Oficina Técnica',
            tipo: 'Oficina técnica',
            piso: '2° piso',
            estado: 'Operativa',
          },
        ],
      },
    ],
  },
]

const modalInitialState = {
  oficinaId: null,
  institucionId: initialInstituciones[0]?.id || '',
  servicioId: initialInstituciones[0]?.servicios[0]?.id || '',
  previousInstitutionId: initialInstituciones[0]?.id || '',
  previousServiceId: initialInstituciones[0]?.servicios[0]?.id || '',
  nombre: '',
  tipo: officeTypes[0],
  piso: '',
  estado: officeStates[0],
}

function OfficeModal({
  isOpen,
  mode,
  formData,
  instituciones,
  onChange,
  onClose,
  onSubmit,
  nameError,
}) {
  const selectedInstitution = instituciones.find((inst) => inst.id === formData.institucionId)
  const services = selectedInstitution?.servicios || []

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {mode === 'edit' ? 'Editar oficina' : 'Nueva oficina'}
            </h3>
            <p className="text-sm text-slate-600">
              Selecciona la institución, el servicio y completa los datos de la oficina.
            </p>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="institucion" className="text-sm font-medium text-slate-700">
                Institución
              </label>
              <select
                id="institucion"
                name="institucion"
                value={formData.institucionId}
                onChange={(e) => {
                  const nextInstitutionId = Number(e.target.value) || ''
                  const institutionServices = instituciones.find((inst) => inst.id === nextInstitutionId)?.servicios || []
                  onChange({
                    ...formData,
                    institucionId: nextInstitutionId,
                    servicioId: institutionServices[0]?.id || '',
                  })
                }}
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
              <label htmlFor="servicio" className="text-sm font-medium text-slate-700">
                Servicio
              </label>
              <select
                id="servicio"
                name="servicio"
                value={formData.servicioId}
                onChange={(e) => onChange({ ...formData, servicioId: Number(e.target.value) || '' })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {services.length === 0 ? (
                  <option value="" disabled>
                    Esta institución no tiene servicios
                  </option>
                ) : (
                  services.map((serv) => (
                    <option key={serv.id} value={serv.id}>
                      {serv.nombre}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="nombre" className="text-sm font-medium text-slate-700">
                Nombre de la oficina
              </label>
              <input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={(e) => onChange({ ...formData, nombre: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Ej: Guardia - Box 1"
                required
              />
              {nameError && <p className="text-sm text-rose-600">{nameError}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="tipo" className="text-sm font-medium text-slate-700">
                Tipo de oficina
              </label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={(e) => onChange({ ...formData, tipo: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {officeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="piso" className="text-sm font-medium text-slate-700">
                Piso / Ubicación interna
              </label>
              <input
                id="piso"
                name="piso"
                value={formData.piso}
                onChange={(e) => onChange({ ...formData, piso: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Ej: Planta baja"
              />
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
                {officeStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
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

function InstitucionesOficinas() {
  const [instituciones, setInstituciones] = useState(initialInstituciones)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mode, setMode] = useState('create')
  const [formData, setFormData] = useState(modalInitialState)
  const [nameError, setNameError] = useState('')

  const tableData = useMemo(() => {
    const term = search.trim().toLowerCase()

    const rows = instituciones.flatMap((inst) =>
      inst.servicios.flatMap((serv) =>
        serv.oficinas.map((office) => ({
          ...office,
          institucion: inst.nombre,
          institucionId: inst.id,
          servicio: serv.nombre,
          servicioId: serv.id,
        })),
      ),
    )

    if (!term) return rows

    return rows.filter(
      (row) =>
        row.institucion.toLowerCase().includes(term) ||
        row.servicio.toLowerCase().includes(term) ||
        row.nombre.toLowerCase().includes(term),
    )
  }, [instituciones, search])

  const handleOpenCreate = () => {
    const defaultInstitution = instituciones[0]
    const defaultService = defaultInstitution?.servicios[0]

    setMode('create')
    setFormData({
      ...modalInitialState,
      institucionId: defaultInstitution?.id || '',
      servicioId: defaultService?.id || '',
      previousInstitutionId: defaultInstitution?.id || '',
      previousServiceId: defaultService?.id || '',
    })
    setNameError('')
    setIsModalOpen(true)
  }

  const handleEdit = (row) => {
    setMode('edit')
    setFormData({
      oficinaId: row.id,
      institucionId: row.institucionId,
      servicioId: row.servicioId,
      previousInstitutionId: row.institucionId,
      previousServiceId: row.servicioId,
      nombre: row.nombre,
      tipo: row.tipo,
      piso: row.piso,
      estado: row.estado,
    })
    setNameError('')
    setIsModalOpen(true)
  }

  const handleDelete = (institucionId, servicioId, oficinaId) => {
    setInstituciones((prev) =>
      prev.map((inst) =>
        inst.id === institucionId
          ? {
              ...inst,
              servicios: inst.servicios.map((serv) =>
                serv.id === servicioId
                  ? { ...serv, oficinas: serv.oficinas.filter((office) => office.id !== oficinaId) }
                  : serv,
              ),
            }
          : inst,
      ),
    )
  }

  const handleSubmit = () => {
    const trimmedName = formData.nombre.trim()
    if (!trimmedName) {
      setNameError('El nombre de la oficina es obligatorio.')
      return
    }

    if (!formData.servicioId || !formData.institucionId) {
      setNameError('Selecciona una institución y servicio válidos.')
      return
    }

    const updatedOffice = {
      id: formData.oficinaId,
      nombre: trimmedName,
      tipo: formData.tipo,
      piso: formData.piso,
      estado: formData.estado,
    }

    if (mode === 'create') {
      setInstituciones((prev) => {
        const nextId =
          prev.reduce(
            (max, inst) =>
              Math.max(
                max,
                ...inst.servicios.map((serv) => (serv.oficinas.length ? Math.max(...serv.oficinas.map((of) => of.id)) : 0)),
              ),
            0,
          ) + 1

        return prev.map((inst) => {
          if (inst.id !== formData.institucionId) return inst
          return {
            ...inst,
            servicios: inst.servicios.map((serv) =>
              serv.id === formData.servicioId
                ? { ...serv, oficinas: [...serv.oficinas, { ...updatedOffice, id: nextId }] }
                : serv,
            ),
          }
        })
      })
    } else {
      setInstituciones((prev) =>
        prev.map((inst) => {
          if (inst.id === formData.institucionId) {
            const serviciosActualizados = inst.servicios.map((serv) => {
              if (serv.id === formData.servicioId) {
                const oficinasActualizadas =
                  formData.previousInstitutionId === formData.institucionId &&
                  formData.previousServiceId === formData.servicioId
                    ? serv.oficinas.map((of) => (of.id === formData.oficinaId ? { ...updatedOffice, id: of.id } : of))
                    : [...serv.oficinas, { ...updatedOffice, id: formData.oficinaId }]

                return { ...serv, oficinas: oficinasActualizadas }
              }
              return serv
            })
            return { ...inst, servicios: serviciosActualizados }
          }

          if (inst.id === formData.previousInstitutionId) {
            return {
              ...inst,
              servicios: inst.servicios.map((serv) =>
                serv.id === formData.previousServiceId
                  ? { ...serv, oficinas: serv.oficinas.filter((of) => of.id !== formData.oficinaId) }
                  : serv,
              ),
            }
          }

          return inst
        }),
      )
    }

    setIsModalOpen(false)
    setFormData(modalInitialState)
    setNameError('')
  }

  const columns = [
    { key: 'institucion', label: 'Institución', accessor: 'institucion' },
    { key: 'servicio', label: 'Servicio', accessor: 'servicio' },
    { key: 'nombre', label: 'Oficina', accessor: 'nombre' },
    { key: 'tipo', label: 'Tipo', accessor: 'tipo' },
    { key: 'piso', label: 'Ubicación / Piso', accessor: 'piso' },
    { key: 'estado', label: 'Estado', accessor: 'estado' },
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
            onClick={() => handleDelete(row.institucionId, row.servicioId, row.id)}
            className="inline-flex items-center gap-1 rounded-lg border border-rose-100 px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Oficinas por institución y servicio</h1>
          <p className="text-slate-600">Gestión jerárquica de oficinas dentro de cada servicio.</p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <Plus className="h-4 w-4" />
          Nueva oficina
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
              placeholder="Buscar por institución, servicio u oficina"
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <Table columns={columns} data={tableData} emptyMessage="No se encontraron oficinas" />
      </Card>

      <OfficeModal
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

export default InstitucionesOficinas
