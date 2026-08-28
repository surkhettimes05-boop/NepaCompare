import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../lib/api';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!apiUrl) {
        setError('Admin service is not configured. Set VITE_API_URL and redeploy the portal.');
        return;
      }
      setLoading(true);
      const res = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password })
        });
        
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(res.status === 401 ? 'Incorrect phone number or password.' : data.message || 'Unable to sign in. Please try again.');
      
      // Store token and user data
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      navigate('/');
    } catch (err: any) {
      setError(err instanceof TypeError ? 'Unable to connect to the admin service.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1.5rem', background: 'linear-gradient(135deg, #f8faff, #eef2ff)' }}>
      <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
        <h2 className="heading-2" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Login</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Admin portal</p>
        {error && <div role="alert" style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', padding: '.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label" htmlFor="admin-phone">Phone number</label>
            <input id="admin-phone" type="tel" autoComplete="username" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="admin-password">Password</label>
            <input id="admin-password" type="password" autoComplete="current-password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  );
}
