import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { customersSeed } from '../lib/crmData';

const currentUser = {
  name: 'Aarati Shah',
  scope: ['KTM', 'BKT'],
};

export default function CustomerProfile() {
  const { id } = useParams();

  const customer = useMemo(() => customersSeed.find((entry) => entry.id === id), [id]);

  if (!customer) {
    return <div className="card"><h2>Customer not found</h2></div>;
  }

  const hasAccess = customer.scope.some((area) => currentUser.scope.includes(area));

  if (!hasAccess) {
    return (
      <div className="card access-card">
        <h2>Access restricted</h2>
        <p>This customer sits outside your permitted scope. Sensitive customer records are protected.</p>
        <Link to="/customers" className="btn btn-primary">Back to customers</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Customer Profile</p>
          <h1>{customer.name}</h1>
        </div>
        <Link to="/customers" className="btn btn-primary">Back to customers</Link>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <h3>Personal information</h3>
          <ul className="detail-list">
            <li><span>Email</span><strong>{customer.email}</strong></li>
            <li><span>Phone</span><strong>{customer.phone}</strong></li>
            <li><span>Tier</span><strong>{customer.customerTier}</strong></li>
            <li><span>Scope</span><strong>{customer.scope.join(', ')}</strong></li>
          </ul>
        </div>

        <div className="card">
          <h3>Vehicles</h3>
          {customer.vehicles.map((vehicle) => (
            <ul key={`${vehicle.registration}-${vehicle.model}`} className="detail-list">
              <li><span>Make / Model</span><strong>{vehicle.make} {vehicle.model}</strong></li>
              <li><span>Registration</span><strong>{vehicle.registration}</strong></li>
              <li><span>Year</span><strong>{vehicle.year}</strong></li>
              <li><span>Policy status</span><strong>{vehicle.policyStatus}</strong></li>
            </ul>
          ))}
        </div>

        <div className="card">
          <h3>Quick portfolio</h3>
          <ul className="detail-list">
            <li><span>Leads</span><strong>{customer.leads.length}</strong></li>
            <li><span>Quotes</span><strong>{customer.quotes.length}</strong></li>
            <li><span>Applications</span><strong>{customer.applications.length}</strong></li>
            <li><span>Policies</span><strong>{customer.policies.length}</strong></li>
            <li><span>Renewals</span><strong>{customer.renewals.length}</strong></li>
            <li><span>Claims</span><strong>{customer.claims.length}</strong></li>
          </ul>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Leads</h3>
          <div className="stack-list">
            {customer.leads.map((lead) => <span key={lead} className="tag">{lead}</span>)}
          </div>
        </div>
        <div className="card">
          <h3>Quotes</h3>
          <div className="stack-list">
            {customer.quotes.map((quote) => <span key={quote} className="tag">{quote}</span>)}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Applications</h3>
          <div className="stack-list">
            {customer.applications.map((application) => <span key={application} className="tag">{application}</span>)}
          </div>
        </div>
        <div className="card">
          <h3>Policies</h3>
          <div className="stack-list">
            {customer.policies.map((policy) => <span key={policy} className="tag">{policy}</span>)}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Renewals</h3>
          <div className="stack-list">
            {customer.renewals.map((renewal) => <span key={renewal} className="tag">{renewal}</span>)}
          </div>
        </div>
        <div className="card">
          <h3>Claims</h3>
          <div className="stack-list">
            {customer.claims.length ? customer.claims.map((claim) => <span key={claim} className="tag">{claim}</span>) : <span className="muted-text">No claims on file.</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Documents</h3>
          <div className="stack-list">
            {customer.documents.map((document) => <span key={document} className="tag">{document}</span>)}
          </div>
        </div>
        <div className="card">
          <h3>Notes</h3>
          <ul className="note-list">
            {customer.notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Communication history</h3>
          <ul className="timeline-list">
            {customer.communicationHistory.map((entry) => (
              <li key={`${entry.timestamp}-${entry.summary}`}>
                <strong>{entry.channel}</strong>
                <span>{entry.summary}</span>
                <small>{entry.direction} • {new Date(entry.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Audit history</h3>
          <ul className="timeline-list">
            {customer.auditHistory.map((entry) => (
              <li key={`${entry.action}-${entry.timestamp}`}>
                <strong>{entry.action}</strong>
                <span>{entry.detail}</span>
                <small>{entry.actor} • {new Date(entry.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
