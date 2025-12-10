import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Loader from '../components/Loader'
import UsuarioRow from '../components/UsuarioRow'
import { getUsuarios } from '../utils/api'

function SuperAdminUsuarios() {
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true)
        const data = await getUsuarios()
        setUsuarios(data)
      } catch (err) {
        setError('No pudimos cargar los usuarios. Intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsuarios()
  }, [])

  const handleConfigurar = (user) => {
    navigate(`/superadmin/usuarios/${user.id}/permisos`)
  }

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
        <div>
          <h1 className="h3 mb-0">Panel SuperAdmin</h1>
          <p className="text-muted mb-0">Gestión centralizada de usuarios y permisos.</p>
        </div>
      </div>

      <Card title="Usuarios del sistema">
        {loading ? (
          <div className="py-4 text-center">
            <Loader label="Cargando usuarios..." />
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Correo</th>
                  <th scope="col">Roles Keycloak</th>
                  <th scope="col" className="text-end">
                    <span className="text-muted small">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length ? (
                  usuarios.map((user) => (
                    <UsuarioRow key={user.id} user={user} onConfigurar={handleConfigurar} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default SuperAdminUsuarios
