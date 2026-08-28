import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Account Recovery', robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return <div className="container" style={{ maxWidth: 560, paddingTop: '4rem', paddingBottom: '5rem' }}><section className="card" style={{ padding: '2rem' }}>
    <h1 className="heading-2">Recover your account</h1><p className="text-muted" style={{ margin: '1rem 0' }}>Automated password reset is being connected. For now, support can begin a verified recovery request but will never ask for your existing password.</p>
    <a className="btn btn-primary" href="mailto:support@khaacho.com?subject=Account%20recovery%20request">Contact account support</a>
    <p className="text-muted" style={{ marginTop: '1rem', fontSize: '.85rem' }}>For safety, do not send identity documents until support provides the approved secure process.</p><p style={{ marginTop: '1rem' }}><Link href="/login">Return to sign in</Link></p>
  </section></div>;
}
