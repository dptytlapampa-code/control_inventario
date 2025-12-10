import PropTypes from 'prop-types'
import ActaModalBase from './ActaModalBase'
import { generateActaEntrega } from '../utils/api'

function ActaEntregaModal({ show, equipo, onClose, onGenerated }) {
  return (
    <ActaModalBase
      show={show}
      title="Acta de Entrega"
      equipo={equipo}
      onClose={onClose}
      onGenerated={onGenerated}
      onSubmit={(payload) => generateActaEntrega(equipo.id, payload)}
    />
  )
}

ActaEntregaModal.propTypes = {
  show: PropTypes.bool.isRequired,
  equipo: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onGenerated: PropTypes.func,
}

export default ActaEntregaModal
