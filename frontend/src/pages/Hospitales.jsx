import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import DataTable from '../components/DataTable'
import FormInput from '../components/FormInput'
import ModalConfirm from '../components/ModalConfirm'
import Loader from '../components/Loader'
import { createHospital, deleteHospital, getHospitales, updateHospital } from '../utils/api'

const initialForm = {
  nombre: '',
  direccion: '',
  telefono: '',
  email: '',
}

function Hospitales() {
  const [hospitals, setHospitals] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await getHospitales()
        setHospitals(response)
      } catch (error) {
        setErrorMessage('No pudimos obtener los hospitales. Intente nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const columns = useMemo(
    () => [
      { key: 'nombre', label: 'Nombre', sortable: true },
      { key: 'direccion', label: 'Dirección' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'email', label: 'Correo' },
    ],
    [],
  )

  const validate = () => {
    const nextErrors = {}
    if (!formData.nombre.trim()) nextErrors.nombre = 'El nombre es obligatorio.'
    if (!formData.direccion.trim()) nextErrors.direccion = 'La dirección es obligatoria.'
    if (!formData.telefono.trim()) nextErrors.telefono = 'El teléfono es obligatorio.'
    if (!formData.email.trim()) {
      nextErrors.email = 'El correo es obligatorio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Ingrese un correo válido.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSaving(true)
    setErrorMessage('')
    try {
      if (formData.id) {
        const updated = await updateHospital(formData.id, formData)
        setHospitals((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const created = await createHospital(formData)
        setHospitals((prev) => [...prev, created])
      }
      setFormData(initialForm)
      setSelected(null)
    } catch (error) {
      setErrorMessage('Hubo un problema al guardar el hospital.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (hospital) => {
    setFormData(hospital)
    setSelected(hospital)
    setErrors({})
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await deleteHospital(selected.id)
      setHospitals((prev) => prev.filter((item) => item.id !== selected.id))
      setSelected(null)
    } catch (error) {
      setErrorMessage('No pudimos eliminar el hospital.')
    } finally {
      setShowDelete(false)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Hospitales</h1>
        <p className="text-sm text-slate-600">Gestión de hospitales y clínicas.</p>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <Card title={formData.id ? 'Editar hospital' : 'Nuevo hospital'}>
            <form onSubmit={handleSubmit} noValidate>
              <FormInput
                name="nombre"
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                error={errors.nombre}
                placeholder="Ej: Hospital Central"
              />
              <FormInput
                name="direccion"
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                required
                error={errors.direccion}
                placeholder="Av. Siempre Viva 123"
              />
              <FormInput
                name="telefono"
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
                error={errors.telefono}
                placeholder="555-1234"
              />
              <FormInput
                name="email"
                label="Correo electrónico"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                error={errors.email}
                placeholder="contacto@hospital.com"
              />

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando…' : formData.id ? 'Actualizar' : 'Guardar'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setFormData(initialForm)
                    setErrors({})
                    setSelected(null)
                  }}
                  disabled={saving}
                >
                  Limpiar
                </button>
              </div>
              {saving && <Loader text="Aplicando cambios" />}
              {errorMessage && <div className="alert alert-warning mt-3 mb-0">{errorMessage}</div>}
            </form>
          </Card>
        </div>

        <div className="col-12 col-lg-8">
          <DataTable
            columns={columns}
            data={hospitals}
            searchKeys={['nombre', 'direccion', 'telefono', 'email']}
            loading={loading}
            error={errorMessage && hospitals.length === 0 ? errorMessage : ''}
            onEdit={handleEdit}
            onDelete={(item) => {
              setSelected(item)
              setShowDelete(true)
            }}
            emptyMessage="No hay hospitales registrados"
          />
        </div>
      </div>

      {showDelete && selected && (
        <ModalConfirm
          title="Eliminar hospital"
          message={`¿Desea eliminar "${selected.nombre}"? También se eliminarán sus servicios y oficinas asociadas.`}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </section>
  )
}

export default Hospitales
