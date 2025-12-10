import { ArrowRight, FileText, Home, MapPin, RefreshCcw, Server, Stethoscope, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import EmptyState from './EmptyState'

const iconByType = {
  equipo: <Server className="w-4 h-4" />,
  hospital: <Home className="w-4 h-4" />,
  servicio: <Stethoscope className="w-4 h-4" />,
  oficina: <MapPin className="w-4 h-4" />,
  mantenimiento: <Wrench className="w-4 h-4" />,
  acta: <FileText className="w-4 h-4" />,
}

function buildTarget(item) {
  switch (item.tipo) {
    case 'equipo':
      return `/equipos/${item.id}`
    case 'hospital':
      return '/instituciones/listado'
    case 'servicio':
      return '/instituciones/servicios'
    case 'oficina':
      return '/instituciones/oficinas'
    case 'mantenimiento':
      return '/mantenimientos/historial'
    case 'acta':
      return '/actas/listado'
    default:
      return '/'
  }
}

function BuscadorGlobalResults({ results, meta, onPageChange }) {
  if (!results?.length) {
    return <EmptyState title="Sin resultados" description="Ajusta los filtros o intenta con otra palabra clave." />
  }

  const totalPages = meta?.last_page || 1
  const currentPage = meta?.current_page || 1

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-slate-100 border border-slate-200 rounded-lg bg-white">
        {results.map((item) => (
          <li key={`${item.tipo}-${item.id}`} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-3 flex-1">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                {iconByType[item.tipo] || <RefreshCcw className="w-4 h-4" />}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 leading-tight line-clamp-2">{item.nombre || item.titulo}</p>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {item.descripcion || item.estado || 'Sin descripción disponible'}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-1">
                  {item.hospital_id && <span className="px-2 py-1 bg-slate-100 rounded-md">Hospital: {item.hospital_id}</span>}
                  {item.servicio_id && <span className="px-2 py-1 bg-slate-100 rounded-md">Servicio: {item.servicio_id}</span>}
                  {item.oficina_id && <span className="px-2 py-1 bg-slate-100 rounded-md">Oficina: {item.oficina_id}</span>}
                  {item.estado && <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md">Estado: {item.estado}</span>}
                  {item.fecha && <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md">Fecha: {new Date(item.fecha).toLocaleDateString()}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wide">
                {item.tipo}
              </span>
              <Link
                to={buildTarget(item)}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Ver detalle
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <button
            type="button"
            className="px-3 py-2 border border-slate-200 rounded-md bg-white disabled:opacity-40"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            type="button"
            className="px-3 py-2 border border-slate-200 rounded-md bg-white disabled:opacity-40"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}

export default BuscadorGlobalResults
