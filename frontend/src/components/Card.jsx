function Card({ title, children, actions }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
      {(title || actions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          {title ? <h2 className="text-lg font-semibold text-slate-900">{title}</h2> : <span />}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}

export default Card
