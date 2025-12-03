function PageTemplate({ title, description }) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-600">{description}</p>}
      </div>
      <div className="border border-dashed border-slate-200 rounded-xl bg-white h-60 flex items-center justify-center text-slate-500">
        Contenido pendiente de implementar.
      </div>
    </section>
  )
}

export default PageTemplate
