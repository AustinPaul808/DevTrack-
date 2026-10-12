import React from 'react';

export default function Input({
  label,
  id,
  error,
  helper,
  type = 'text',
  className = '',
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        required={required}
        className={`form-input ${error ? 'border-danger' : ''}`}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
      {!error && helper && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{helper}</span>}
    </div>
  );
}
