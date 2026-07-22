import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', padding: 'var(--space-2xl) 0 var(--space-xl)', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
          
          <div>
            <h4 className="heading-3" style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Nepa<span style={{ color: 'var(--primary-accent)'}}>Compare</span></h4>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              An insurance comparison tool for Nepal. Compare indicative pricing across Motor, Health, and Life insurance — free, with no agent pressure.
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

        {/* SEO INTERNAL LINKING SECTION */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-xl)' }}>
            <div>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Top Cities</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><Link href="/location/kathmandu" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Insurance in Kathmandu</Link></li>
                <li><Link href="/location/pokhara" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Insurance in Pokhara</Link></li>
                <li><Link href="/location/bharatpur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Insurance in Bharatpur</Link></li>
                <li><Link href="/location/lalitpur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Insurance in Lalitpur</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Compare Insurers</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><Link href="/compare-insurers/shikhar-insurance-vs-sagarmatha-lumbini" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Shikhar vs Sagarmatha</Link></li>
                <li><Link href="/compare-insurers/nepal-insurance-vs-neco-insurance" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Nepal Ins vs Neco</Link></li>
                <li><Link href="/compare-insurers/nlg-insurance-vs-shikhar-insurance" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>NLG vs Shikhar</Link></li>
                <li><Link href="/compare-insurers/sagarmatha-lumbini-vs-neco-insurance" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Sagarmatha vs Neco</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Popular Bikes</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><Link href="/motor/bike/bajaj/pulsar-150" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Bajaj Pulsar 150</Link></li>
                <li><Link href="/motor/bike/royal-enfield/classic-350" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Royal Enfield Classic 350</Link></li>
                <li><Link href="/motor/bike/tvs/ntorq-125" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>TVS NTorq 125</Link></li>
                <li><Link href="/motor/bike/honda/dio" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Honda Dio</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Guides</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><Link href="/blog/bike-insurance-claim-process-nepal" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Bike Claim Process</Link></li>
                <li><Link href="/blog/third-party-insurance-calculation-nepal" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Third-Party Calculation</Link></li>
                <li><Link href="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>View All Articles</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
          <p className="text-muted" style={{ fontSize: '0.75rem' }}>
            NepaCompare is an independent comparison platform — not an insurer or broker. Pricing shown is indicative only. Final premiums are determined solely by the respective insurers. NepaCompare is not an agent or intermediary licensed by the Nepal Insurance Authority.
          </p>
          <p className="text-muted" style={{ fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} NepaCompare Private Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
