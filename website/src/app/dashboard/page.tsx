'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'wellness' | 'support'>('overview');
  
  const [quotes, setQuotes] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
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
        
        // Fetch all data in parallel
        const [resQuotes, resPolicies, resAppointments, resTickets] = await Promise.all([
          fetch(`${apiUrl}/users/me/quotes`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/renewals/my-policies`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/wellness/appointments`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/support/tickets`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (resQuotes.status === 401) {
          localStorage.removeItem('customer_token');
          router.push('/login');
          return;
        }

        if (resQuotes.ok) setQuotes(await resQuotes.json());
        if (resPolicies.ok) setPolicies(await resPolicies.json());
        if (resAppointments.ok) setAppointments(await resAppointments.json());
        if (resTickets.ok) setTickets(await resTickets.json());

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

  // --- Modals State ---
  const [paymentModal, setPaymentModal] = useState<{ show: boolean, type: 'buy' | 'renew', id: string } | null>(null);
  const [appointmentModal, setAppointmentModal] = useState<{ show: boolean } | null>(null);
  const [ticketModal, setTicketModal] = useState<{ show: boolean } | null>(null);

  // --- Forms State ---
  const [appointmentForm, setAppointmentForm] = useState({ type: 'OPD_CONSULTATION', providerName: 'Grandee International Hospital', date: '' });
  const [ticketForm, setTicketForm] = useState({ subject: '', description: '' });

  // --- Actions ---
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('customer_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    try {
      await fetch(`${apiUrl}/wellness/appointments`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentForm)
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('customer_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    try {
      await fetch(`${apiUrl}/support/tickets`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketForm)
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const processSimulatedPayment = async () => {
    if (!paymentModal) return;
    setLoading(true);
    const token = localStorage.getItem('customer_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    try {
      if (paymentModal.type === 'buy') {
        await fetch(`${apiUrl}/leads/${paymentModal.id}/buy`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        await fetch(`${apiUrl}/renewals/${paymentModal.id}/renew`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const downloadMockDocument = (docName: string) => {
    // In a real app, this would trigger an S3 signed URL download.
    // For now, simulate download success.
    alert(`Downloading ${docName} from secure vault...`);
  };

  const expiringPolicies = policies.filter(p => p.status === 'EXPIRING_SOON');

  return (
    <div className="container animate-fade-up" style={{ paddingTop: '2rem', minHeight: '80vh', paddingBottom: '4rem' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 className="heading-2" style={{ marginBottom: 'var(--space-2)' }}>Unified Digital Locker</h1>
          <p className="text-muted">Manage your policies, documents, and wellness in one secure place.</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </div>

      {/* RENEWAL ALERTS (Always visible at top if urgent) */}
      {expiringPolicies.length > 0 && (
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h3 className="heading-3" style={{ marginBottom: 'var(--space-4)', color: 'var(--error)' }}>🚨 Urgent: Expiring Policies</h3>
          {expiringPolicies.map(policy => (
            <div key={policy.id} className="card" style={{ border: '2px solid var(--error)', background: 'var(--error-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div>
                <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>{policy.insurer} - {policy.planName}</h4>
                <p className="text-muted" style={{ margin: 'var(--space-1) 0' }}>Expires on: <strong>{new Date(policy.endDate).toLocaleDateString()}</strong></p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>NPR {policy.premium.toLocaleString()}</p>
                <button onClick={() => router.push('/renew')} className="btn btn-danger">
                  View renewal steps
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', borderBottom: '2px solid var(--border-subtle)', marginBottom: 'var(--space-8)', overflowX: 'auto' }}>
        {['overview', 'documents', 'wellness', 'support'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              padding: 'var(--space-3) var(--space-5)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-tertiary)',
              fontWeight: activeTab === tab ? 600 : 500,
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {loading ? (
        <p className="text-center text-muted" style={{ padding: 'var(--space-20)' }}>Loading your secure vault...</p>
      ) : (
        <>
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-fade-up">
              <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
                <h3 className="heading-3" style={{ marginBottom: 'var(--space-6)' }}>Active Policies</h3>
                {policies.length === 0 ? (
                  <p className="text-muted">You have no active policies.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                          <th style={{ padding: 'var(--space-4) 0', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Insurer</th>
                          <th style={{ padding: 'var(--space-4) 0', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan</th>
                          <th style={{ padding: 'var(--space-4) 0', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                          <th style={{ padding: 'var(--space-4) 0', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>End Date</th>
                          <th style={{ padding: 'var(--space-4) 0', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {policies.map(policy => (
                          <tr key={policy.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: 'var(--space-4) 0', fontWeight: 500, color: 'var(--text-primary)' }}>{policy.insurer}</td>
                            <td style={{ padding: 'var(--space-4) 0', color: 'var(--text-secondary)' }}>{policy.planName}</td>
                            <td style={{ padding: 'var(--space-4) 0', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{policy.vertical}</td>
                            <td style={{ padding: 'var(--space-4) 0', color: 'var(--text-secondary)' }}>{new Date(policy.endDate).toLocaleDateString()}</td>
                            <td style={{ padding: 'var(--space-4) 0' }}>
                              <span className={`badge ${policy.status === 'EXPIRING_SOON' ? 'badge-error' : 'badge-success'}`}>
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
                <h3 className="heading-3" style={{ marginBottom: 'var(--space-6)' }}>My Quotes (Pending)</h3>
                {quotes.length === 0 ? (
                  <p className="text-muted">You haven't requested any quotes yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <tbody>
                        {quotes.map(quote => (
                          <tr key={quote.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: 'var(--space-4) 0', color: 'var(--text-secondary)' }}>{new Date(quote.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: 'var(--space-4) 0', textTransform: 'capitalize', color: 'var(--text-primary)' }}>{quote.vertical} Insurance</td>
                            <td style={{ padding: 'var(--space-4) 0' }}><span className={`badge ${quote.status === 'CONVERTED' ? 'badge-success' : 'badge-primary'}`}>{quote.status}</span></td>
                            <td style={{ padding: 'var(--space-4) 0', textAlign: 'right' }}>
                              {quote.status === 'NEW' && (
                                <button onClick={() => router.push('/compare')} className="btn btn-primary btn-sm">Review comparison</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="animate-fade-up">
              <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
                <h3 className="heading-3" style={{ marginBottom: 'var(--space-2)' }}>Policy Vault</h3>
                <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>Download your official policy documents, health cards, and tax receipts.</p>

                {policies.length === 0 ? (
                  <p className="text-muted text-center" style={{ padding: 'var(--space-8)' }}>No verified policy documents have been added.</p>
                ) : (
                  <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {policies.map(policy => (
                      <div key={policy.id} className="card" style={{ padding: 'var(--space-6)' }}>
                        <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-1)', color: 'var(--text-primary)' }}>{policy.insurer}</h4>
                        <p className="text-muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>{policy.planName} ({policy.vertical})</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                          <button onClick={() => downloadMockDocument('Policy_Document.pdf')} className="btn btn-secondary" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)' }}>
                            <span>📄 Policy PDF</span> <span>↓</span>
                          </button>
                          
                          {policy.vertical === 'health' && (
                            <button onClick={() => downloadMockDocument('E-Health_Card.pdf')} className="btn btn-secondary" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)' }}>
                              <span>💳 E-Health Card</span> <span>↓</span>
                            </button>
                          )}
                          
                          <button onClick={() => downloadMockDocument('Tax_Certificate.pdf')} className="btn btn-secondary" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)' }}>
                            <span>🧾 Tax Certificate</span> <span>↓</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: WELLNESS */}
          {activeTab === 'wellness' && (
            <div className="animate-fade-up">
              <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.12) 100%)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                  <div>
                    <h3 className="heading-3" style={{ color: 'var(--success)' }}>🌿 Wellness Hub</h3>
                    <p className="text-muted">Use your active health policy to book discounted check-ups.</p>
                  </div>
                  <button onClick={() => setAppointmentModal({ show: true })} className="btn btn-success">
                    Book Appointment
                  </button>
                </div>

                {appointments.length > 0 ? (
                  <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                    {appointments.map(appt => (
                      <div key={appt.id} className="card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', padding: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                          <span style={{ fontSize: 'var(--text-lg)' }}>{appt.type === 'HEALTH_CHECKUP' ? '🩺' : '👨‍⚕️'}</span>
                          <h4 style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{appt.type.replace('_', ' ')}</h4>
                        </div>
                        <p style={{ fontWeight: 500, marginBottom: 'var(--space-1)', color: 'var(--text-secondary)' }}>{appt.providerName}</p>
                        <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>{new Date(appt.date).toLocaleDateString()}</p>
                        <div style={{ marginTop: 'var(--space-4)' }}>
                          <span className={`badge ${appt.status === 'SCHEDULED' ? 'badge-success' : 'badge-error'}`}>{appt.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center" style={{ padding: 'var(--space-8)' }}>You have no appointments. Book one today!</p>
                )}
              </div>
            </div>
          )}

          {/* TAB: SUPPORT */}
          {activeTab === 'support' && (
            <div className="animate-fade-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h3 className="heading-3">Help & Support Tickets</h3>
                <button onClick={() => setTicketModal({ show: true })} className="btn btn-primary">Raise a Ticket</button>
              </div>

              {tickets.length === 0 ? (
                <div className="card text-center" style={{ padding: 'var(--space-20) var(--space-4)' }}>
                  <p className="text-muted">You have no active support tickets.</p>
                </div>
              ) : (
                <div className="card">
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                        <th style={{ padding: 'var(--space-4) 0', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket ID</th>
                        <th style={{ padding: 'var(--space-4) 0', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</th>
                        <th style={{ padding: 'var(--space-4) 0', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                        <th style={{ padding: 'var(--space-4) 0', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map(ticket => (
                        <tr key={ticket.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: 'var(--space-4) 0', fontSize: 'var(--text-xs)', fontFamily: 'monospace', color: 'var(--text-tertiary)' }}>#{ticket.id.substring(0,8)}</td>
                          <td style={{ padding: 'var(--space-4) 0', fontWeight: 500, color: 'var(--text-primary)' }}>{ticket.subject}</td>
                          <td style={{ padding: 'var(--space-4) 0', color: 'var(--text-secondary)' }}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: 'var(--space-4) 0' }}>
                            <span className={`badge ${ticket.status === 'OPEN' ? 'badge-primary' : 'badge-success'}`}>{ticket.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* --- MODALS --- */}
      
      {/* Payment/Renewal Modal */}
      {paymentModal?.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 'var(--z-modal-backdrop)', padding: 'var(--space-4)' }}>
          <div className="card animate-fade-up" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-8)', textAlign: 'center', background: 'var(--bg-surface)' }}>
            <h2 className="heading-2" style={{ marginBottom: 'var(--space-4)' }}>{paymentModal.type === 'buy' ? 'Buy Policy' : 'Renew Policy'}</h2>
            <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>Redirecting to secure payment gateway (eSewa/Khalti)...</p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
              <button onClick={() => setPaymentModal(null)} className="btn btn-secondary" disabled={loading}>Cancel</button>
              <button onClick={processSimulatedPayment} className="btn btn-success" disabled={loading}>
                {loading ? 'Processing...' : 'Simulate Success'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {appointmentModal?.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 'var(--z-modal-backdrop)', padding: 'var(--space-4)' }}>
          <div className="card animate-fade-up" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-8)', background: 'var(--bg-surface)' }}>
            <h2 className="heading-3" style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>Book Appointment</h2>
            <form onSubmit={handleBookAppointment}>
              <div className="input-group">
                <label className="input-label">Appointment Type</label>
                <select className="input-field" value={appointmentForm.type} onChange={e => setAppointmentForm(prev => ({...prev, type: e.target.value}))} required>
                  <option value="OPD_CONSULTATION">OPD Consultation</option>
                  <option value="HEALTH_CHECKUP">Annual Health Check-up</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Healthcare Provider</label>
                <select className="input-field" value={appointmentForm.providerName} onChange={e => setAppointmentForm(prev => ({...prev, providerName: e.target.value}))} required>
                  <option value="Grandee International Hospital">Grandee International Hospital</option>
                  <option value="Nepal Mediciti Hospital">Nepal Mediciti Hospital</option>
                  <option value="Vayodha Hospital">Vayodha Hospital</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Preferred Date</label>
                <input type="date" className="input-field" value={appointmentForm.date} onChange={e => setAppointmentForm(prev => ({...prev, date: e.target.value}))} min={new Date().toISOString().split('T')[0]} required />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <button type="button" onClick={() => setAppointmentModal(null)} className="btn btn-secondary" style={{ flex: 1 }} disabled={loading}>Cancel</button>
                <button type="submit" className="btn btn-success" style={{ flex: 1 }} disabled={loading}>{loading ? 'Booking...' : 'Confirm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {ticketModal?.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 'var(--z-modal-backdrop)', padding: 'var(--space-4)' }}>
          <div className="card animate-fade-up" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-8)', background: 'var(--bg-surface)' }}>
            <h2 className="heading-3" style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>Raise a Ticket</h2>
            <form onSubmit={handleCreateTicket}>
              <div className="input-group">
                <label className="input-label">Subject</label>
                <input type="text" className="input-field" placeholder="e.g. Endorsement Request" value={ticketForm.subject} onChange={e => setTicketForm(prev => ({...prev, subject: e.target.value}))} required />
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea className="input-field" rows={4} placeholder="How can we help?" value={ticketForm.description} onChange={e => setTicketForm(prev => ({...prev, description: e.target.value}))} required />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <button type="button" onClick={() => setTicketModal(null)} className="btn btn-secondary" style={{ flex: 1 }} disabled={loading}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
