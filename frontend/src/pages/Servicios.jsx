import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import DataTable from '../components/DataTable'
import FormInput from '../components/FormInput'
import FormSelect from '../components/FormSelect'
import ModalConfirm from '../components/ModalConfirm'
import Loader from '../components/Loader'
import { createServicio, deleteServicio, getHospitales, getServicios, updateServicio } from '../utils/api'

const initialForm = {
  hospitalId: '',
  nombre: '',
  responsable: '',
}

function Servicios() {
  const [hospitals, setHospitals] = useState([])
  const [services, setServices] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [hospitalResponse, serviceResponse] = await Promise.all([getHospitales(), getServicios()])
        setHospitals(hospitalResponse)
        setServices(serviceResponse)
      } catch (error) {
        setErrorMessage('No pudimos cargar los servicios.')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const columns = useMemo(
    () => [
      {
        key: 'hospitalId',
        label: 'Hospital',
        render: (row) => hospitals.find((item) => item.id === row.hospitalId)?.nombre || '—',
        sortable: true,
      },
      { key: 'nombre', label: 'Servicio', sortable: true },
      { key: 'responsable', label: 'Responsable' },
    ],
    [hospitals],
  )

  const validate = () => {
    const nextErrors = {}
    if (!formData.hospitalId) nextErrors.hospitalId = 'Seleccione un hospital.'
    if (!formData.nombre.trim()) nextErrors.nombre = 'El nombre del servicio es obligatorio.'
    if (!formData.responsable.trim()) nextErrors.responsable = 'El responsable es obligatorio.'
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
        const updated = await updateServicio(formData.id, formData)
        setServices((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const created = await createServicio(formData)
        setServices((prev) => [...prev, created])
      }
      setFormData(initialForm)
      setSelected(null)
    } catch (error) {
      setErrorMessage('No pudimos guardar el servicio.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (service) => {
    setFormData(service)
    setSelected(service)
    setErrors({})
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await deleteServicio(selected.id)
      setServices((prev) => prev.filter((item) => item.id !== selected.id))
      setSelected(null)
    } catch (error) {
      setErrorMessage('No pudimos eliminar el servicio.')
    } finally {
      setShowDelete(false)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Servicios</h1>
        <p className="text-sm text-slate-600">Administración de servicios por hospital.</p>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <Card title={formData.id ? 'Editar servicio' : 'Nuevo servicio'}>
            <form onSubmit={handleSubmit} noValidate>
              <FormSelect
                name="hospitalId"
                label="Hospital"
                value={formData.hospitalId}
                onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
                options={hospitals.map((item) => ({ value: item.id, label: item.nombre }))}
                required
                error={errors.hospitalId}
              />
              <FormInput
                name="nombre"
                label="Servicio"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                error={errors.nombre}
                placeholder="Ej: Emergencias"
              />
              <FormInput
                name="responsable"
                label="Responsable"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                required
                error={errors.responsable}
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
            data={services}
            searchKeys={['nombre', 'responsable']}
            loading={loading}
            error={errorMessage && services.length === 0 ? errorMessage : ''}
            onEdit={handleEdit}
            onDelete={(item) => {
              setSelected(item)
              setShowDelete(true)
            }}
            emptyMessage="No hay servicios registrados"
          />
        </div>
      </div>

      {showDelete && selected && (
        <ModalConfirm
          title="Eliminar servicio"
          message={`¿Desea eliminar "${selected.nombre}"? Las oficinas asociadas también serán removidas.`}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </section>
  )
}

export default Servicios
