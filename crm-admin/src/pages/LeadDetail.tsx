import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { leadSeed, leadStatusOptions, leadPriorityOptions, staffOptions } from '../lib/crmData';

const currentUserScope = ['KTM', 'BKT'];

export default function LeadDetail() {
  const { id } = useParams();
  const lead = useMemo(() => leadSeed.find((item) => item.id === id), [id]);

  if (!lead) {
    return <div className="card"><h2>Lead not found</h2></div>;
  }

  const hasAccess = lead.scope.some((area) => currentUserScope.includes(area));

  if (!hasAccess) {
    return (
      <div className="card access-card">
        <h2>Access restricted</h2>
        <p>This lead sits outside your permitted scope and cannot be viewed.</p>
        <Link to="/leads" className="btn btn-primary">Back to leads</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Lead detail</p>
          <h1>{lead.customerName}</h1>
        </div>
        <Link to="/leads" className="btn btn-primary">Back to pipeline</Link>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <h3>Lead overview</h3>
          <ul className="detail-list">
            <li><span>Lead ID</span><strong>{lead.id}</strong></li>
            <li><span>Customer ID</span><strong>{lead.customerId}</strong></li>
            <li><span>Phone</span><strong>{lead.phone}</strong></li>
            <li><span>Email</span><strong>{lead.email}</strong></li>
            <li><span>Source</span><strong>{lead.source}</strong></li>
            <li><span>Product</span><strong>{lead.product}</strong></li>
          </ul>
        </div>

        <div className="card">
          <h3>Assignment & priority</h3>
          <ul className="detail-list">
            <li><span>Status</span><strong>{lead.status}</strong></li>
            <li><span>Priority</span><strong>{lead.priority}</strong></li>
            <li><span>Assigned to</span><strong>{lead.assignedTo}</strong></li>
            <li><span>Team</span><strong>{lead.assignedTeam}</strong></li>
            <li><span>Scope</span><strong>{lead.scope.join(', ')}</strong></li>
            <li><span>Updated</span><strong>{new Date(lead.updatedAt).toLocaleString()}</strong></li>
          </ul>
        </div>

        <div className="card">
          <h3>Customer profile</h3>
          <ul className="detail-list">
            <li><span>Date of birth</span><strong>{lead.customerProfile.dob}</strong></li>
            <li><span>Location</span><strong>{lead.customerProfile.district}, {lead.customerProfile.province}</strong></li>
            <li><span>Vehicle</span><strong>{lead.customerProfile.vehicle.make} {lead.customerProfile.vehicle.model}</strong></li>
            <li><span>Registration</span><strong>{lead.customerProfile.vehicle.registration}</strong></li>
            <li><span>Insurance need</span><strong>{lead.customerProfile.insuranceNeed}</strong></li>
          </ul>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Workflow actions</h3>
          <div className="filter-bar" style={{ marginBottom: '1rem' }}>
            <select className="input-field" defaultValue={lead.status}>
              {leadStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <select className="input-field" defaultValue={lead.priority}>
              {leadPriorityOptions.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
            <select className="input-field" defaultValue={lead.assignedTo}>
              {staffOptions.map((staff) => <option key={staff} value={staff}>{staff}</option>)}
            </select>
          </div>
          <div className="grid grid-2">
            <button className="btn btn-primary">Save status change</button>
            <button className="btn">Add note</button>
          </div>
        </div>

        <div className="card">
          <h3>Notes</h3>
          <ul className="note-list">
            {lead.notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Activity timeline</h3>
          <ul className="timeline-list">
            {lead.activity.map((entry) => (
              <li key={`${entry.timestamp}-${entry.message}`}>
                <strong>{entry.type}</strong>
                <span>{entry.message}</span>
                <small>{entry.actor} • {new Date(entry.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Communication history</h3>
          <ul className="timeline-list">
            {lead.communicationHistory.map((entry) => (
              <li key={`${entry.timestamp}-${entry.summary}`}>
                <strong>{entry.channel}</strong>
                <span>{entry.summary}</span>
                <small>{entry.direction} • {new Date(entry.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <h3>Quote history</h3>
          <ul className="timeline-list">
            {lead.quotes.map((quote) => (
              <li key={quote.id}>
                <strong>{quote.id}</strong>
                <span>{quote.insurer} — {quote.premium}</span>
                <small>{quote.status} • {quote.createdAt}</small>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Application history</h3>
          <ul className="timeline-list">
            {lead.applications.map((application) => (
              <li key={application.id}>
                <strong>{application.id}</strong>
                <span>{application.insurer}</span>
                <small>{application.status} • {application.createdAt}</small>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Policy history</h3>
          <ul className="timeline-list">
            {lead.policies.length ? lead.policies.map((policy) => (
              <li key={policy.id}>
                <strong>{policy.number}</strong>
                <span>{policy.insurer}</span>
                <small>{policy.status} • {policy.premium}</small>
              </li>
            )) : <li><span>No policies issued yet.</span></li>}
          </ul>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Audit history</h3>
          <ul className="timeline-list">
            {lead.auditTrail.map((entry) => (
              <li key={`${entry.action}-${entry.timestamp}`}>
                <strong>{entry.action}</strong>
                <span>{entry.detail}</span>
                <small>{entry.actor} • {new Date(entry.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Customer sensitive actions</h3>
          <ul className="detail-list">
            <li><span>Profile access</span><strong>Audited</strong></li>
            <li><span>Lead change</span><strong>Audited</strong></li>
            <li><span>Document upload</span><strong>Audited</strong></li>
            <li><span>Policy issuance</span><strong>Audited</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

                  className="input-field" 
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  disabled={saving} 
                  style={{ width: '100%', maxWidth: '300px' }}
                >
                  <option value="">-- Select Partner --</option>
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <button 
                  onClick={handleRoute} 
                  disabled={saving || !selectedPartner || selectedPartner === lead.partnerId}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Route
                </button>
              </div>
              {lead.partnerId && (
                <p style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', marginTop: '0.5rem', fontWeight: 500 }}>
                  Currently routed to: {lead.partner?.name || 'Unknown Partner'}
                </p>
              )}
            </div>

            {lead.statusHistory && lead.statusHistory.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Routing History</h3>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                  {lead.statusHistory.map((history: any) => (
                    <div key={history.id} style={{ marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{new Date(history.changedAt).toLocaleString()}</span>
                      <br/>
                      <strong>{history.changedBy?.name || 'System'}</strong> changed status from <em>{history.oldStatus}</em> to <em>{history.newStatus}</em>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Created: {new Date(lead.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
