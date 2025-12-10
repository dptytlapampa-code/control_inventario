import { useEffect, useMemo, useState } from 'react'
import AuditoriaFilter from '../components/AuditoriaFilter'
import AuditoriaTable from '../components/AuditoriaTable'
import Card from '../components/Card'
import Loader from '../components/Loader'
import { exportAuditoriaExcel, exportAuditoriaPDF, getAuditoria } from '../utils/api'

function Auditoria() {
  const [filters, setFilters] = useState({ usuario: '', modulo: '', accion: '', desde: '', hasta: '', search: '' })
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current_page: 1, per_page: 15, last_page: 1, total: 0 })
  const [error, setError] = useState('')

  const fetchAuditoria = async (page = 1) => {
    setLoading(true)
    setError('')
    try {
      const response = await getAuditoria({
        user_id: filters.usuario || undefined,
        modulo: filters.modulo || undefined,
        accion: filters.accion || undefined,
        desde: filters.desde || undefined,
        hasta: filters.hasta || undefined,
        search: filters.search || undefined,
        page,
        per_page: pagination.per_page,
      })

      const data = response.data || response
      setRegistros(
        (data?.data || data || []).map((item) => ({
          ...item,
          fecha_legible: item.created_at ? new Date(item.created_at).toLocaleString() : '',
          antes_resumen: item.antes ? JSON.stringify(item.antes).slice(0, 120) : '',
          despues_resumen: item.despues ? JSON.stringify(item.despues).slice(0, 120) : '',
        })),
      )
      setPagination({
        current_page: data.current_page || page,
        per_page: data.per_page || pagination.per_page,
        last_page: data.last_page || 1,
        total: data.total || (data.data ? data.data.length : data.length || 0),
      })
    } catch (err) {
      setError('No se pudo cargar la auditoría')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuditoria(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.usuario, filters.modulo, filters.accion, filters.desde, filters.hasta, filters.search])

  const usuarios = useMemo(() => {
    const values = new Map()
    registros.forEach((item) => {
      if (item.user_id && !values.has(item.user_id)) {
        values.set(item.user_id, item.user_name || item.user_email || item.user_id)
      }
    })
    return Array.from(values.entries()).map(([value, label]) => ({ value, label }))
  }, [registros])

  const modulos = useMemo(() => {
    const values = new Set(registros.map((item) => item.modulo).filter(Boolean))
    return Array.from(values).map((value) => ({ value, label: value }))
  }, [registros])

  const acciones = useMemo(() => {
    const values = new Set(registros.map((item) => item.accion).filter(Boolean))
    return Array.from(values).map((value) => ({ value, label: value }))
  }, [registros])

  const registrosFiltrados = useMemo(() => {
    if (!filters.search) return registros
    const search = filters.search.toLowerCase()
    return registros.filter(
      (item) =>
        item.user_name?.toLowerCase().includes(search) ||
        item.accion?.toLowerCase().includes(search) ||
        item.modulo?.toLowerCase().includes(search),
    )
  }, [filters.search, registros])

  const handleReset = () => {
    setFilters({ usuario: '', modulo: '', accion: '', desde: '', hasta: '', search: '' })
    fetchAuditoria(1)
  }

  const handlePageChange = (page) => {
    fetchAuditoria(page)
  }

  const handleExport = async (type) => {
    try {
      const params = {
        user_id: filters.usuario || undefined,
        modulo: filters.modulo || undefined,
        accion: filters.accion || undefined,
        desde: filters.desde || undefined,
        hasta: filters.hasta || undefined,
      }
      const exportFn = type === 'pdf' ? exportAuditoriaPDF : exportAuditoriaExcel
      const blob = await exportFn(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = type === 'pdf' ? 'auditoria.pdf' : 'auditoria.csv'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('No se pudo exportar la auditoría')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-800">Auditoría del sistema</p>
          <p className="text-sm text-slate-500">Monitoreo integral de acciones clave en la plataforma.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
          >
            Exportar PDF
          </button>
          <button
            type="button"
            onClick={() => handleExport('excel')}
            className="px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
          >
            Exportar Excel
          </button>
        </div>
      </div>

      <AuditoriaFilter
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
        usuarios={usuarios}
        modulos={modulos}
        acciones={acciones}
      />

      {error && (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      {loading && <Loader />}

      <AuditoriaTable registros={registrosFiltrados} loading={loading} pagination={pagination} onPageChange={handlePageChange} />
    </div>
  )
}

export default Auditoria
