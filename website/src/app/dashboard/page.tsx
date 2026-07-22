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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-2" style={{ marginBottom: '0.25rem' }}>Unified Digital Locker</h1>
          <p className="text-muted">Manage your policies, documents, and wellness in one secure place.</p>
        </div>
        <button onClick={handleLogout} className="btn" style={{ border: '1px solid var(--border-color)', background: 'transparent' }}>Logout</button>
      </div>

      {/* RENEWAL ALERTS (Always visible at top if urgent) */}
      {expiringPolicies.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="heading-3" style={{ marginBottom: '1rem', color: 'var(--accent-red)' }}>🚨 Urgent: Expiring Policies</h3>
          {expiringPolicies.map(policy => (
            <div key={policy.id} className="card" style={{ border: '2px solid var(--accent-red)', background: 'rgba(239, 68, 68, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-color)' }}>{policy.insurer} - {policy.planName}</h4>
                <p className="text-muted" style={{ margin: '0.25rem 0' }}>Expires on: <strong>{new Date(policy.endDate).toLocaleDateString()}</strong></p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '0.5rem' }}>NPR {policy.premium.toLocaleString()}</p>
                <button onClick={() => setPaymentModal({ show: true, type: 'renew', id: policy.id })} className="btn btn-primary" style={{ background: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>
                  1-Click Renew
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-color)', marginBottom: '2rem', overflowX: 'auto' }}>
        {['overview', 'documents', 'wellness', 'support'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid var(--primary-color)' : '3px solid transparent',
              color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-muted)',
              fontWeight: activeTab === tab ? 600 : 500,
              fontSize: '1rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {loading ? (
        <p className="text-center text-muted" style={{ padding: '3rem' }}>Loading your secure vault...</p>
      ) : (
        <>
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-fade-up">
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 className="heading-3" style={{ marginBottom: '1.5rem' }}>Active Policies</h3>
                {policies.length === 0 ? (
                  <p className="text-muted">You have no active policies.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <th style={{ padding: '1rem 0' }}>Insurer</th>
                          <th style={{ padding: '1rem 0' }}>Plan</th>
                          <th style={{ padding: '1rem 0' }}>Type</th>
                          <th style={{ padding: '1rem 0' }}>End Date</th>
                          <th style={{ padding: '1rem 0' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {policies.map(policy => (
                          <tr key={policy.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '1rem 0', fontWeight: 500 }}>{policy.insurer}</td>
                            <td style={{ padding: '1rem 0' }}>{policy.planName}</td>
                            <td style={{ padding: '1rem 0', textTransform: 'capitalize' }}>{policy.vertical}</td>
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
                <h3 className="heading-3" style={{ marginBottom: '1.5rem' }}>My Quotes (Pending)</h3>
                {quotes.length === 0 ? (
                  <p className="text-muted">You haven't requested any quotes yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <tbody>
                        {quotes.map(quote => (
                          <tr key={quote.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '1rem 0' }}>{new Date(quote.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '1rem 0', textTransform: 'capitalize' }}>{quote.vertical} Insurance</td>
                            <td style={{ padding: '1rem 0' }}><span className={`badge ${quote.status === 'CONVERTED' ? 'badge-success' : 'badge-new'}`}>{quote.status}</span></td>
                            <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                              {quote.status === 'NEW' && (
                                <button onClick={() => setPaymentModal({ show: true, type: 'buy', id: quote.id })} className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Buy Policy</button>
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
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>Policy Vault</h3>
                <p className="text-muted" style={{ marginBottom: '2rem' }}>Download your official policy documents, health cards, and tax receipts.</p>

                {policies.length === 0 ? (
                  <p className="text-muted text-center" style={{ padding: '2rem' }}>No documents available. Buy a policy first!</p>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {policies.map(policy => (
                      <div key={policy.id} style={{ border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '1.5rem', background: 'var(--bg-card)' }}>
                        <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{policy.insurer}</h4>
                        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>{policy.planName} ({policy.vertical})</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <button onClick={() => downloadMockDocument('Policy_Document.pdf')} className="btn btn-outline" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
                            <span>📄 Policy PDF</span> <span>↓</span>
                          </button>
                          
                          {policy.vertical === 'health' && (
                            <button onClick={() => downloadMockDocument('E-Health_Card.pdf')} className="btn btn-outline" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
                              <span>💳 E-Health Card</span> <span>↓</span>
                            </button>
                          )}
                          
                          <button onClick={() => downloadMockDocument('Tax_Certificate.pdf')} className="btn btn-outline" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
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
              <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.1) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 className="heading-3" style={{ color: 'var(--success)' }}>🌿 Wellness Hub</h3>
                    <p className="text-muted">Use your active health policy to book discounted check-ups.</p>
                  </div>
                  <button onClick={() => setAppointmentModal({ show: true })} className="btn btn-primary" style={{ background: 'var(--success)', borderColor: 'var(--success)' }}>
                    Book Appointment
                  </button>
                </div>

                {appointments.length > 0 ? (
                  <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                    {appointments.map(appt => (
                      <div key={appt.id} className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>{appt.type === 'HEALTH_CHECKUP' ? '🩺' : '👨‍⚕️'}</span>
                          <h4 style={{ fontWeight: 600, fontSize: '0.9rem' }}>{appt.type.replace('_', ' ')}</h4>
                        </div>
                        <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{appt.providerName}</p>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>{new Date(appt.date).toLocaleDateString()}</p>
                        <div style={{ marginTop: '1rem' }}>
                          <span className={`badge ${appt.status === 'SCHEDULED' ? 'badge-success' : 'badge-lost'}`}>{appt.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center" style={{ padding: '2rem' }}>You have no appointments. Book one today!</p>
                )}
              </div>
            </div>
          )}

          {/* TAB: SUPPORT */}
          {activeTab === 'support' && (
            <div className="animate-fade-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="heading-3">Help & Support Tickets</h3>
                <button onClick={() => setTicketModal({ show: true })} className="btn btn-primary">Raise a Ticket</button>
              </div>

              {tickets.length === 0 ? (
                <div className="card text-center" style={{ padding: '3rem 1rem' }}>
                  <p className="text-muted">You have no active support tickets.</p>
                </div>
              ) : (
                <div className="card">
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '1rem 0' }}>Ticket ID</th>
                        <th style={{ padding: '1rem 0' }}>Subject</th>
                        <th style={{ padding: '1rem 0' }}>Date</th>
                        <th style={{ padding: '1rem 0' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map(ticket => (
                        <tr key={ticket.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '1rem 0', fontSize: '0.85rem', fontFamily: 'monospace' }}>#{ticket.id.substring(0,8)}</td>
                          <td style={{ padding: '1rem 0', fontWeight: 500 }}>{ticket.subject}</td>
                          <td style={{ padding: '1rem 0' }}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: '1rem 0' }}>
                            <span className={`badge ${ticket.status === 'OPEN' ? 'badge-new' : 'badge-success'}`}>{ticket.status}</span>
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', textAlign: 'center', background: 'var(--bg-card)' }}>
            <h2 className="heading-2" style={{ marginBottom: '1rem' }}>{paymentModal.type === 'buy' ? 'Buy Policy' : 'Renew Policy'}</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Redirecting to secure payment gateway (eSewa/Khalti)...</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => setPaymentModal(null)} className="btn btn-secondary" disabled={loading}>Cancel</button>
              <button onClick={processSimulatedPayment} className="btn btn-primary" style={{ background: 'var(--success)', borderColor: 'var(--success)' }} disabled={loading}>
                {loading ? 'Processing...' : 'Simulate Success'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {appointmentModal?.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card animate-fade-up" style={{ width: '100%', maxWidth: '400px', padding: '2rem', background: 'var(--bg-card)' }}>
            <h2 className="heading-3" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Book Appointment</h2>
            <form onSubmit={handleBookAppointment}>
              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label className="input-label">Appointment Type</label>
                <select className="input-field" value={appointmentForm.type} onChange={e => setAppointmentForm(prev => ({...prev, type: e.target.value}))} required>
                  <option value="OPD_CONSULTATION">OPD Consultation</option>
                  <option value="HEALTH_CHECKUP">Annual Health Check-up</option>
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label className="input-label">Healthcare Provider</label>
                <select className="input-field" value={appointmentForm.providerName} onChange={e => setAppointmentForm(prev => ({...prev, providerName: e.target.value}))} required>
                  <option value="Grandee International Hospital">Grandee International Hospital</option>
                  <option value="Nepal Mediciti Hospital">Nepal Mediciti Hospital</option>
                  <option value="Vayodha Hospital">Vayodha Hospital</option>
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: '2rem' }}>
                <label className="input-label">Preferred Date</label>
                <input type="date" className="input-field" value={appointmentForm.date} onChange={e => setAppointmentForm(prev => ({...prev, date: e.target.value}))} min={new Date().toISOString().split('T')[0]} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setAppointmentModal(null)} className="btn btn-secondary" style={{ flex: 1 }} disabled={loading}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, background: 'var(--success)', borderColor: 'var(--success)' }} disabled={loading}>{loading ? 'Booking...' : 'Confirm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {ticketModal?.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card animate-fade-up" style={{ width: '100%', maxWidth: '400px', padding: '2rem', background: 'var(--bg-card)' }}>
            <h2 className="heading-3" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Raise a Ticket</h2>
            <form onSubmit={handleCreateTicket}>
              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label className="input-label">Subject</label>
                <input type="text" className="input-field" placeholder="e.g. Endorsement Request" value={ticketForm.subject} onChange={e => setTicketForm(prev => ({...prev, subject: e.target.value}))} required />
              </div>
              <div className="input-group" style={{ marginBottom: '2rem' }}>
                <label className="input-label">Description</label>
                <textarea className="input-field" rows={4} placeholder="How can we help?" value={ticketForm.description} onChange={e => setTicketForm(prev => ({...prev, description: e.target.value}))} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
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
