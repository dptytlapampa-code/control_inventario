import PropTypes from 'prop-types'
import ActaModalBase from './ActaModalBase'
import { generateActaTraslado } from '../utils/api'

function ActaTrasladoModal({ show, equipo, onClose, onGenerated }) {
  return (
    <ActaModalBase
      show={show}
      title="Acta de Traslado"
      equipo={equipo}
      onClose={onClose}
      onGenerated={onGenerated}
      onSubmit={(payload) => generateActaTraslado(equipo.id, payload)}
    />
  )
}

ActaTrasladoModal.propTypes = {
  show: PropTypes.bool.isRequired,
  equipo: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onGenerated: PropTypes.func,
}

export default ActaTrasladoModal
