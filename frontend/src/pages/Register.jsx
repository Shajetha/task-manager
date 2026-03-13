import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return setError('All fields are required.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome aboard ');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
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
        <h2>Organize your work. Amplify your output.</h2>
        <p>A clean, powerful task manager built for people who value clarity.</p>
        
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <h1>Create account</h1>
          <p className="subtitle">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Email"
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
                placeholder="Password(Min 8 characters)"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? <><span className="spinner" /> Creating account…</> : 'Create Account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}