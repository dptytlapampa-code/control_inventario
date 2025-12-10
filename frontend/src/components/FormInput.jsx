import PropTypes from 'prop-types'

function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  autoComplete = 'off',
}) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label fw-semibold text-secondary">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`form-control rounded-3 ${error ? 'is-invalid' : ''}`}
      />
      {helperText && !error && <div className="form-text">{helperText}</div>}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  )}

FormInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  autoComplete: PropTypes.string,
}

export default FormInput
