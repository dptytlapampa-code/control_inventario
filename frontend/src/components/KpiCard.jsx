import PropTypes from 'prop-types'

function KpiCard({ title, value, subtitle, icon: Icon, variant = 'primary' }) {
  const accentClass = {
    primary: 'text-indigo-700 bg-indigo-50 border-indigo-100',
    success: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    warning: 'text-amber-700 bg-amber-50 border-amber-100',
    danger: 'text-rose-700 bg-rose-50 border-rose-100',
    info: 'text-sky-700 bg-sky-50 border-sky-100',
  }[variant] || 'text-indigo-700 bg-indigo-50 border-indigo-100'

  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body d-flex align-items-center gap-3">
        <div className={`rounded-3 border ${accentClass} d-flex align-items-center justify-content-center`} style={{ width: 52, height: 52 }}>
          {Icon ? <Icon className="w-6 h-6" /> : <span className="fw-bold">{title?.[0] || '?'}</span>}
        </div>
        <div className="flex-grow-1">
          <p className="text-uppercase text-muted fw-semibold small mb-1">{title}</p>
          <div className="d-flex align-items-baseline gap-2">
            <span className="h4 mb-0 fw-bold text-slate-900">{value}</span>
            {subtitle && <small className="text-muted">{subtitle}</small>}
          </div>
        </div>
      </div>
    </div>
  )
}

KpiCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
  variant: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'info']),
}

export default KpiCard
