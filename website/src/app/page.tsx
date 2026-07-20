import Link from 'next/link';
import './page.css';

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section animate-fade-up">
        <div className="container">
          
          <div className="hero-grid">
            {/* Thesis Statement & CTAs */}
            <div className="hero-content-stack">
              <div className="hero-text">
                <h1 className="heading-1">
                  No agent calls.<br/>
                  No fine print surprises.
                </h1>
                <p className="hero-subtitle text-muted">
                  Compare indicative pricing for Motor, Health, and Life insurance from insurers in Nepal. Free to use. No signup required to browse.
                </p>
              </div>

              {/* Primary Actions */}
              <div className="hero-actions">
                <Link href="/compare" className="btn btn-primary btn-large">
                  Compare Plans
                </Link>
                <Link href="/how-it-works" className="btn btn-ghost btn-large">
                  How it works
                </Link>
              </div>

              {/* Trust Indicators — only factual process claims */}
              <div className="trust-indicators text-muted">
                <span className="trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> No spam calls</span>
                <span className="trust-dot">•</span>
                <span className="trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> No hidden fees</span>
                <span className="trust-dot">•</span>
                <span className="trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Free comparison</span>
              </div>
            </div>

            {/* Illustrative Comparison Visual */}
            <div className="hero-visual">
              <div className="policy-widget-container">
                
                {/* Back Card */}
                <div className="widget-card widget-back animate-slide-left">
                  <div className="widget-header">
                    <div className="insurer-info">
                      <div className="insurer-logo-mock logo-neco">A</div>
                      <div>
                        <div className="insurer-name">Insurer A</div>
                        <div className="policy-type text-muted">Comprehensive Motor</div>
                      </div>
                    </div>
                    <div className="policy-price text-muted">NPR 11,500<span className="term">/yr</span></div>
                  </div>
                  <div className="widget-spacer"></div>
                </div>

                {/* Front Card */}
                <div className="widget-card widget-front animate-slide-up">
                  <div className="widget-meta">
                    <div className="live-badge">
                      <span className="live-dot"></span> Example
                    </div>
                    <div className="best-value-badge">★ LOWER PRICE</div>
                  </div>
                  
                  <div className="widget-header">
                    <div className="insurer-info">
                      <div className="insurer-logo-mock logo-shikhar">B</div>
                      <div>
                        <div className="insurer-name highlight-blue">Insurer B</div>
                        <div className="policy-type text-muted">Comprehensive Motor</div>
                      </div>
                    </div>
                    <div className="price-block">
                      <div className="policy-price highlight-green">NPR 9,200<span className="term text-muted">/yr</span></div>
                    </div>
                  </div>

                  <div className="widget-details">
                    <div className="detail-row">
                      <span className="text-muted">Coverage</span>
                      <span className="detail-val">Full Third-Party & Own Damage</span>
                    </div>
                    <div className="detail-row">
                      <span className="text-muted">Cashless Garages</span>
                      <span className="detail-val">Network varies by insurer</span>
                    </div>
                  </div>

                  <div className="widget-footer">
                    <div className="savings-tag">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      Illustrative — actual quotes may vary
                    </div>
                    <button className="btn btn-primary btn-small">Compare Now</button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Signature Horizon Line */}
          <div className="signature-divider">
            <div className="blue-accent-line"></div>
          </div>
        </div>
      </section>

      {/* Early Access Banner — replaces fabricated stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">Free</div>
              <div className="stat-label">Always free to compare</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">3</div>
              <div className="stat-label">Insurance verticals covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">Early</div>
              <div className="stat-label">Access — platform in beta</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Agent commissions charged</div>
            </div>
          </div>
        </div>
      </section>

      {/* Vertical Selector Grid */}
      <section className="category-section">
        <div className="container vertical-selector">
          <h2 className="heading-3" style={{ textAlign: 'center', marginBottom: '2rem' }}>What do you want to insure?</h2>
          
          <div className="vertical-grid">
            <Link href="/motor" className="vertical-card">
              <div className="icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 18H3c-.6 0-1-.4-1-1v-4c0-1.7 1.3-3 3-3h1.5l2-4.5c.3-.6 1-1 1.7-1h7.6c.7 0 1.4.4 1.7 1l2 4.5H22c1.7 0 3 1.3 3 3v4c0 .6-.4 1-1 1h-2"/>
                  <circle cx="7.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <h3>Motor</h3>
              <p className="text-muted">Two & Four-wheeler</p>
            </Link>

            <Link href="/health" className="vertical-card">
              <div className="icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
                <svg style={{position: 'absolute', top: '10px', left: '10px'}} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <h3>Health</h3>
              <p className="text-muted">Family & Individual</p>
            </Link>

            <Link href="/life" className="vertical-card">
              <div className="icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4" stroke="var(--success)"/>
                </svg>
              </div>
              <h3>Life / Term</h3>
              <p className="text-muted">Secure your family's future</p>
            </Link>

            <Link href="/travel" className="vertical-card">
              <div className="icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 13.29c.14-.14.21-.33.21-.52 0-.2-.07-.39-.21-.52l-2-2a.75.75 0 0 0-1.06 1.06L20.18 12.5H16v-6c0-1.1-.9-2-2-2h-2.5a.5.5 0 0 0-.5.5v7.5H4a2 2 0 0 0 0 4h7v7.5a.5.5 0 0 0 .5.5H14c1.1 0 2-.9 2-2v-6h4.18l-1.24 1.24a.75.75 0 0 0 1.06 1.06l2-2Z"/>
                </svg>
              </div>
              <h3>Travel</h3>
              <p className="text-muted">International trips</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Why NepaCompare — removed NIA Regulated card */}
      <section className="advantage-section">
        <div className="container">
          <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '3rem' }}>The NepaCompare Advantage</h2>
          <div className="advantage-grid">
            <div className="advantage-card">
              <div className="adv-icon">🛡️</div>
              <h3 className="heading-3">Unbiased Comparison</h3>
              <p className="text-muted">We don't play favorites. See indicative policy pricing side-by-side so you can make an informed decision.</p>
            </div>
            <div className="advantage-card">
              <div className="adv-icon">💰</div>
              <h3 className="heading-3">No Agent Commissions</h3>
              <p className="text-muted">We charge you nothing to compare. Final premiums are set by the insurer — no markup from us.</p>
            </div>
            <div className="advantage-card">
              <div className="adv-icon">📋</div>
              <h3 className="heading-3">Transparent Process</h3>
              <p className="text-muted">We surface the information you need to compare policies yourself — without pressure from a sales agent.</p>
            </div>
            <div className="advantage-card">
              <div className="adv-icon">🚀</div>
              <h3 className="heading-3">Early Access</h3>
              <p className="text-muted">NepaCompare is in early access. We're actively building our insurer network. Pricing shown is indicative.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners section removed — no confirmed partnerships yet */}
      {/* Testimonials section removed — no real, consented customer stories yet */}

    </div>
  );
}
