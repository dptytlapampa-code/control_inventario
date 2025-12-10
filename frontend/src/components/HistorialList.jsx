import PropTypes from 'prop-types'

function HistorialList({ registros = [], onEdit, onDelete, filterType = '', onFilterChange }) {
  const tipos = Array.from(new Set(registros.map((item) => item.tipoEvento)))

  const filtered = filterType ? registros.filter((item) => item.tipoEvento === filterType) : registros

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h2 className="h6 mb-1">Historial</h2>
            <p className="text-secondary mb-0">Lista cronológica de movimientos y mantenimientos registrados.</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <label className="form-label mb-0 text-secondary" htmlFor="filtroTipo">
              Tipo de evento
            </label>
            <select
              id="filtroTipo"
              className="form-select form-select-sm"
              value={filterType}
              onChange={(e) => onFilterChange?.(e.target.value)}
            >
              <option value="">Todos</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Evento</th>
                <th scope="col">Fecha</th>
                <th scope="col">Descripción</th>
                <th scope="col">Usuario</th>
                <th scope="col">Movimiento</th>
                <th scope="col" className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-secondary py-4">
                    No hay registros con el filtro seleccionado.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="badge text-bg-light border fw-semibold">{item.tipoEvento}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-secondary">
                        {item.fechaEvento ? new Date(item.fechaEvento).toLocaleString('es-ES') : '—'}
                      </div>
                      <small className="text-muted">{item.id}</small>
                    </td>
                    <td className="text-secondary" style={{ maxWidth: 260 }}>
                      {item.descripcion || 'Sin descripción'}
                    </td>
                    <td className="text-secondary">{item.usuarioRegistra || 'N/D'}</td>
                    <td>
                      {item.oficinaOrigenId || item.oficinaDestinoId ? (
                        <div className="small text-secondary">
                          {item.oficinaOrigenId ? <div>Origen: {item.oficinaOrigenId}</div> : <div>Origen: —</div>}
                          {item.oficinaDestinoId ? <div>Destino: {item.oficinaDestinoId}</div> : <div>Destino: —</div>}
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="btn-group" role="group" aria-label="Acciones">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(item)}>
                          Editar
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(item)}>
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
      </div>
    </div>
  )
}

HistorialList.propTypes = {
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
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  filterType: PropTypes.string,
  onFilterChange: PropTypes.func,
}

export default HistorialList
