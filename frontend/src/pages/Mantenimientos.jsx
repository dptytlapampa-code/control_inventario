import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import DataTable from '../components/DataTable'
import FormInput from '../components/FormInput'
import FormSelect from '../components/FormSelect'
import ModalConfirm from '../components/ModalConfirm'
import Loader from '../components/Loader'
import {
  createMantenimiento,
  deleteMantenimiento,
  getEquipos,
  getHospitales,
  getMantenimientos,
  getOficinas,
  getServicios,
  updateMantenimiento,
} from '../utils/api'

const initialForm = {
  hospitalId: '',
  servicioId: '',
  oficinaId: '',
  equipoId: '',
  fecha: '',
  tipo: '',
  responsable: '',
  notas: '',
}

const tipoMantenimiento = [
  { value: 'Preventivo', label: 'Preventivo' },
  { value: 'Correctivo', label: 'Correctivo' },
  { value: 'Calibración', label: 'Calibración' },
]

function Mantenimientos() {
  const [hospitals, setHospitals] = useState([])
  const [services, setServices] = useState([])
  const [offices, setOffices] = useState([])
  const [equipments, setEquipments] = useState([])
  const [records, setRecords] = useState([])
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
        const [hospitalResponse, serviceResponse, officeResponse, equipmentResponse, maintenanceResponse] =
          await Promise.all([
            getHospitales(),
            getServicios(),
            getOficinas(),
            getEquipos(),
            getMantenimientos(),
          ])
        setHospitals(hospitalResponse)
        setServices(serviceResponse)
        setOffices(officeResponse)
        setEquipments(equipmentResponse)
        setRecords(maintenanceResponse)
      } catch (error) {
        setErrorMessage('No pudimos cargar los mantenimientos.')
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

  const filteredEquipments = useMemo(
    () =>
      equipments.filter(
        (item) =>
          (!formData.hospitalId || item.hospitalId === formData.hospitalId) &&
          (!formData.servicioId || item.servicioId === formData.servicioId) &&
          (!formData.oficinaId || item.oficinaId === formData.oficinaId),
      ),
    [equipments, formData.hospitalId, formData.servicioId, formData.oficinaId],
  )

  const columns = useMemo(
    () => [
      {
        key: 'equipoId',
        label: 'Equipo',
        render: (row) => equipments.find((item) => item.id === row.equipoId)?.nombre || '—',
        sortable: true,
      },
      { key: 'fecha', label: 'Fecha', sortable: true },
      { key: 'tipo', label: 'Tipo' },
      { key: 'responsable', label: 'Responsable' },
      {
        key: 'hospitalId',
        label: 'Ubicación',
        render: (row) => {
          const hospitalName = hospitals.find((item) => item.id === row.hospitalId)?.nombre
          const serviceName = services.find((item) => item.id === row.servicioId)?.nombre
          const officeName = offices.find((item) => item.id === row.oficinaId)?.nombre
          return (
            <div>
              <div className="fw-semibold text-secondary">{hospitalName || '—'}</div>
              <small className="text-muted">{serviceName || 'Sin servicio'} · {officeName || 'Sin oficina'}</small>
            </div>
          )
        },
      },
    ],
    [equipments, hospitals, offices, services],
  )

  const validate = () => {
    const nextErrors = {}
    if (!formData.hospitalId) nextErrors.hospitalId = 'Seleccione un hospital.'
    if (!formData.servicioId) nextErrors.servicioId = 'Seleccione un servicio.'
    if (!formData.oficinaId) nextErrors.oficinaId = 'Seleccione una oficina.'
    if (!formData.equipoId) nextErrors.equipoId = 'Seleccione un equipo.'
    if (!formData.fecha) nextErrors.fecha = 'Seleccione la fecha programada.'
    if (!formData.tipo) nextErrors.tipo = 'Seleccione el tipo de mantenimiento.'
    if (!formData.responsable.trim()) nextErrors.responsable = 'Ingrese el responsable.'
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
        const updated = await updateMantenimiento(formData.id, formData)
        setRecords((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const created = await createMantenimiento(formData)
        setRecords((prev) => [...prev, created])
      }
      setFormData(initialForm)
      setSelected(null)
    } catch (error) {
      setErrorMessage('No pudimos guardar el mantenimiento.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (record) => {
    setFormData(record)
    setSelected(record)
    setErrors({})
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await deleteMantenimiento(selected.id)
      setRecords((prev) => prev.filter((item) => item.id !== selected.id))
      setSelected(null)
    } catch (error) {
      setErrorMessage('No pudimos eliminar el mantenimiento.')
    } finally {
      setShowDelete(false)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Mantenimientos</h1>
        <p className="text-sm text-slate-600">Programación y registro de mantenimientos con dependencias.</p>
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-4">
          <Card title={formData.id ? 'Editar mantenimiento' : 'Nuevo mantenimiento'}>
            <form onSubmit={handleSubmit} noValidate>
              <FormSelect
                name="hospitalId"
                label="Hospital"
                value={formData.hospitalId}
                onChange={(e) =>
                  setFormData({ ...formData, hospitalId: e.target.value, servicioId: '', oficinaId: '', equipoId: '' })
                }
                options={hospitals.map((item) => ({ value: item.id, label: item.nombre }))}
                required
                error={errors.hospitalId}
              />
              <FormSelect
                name="servicioId"
                label="Servicio"
                value={formData.servicioId}
                onChange={(e) => setFormData({ ...formData, servicioId: e.target.value, oficinaId: '', equipoId: '' })}
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
                onChange={(e) => setFormData({ ...formData, oficinaId: e.target.value, equipoId: '' })}
                options={filteredOffices.map((item) => ({ value: item.id, label: item.nombre }))}
                required
                disabled={!formData.servicioId}
                error={errors.oficinaId}
                placeholder={formData.servicioId ? 'Seleccione una oficina' : 'Seleccione un servicio primero'}
              />
              <FormSelect
                name="equipoId"
                label="Equipo"
                value={formData.equipoId}
                onChange={(e) => setFormData({ ...formData, equipoId: e.target.value })}
                options={filteredEquipments.map((item) => ({ value: item.id, label: item.nombre }))}
                required
                disabled={!formData.oficinaId}
                error={errors.equipoId}
                placeholder={formData.oficinaId ? 'Seleccione un equipo' : 'Seleccione una oficina primero'}
              />
              <FormInput
                name="fecha"
                label="Fecha programada"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
                error={errors.fecha}
              />
              <FormSelect
                name="tipo"
                label="Tipo de mantenimiento"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                options={tipoMantenimiento}
                required
                error={errors.tipo}
              />
              <FormInput
                name="responsable"
                label="Responsable"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                required
                error={errors.responsable}
              />
              <FormInput
                name="notas"
                label="Notas"
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                placeholder="Observaciones opcionales"
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
            data={records}
            searchKeys={['fecha', 'tipo', 'responsable']}
            loading={loading}
            error={errorMessage && records.length === 0 ? errorMessage : ''}
            onEdit={handleEdit}
            onDelete={(item) => {
              setSelected(item)
              setShowDelete(true)
            }}
            emptyMessage="No hay mantenimientos registrados"
          />
        </div>
      </div>

      {showDelete && selected && (
        <ModalConfirm
          title="Eliminar mantenimiento"
          message={`¿Desea eliminar el mantenimiento del ${selected.fecha}?`}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </section>
  )
}

export default Mantenimientos
