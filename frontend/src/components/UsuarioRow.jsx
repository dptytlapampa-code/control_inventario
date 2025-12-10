function UsuarioRow({ user, onConfigurar }) {
  return (
    <tr>
      <td className="fw-semibold text-secondary">{user.nombre}</td>
      <td>{user.email}</td>
      <td>
        <div className="d-flex flex-wrap gap-1">
          {user.roles?.length ? (
            user.roles.map((role) => (
              <span key={role} className="badge text-bg-light border">
                {role}
              </span>
            ))
          ) : (
            <span className="text-muted">Sin roles</span>
          )}
        </div>
      </td>
      <td className="text-end">
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => onConfigurar?.(user)}
        >
          Configurar permisos
        </button>
      </td>
    </tr>
  )
}

export default UsuarioRow
