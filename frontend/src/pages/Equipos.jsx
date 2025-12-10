import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import Error from '../components/Error'
import { getEquipos, getTiposEquipos } from '../utils/api'
import ActaEntregaModal from '../components/ActaEntregaModal'
import ActaTrasladoModal from '../components/ActaTrasladoModal'
import ActaBajaModal from '../components/ActaBajaModal'
import ActaPrestamoModal from '../components/ActaPrestamoModal'

function Equipos() {
  const navigate = useNavigate()
  const [equipos, setEquipos] = useState([])
  const [tipos, setTipos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actaMessage, setActaMessage] = useState('')
  const [activeActa, setActiveActa] = useState(null)
  const [selectedEquipo, setSelectedEquipo] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [equiposResponse, tiposResponse] = await Promise.all([getEquipos(), getTiposEquipos()])
        setEquipos(equiposResponse.data || equiposResponse)
        setTipos(tiposResponse)
      } catch (err) {
        setError('No pudimos cargar los equipos en este momento.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getTipoNombre = (tipoId) => tipos.find((tipo) => tipo.id === tipoId)?.nombre || 'Sin tipo'

  const handleOpenActa = (tipo, equipo) => {
    setSelectedEquipo(equipo)
    setActiveActa(tipo)
    setActaMessage('')
    setOpenMenu(null)
  }

  const handleActaGenerated = () => {
    setActaMessage('Acta generada y lista para descargar desde el módulo de actas.')
  }

  const closeModal = () => {
    setActiveActa(null)
    setSelectedEquipo(null)
  }

  const toggleMenu = (equipoId) => {
    setOpenMenu((current) => (current === equipoId ? null : equipoId))
  }

  return (
    <section className="container-fluid py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h4 mb-1">Equipos</h1>
          <p className="text-secondary mb-0">Navega al historial de movimientos y mantenimientos de cada equipo.</p>
        </div>
      </div>

      {error && (
        <div className="mb-3">
          <Error message={error} />
        </div>
      )}

      {actaMessage && (
        <div className="alert alert-success" role="alert">
          {actaMessage}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="row g-3">
          {equipos.map((equipo) => (
            <div key={equipo.id} className="col-12 col-lg-6 col-xl-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h2 className="h6 mb-1">{equipo.nombre}</h2>
                  <p className="text-secondary mb-2">{getTipoNombre(equipo.tipoId)}</p>
                  <div className="small text-muted mb-3">Serie: {equipo.serie || 'N/D'}</div>
                  <div className="mt-auto d-flex justify-content-between align-items-center gap-2">
                    <div className="position-relative">
                      <button
                        type="button"
                        className="btn btn-outline-secondary dropdown-toggle"
                        onClick={() => toggleMenu(equipo.id)}
                      >
                        Generar acta
                      </button>
                      {openMenu === equipo.id && (
                        <div className="dropdown-menu show" style={{ display: 'block' }}>
                          <button className="dropdown-item" type="button" onClick={() => handleOpenActa('entrega', equipo)}>
                            Acta de Entrega
                          </button>
                          <button className="dropdown-item" type="button" onClick={() => handleOpenActa('traslado', equipo)}>
                            Acta de Traslado
                          </button>
                          <button className="dropdown-item" type="button" onClick={() => handleOpenActa('baja', equipo)}>
                            Acta de Baja
                          </button>
                          <button className="dropdown-item" type="button" onClick={() => handleOpenActa('prestamo', equipo)}>
                            Acta de Préstamo
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => navigate(`/equipos/${equipo.id}/historial`)}
                    >
                      Ver historial
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

      {equipos.length === 0 && (
        <div className="col-12">
          <div className="alert alert-info" role="alert">
            No hay equipos registrados aún. Agrega equipos para gestionar su historial.
          </div>
            </div>
          )}
        </div>
      )}
      <ActaEntregaModal
        show={activeActa === 'entrega' && !!selectedEquipo}
        equipo={selectedEquipo || {}}
        onClose={closeModal}
        onGenerated={handleActaGenerated}
      />
      <ActaTrasladoModal
        show={activeActa === 'traslado' && !!selectedEquipo}
        equipo={selectedEquipo || {}}
        onClose={closeModal}
        onGenerated={handleActaGenerated}
      />
      <ActaBajaModal
        show={activeActa === 'baja' && !!selectedEquipo}
        equipo={selectedEquipo || {}}
        onClose={closeModal}
        onGenerated={handleActaGenerated}
      />
      <ActaPrestamoModal
        show={activeActa === 'prestamo' && !!selectedEquipo}
        equipo={selectedEquipo || {}}
        onClose={closeModal}
        onGenerated={handleActaGenerated}
      />
    </section>
  )
}

export default Equipos
