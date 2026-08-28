import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Renew an Insurance Policy', description: 'Prepare to renew a motor, health, life or travel insurance policy in Nepal.', alternates: { canonical: '/renew' } };

export default function RenewPage() {
  return <div className="container" style={{ maxWidth: 820, paddingTop: '4rem', paddingBottom: '5rem' }}>
    <p style={{ color: 'var(--primary-accent)', fontWeight: 700 }}>POLICY SERVICE</p><h1 className="heading-1">Renew a policy</h1>
    <p className="text-muted" style={{ fontSize: '1.1rem', margin: '1rem 0 2rem' }}>Khaacho can help you prepare, but renewal is completed and confirmed by the insurer.</p>
    <section className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}><h2 className="heading-3">Already saved a policy?</h2><p className="text-muted" style={{ margin: '.6rem 0 1rem' }}>Sign in to see renewal dates and insurer details stored in your locker.</p><Link href="/dashboard" className="btn btn-primary">Open My Locker</Link></section>
    <section className="card" style={{ padding: '1.5rem' }}><h2 className="heading-3">Renew directly with your insurer</h2><ol className="text-muted" style={{ paddingLeft: '1.2rem', marginTop: '.75rem' }}><li>Find the insurer and policy number on your schedule.</li><li>Confirm expiry date, coverage and any claim history.</li><li>Ask the insurer for the renewal notice and current wording.</li><li>Pay only through an official insurer channel and retain the receipt.</li></ol><p className="text-muted" style={{ marginTop: '1rem' }}>Do not send policy documents through chat. <Link href="/contact">Request support</Link> if you cannot identify the correct insurer contact.</p></section>
  </div>;
}
