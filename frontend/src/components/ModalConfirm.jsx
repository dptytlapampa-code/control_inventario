import PropTypes from 'prop-types'

function ModalConfirm({ title = 'Confirmar acción', message, onConfirm, onCancel, confirmLabel = 'Eliminar', cancelLabel = 'Cancelar' }) {
  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(15, 23, 42, 0.45)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-semibold text-secondary">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onCancel} />
          </div>
          <div className="modal-body">
            <p className="mb-0 text-secondary">{message}</p>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-light" onClick={onCancel}>
              {cancelLabel}
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

ModalConfirm.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
}

export default ModalConfirm
