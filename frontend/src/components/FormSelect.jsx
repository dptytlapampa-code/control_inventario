import PropTypes from 'prop-types'

function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  placeholder = 'Seleccione una opción',
  error,
  disabled = false,
}) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label fw-semibold text-secondary">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`form-select rounded-3 ${error ? 'is-invalid' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  )
}

FormSelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
}

export default FormSelect
