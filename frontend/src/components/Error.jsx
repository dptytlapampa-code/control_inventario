function Error({ title = 'Ocurrió un error', message = 'No fue posible completar la acción.' }) {
  return (
    <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-rose-700">
      <div className="font-semibold">{title}</div>
      <p className="text-sm text-rose-600">{message}</p>
    </div>
  )
}

export default Error
