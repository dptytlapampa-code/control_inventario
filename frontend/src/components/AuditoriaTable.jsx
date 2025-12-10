import { ShieldCheck, Timer } from 'lucide-react'

function AuditoriaTable({ registros = [], loading = false, pagination, onPageChange }) {
  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">Eventos de auditoría</p>
          <p className="text-xs text-slate-500">Trazabilidad completa de acciones clave</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Timer className="w-4 h-4" />
          <span>UTC{new Date().toLocaleTimeString('es-ES', { timeZoneName: 'short' }).replace(/.*GMT/, ' GMT')}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Acción</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Módulo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Usuario</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Rol</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">IP</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Objeto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-sm text-slate-500">
                  Cargando auditoría...
                </td>
              </tr>
            ) : registros.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-sm text-slate-500">
                  No hay registros que coincidan con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              registros.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-800 font-semibold">{item.accion}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{item.modulo}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="font-medium">{item.user_name || 'Desconocido'}</div>
                    <div className="text-xs text-slate-500">{item.user_email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>{item.user_role || 'N/D'}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{item.ip_address || 'N/D'}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{item.fecha_legible || item.created_at}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{item.objeto_id || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="text-xs text-slate-500">Antes: {item.antes_resumen || '—'}</div>
                    <div className="text-xs text-slate-500">Después: {item.despues_resumen || '—'}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600">
          <div>
            Página {pagination.current_page} de {pagination.last_page} — {pagination.total} registros
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.current_page <= 1}
              onClick={() => handlePageChange(pagination.current_page - 1)}
              className="px-3 py-2 border border-slate-200 rounded-lg disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={pagination.current_page >= pagination.last_page}
              onClick={() => handlePageChange(pagination.current_page + 1)}
              className="px-3 py-2 border border-slate-200 rounded-lg disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuditoriaTable
