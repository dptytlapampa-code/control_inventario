import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'

const modules = [
  { value: 'all', label: 'Todos' },
  { value: 'equipos', label: 'Equipos' },
  { value: 'hospitales', label: 'Hospitales' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'oficinas', label: 'Oficinas' },
  { value: 'mantenimientos', label: 'Mantenimientos' },
  { value: 'actas', label: 'Actas' },
]

function BuscadorGlobalBar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [module, setModule] = useState(searchParams.get('modulo') || 'all')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!query.trim()) return

    const params = new URLSearchParams({ q: query.trim(), modulo: module })
    navigate(`/buscador?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-center gap-3 max-w-3xl bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
    >
      <Search className="w-4 h-4 text-slate-500" aria-hidden />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar equipos, hospitales, oficinas, mantenimientos..."
        className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
      />
      <select
        value={module}
        onChange={(e) => setModule(e.target.value)}
        className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700"
      >
        {modules.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white text-sm font-semibold px-3 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        disabled={!query.trim()}
      >
        Buscar
      </button>
    </form>
  )
}

export default BuscadorGlobalBar
