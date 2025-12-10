import React from 'react'

const defaultPermissions = {
  puede_ver: false,
  puede_crear: false,
  puede_editar: false,
  puede_eliminar: false,
}

function PermisosTable({ modules = [], permissions = {}, onToggle }) {
  const handleChange = (modulo, field, value) => {
    if (onToggle) {
      onToggle(modulo, field, value)
    }
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th scope="col">Módulo</th>
            <th scope="col" className="text-center">Ver</th>
            <th scope="col" className="text-center">Crear</th>
            <th scope="col" className="text-center">Editar</th>
            <th scope="col" className="text-center">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((modulo) => {
            const current = permissions[modulo] || defaultPermissions

            return (
              <tr key={modulo}>
                <th scope="row" className="fw-semibold text-secondary">
                  {modulo}
                </th>
                {['puede_ver', 'puede_crear', 'puede_editar', 'puede_eliminar'].map((field) => (
                  <td key={field} className="text-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={Boolean(current[field])}
                      onChange={(e) => handleChange(modulo, field, e.target.checked)}
                    />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default React.memo(PermisosTable)
