import { useEffect, useMemo, useState } from 'react'

const FORMAT_OPTIONS = [
  { value: 'excel', label: 'Excel (XLSX)' },
  { value: 'csv', label: 'CSV' },
  { value: 'pdf', label: 'PDF' },
]

function ExportForm({ filtersConfig = [], onSubmit, defaultFormat = 'excel', loading = false }) {
  const [format, setFormat] = useState(defaultFormat)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    setFormat(defaultFormat)
  }, [defaultFormat])

  const handleChange = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (onSubmit) {
      onSubmit({ ...filters, format })
    }
  }

  const groupedFilters = useMemo(() => {
    if (!filtersConfig.length) return []
    const half = Math.ceil(filtersConfig.length / 2)
    return [filtersConfig.slice(0, half), filtersConfig.slice(half)]
  }, [filtersConfig])

  return (
    <form onSubmit={handleSubmit} className="pt-2">
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Formato</label>
          <select
            className="form-select"
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            disabled={loading}
          >
            {FORMAT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-8">
          <label className="form-label fw-semibold">Filtros</label>
          <div className="row g-2">
            {groupedFilters.map((column, columnIndex) => (
              <div className="col-md-6" key={`col-${columnIndex}`}>
                {column.map((filter) => {
                  const { name, label, type = 'text', options = [] } = filter
                  const value = filters[name] ?? ''

                  if (type === 'select') {
                    return (
                      <div className="mb-2" key={name}>
                        <label className="form-label small mb-1">{label}</label>
                        <select
                          className="form-select form-select-sm"
                          value={value}
                          onChange={(event) => handleChange(name, event.target.value)}
                          disabled={loading}
                        >
                          <option value="">Todos</option>
                          {options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )
                  }

                  return (
                    <div className="mb-2" key={name}>
                      <label className="form-label small mb-1">{label}</label>
                      <input
                        type={type}
                        className="form-control form-control-sm"
                        value={value}
                        onChange={(event) => handleChange(name, event.target.value)}
                        disabled={loading}
                      />
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end mt-3">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Procesando...' : 'Exportar'}
        </button>
      </div>
    </form>
  )
}

export default ExportForm
