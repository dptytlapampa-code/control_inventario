const variants = {
  Activo: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  'En Servicio Técnico': 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  Baja: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
}

function StatusBadge({ status }) {
  const variant = variants[status] || 'bg-slate-50 text-slate-700 ring-1 ring-slate-200'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${variant}`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
