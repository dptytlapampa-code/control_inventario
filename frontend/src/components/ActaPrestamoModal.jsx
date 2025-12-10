import PropTypes from 'prop-types'
import ActaModalBase from './ActaModalBase'
import { generateActaPrestamo } from '../utils/api'

function ActaPrestamoModal({ show, equipo, onClose, onGenerated }) {
  return (
    <ActaModalBase
      show={show}
      title="Acta de Préstamo"
      equipo={equipo}
      onClose={onClose}
      onGenerated={onGenerated}
      onSubmit={(payload) => generateActaPrestamo(equipo.id, payload)}
    />
  )
}

ActaPrestamoModal.propTypes = {
  show: PropTypes.bool.isRequired,
  equipo: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onGenerated: PropTypes.func,
}

export default ActaPrestamoModal
