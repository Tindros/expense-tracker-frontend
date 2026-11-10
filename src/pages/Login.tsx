import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { PasswordInput } from '../components/PasswordInput';
import { authService } from '../services/authService';
import './AuthPages.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
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
      const result = await authService.login({
        email,
        password,
        rememberMe,
      });

      if (result.success) {
        setSuccessMsg(result.message || 'Logged in successfully!');

        navigate('/dashboard');
      } else {
        setErrors({
          general: result.message || 'Login failed',
        });
      }
    } catch (err) {
      setErrors({
        general: 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Log in to access your personal expense tracker.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {errors.general && (
          <div className="alert alert-error">
            {errors.general}
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            {successMsg}
          </div>
        )}

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
          placeholder="Enter your password"
          disabled={isLoading}
        />

        <div className="auth-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account?{' '}
        <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
}