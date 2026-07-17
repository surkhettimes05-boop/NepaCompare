import Link from 'next/link';
import './page.css';

export default function Home() {
  return (
    <div className="home-container">
      {/* 4. Hero Section */}
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
                  Find the best policies for Motor, Health, and Life from top insurers. Save time, save money, and buy with confidence.
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

              {/* Trust Indicators */}
              <div className="trust-indicators text-muted">
                <span className="trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> No spam calls</span>
                <span className="trust-dot">•</span>
                <span className="trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> No hidden fees</span>
                <span className="trust-dot">•</span>
                <span className="trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Free comparison</span>
              </div>
            </div>

            {/* Live Comparison Visual */}
            <div className="hero-visual">
              <div className="policy-widget-container">
                
                {/* Back Card (Context) */}
                <div className="widget-card widget-back animate-slide-left">
                  <div className="widget-header">
                    <div className="insurer-info">
                      <div className="insurer-logo-mock logo-neco">N</div>
                      <div>
                        <div className="insurer-name">Neco Insurance</div>
                        <div className="policy-type text-muted">Comprehensive Motor</div>
                      </div>
                    </div>
                    <div className="policy-price text-muted">NPR 11,500<span className="term">/yr</span></div>
                  </div>
                  {/* Empty body to ensure front card doesn't cover text */}
                  <div className="widget-spacer"></div>
                </div>

                {/* Front Card (Winner) */}
                <div className="widget-card widget-front animate-slide-up">
                  <div className="widget-meta">
                    <div className="live-badge">
                      <span className="live-dot"></span> Updated live
                    </div>
                    <div className="best-value-badge">★ BEST VALUE</div>
                  </div>
                  
                  <div className="widget-header">
                    <div className="insurer-info">
                      <div className="insurer-logo-mock logo-shikhar">S</div>
                      <div>
                        <div className="insurer-name highlight-blue">Shikhar Insurance</div>
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
                      <span className="detail-val">42+ Network</span>
                    </div>
                  </div>

                  <div className="widget-footer">
                    <div className="savings-tag">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      You save NPR 2,300
                    </div>
                    <button className="btn btn-primary btn-small">Select</button>
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

      {/* 5. Trust Stats Row */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">14+</div>
              <div className="stat-label">Insurers Partnered</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">10,000+</div>
              <div className="stat-label">Customers Trust Us</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Claims Support Included</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">100%</div>
              <div className="stat-label">Best Price Guaranteed</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Vertical Selector Grid */}
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

      {/* 8. Why NepaCompare */}
      <section className="advantage-section">
        <div className="container">
          <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '3rem' }}>The NepaCompare Advantage</h2>
          <div className="advantage-grid">
            <div className="advantage-card">
              <div className="adv-icon">🛡️</div>
              <h3 className="heading-3">Unbiased Comparison</h3>
              <p className="text-muted">We don't play favorites. See all policies side-by-side transparently.</p>
            </div>
            <div className="advantage-card">
              <div className="adv-icon">💰</div>
              <h3 className="heading-3">Best Price Guaranteed</h3>
              <p className="text-muted">Zero hidden fees or agent commissions. What you see is what you pay.</p>
            </div>
            <div className="advantage-card">
              <div className="adv-icon">🤝</div>
              <h3 className="heading-3">Dedicated Claims Support</h3>
              <p className="text-muted">Our experts guide you through the claims process when you need it most.</p>
            </div>
            <div className="advantage-card">
              <div className="adv-icon">🏛️</div>
              <h3 className="heading-3">NIA Regulated</h3>
              <p className="text-muted">Fully compliant with the Nepal Insurance Authority regulations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Insurer Partner Marquee */}
      <section className="partners-section">
        <div className="container">
          <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>Leading insurers we work with</p>
          <div className="marquee">
            <div className="marquee-content">
              {/* Placeholders for actual logos */}
              <div className="partner-logo">Shikhar Insurance</div>
              <div className="partner-logo">Neco Insurance</div>
              <div className="partner-logo">NLG Insurance</div>
              <div className="partner-logo">Sagarmatha</div>
              <div className="partner-logo">Sanima Reliance</div>
              <div className="partner-logo">Himalayan Life</div>
              {/* Duplicate for infinite scroll illusion */}
              <div className="partner-logo">Shikhar Insurance</div>
              <div className="partner-logo">Neco Insurance</div>
              <div className="partner-logo">NLG Insurance</div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Customer Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '3rem' }}>Don't just take our word for it</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="quote">"Saved Rs. 2,000 on my bike renewal without having to talk to a single agent. The whole process took 5 minutes."</p>
              <div className="author">
                <div className="author-name">Rabin K.</div>
                <div className="author-detail">Motor Insurance Customer</div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="quote">"Finally, a clear breakdown of health insurance policies in Nepal. I understood exactly what my family was covered for."</p>
              <div className="author">
                <div className="author-name">Sita M.</div>
                <div className="author-detail">Health Insurance Customer</div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="quote">"The claims support was incredible. They helped me file all the paperwork when my car was damaged."</p>
              <div className="author">
                <div className="author-name">Dipendra S.</div>
                <div className="author-detail">Motor Insurance Customer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
