import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError('Email and password are required.');

    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-brand">
        <div className="auth-brand-grid" />
        <div className="auth-brand-logo">
          TaskTrack
        </div>
        <h2>Welcome back. Let's get things done.</h2>
        <p>Sign in to pick up right where you left off.</p>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <h1>Sign in</h1>
          <p className="subtitle">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}