import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import FormInput from './FormInput'
import FormSelect from './FormSelect'

const EVENT_TYPES = [
  'Mantenimiento preventivo',
  'Mantenimiento correctivo',
  'Traslado a otro servicio/oficina',
  'Cambio de estado',
  'Baja del equipo',
]

const initialState = {
  tipoEvento: EVENT_TYPES[0],
  descripcion: '',
  fechaEvento: '',
  oficinaOrigenId: '',
  oficinaDestinoId: '',
}

function HistorialForm({ initialData, onSubmit, onCancel, offices = [], saving = false }) {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialState,
        ...initialData,
      })
    }
  }, [initialData])

  const validate = () => {
    const nextErrors = {}
    if (!formData.tipoEvento) nextErrors.tipoEvento = 'Selecciona el tipo de evento.'
    if (!formData.fechaEvento) nextErrors.fechaEvento = 'Indica la fecha del evento.'

    if (formData.oficinaOrigenId && formData.oficinaDestinoId && formData.oficinaOrigenId === formData.oficinaDestinoId) {
      nextErrors.oficinaDestinoId = 'El destino debe ser diferente al origen.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormSelect
        name="tipoEvento"
        label="Tipo de evento"
        value={formData.tipoEvento}
        onChange={(e) => setFormData({ ...formData, tipoEvento: e.target.value })}
        required
        options={EVENT_TYPES.map((label) => ({ value: label, label }))}
        error={errors.tipoEvento}
      />

      <FormInput
        name="fechaEvento"
        label="Fecha del evento"
        type="datetime-local"
        value={formData.fechaEvento}
        onChange={(e) => setFormData({ ...formData, fechaEvento: e.target.value })}
        required
        error={errors.fechaEvento}
      />

      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label fw-semibold text-secondary">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          className="form-control rounded-3"
          rows={3}
          placeholder="Detalle las acciones realizadas, hallazgos o motivos del movimiento."
        />
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <FormSelect
            name="oficinaOrigenId"
            label="Oficina origen"
            value={formData.oficinaOrigenId}
            onChange={(e) => setFormData({ ...formData, oficinaOrigenId: e.target.value })}
            options={offices.map((office) => ({ value: office.id, label: office.nombre }))}
            placeholder="No aplica"
            error={errors.oficinaOrigenId}
          />
        </div>
        <div className="col-12 col-md-6">
          <FormSelect
            name="oficinaDestinoId"
            label="Oficina destino"
            value={formData.oficinaDestinoId}
            onChange={(e) => setFormData({ ...formData, oficinaDestinoId: e.target.value })}
            options={offices.map((office) => ({ value: office.id, label: office.nombre }))}
            placeholder="No aplica"
            error={errors.oficinaDestinoId}
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button type="button" className="btn btn-light" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

HistorialForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.string,
    tipoEvento: PropTypes.string,
    descripcion: PropTypes.string,
    fechaEvento: PropTypes.string,
    oficinaOrigenId: PropTypes.string,
    oficinaDestinoId: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  offices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
    }),
  ),
  saving: PropTypes.bool,
}

export default HistorialForm
