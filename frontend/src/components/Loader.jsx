import PropTypes from 'prop-types'

function Loader({ text = 'Cargando' }) {
  return (
    <div className="d-flex align-items-center gap-2 text-secondary py-3">
      <div className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true" />
      <span className="small">{text}…</span>
    </div>
  )
}

Loader.propTypes = {
  text: PropTypes.string,
}

export default Loader
