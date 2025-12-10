import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import HistorialForm from '../components/HistorialForm'
import HistorialList from '../components/HistorialList'
import HistorialTimeline from '../components/HistorialTimeline'
import ModalConfirm from '../components/ModalConfirm'
import Loader from '../components/Loader'
import Error from '../components/Error'
import {
  createHistorial,
  deleteHistorial,
  getHistorial,
  getOficinas,
  updateHistorial,
} from '../utils/api'

function EquiposHistorial() {
  const navigate = useNavigate()
  const { equipoId: equipoIdParam } = useParams()
  const equipoId = useMemo(() => equipoIdParam || 'eq1', [equipoIdParam])

  const [historial, setHistorial] = useState([])
  const [offices, setOffices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [filterType, setFilterType] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [showTimeline, setShowTimeline] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [historialResponse, officesResponse] = await Promise.all([
          getHistorial(equipoId),
          getOficinas(),
        ])
        setHistorial(historialResponse)
        setOffices(officesResponse)
      } catch (err) {
        setError(err.message || 'No se pudo cargar el historial del equipo.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [equipoId])

  const handleSave = async (payload) => {
    try {
      setSaving(true)
      let response
      if (selected?.id) {
        response = await updateHistorial(selected.id, payload)
        setHistorial((prev) => prev.map((item) => (item.id === response.id ? response : item)))
      } else {
        response = await createHistorial(equipoId, payload)
        setHistorial((prev) => [response, ...prev])
      }
      setSelected(null)
      setShowForm(false)
    } catch (err) {
      setError(err.message || 'No pudimos guardar el registro del historial.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await deleteHistorial(toDelete.id)
      setHistorial((prev) => prev.filter((item) => item.id !== toDelete.id))
      setToDelete(null)
    } catch (err) {
      setError(err.message || 'No pudimos eliminar el registro seleccionado.')
    }
  }

  const openForm = (record = null) => {
    setSelected(record)
    setShowForm(true)
  }

  const closeForm = () => {
    setSelected(null)
    setShowForm(false)
  }

  return (
    <section className="container-fluid py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h4 mb-1">Historial del equipo</h1>
          <p className="text-secondary mb-0">Registrar y consultar eventos clave de mantenimiento y movimientos.</p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            Volver
          </button>
          <button type="button" className="btn btn-primary" onClick={() => openForm()}>
            Agregar registro
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3">
          <Error message={error} />
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="row g-4">
          <div className="col-12 col-xl-8">
            <HistorialList
              registros={historial}
              onEdit={(item) => openForm(item)}
              onDelete={(item) => setToDelete(item)}
              filterType={filterType}
              onFilterChange={setFilterType}
            />
          </div>
          <div className="col-12 col-xl-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="h6 mb-0">Visualización</h2>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="toggleTimeline"
                  checked={showTimeline}
                  onChange={(e) => setShowTimeline(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="toggleTimeline">
                  Mostrar línea de tiempo
                </label>
              </div>
            </div>
            {showTimeline ? (
              <HistorialTimeline registros={historial} />
            ) : (
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <p className="text-secondary mb-0">
                    Activa la línea de tiempo para ver un resumen visual de los movimientos.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.45)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-semibold text-secondary">
                  {selected ? 'Editar registro' : 'Nuevo registro'}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeForm} />
              </div>
              <div className="modal-body">
                <HistorialForm
                  initialData={selected}
                  onSubmit={handleSave}
                  onCancel={closeForm}
                  offices={offices}
                  saving={saving}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {toDelete && (
        <ModalConfirm
          title="Eliminar registro"
          message="Esta acción eliminará el registro del historial de forma permanente."
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
        />
      )}
    </section>
  )
}

export default EquiposHistorial
