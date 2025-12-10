import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import DataTable from '../components/DataTable'
import FormInput from '../components/FormInput'
import FormSelect from '../components/FormSelect'
import ModalConfirm from '../components/ModalConfirm'
import Loader from '../components/Loader'
import { createOficina, deleteOficina, getHospitales, getOficinas, getServicios, updateOficina } from '../utils/api'

const initialForm = {
  hospitalId: '',
  servicioId: '',
  nombre: '',
  extension: '',
}

function Oficinas() {
  const [hospitals, setHospitals] = useState([])
  const [services, setServices] = useState([])
  const [offices, setOffices] = useState([])
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
        const [hospitalResponse, serviceResponse, officeResponse] = await Promise.all([
          getHospitales(),
          getServicios(),
          getOficinas(),
        ])
        setHospitals(hospitalResponse)
        setServices(serviceResponse)
        setOffices(officeResponse)
      } catch (error) {
        setErrorMessage('No pudimos cargar las oficinas.')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const filteredServices = useMemo(
    () => services.filter((item) => item.hospitalId === formData.hospitalId),
    [formData.hospitalId, services],
  )

  const columns = useMemo(
    () => [
      {
        key: 'hospitalId',
        label: 'Hospital',
        render: (row) => hospitals.find((item) => item.id === row.hospitalId)?.nombre || '—',
        sortable: true,
      },
      {
        key: 'servicioId',
        label: 'Servicio',
        render: (row) => services.find((item) => item.id === row.servicioId)?.nombre || '—',
        sortable: true,
      },
      { key: 'nombre', label: 'Oficina', sortable: true },
      { key: 'extension', label: 'Extensión' },
    ],
    [hospitals, services],
  )

  const validate = () => {
    const nextErrors = {}
    if (!formData.hospitalId) nextErrors.hospitalId = 'Seleccione un hospital.'
    if (!formData.servicioId) nextErrors.servicioId = 'Seleccione un servicio.'
    if (!formData.nombre.trim()) nextErrors.nombre = 'El nombre de la oficina es obligatorio.'
    if (!formData.extension.trim()) nextErrors.extension = 'La extensión o interno es obligatorio.'
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
        const updated = await updateOficina(formData.id, formData)
        setOffices((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const created = await createOficina(formData)
        setOffices((prev) => [...prev, created])
      }
      setFormData(initialForm)
      setSelected(null)
    } catch (error) {
      setErrorMessage('No pudimos guardar la oficina.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (office) => {
    setFormData(office)
    setSelected(office)
    setErrors({})
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await deleteOficina(selected.id)
      setOffices((prev) => prev.filter((item) => item.id !== selected.id))
      setSelected(null)
    } catch (error) {
      setErrorMessage('No pudimos eliminar la oficina.')
    } finally {
      setShowDelete(false)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Oficinas</h1>
        <p className="text-sm text-slate-600">Listado y organización de oficinas por servicio.</p>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <Card title={formData.id ? 'Editar oficina' : 'Nueva oficina'}>
            <form onSubmit={handleSubmit} noValidate>
              <FormSelect
                name="hospitalId"
                label="Hospital"
                value={formData.hospitalId}
                onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value, servicioId: '' })}
                options={hospitals.map((item) => ({ value: item.id, label: item.nombre }))}
                required
                error={errors.hospitalId}
              />
              <FormSelect
                name="servicioId"
                label="Servicio"
                value={formData.servicioId}
                onChange={(e) => setFormData({ ...formData, servicioId: e.target.value })}
                options={filteredServices.map((item) => ({ value: item.id, label: item.nombre }))}
                required
                error={errors.servicioId}
                disabled={!formData.hospitalId}
                placeholder={formData.hospitalId ? 'Seleccione un servicio' : 'Seleccione un hospital primero'}
              />
              <FormInput
                name="nombre"
                label="Oficina"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                error={errors.nombre}
                placeholder="Ej: Box 1"
              />
              <FormInput
                name="extension"
                label="Extensión / Interno"
                value={formData.extension}
                onChange={(e) => setFormData({ ...formData, extension: e.target.value })}
                required
                error={errors.extension}
                placeholder="Ej: 1203"
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
            data={offices}
            searchKeys={['nombre', 'extension']}
            loading={loading}
            error={errorMessage && offices.length === 0 ? errorMessage : ''}
            onEdit={handleEdit}
            onDelete={(item) => {
              setSelected(item)
              setShowDelete(true)
            }}
            emptyMessage="No hay oficinas registradas"
          />
        </div>
      </div>

      {showDelete && selected && (
        <ModalConfirm
          title="Eliminar oficina"
          message={`¿Desea eliminar la oficina "${selected.nombre}"?`}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </section>
  )
}

export default Oficinas
