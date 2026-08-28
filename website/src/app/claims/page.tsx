import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Insurance Claims Help', description: 'Understand the first steps for reporting an insurance claim and finding insurer support.', alternates: { canonical: '/claims' } };

export default function ClaimsPage() {
  return <div className="container" style={{ maxWidth: 860, paddingTop: '4rem', paddingBottom: '5rem' }}>
    <p style={{ color: 'var(--primary-accent)', fontWeight: 700 }}>CLAIMS HELP</p><h1 className="heading-1">Report the event to your insurer promptly</h1>
    <p className="text-muted" style={{ margin: '1rem 0 2rem', fontSize: '1.1rem' }}>Khaacho does not decide or process claims. The insurer’s policy wording and instructions control.</p>
    <div style={{ display: 'grid', gap: '1rem' }}>
      <section className="card" style={{ padding: '1.5rem' }}><h2 className="heading-3">Immediate steps</h2><ol className="text-muted" style={{ paddingLeft: '1.2rem', marginTop: '.75rem' }}><li>Prioritize safety and contact emergency services where needed.</li><li>Notify the insurer using the number on the policy schedule.</li><li>Record the claim reference and representative’s name.</li><li>Preserve photographs, reports, receipts and damaged property where safe.</li><li>Do not admit liability or authorize non-emergency repairs before insurer guidance.</li></ol></section>
      <section className="card" style={{ padding: '1.5rem' }}><h2 className="heading-3">Common documents</h2><p className="text-muted">Policy schedule, identification, vehicle registration and licence where applicable, police report where required, photographs, estimates, invoices and the insurer’s claim form.</p></section>
      <section className="card" style={{ padding: '1.5rem' }}><h2 className="heading-3">Escalation</h2><p className="text-muted">First use the insurer’s complaint process. Keep written records and deadlines. For independent regulatory escalation, use only contact details published by the Nepal Insurance Authority.</p><Link href="/contact" className="btn btn-outline" style={{ marginTop: '1rem' }}>Ask Khaacho for navigation help</Link></section>
    </div>
  </div>;
}
