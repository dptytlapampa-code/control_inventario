import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../components/Card'
import Loader from '../components/Loader'
import PermisosTable from '../components/PermisosTable'
import {
  deletePermiso,
  getHospitales,
  getPermisosUsuario,
  getUsuarios,
  savePermisosUsuario,
} from '../utils/api'

const MODULOS_SISTEMA = [
  'Hospitales',
  'Servicios',
  'Oficinas',
  'Equipos',
  'Adjuntos',
  'Mantenimientos',
  'Historial',
]

const emptyPermission = { puede_ver: false, puede_crear: false, puede_editar: false, puede_eliminar: false }

function SuperAdminPermisos() {
  const { userId } = useParams()
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState(null)
  const [hospitales, setHospitales] = useState([])
  const [permisos, setPermisos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hospitalSeleccionado, setHospitalSeleccionado] = useState('')
  const [modulePermissions, setModulePermissions] = useState({})

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        const [usuariosData, hospitalesData, permisosData] = await Promise.all([
          getUsuarios(),
          getHospitales(),
          getPermisosUsuario(userId),
        ])

        setUsuario(usuariosData.find((item) => item.id === userId) || null)
        setHospitales(hospitalesData)
        setPermisos(permisosData)
      } catch (err) {
        setError('No pudimos cargar la configuración de permisos.')
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [userId])

  const permisosPorModulo = useMemo(() => {
    const map = {}
    MODULOS_SISTEMA.forEach((modulo) => {
      const existente = permisos.find(
        (permiso) =>
          permiso.modulo === modulo && (permiso.hospital_id || '') === (hospitalSeleccionado || ''),
      )
      map[modulo] = existente
        ? {
            puede_ver: Boolean(existente.puede_ver),
            puede_crear: Boolean(existente.puede_crear),
            puede_editar: Boolean(existente.puede_editar),
            puede_eliminar: Boolean(existente.puede_eliminar),
          }
        : emptyPermission
    })
    return map
  }, [hospitalSeleccionado, permisos])

  useEffect(() => {
    setModulePermissions(permisosPorModulo)
  }, [permisosPorModulo])

  const handleToggle = (modulo, field, value) => {
    setModulePermissions((prev) => ({
      ...prev,
      [modulo]: { ...prev[modulo], [field]: value },
    }))
  }

  const handleGuardar = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      setSaving(true)
      const payload = MODULOS_SISTEMA.map((modulo) => ({
        modulo,
        hospital_id: hospitalSeleccionado || null,
        ...modulePermissions[modulo],
      }))

      const response = await savePermisosUsuario(userId, { permisos: payload })
      setPermisos(response.permisos)
      setSuccess('Permisos actualizados correctamente.')
    } catch (err) {
      setError('No pudimos guardar los permisos. Intenta nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleEliminar = async (permisoId) => {
    setError('')
    setSuccess('')
    try {
      await deletePermiso(permisoId)
      const actualizados = await getPermisosUsuario(userId)
      setPermisos(actualizados)
      setSuccess('Permiso eliminado.')
    } catch (err) {
      setError('No pudimos eliminar el permiso seleccionado.')
    }
  }

  if (loading) {
    return (
      <div className="container-fluid py-4 text-center">
        <Loader label="Preparando configuración de permisos..." />
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
        <div>
          <h1 className="h3 mb-0">Permisos de usuario</h1>
          <p className="text-muted mb-0">Configura los permisos internos combinados con roles Keycloak.</p>
        </div>
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <Card
            title={usuario ? `Usuario: ${usuario.nombre}` : 'Usuario no encontrado'}
            actions={
              usuario && (
                <span className="badge text-bg-light border">
                  Keycloak ID: <span className="fw-semibold ms-1">{usuario.id}</span>
                </span>
              )
            }
          >
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <form onSubmit={handleGuardar} className="d-flex flex-column gap-3">
              <div className="row g-3 align-items-end">
                <div className="col-md-6 col-lg-4">
                  <label htmlFor="hospital" className="form-label fw-semibold text-secondary">
                    Hospital (opcional)
                  </label>
                  <select
                    id="hospital"
                    className="form-select"
                    value={hospitalSeleccionado}
                    onChange={(e) => setHospitalSeleccionado(e.target.value)}
                  >
                    <option value="">Todos los hospitales</option>
                    {hospitales.map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>
                        {hospital.nombre}
                      </option>
                    ))}
                  </select>
                  <div className="form-text">Los permisos se aplicarán solo al hospital elegido.</div>
                </div>
              </div>

              <PermisosTable modules={MODULOS_SISTEMA} permissions={modulePermissions} onToggle={handleToggle} />

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar permisos'}
                </button>
              </div>
            </form>
          </Card>
        </div>

        <div className="col-12">
          <Card title="Permisos actuales">
            {permisos.length === 0 ? (
              <p className="text-muted mb-0">El usuario aún no tiene permisos configurados.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Módulo</th>
                      <th scope="col">Hospital</th>
                      <th scope="col" className="text-center">Ver</th>
                      <th scope="col" className="text-center">Crear</th>
                      <th scope="col" className="text-center">Editar</th>
                      <th scope="col" className="text-center">Eliminar</th>
                      <th scope="col" className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permisos.map((permiso) => (
                      <tr key={permiso.id}>
                        <td className="fw-semibold text-secondary">{permiso.modulo}</td>
                        <td>
                          {permiso.hospital_id
                            ? hospitales.find((h) => h.id === permiso.hospital_id)?.nombre || 'Hospital oculto'
                            : 'Todos'}
                        </td>
                        {['puede_ver', 'puede_crear', 'puede_editar', 'puede_eliminar'].map((field) => (
                          <td key={field} className="text-center">
                            {permiso[field] ? (
                              <span className="badge text-bg-success-subtle text-success border-success-subtle">Sí</span>
                            ) : (
                              <span className="badge text-bg-light border">No</span>
                            )}
                          </td>
                        ))}
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleEliminar(permiso.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminPermisos
