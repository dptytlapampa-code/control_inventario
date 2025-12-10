import PropTypes from 'prop-types'

function HistorialTimeline({ registros = [] }) {
  const sorted = [...registros].sort((a, b) => new Date(b.fechaEvento || b.createdAt || 0) - new Date(a.fechaEvento || a.createdAt || 0))

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h2 className="h6 mb-3">Línea de tiempo</h2>
        <div className="position-relative ps-3">
          <div className="position-absolute start-0 top-0 h-100 border-start border-2 border-primary" aria-hidden="true" />
          <div className="d-flex flex-column gap-4">
            {sorted.length === 0 && <p className="text-secondary mb-0">Aún no hay eventos registrados.</p>}
            {sorted.map((item) => (
              <div key={item.id} className="d-flex gap-3 align-items-start">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                  <i className="bi bi-clock-history" aria-hidden="true" />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="h6 mb-1">{item.tipoEvento}</h3>
                    <small className="text-muted">
                      {item.fechaEvento ? new Date(item.fechaEvento).toLocaleString('es-ES') : 'Sin fecha'}
                    </small>
                  </div>
                  <p className="text-secondary mb-1">{item.descripcion || 'Sin detalles adicionales.'}</p>
                  <div className="small text-muted">
                    Registrado por {item.usuarioRegistra || 'N/D'}
                    {item.oficinaOrigenId || item.oficinaDestinoId ? (
                      <span className="ms-2">
                        {item.oficinaOrigenId && `Origen: ${item.oficinaOrigenId}`}
                        {item.oficinaOrigenId && item.oficinaDestinoId && ' → '}
                        {item.oficinaDestinoId && `Destino: ${item.oficinaDestinoId}`}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

HistorialTimeline.propTypes = {
  registros: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      tipoEvento: PropTypes.string.isRequired,
      fechaEvento: PropTypes.string,
      descripcion: PropTypes.string,
      usuarioRegistra: PropTypes.string,
      oficinaOrigenId: PropTypes.string,
      oficinaDestinoId: PropTypes.string,
    }),
  ),
}

export default HistorialTimeline
