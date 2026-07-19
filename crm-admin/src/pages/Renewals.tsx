import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Renewals() {
  const [expiringPolicies, setExpiringPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch('http://localhost:8080/renewals/expiring-all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const data = await res.json();
        setExpiringPolicies(data);
      } catch (error) {
        console.error('Failed to fetch expiring policies', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [navigate]);

  return (
    <div className="page-content animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-2">Retention Dashboard</h1>
          <p className="text-muted">Proactively contact customers before their policies expire.</p>
        </div>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--accent-red)', fontWeight: 600 }}>
          {expiringPolicies.length} Policies Expiring Soon
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading expiring policies...</p>
        ) : expiringPolicies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p className="text-muted">No policies expiring in the next 30 days. Great retention rate!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Expiration Date</th>
                  <th>Customer Name</th>
                  <th>Customer Phone</th>
                  <th>Insurer</th>
                  <th>Plan & Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expiringPolicies.map(policy => (
                  <tr key={policy.id} style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--accent-red)' }}>
                        {new Date(policy.endDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{policy.user?.name || 'N/A'}</td>
                    <td>{policy.user?.phone || 'N/A'}</td>
                    <td>{policy.insurer}</td>
                    <td>{policy.planName} (NPR {policy.premium.toLocaleString()})</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => alert(`Call customer at ${policy.user?.phone} to secure this renewal!`)}>
                        Call Customer
                      </button>
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
