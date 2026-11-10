import React, { type InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  // Build a stable error-message ID from the field's id or name
  const fieldId = props.id || props.name;
  const errorId = error && fieldId ? `${fieldId}-error` : undefined;

  return (
    <div className={`input-group ${className}`}>
      <label className="input-label" htmlFor={fieldId}>
        {label}
      </label>
      <input
        className={`input-field ${error ? 'input-error' : ''}`}
        aria-describedby={errorId}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error && (
        <span id={errorId} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
