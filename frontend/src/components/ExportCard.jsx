import ExportForm from './ExportForm'

function ExportCard({ title, description, filtersConfig = [], onExport, loading = false }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between mb-2">
          <div>
            <span className="badge bg-indigo-100 text-indigo-800 mb-2">Exportación</span>
            <h5 className="card-title mb-1">{title}</h5>
            <p className="text-muted small mb-0">{description}</p>
          </div>
          <i className="bi bi-download text-primary fs-4" aria-hidden />
        </div>
        <ExportForm filtersConfig={filtersConfig} onSubmit={onExport} loading={loading} />
      </div>
    </div>
  )
}

export default ExportCard
