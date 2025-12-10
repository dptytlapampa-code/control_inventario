import { useEffect, useState } from 'react'
import {
  deleteEncabezadoActa,
  getEncabezadoActa,
  uploadEncabezadoActa,
} from '../utils/api'
import Loader from '../components/Loader'
import Error from '../components/Error'

function ConfigEncabezadoActas() {
  const [encabezado, setEncabezado] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEncabezadoActa()
        setEncabezado(data)
      } catch (err) {
        setError('No pudimos cargar el encabezado actual.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const validateFile = (selectedFile) => {
    if (!selectedFile) return 'Selecciona un archivo PNG o JPG.'
    if (!['image/png', 'image/jpeg'].includes(selectedFile.type)) {
      return 'Formato inválido. Solo se permiten PNG o JPG.'
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      return 'El archivo excede el tamaño máximo de 2MB.'
    }
    return ''
  }

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0]
    const validationMessage = validateFile(selected)
    setError(validationMessage)
    setSuccess('')
    setFile(validationMessage ? null : selected)
  }

  const handleUpload = async () => {
    const validationMessage = validateFile(file)
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    try {
      setSaving(true)
      setError('')
      const data = await uploadEncabezadoActa(file)
      setEncabezado(data)
      setSuccess('Encabezado guardado correctamente.')
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'No fue posible guardar el encabezado.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      setSaving(true)
      setError('')
      await deleteEncabezadoActa()
      setEncabezado(null)
      setFile(null)
      setSuccess('Encabezado eliminado correctamente.')
    } catch (err) {
      setError('No fue posible eliminar el encabezado.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <section className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h4 mb-1">Configuración de Encabezado para Actas</h1>
          <p className="text-secondary mb-0">
            Define el encabezado institucional que se imprimirá en todas las actas en PDF.
          </p>
        </div>
      </div>

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

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Vista previa</h5>
              <p className="text-secondary small mb-3">
                Se recomienda una imagen 1200 x 250 px en formato PNG o JPG, con relación de aspecto 4.8:1.
              </p>
              {encabezado ? (
                <div className="border rounded p-3 bg-light text-center">
                  <img
                    src={encabezado.url}
                    alt="Encabezado institucional"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  <div className="small text-secondary mt-2">
                    {encabezado.filename} · {(encabezado.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              ) : (
                <div className="border rounded p-4 bg-light text-center text-secondary">
                  No se ha configurado un encabezado aún.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Subir encabezado</h5>
              <div className="mb-3">
                <label className="form-label">Seleccionar archivo (PNG o JPG, máx. 2MB)</label>
                <input type="file" className="form-control" accept="image/png,image/jpeg" onChange={handleFileChange} />
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-primary" onClick={handleUpload} disabled={saving || !file}>
                  {saving ? 'Guardando…' : 'Guardar encabezado'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleDelete}
                  disabled={saving || !encabezado}
                >
                  Eliminar encabezado actual
                </button>
              </div>
              <p className="text-secondary small mt-3 mb-0">
                Asegúrate de que la imagen mantenga la proporción para evitar distorsiones en los PDF.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConfigEncabezadoActas
