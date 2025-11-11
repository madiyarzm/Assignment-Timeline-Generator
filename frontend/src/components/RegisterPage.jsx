import React, { useState } from 'react';
import api from '../api';

function RegisterPage({ onRegister, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.register(name, email, password);
      if (response.user) {
        onRegister(response.user);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Create Account</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="register-name">Name</label>
              <input 
                type="text" 
                id="register-name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-email">Email</label>
              <input 
                type="email" 
                id="register-email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <input 
                type="password" 
                id="register-password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          <p className="auth-switch">
            Already have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
