import PropTypes from 'prop-types'

function EmptyState({ title = 'Sin información para mostrar', message = 'Agrega nuevos registros para visualizarlos aquí.', action }) {
  return (
    <div className="text-center text-secondary py-4">
      <div className="fw-semibold mb-1">{title}</div>
      <p className="small mb-2">{message}</p>
      {action}
    </div>
  )
}

EmptyState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  action: PropTypes.node,
}

export default EmptyState
