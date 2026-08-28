'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/auth/customer-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

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
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h1 className="heading-2" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create an Account</h1>
        
        {error && <div style={{ color: 'var(--accent-red)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label className="input-label" htmlFor="register-name">Full Name</label>
            <input id="register-name" type="text" autoComplete="name" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="register-email">Email Address</label>
            <input id="register-email" type="email" autoComplete="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="register-phone">Phone Number</label>
            <input id="register-phone" type="tel" autoComplete="tel" className="input-field" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="register-password">Password</label>
            <input id="register-password" type="password" autoComplete="new-password" minLength={10} className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <label style={{ display: 'flex', gap: '.6rem', alignItems: 'flex-start', color: 'var(--text-muted)', fontSize: '.85rem' }}><input type="checkbox" required style={{ marginTop: '.3rem' }} /> <span>I agree to the <Link href="/terms">Terms</Link> and acknowledge the <Link href="/privacy">Privacy Policy</Link>. Creating an account does not consent to insurer referrals.</span></label>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <span className="text-muted">Already have an account? </span>
          <Link href="/login" style={{ color: 'var(--primary-color)', fontWeight: 500 }}>Login</Link>
        </div>
      </div>
    </div>
  );
}
