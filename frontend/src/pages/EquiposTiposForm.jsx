import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Camera, HardDrive, Laptop2, Monitor, Printer, Router, Save, Server, Undo2 } from 'lucide-react'
import Card from '../components/Card'

const iconOptions = ['Printer', 'Monitor', 'Laptop2', 'Router', 'Server', 'HardDrive', 'Camera']

const initialTypes = [
  { id: 1, nombre: 'Impresora', icono: 'Printer', descripcion: 'Dispositivos de impresión', estado: 'Activo' },
  { id: 2, nombre: 'Monitor', icono: 'Monitor', descripcion: 'Pantallas LED/LCD', estado: 'Activo' },
  { id: 3, nombre: 'Notebook', icono: 'Laptop2', descripcion: 'Equipos portátiles', estado: 'Inactivo' },
]

const iconComponents = { Printer, Monitor, Laptop2, Router, Server, HardDrive, Camera }

const defaultForm = {
  nombre: '',
  descripcion: '',
  icono: 'Printer',
  estado: 'Activo',
}

function EquiposTiposForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState(() => {
    if (isEdit) {
      const existingType = initialTypes.find((type) => type.id === Number(id))
      if (existingType) return existingType
    }
    return defaultForm
  })
  const [lastSaved, setLastSaved] = useState(null)

  const IconPreview = useMemo(() => iconComponents[formData.icono] || Laptop2, [formData.icono])

  const handleSubmit = (event) => {
    event.preventDefault()
    setLastSaved(formData)
    window.alert('Datos guardados en memoria local (mock).')
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">{isEdit ? 'Editar tipo de equipo' : 'Nuevo tipo de equipo'}</h1>
        <p className="text-sm text-slate-600">
          Define el nombre, ícono y estado de los tipos de equipos para mantener una clasificación consistente.
        </p>
      </div>

      <Card title="Detalle del tipo" actions={null}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-1">
                <label htmlFor="nombre" className="text-sm font-medium text-slate-700">
                  Nombre del tipo
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Ej: Impresora láser"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="descripcion" className="text-sm font-medium text-slate-700">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  rows={3}
                  placeholder="Detalle el uso o características del tipo"
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
                    onChange={(e) => setFormData({ ...formData, icono: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
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
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <IconPreview className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Previsualización</p>
                  <p className="text-xs text-slate-500">Ícono seleccionado: {formData.icono}</p>
                </div>
              </div>
              <div className="rounded-lg bg-white p-3 text-xs text-slate-600 shadow-sm">
                <p className="font-semibold text-slate-900">Estado</p>
                <p>{formData.estado === 'Activo' ? 'Disponible para nuevas altas.' : 'No se mostrará al crear equipos.'}</p>
              </div>
              {lastSaved && (
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-700">
                  Último guardado local: <strong>{lastSaved.nombre || 'Sin nombre'}</strong>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/equipos/tipos')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <Undo2 className="h-4 w-4" />
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <Save className="h-4 w-4" />
              Guardar
            </button>
          </div>
        </form>
      </Card>
    </section>
  )
}

export default EquiposTiposForm
