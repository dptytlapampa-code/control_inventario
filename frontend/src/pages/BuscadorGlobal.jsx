import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BuscadorGlobalResults from '../components/BuscadorGlobalResults'
import Card from '../components/Card'
import FormSelect from '../components/FormSelect'
import FormInput from '../components/FormInput'
import Loader from '../components/Loader'
import {
  getHospitales,
  getOficinas,
  getServicios,
  searchGlobal,
} from '../utils/api'

const moduloFiltros = {
  equipos: ['hospital_id', 'servicio_id', 'oficina_id', 'estado_equipo'],
  mantenimientos: ['hospital_id', 'fecha_desde', 'fecha_hasta'],
  actas: ['tipo', 'fecha_desde', 'fecha_hasta'],
}

const actaTipos = [
  { value: 'entrega', label: 'Entrega' },
  { value: 'traslado', label: 'Traslado' },
  { value: 'baja', label: 'Baja' },
  { value: 'prestamo', label: 'Préstamo' },
]

function BuscadorGlobal() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [results, setResults] = useState([])
  const [meta, setMeta] = useState()
  const [loading, setLoading] = useState(false)
  const [hospitals, setHospitals] = useState([])
  const [services, setServices] = useState([])
  const [offices, setOffices] = useState([])

  const q = searchParams.get('q') || ''
  const modulo = searchParams.get('modulo') || 'all'
  const page = Number(searchParams.get('page') || 1)

  useEffect(() => {
    const loadStaticData = async () => {
      const [hospitalResponse, serviceResponse, officeResponse] = await Promise.all([
        getHospitales(),
        getServicios(),
        getOficinas(),
      ])
      setHospitals(hospitalResponse)
      setServices(serviceResponse)
      setOffices(officeResponse)
    }

    loadStaticData()
  }, [])

  useEffect(() => {
    if (!q.trim()) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await searchGlobal(Object.fromEntries(searchParams.entries()))
        setResults(response.data || response)
        setMeta(response.meta || {
          current_page: 1,
          per_page: response.length || 0,
          total: response.length || 0,
          last_page: 1,
        })
      } catch (error) {
        setResults([])
        setMeta(undefined)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [q, modulo, page, searchParams])

  const handleParamChange = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
      next.set('page', '1')
    } else {
      next.delete(key)
    }
    setSearchParams(next)
  }

  const activeFilters = useMemo(() => moduloFiltros[modulo] || [], [modulo])

  const filteredServices = useMemo(
    () => services.filter((item) => item.hospitalId === searchParams.get('hospital_id')),
    [searchParams, services],
  )

  const filteredOffices = useMemo(
    () => offices.filter((item) => item.servicioId === searchParams.get('servicio_id')),
    [searchParams, offices],
  )

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Buscador global</h1>
        <p className="text-sm text-slate-600">
          Mostrando {meta?.total ?? 0} resultados para “{q}” en {modulo === 'all' ? 'todos los módulos' : modulo}.
        </p>
      </div>

      <Card title="Filtros avanzados">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeFilters.includes('hospital_id') && (
            <FormSelect
              label="Hospital"
              value={searchParams.get('hospital_id') || ''}
              onChange={(e) => handleParamChange('hospital_id', e.target.value)}
              options={[{ value: '', label: 'Todos' }, ...hospitals.map((h) => ({ value: h.id, label: h.nombre }))]}
            />
          )}
          {activeFilters.includes('servicio_id') && (
            <FormSelect
              label="Servicio"
              value={searchParams.get('servicio_id') || ''}
              onChange={(e) => handleParamChange('servicio_id', e.target.value)}
              options={[{ value: '', label: 'Todos' }, ...filteredServices.map((s) => ({ value: s.id, label: s.nombre }))]}
            />
          )}
          {activeFilters.includes('oficina_id') && (
            <FormSelect
              label="Oficina"
              value={searchParams.get('oficina_id') || ''}
              onChange={(e) => handleParamChange('oficina_id', e.target.value)}
              options={[{ value: '', label: 'Todas' }, ...filteredOffices.map((o) => ({ value: o.id, label: o.nombre }))]}
            />
          )}
          {activeFilters.includes('estado_equipo') && (
            <FormSelect
              label="Estado del equipo"
              value={searchParams.get('estado_equipo') || ''}
              onChange={(e) => handleParamChange('estado_equipo', e.target.value)}
              options={[
                { value: '', label: 'Todos' },
                { value: 'Operativo', label: 'Operativo' },
                { value: 'En mantenimiento', label: 'En mantenimiento' },
                { value: 'Fuera de servicio', label: 'Fuera de servicio' },
              ]}
            />
          )}
          {activeFilters.includes('fecha_desde') && (
            <FormInput
              type="date"
              label="Desde"
              value={searchParams.get('fecha_desde') || ''}
              onChange={(e) => handleParamChange('fecha_desde', e.target.value)}
            />
          )}
          {activeFilters.includes('fecha_hasta') && (
            <FormInput
              type="date"
              label="Hasta"
              value={searchParams.get('fecha_hasta') || ''}
              onChange={(e) => handleParamChange('fecha_hasta', e.target.value)}
            />
          )}
          {activeFilters.includes('tipo') && (
            <FormSelect
              label="Tipo de acta"
              value={searchParams.get('tipo') || ''}
              onChange={(e) => handleParamChange('tipo', e.target.value)}
              options={[{ value: '', label: 'Todas' }, ...actaTipos]}
            />
          )}
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : (
        <BuscadorGlobalResults
          results={results}
          meta={meta}
          onPageChange={(nextPage) => handleParamChange('page', String(nextPage))}
        />
      )}
    </section>
  )
}

export default BuscadorGlobal
