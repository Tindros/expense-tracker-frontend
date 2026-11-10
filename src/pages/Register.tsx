import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/Input';
import { PasswordInput } from '../components/PasswordInput';
import { authService } from '../services/authService';
import './AuthPages.css';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      else if (!/[A-Z]/.test(password)) newErrors.password = 'Password must contain an uppercase letter';
      else if (!/[a-z]/.test(password)) newErrors.password = 'Password must contain a lowercase letter';
      else if (!/[0-9]/.test(password)) newErrors.password = 'Password must contain a number';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrors({});
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const result = await authService.register({ fullName, email, password });
      if (result.success) {
        setSuccessMsg(result.message || 'Registration successful!');
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrors({ general: result.message || 'Registration failed' });
      }
    } catch (err) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Create an Account</h2>
        <p>Sign up to start tracking your expenses.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {errors.general && <div className="alert alert-error">{errors.general}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <Input
          id="fullName"
          name="fullName"
          type="text"
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName}
          placeholder="John Doe"
          disabled={isLoading}
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
          disabled={isLoading}
        />

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="Minimum 8 characters"
          disabled={isLoading}
        />
        
        <div className="password-hint">
          Must contain 8+ chars, uppercase, lowercase, and a number.
        </div>

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
          disabled={isLoading}
        />

        <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
