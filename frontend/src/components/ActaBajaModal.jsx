import PropTypes from 'prop-types'
import ActaModalBase from './ActaModalBase'
import { generateActaBaja } from '../utils/api'

function ActaBajaModal({ show, equipo, onClose, onGenerated }) {
  return (
    <ActaModalBase
      show={show}
      title="Acta de Baja"
      equipo={equipo}
      onClose={onClose}
      onGenerated={onGenerated}
      onSubmit={(payload) => generateActaBaja(equipo.id, payload)}
    />
  )
}

ActaBajaModal.propTypes = {
  show: PropTypes.bool.isRequired,
  equipo: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onGenerated: PropTypes.func,
}

export default ActaBajaModal
