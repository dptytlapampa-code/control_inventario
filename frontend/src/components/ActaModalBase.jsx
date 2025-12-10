import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Error from './Error'

function ActaModalBase({ show, title, equipo = {}, onClose, onSubmit, onGenerated }) {
  const [motivo, setMotivo] = useState('')
  const [detalle, setDetalle] = useState('')
  const [receptorNombre, setReceptorNombre] = useState('')
  const [receptorIdentificacion, setReceptorIdentificacion] = useState('')
  const [receptorCargo, setReceptorCargo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (show) {
      setMotivo('')
      setDetalle('')
      setReceptorNombre('')
      setReceptorIdentificacion('')
      setReceptorCargo('')
      setError('')
      setSuccess('')
    }
  }, [show])

  if (!show) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!motivo.trim()) {
      setError('El motivo o detalle del acto es obligatorio.')
      return
    }

    if (!receptorNombre.trim()) {
      setError('El nombre del receptor es obligatorio.')
      return
    }

    try {
      setLoading(true)
      const payload = {
        motivo: motivo.trim(),
        detalle: detalle.trim(),
        receptor_nombre: receptorNombre.trim(),
        receptor_identificacion: receptorIdentificacion.trim() || undefined,
        receptor_cargo: receptorCargo.trim() || undefined,
        equipo: {
          id: equipo.id,
          nombre: equipo.nombre,
          marca: equipo.marca,
          modelo: equipo.modelo,
          serie: equipo.serie,
          codigo: equipo.bienPatrimonial,
          ubicacion: equipo.ubicacion || equipo.oficinaId || '',
        },
      }

      const result = await onSubmit(payload)
      setSuccess('Acta generada correctamente.')
      if (onGenerated) onGenerated(result)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'No se pudo generar el acta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} disabled={loading} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="mb-3">
                  <Error message={error} />
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <div className="mb-3">
                <h6 className="mb-1">Equipo</h6>
                <p className="mb-0 text-secondary small">{equipo.nombre}</p>
                <p className="mb-0 text-secondary small">Serie: {equipo.serie || 'N/D'} | Código: {equipo.bienPatrimonial || 'N/D'}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Motivo / Detalle del Acto *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  required
                  placeholder="Describe el motivo, condición o detalle del acto"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Información adicional</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                  placeholder="Observaciones complementarias"
                />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre del receptor *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={receptorNombre}
                    onChange={(e) => setReceptorNombre(e.target.value)}
                    required
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Identificación</label>
                  <input
                    type="text"
                    className="form-control"
                    value={receptorIdentificacion}
                    onChange={(e) => setReceptorIdentificacion(e.target.value)}
                    placeholder="Documento o ID"
                  />
                </div>
              </div>

              <div className="row g-3 mt-1">
                <div className="col-md-12">
                  <label className="form-label">Cargo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={receptorCargo}
                    onChange={(e) => setReceptorCargo(e.target.value)}
                    placeholder="Cargo o función"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Generando…' : 'Generar PDF'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </div>
  )
}

ActaModalBase.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  equipo: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onGenerated: PropTypes.func,
}

export default ActaModalBase
