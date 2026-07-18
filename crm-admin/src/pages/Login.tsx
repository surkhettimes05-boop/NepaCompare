import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [phone, setPhone] = useState('9800000000');
  const [password, setPassword] = useState('admin_password');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let data;
      try {
        const res = await fetch('http://localhost:8080/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password })
        });
        
        data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');

      
      // Store token and user data
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
        <h2 className="heading-2" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Login</h2>
        {error && <div style={{ color: 'var(--accent-red)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <input type="text" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
        </form>
      </div>
    </div>
  );
}
