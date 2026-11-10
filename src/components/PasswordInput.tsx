import React, { type InputHTMLAttributes, useState } from 'react';
import './Input.css';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ label, error, className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Build a stable error-message ID from the field's id or name
  const fieldId = props.id || props.name;
  const errorId = error && fieldId ? `${fieldId}-error` : undefined;

  return (
    <div className={`input-group ${className}`}>
      <label className="input-label" htmlFor={fieldId}>
        {label}
      </label>
      <div className="password-wrapper">
        <input
          className={`input-field ${error ? 'input-error' : ''}`}
          type={showPassword ? 'text' : 'password'}
          aria-describedby={errorId}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && (
        <span id={errorId} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
