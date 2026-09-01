'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/auth/customer-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('customer_token', data.access_token);
      localStorage.setItem('customer_user', JSON.stringify(data.user));
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 'var(--space-20)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-8)' }}>
        <h1 className="heading-2" style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>Login to Khaacho</h1>
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>Access your digital locker and manage your policies</p>
        
        {error && <div className="badge badge-error" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-3)', width: '100%', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label" htmlFor="login-email">Email Address</label>
            <input id="login-email" type="email" autoComplete="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="login-password">Password</label>
            <input id="login-password" type="password" autoComplete="current-password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{ textAlign: 'right', marginTop: 'var(--space-4)' }}><Link href="/forgot-password" className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>Forgot password?</Link></div>
        
        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-subtle)' }}>
          <span className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>Don't have an account? </span>
          <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Register</Link>
        </div>
      </div>
    </div>
  );
}
