import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdjuntosUploader from '../components/AdjuntosUploader'
import AdjuntosList from '../components/AdjuntosList'
import ModalConfirm from '../components/ModalConfirm'
import { deleteAdjunto, downloadAdjunto, getAdjuntos } from '../utils/api'
import Error from '../components/Error'
import Loader from '../components/Loader'

function EquiposAdjuntos() {
  const { equipoId: equipoIdParam } = useParams()
  const navigate = useNavigate()
  const equipoId = useMemo(() => equipoIdParam || 'eq1', [equipoIdParam])

  const [adjuntos, setAdjuntos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adjuntoToDelete, setAdjuntoToDelete] = useState(null)

  useEffect(() => {
    const fetchAdjuntos = async () => {
      try {
        setLoading(true)
        const data = await getAdjuntos(equipoId)
        setAdjuntos(data)
      } catch (err) {
        setError(err.message || 'No se pudieron obtener los adjuntos.')
      } finally {
        setLoading(false)
      }
    }

    fetchAdjuntos()
  }, [equipoId])

  const handleUploaded = (adjunto) => {
    setAdjuntos((prev) => [adjunto, ...prev])
  }

  const handleDownload = async (adjunto) => {
    try {
      const archivo = await downloadAdjunto(adjunto.id)
      if (!archivo) throw new Error('Archivo no disponible')

      const blob = archivo.file instanceof Blob ? archivo.file : new Blob([archivo.contenido || ''], { type: archivo.mime })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', archivo.nombre)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message || 'No se pudo descargar el adjunto.')
    }
  }

  const confirmDelete = async () => {
    if (!adjuntoToDelete) return

    try {
      await deleteAdjunto(adjuntoToDelete.id)
      setAdjuntos((prev) => prev.filter((item) => item.id !== adjuntoToDelete.id))
      setAdjuntoToDelete(null)
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el adjunto.')
    }
  }

  const handleBack = () => navigate(-1)

  return (
    <section className="container-fluid py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h4 mb-1">Adjuntos del equipo</h1>
          <p className="text-secondary mb-0">Carga, descarga y administración de archivos asociados al equipo.</p>
        </div>
        <button type="button" className="btn btn-outline-secondary" onClick={handleBack}>
          Volver
        </button>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <AdjuntosUploader equipoId={equipoId} onUploaded={handleUploaded} />
        </div>
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h2 className="h6 mb-1">Archivos cargados</h2>
                  <p className="text-secondary mb-0">Se listan los adjuntos registrados para el equipo seleccionado.</p>
                </div>
              </div>

              {error && (
                <div className="mb-3">
                  <Error message={error} />
                </div>
              )}

              {loading ? (
                <Loader />
              ) : (
                <AdjuntosList
                  adjuntos={adjuntos}
                  loading={loading}
                  onDownload={handleDownload}
                  onDelete={(adjunto) => setAdjuntoToDelete(adjunto)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {adjuntoToDelete && (
        <ModalConfirm
          title="Eliminar adjunto"
          message={`¿Deseas eliminar "${adjuntoToDelete.nombre}"? Esta acción no se puede deshacer.`}
          onConfirm={confirmDelete}
          onCancel={() => setAdjuntoToDelete(null)}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
        />
      )}
    </section>
  )
}

export default EquiposAdjuntos
