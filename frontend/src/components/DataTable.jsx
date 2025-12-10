import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Loader from './Loader'
import EmptyState from './EmptyState'

function DataTable({
  columns,
  data,
  searchKeys = [],
  itemsPerPage = 5,
  loading = false,
  error,
  onEdit,
  onDelete,
  emptyMessage = 'Sin registros disponibles',
  searchPlaceholder = 'Buscar...',
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const filteredData = useMemo(() => {
    const normalized = search.toLowerCase()
    const filtered = data.filter((row) => {
      if (!normalized) return true
      return searchKeys.some((key) => String(row[key] || '').toLowerCase().includes(normalized))
    })

    if (sortConfig.key) {
      return [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key] || ''
        const bValue = b[sortConfig.key] || ''
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, search, searchKeys, sortConfig])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (key, sortable) => {
    if (!sortable) return
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body pb-0">
        <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between mb-3">
          <div>
            <h6 className="fw-semibold text-secondary mb-0">Registros</h6>
            <small className="text-muted">Búsqueda y paginación local</small>
          </div>
          <div className="ms-auto w-100 w-md-25">
            <input
              type="search"
              className="form-control"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>
        </div>
        {loading && <Loader text="Cargando datos" />}
        {error && <div className="alert alert-danger mb-0">{error}</div>}
        {!loading && !error && paginatedData.length === 0 && <EmptyState message={emptyMessage} />}
      </div>

      {!loading && !error && paginatedData.length > 0 && (
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    role={column.sortable ? 'button' : undefined}
                    className={column.sortable ? 'text-decoration-none' : ''}
                    onClick={() => handleSort(column.key, column.sortable)}
                  >
                    <div className="d-flex align-items-center gap-1">
                      <span className="small text-uppercase text-muted">{column.label}</span>
                      {column.sortable && sortConfig.key === column.key && (
                        <span className="text-muted">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete) && <th className="text-uppercase text-muted small">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={column.key} className="text-secondary">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        {onEdit && (
                          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onEdit(row)}>
                            Editar
                          </button>
                        )}
                        {onDelete && (
                          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(row)}>
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && paginatedData.length > 0 && (
        <div className="card-body d-flex align-items-center justify-content-between">
          <small className="text-muted">
            Mostrando {startIndex + 1} - {startIndex + paginatedData.length} de {filteredData.length}
          </small>
          <div className="btn-group" role="group" aria-label="Paginación">
            <button type="button" className="btn btn-outline-secondary" disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Anterior
            </button>
            <button type="button" className="btn btn-outline-secondary" disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
      sortable: PropTypes.bool,
    }),
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchKeys: PropTypes.arrayOf(PropTypes.string),
  itemsPerPage: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  emptyMessage: PropTypes.string,
  searchPlaceholder: PropTypes.string,
}

export default DataTable
