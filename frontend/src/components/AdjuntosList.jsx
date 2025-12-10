import PropTypes from 'prop-types'
import { Download, Trash } from 'lucide-react'
import EmptyState from './EmptyState'

function AdjuntosList({ adjuntos, onDownload, onDelete, loading }) {
  if (!loading && adjuntos.length === 0) {
    return (
      <EmptyState
        title="Sin adjuntos"
        description="Todavía no se cargaron archivos para este equipo."
      />
    )
  }

  return (
    <div className="table-responsive shadow-sm rounded border">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Tamaño</th>
            <th>Fecha</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-secondary">
                Cargando adjuntos...
              </td>
            </tr>
          ) : (
            adjuntos.map((adjunto) => (
              <tr key={adjunto.id}>
                <td className="fw-semibold">{adjunto.nombre}</td>
                <td>{adjunto.tipo}</td>
                <td>{formatSize(adjunto.size)}</td>
                <td>{adjunto.fecha}</td>
                <td className="text-end">
                  <div className="btn-group" role="group" aria-label="Acciones">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => onDownload(adjunto)}
                    >
                      <Download size={16} className="me-1" />
                      Descargar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onDelete(adjunto)}
                    >
                      <Trash size={16} className="me-1" />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

AdjuntosList.propTypes = {
  adjuntos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      tipo: PropTypes.string.isRequired,
      fecha: PropTypes.string.isRequired,
      size: PropTypes.number,
      file: PropTypes.any,
    })
  ),
  onDownload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}

AdjuntosList.defaultProps = {
  adjuntos: [],
  loading: false,
}

export default AdjuntosList
