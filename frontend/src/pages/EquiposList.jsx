import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import DataTable from '../components/DataTable'
import FormInput from '../components/FormInput'
import FormSelect from '../components/FormSelect'
import ModalConfirm from '../components/ModalConfirm'
import Loader from '../components/Loader'
import {
  createEquipo,
  deleteEquipo,
  getEquipos,
  getHospitales,
  getOficinas,
  getServicios,
  getTiposEquipos,
  updateEquipo,
} from '../utils/api'

const initialForm = {
  nombre: '',
  tipoId: '',
  serie: '',
  bienPatrimonial: '',
  estado: '',
  hospitalId: '',
  servicioId: '',
  oficinaId: '',
}

const estados = [
  { value: 'Operativo', label: 'Operativo' },
  { value: 'En mantenimiento', label: 'En mantenimiento' },
  { value: 'Fuera de servicio', label: 'Fuera de servicio' },
]

function EquiposList() {
  const [hospitals, setHospitals] = useState([])
  const [services, setServices] = useState([])
  const [offices, setOffices] = useState([])
  const [types, setTypes] = useState([])
  const [equipments, setEquipments] = useState([])
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
        const [hospitalResponse, serviceResponse, officeResponse, typeResponse, equipmentResponse] = await Promise.all([
          getHospitales(),
          getServicios(),
          getOficinas(),
          getTiposEquipos(),
          getEquipos(),
        ])
        setHospitals(hospitalResponse)
        setServices(serviceResponse)
        setOffices(officeResponse)
        setTypes(typeResponse)
        setEquipments(equipmentResponse)
      } catch (error) {
        setErrorMessage('No pudimos cargar los equipos.')
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

  const filteredOffices = useMemo(
    () => offices.filter((item) => item.servicioId === formData.servicioId),
    [formData.servicioId, offices],
  )

  const columns = useMemo(
    () => [
      { key: 'nombre', label: 'Equipo', sortable: true },
      {
        key: 'tipoId',
        label: 'Tipo',
        render: (row) => types.find((item) => item.id === row.tipoId)?.nombre || '—',
      },
      { key: 'serie', label: 'Serie', sortable: true },
      { key: 'bienPatrimonial', label: 'Bien patrimonial' },
      {
        key: 'hospitalId',
        label: 'Hospital / Servicio',
        render: (row) => {
          const hospitalName = hospitals.find((item) => item.id === row.hospitalId)?.nombre
          const serviceName = services.find((item) => item.id === row.servicioId)?.nombre
          return (
            <div>
              <div className="fw-semibold text-secondary">{hospitalName || '—'}</div>
              <small className="text-muted">{serviceName || 'Sin servicio'}</small>
            </div>
          )
        },
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (row) => (
          <span className="badge text-bg-light border fw-semibold">{row.estado}</span>
        ),
      },
    ],
    [hospitals, services, types],
  )

  const validate = () => {
    const nextErrors = {}
    if (!formData.nombre.trim()) nextErrors.nombre = 'El nombre es obligatorio.'
    if (!formData.tipoId) nextErrors.tipoId = 'Seleccione el tipo de equipo.'
    if (!formData.serie.trim()) nextErrors.serie = 'La serie es obligatoria.'
    if (!formData.estado) nextErrors.estado = 'Seleccione el estado.'
    if (!formData.hospitalId) nextErrors.hospitalId = 'Seleccione un hospital.'
    if (!formData.servicioId) nextErrors.servicioId = 'Seleccione un servicio.'
    if (!formData.oficinaId) nextErrors.oficinaId = 'Seleccione una oficina.'
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
        const updated = await updateEquipo(formData.id, formData)
        setEquipments((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const created = await createEquipo(formData)
        setEquipments((prev) => [...prev, created])
      }
      setFormData(initialForm)
      setSelected(null)
    } catch (error) {
      setErrorMessage('No pudimos guardar el equipo.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (equipment) => {
    setFormData(equipment)
    setSelected(equipment)
    setErrors({})
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await deleteEquipo(selected.id)
      setEquipments((prev) => prev.filter((item) => item.id !== selected.id))
      setSelected(null)
    } catch (error) {
      setErrorMessage('No pudimos eliminar el equipo.')
    } finally {
      setShowDelete(false)
    }
  }

  return (
    <section className="space-y-4">
      <div className="d-flex flex-column gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Listado de equipos</h1>
        <p className="text-sm text-slate-600 mb-0">Inventario detallado con validaciones, filtros y acciones.</p>
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-4">
          <Card title={formData.id ? 'Editar equipo' : 'Nuevo equipo'}>
            <form onSubmit={handleSubmit} noValidate>
              <FormInput
                name="nombre"
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                error={errors.nombre}
                placeholder="Ej: Monitor Philips"
              />
              <FormSelect
                name="tipoId"
                label="Tipo de equipo"
                value={formData.tipoId}
                onChange={(e) => setFormData({ ...formData, tipoId: e.target.value })}
                options={types.map((item) => ({ value: item.id, label: item.nombre }))}
                required
                error={errors.tipoId}
              />
              <FormInput
                name="serie"
                label="Número de serie"
                value={formData.serie}
                onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
                required
                error={errors.serie}
              />
              <FormInput
                name="bienPatrimonial"
                label="Bien patrimonial"
                value={formData.bienPatrimonial}
                onChange={(e) => setFormData({ ...formData, bienPatrimonial: e.target.value })}
                placeholder="Opcional"
              />
              <FormSelect
                name="estado"
                label="Estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                options={estados}
                required
                error={errors.estado}
              />
              <FormSelect
                name="hospitalId"
                label="Hospital"
                value={formData.hospitalId}
                onChange={(e) =>
                  setFormData({ ...formData, hospitalId: e.target.value, servicioId: '', oficinaId: '' })
                }
                options={hospitals.map((item) => ({ value: item.id, label: item.nombre }))}
                required
                error={errors.hospitalId}
              />
              <FormSelect
                name="servicioId"
                label="Servicio"
                value={formData.servicioId}
                onChange={(e) => setFormData({ ...formData, servicioId: e.target.value, oficinaId: '' })}
                options={filteredServices.map((item) => ({ value: item.id, label: item.nombre }))}
                required
                disabled={!formData.hospitalId}
                error={errors.servicioId}
                placeholder={formData.hospitalId ? 'Seleccione un servicio' : 'Seleccione un hospital primero'}
              />
              <FormSelect
                name="oficinaId"
                label="Oficina"
                value={formData.oficinaId}
                onChange={(e) => setFormData({ ...formData, oficinaId: e.target.value })}
                options={filteredOffices.map((item) => ({ value: item.id, label: item.nombre }))}
                required
                disabled={!formData.servicioId}
                error={errors.oficinaId}
                placeholder={formData.servicioId ? 'Seleccione una oficina' : 'Seleccione un servicio primero'}
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

        <div className="col-12 col-xl-8">
          <DataTable
            columns={columns}
            data={equipments}
            searchKeys={['nombre', 'serie', 'bienPatrimonial', 'estado']}
            loading={loading}
            error={errorMessage && equipments.length === 0 ? errorMessage : ''}
            onEdit={handleEdit}
            onDelete={(item) => {
              setSelected(item)
              setShowDelete(true)
            }}
            emptyMessage="No hay equipos registrados"
          />
        </div>
      </div>

      {showDelete && selected && (
        <ModalConfirm
          title="Eliminar equipo"
          message={`¿Desea eliminar "${selected.nombre}"? Esta acción no se puede deshacer.`}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </section>
  )
}

export default EquiposList
