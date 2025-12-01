function Loading({ message = 'Cargando...' }) {
  return (
    <div className="flex items-center justify-center gap-2 text-slate-600">
      <span className="h-3 w-3 animate-ping rounded-full bg-indigo-500" aria-hidden />
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

export default Loading
