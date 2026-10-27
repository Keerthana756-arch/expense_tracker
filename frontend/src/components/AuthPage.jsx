import React, { useState } from 'react';
import { LogIn, UserPlus, Lock, Mail, User, Wallet, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { authApi } from '../api/authService';

export default function AuthPage({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!formData.username.trim() || formData.username.trim().length < 3) {
        setError('Username must be at least 3 characters long.');
        return;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setLoading(true);
      try {
        const response = await authApi.register({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });
        onAuthSuccess(response);
      } catch (err) {
        setError(err.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!formData.username.trim()) {
        setError('Please enter your username or email.');
        return;
      }
      if (!formData.password) {
        setError('Please enter your password.');
        return;
      }

      setLoading(true);
      try {
        const response = await authApi.login({
          usernameOrEmail: formData.username.trim(),
          password: formData.password,
        });
        onAuthSuccess(response);
      } catch (err) {
        setError(err.message || 'Login failed. Please verify your credentials.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await authApi.login({
        usernameOrEmail: 'demo',
        password: 'demo123',
      });
      onAuthSuccess(response);
    } catch {
      // If demo user wasn't registered yet, register it
      try {
        const regResp = await authApi.register({
          username: 'demo',
          email: 'demo@expensetracker.com',
          password: 'demo123',
        });
        onAuthSuccess(regResp);
      } catch (e2) {
        setError(e2.message || 'Failed to initialize demo account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-icon-circle">
            <Wallet size={32} />
          </div>
          <h2>Daily Expense Tracker</h2>
          <p>Sign in or create an account to manage your personal expenses</p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            className={`auth-tab ${isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
          >
            <UserPlus size={16} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Username / Identifier */}
          <div className="form-group">
            <label htmlFor="auth-username">
              {isRegister ? 'Username' : 'Username or Email'}
            </label>
            <div className="input-wrap icon-left">
              <User className="input-icon" size={16} />
              <input
                id="auth-username"
                name="username"
                type="text"
                placeholder={isRegister ? 'Choose a username' : 'Enter username or email'}
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Email (Registration only) */}
          {isRegister && (
            <div className="form-group">
              <label htmlFor="auth-email">Email Address</label>
              <div className="input-wrap icon-left">
                <Mail className="input-icon" size={16} />
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <div className="input-wrap icon-left">
              <Lock className="input-icon" size={16} />
              <input
                id="auth-password"
                name="password"
                type="password"
                placeholder="Enter password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                required
              />
            </div>
          </div>

          {/* Confirm Password (Registration only) */}
          {isRegister && (
            <div className="form-group">
              <label htmlFor="auth-confirm">Confirm Password</label>
              <div className="input-wrap icon-left">
                <Lock className="input-icon" size={16} />
                <input
                  id="auth-confirm"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-auth-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-sm"></span>
            ) : isRegister ? (
              <>
                <UserPlus size={18} />
                <span>Register Account</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="demo-divider">
          <span>or explore instantly</span>
        </div>

        <button
          type="button"
          className="btn btn-demo"
          onClick={handleDemoLogin}
          disabled={loading}
          title="Sign in with sample pre-loaded demo account"
        >
          <Sparkles size={16} className="sparkle-icon" />
          <span>One-Click Demo Account (username: demo)</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

