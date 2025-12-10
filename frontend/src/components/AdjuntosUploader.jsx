import { useState } from 'react'
import PropTypes from 'prop-types'
import { uploadAdjunto } from '../utils/api'
import Loader from './Loader'
import Error from './Error'

const MAX_SIZE_MB = 5
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

function AdjuntosUploader({ equipoId, onUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFileChange = (event) => {
    setError('')
    setSuccess('')
    const file = event.target.files?.[0]

    if (!file) {
      setSelectedFile(null)
      return
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Formato no permitido. Solo PDF, JPG o PNG.')
      setSelectedFile(null)
      return
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError('El archivo supera el límite de 5 MB.')
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async (event) => {
    event.preventDefault()

    if (!selectedFile) {
      setError('Selecciona un archivo válido para continuar.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const adjunto = await uploadAdjunto(equipoId, selectedFile)
      setSuccess('Adjunto cargado correctamente.')
      setSelectedFile(null)
      if (onUploaded) {
        onUploaded(adjunto)
      }
    } catch (err) {
      setError(err.message || 'No se pudo subir el archivo. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card shadow-sm" onSubmit={handleUpload}>
      <div className="card-body">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="flex-grow-1">
            <label className="form-label text-secondary">Adjuntar archivo</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <div className="form-text">Tamaño máximo 5 MB. Formatos: PDF, JPG o PNG.</div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Subiendo...' : 'Subir'}
          </button>
        </div>

        {loading && (
          <div className="mb-3">
            <Loader />
          </div>
        )}

        {error && (
          <div className="mb-3">
            <Error message={error} />
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-0" role="alert">
            {success}
          </div>
        )}
      </div>
    </form>
  )
}

AdjuntosUploader.propTypes = {
  equipoId: PropTypes.string.isRequired,
  onUploaded: PropTypes.func,
}

export default AdjuntosUploader
