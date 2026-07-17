import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', padding: 'var(--space-2xl) 0 var(--space-xl)', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
          
          <div>
            <h4 className="heading-3" style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Nepa<span style={{ color: 'var(--primary-accent)'}}>Compare</span></h4>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Nepal's most trusted insurance comparison platform. Save time, save money, and buy with confidence.
            </p>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>Insurance</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link href="/motor" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Motor Insurance</Link></li>
              <li><Link href="/health" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Health Insurance</Link></li>
              <li><Link href="/life" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Term Life Insurance</Link></li>
              <li><Link href="/travel" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Travel Insurance</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>About Us</Link></li>
              <li><Link href="/careers" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Careers</Link></li>
              <li><Link href="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Contact Us</Link></li>
              <li><Link href="/partners" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Partner with us</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Terms of Service</Link></li>
              <li><Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Privacy Policy</Link></li>
              <li><Link href="/disclaimer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
          <p className="text-muted" style={{ fontSize: '0.75rem' }}>
            NepaCompare is a technology platform acting as an insurance comparison engine. Final premiums are determined by the respective insurers and are subject to the guidelines of the Nepal Insurance Authority (NIA).
          </p>
          <p className="text-muted" style={{ fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} NepaCompare Private Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
