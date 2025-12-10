import { useEffect, useState } from 'react'
import { searchProducts } from '../api/posApi'
import { usePosStore } from '../store/posStore'

function ProductSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const { agregarItem } = usePosStore()

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const response = await searchProducts(query)
        setResults(response.data || [])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(handler)
  }, [query])

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Buscar producto por nombre o código"
        className="w-full border rounded-lg px-4 py-3 text-lg"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {loading && <div className="text-sm text-slate-500">Buscando...</div>}
        {results.map((producto) => (
          <div
            key={producto.id}
            className="flex items-center justify-between bg-white border rounded-lg px-4 py-3"
          >
            <div>
              <div className="font-semibold">{producto.nombre}</div>
              <div className="text-sm text-slate-500">${producto.precio_venta}</div>
            </div>
            <button
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
              onClick={() => agregarItem(producto, 1)}
            >
              Agregar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductSearch
