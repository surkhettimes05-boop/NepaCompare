'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('customer_token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        
        // Fetch quotes
        const resQuotes = await fetch(`${apiUrl}/users/me/quotes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resQuotes.status === 401) {
          localStorage.removeItem('customer_token');
          router.push('/login');
          return;
        }
        const dataQuotes = await resQuotes.json();
        setQuotes(dataQuotes);

        // Fetch policies
        const resPolicies = await fetch(`${apiUrl}/renewals/my-policies`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resPolicies.ok) {
          const dataPolicies = await resPolicies.json();
          setPolicies(dataPolicies);
        }

      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
    router.push('/login');
  };

  const expiringPolicies = policies.filter(p => p.status === 'EXPIRING_SOON');

  return (
    <div className="container" style={{ paddingTop: '2rem', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-2">My Digital Locker</h1>
        <button onClick={handleLogout} className="btn" style={{ border: '1px solid var(--border-color)', background: 'transparent' }}>Logout</button>
      </div>

      {/* RENEWAL ALERTS */}
      {expiringPolicies.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="heading-3" style={{ marginBottom: '1rem', color: 'var(--accent-red)' }}>🚨 Action Required: Expiring Policies</h3>
          {expiringPolicies.map(policy => (
            <div key={policy.id} className="card" style={{ border: '2px solid var(--accent-red)', background: 'rgba(239, 68, 68, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-color)' }}>{policy.insurer} - {policy.planName}</h4>
                <p className="text-muted" style={{ margin: '0.25rem 0' }}>Expires on: <strong>{new Date(policy.endDate).toLocaleDateString()}</strong></p>
                <p style={{ color: 'var(--accent-red)', fontWeight: 500 }}>Your coverage will drop in less than 30 days!</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '0.5rem' }}>NPR {policy.premium.toLocaleString()}</p>
                <button className="btn btn-primary" style={{ background: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>
                  1-Click Renew Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ACTIVE POLICIES */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="heading-3" style={{ marginBottom: '1.5rem' }}>Active Policies</h3>
        {loading ? (
          <p>Loading your policies...</p>
        ) : policies.length === 0 ? (
          <p className="text-muted">You have no active policies.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem 0' }}>Insurer</th>
                  <th style={{ padding: '1rem 0' }}>Plan</th>
                  <th style={{ padding: '1rem 0' }}>Start Date</th>
                  <th style={{ padding: '1rem 0' }}>End Date</th>
                  <th style={{ padding: '1rem 0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy: any) => (
                  <tr key={policy.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0', fontWeight: 500 }}>{policy.insurer}</td>
                    <td style={{ padding: '1rem 0' }}>{policy.planName}</td>
                    <td style={{ padding: '1rem 0' }}>{new Date(policy.startDate).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem 0' }}>{new Date(policy.endDate).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span className={`badge ${policy.status === 'EXPIRING_SOON' ? 'badge-lost' : 'badge-new'}`}>
                        {policy.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="heading-3" style={{ marginBottom: '1.5rem' }}>My Insurance Quotes</h3>
        
        {loading ? (
          <p>Loading your quotes...</p>
        ) : quotes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>You haven't requested any quotes yet.</p>
            <button onClick={() => router.push('/get-quote')} className="btn btn-primary">Get a Quote Now</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem 0' }}>Date</th>
                  <th style={{ padding: '1rem 0' }}>Insurance Type</th>
                  <th style={{ padding: '1rem 0' }}>Status</th>
                  <th style={{ padding: '1rem 0' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote: any) => (
                  <tr key={quote.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0' }}>{new Date(quote.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem 0', textTransform: 'capitalize' }}>{quote.vertical}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span className="badge badge-new">{quote.status}</span>
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <button className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>View Quote</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
