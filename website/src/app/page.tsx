import Link from 'next/link';
import './page.css';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('/', 'Compare Insurance in Nepal | Motor, Health & Life', 'Compare indicative motor, health and life insurance information in Nepal and understand coverage before requesting a quote.', { alternates: { languages: { 'en-NP': '/', 'ne-NP': '/np', 'x-default': '/' } } });

export default function Home() {
  return (
    <div className="home-container">
      <section className="home-hero">
        <div className="container">
          <div className="hero-layout">
            <div className="hero-content-stack">
              <div className="hero-text">
                <p className="eyebrow">Khaacho</p>
                <h1 className="heading-1">
                  Compare insurance.<br />
                  Understand your options.<br />
                  Get assistance buying insurance.
                </h1>
                <p className="hero-subtitle text-muted">
                  Khaacho helps people in Nepal compare insurance options and get support buying the right cover for their situation.
                </p>
              </div>

              <div className="hero-actions">
                <Link href="/wizard/motor" className="btn btn-primary btn-large">
                  Get motor insurance help <span aria-hidden="true">-&gt;</span>
                </Link>
                <Link href="/how-it-works" className="btn btn-ghost btn-large">
                  How it works
                </Link>
              </div>

              <div className="trust-indicators text-muted">
                <span className="trust-item"><span className="status-dot" /> Motor-first product launch</span><span className="trust-dot">•</span><span className="trust-item">Assistance before purchase</span>
              </div>
            </div>

            <div className="hero-panel" aria-label="Insurance planning overview">
              <div className="panel-topline"><span>START WITH MOTOR</span><span className="panel-check">✓ Operational launch</span></div>
              <div className="coverage-score"><div><span className="score-label">Primary products</span><strong>Motor<br />Insurance</strong></div><div className="score-ring">4<br /><small>categories</small></div></div>
              <div className="panel-list">
                <div><span className="mini-icon blue">M</span><span>Motor Insurance</span><b>Live</b></div>
                <div><span className="mini-icon violet">T</span><span>Travel Insurance</span><b>Coming soon</b></div>
                <div><span className="mini-icon green">H</span><span>Health Insurance</span><b>Coming soon</b></div>
                <div><span className="mini-icon orange">L</span><span>Life Insurance</span><b>Coming soon</b></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="category-section">
        <div className="container">
          <div className="section-intro">
            <div>
              <p className="eyebrow">Primary products</p>
              <h2>Choose your insurance journey.</h2>
            </div>
            <p>Only motor is operational at launch. Other categories are intentionally marked as coming soon.</p>
          </div>

          <div className="category-grid">
            <Link href="/wizard/motor" className="category-card motor-card">
              <div className="icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 18H3c-.6 0-1-.4-1-1v-4c0-1.7 1.3-3 3-3h1.5l2-4.5c.3-.6 1-1 1.7-1h7.6c.7 0 1.4.4 1.7 1l2 4.5H22c1.7 0 3 1.3 3 3v4c0 .6-.4 1-1 1h-2"/>
                  <circle cx="7.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <span className="card-arrow">-&gt;</span>
              <h3>Motor Insurance</h3>
              <p>Request a vehicle insurance intake and get assistance from Khaacho.</p>
              <span className="card-link">Start motor request <span aria-hidden="true">-&gt;</span></span>
            </Link>

            <Link href="/contact" className="category-card health-card" aria-label="Travel Insurance coming soon">
              <div className="icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h18M12 3v18"/>
                </svg>
              </div>
              <span className="card-arrow">-&gt;</span>
              <h3>Travel Insurance</h3>
              <p>Coming soon / request assistance</p>
              <span className="card-link">Request assistance <span aria-hidden="true">-&gt;</span></span>
            </Link>

            <Link href="/contact" className="category-card life-card" aria-label="Health Insurance coming soon">
              <div className="icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </div>
              <span className="card-arrow">-&gt;</span>
              <h3>Health Insurance</h3>
              <p>Coming soon / request assistance</p>
              <span className="card-link">Request assistance <span aria-hidden="true">-&gt;</span></span>
            </Link>

            <Link href="/contact" className="category-card" aria-label="Life Insurance coming soon">
              <div className="icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4" stroke="var(--success)"/>
                </svg>
              </div>
              <span className="card-arrow">-&gt;</span>
              <h3>Life Insurance</h3>
              <p>Coming soon / request assistance</p>
              <span className="card-link">Request assistance <span aria-hidden="true">-&gt;</span></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="trust-strip"><div className="container trust-grid"><span><b>✓</b> Free to compare</span><span><b>✓</b> Transparent information</span><span><b>✓</b> Built for Nepal</span><span><b>✓</b> No obligation to buy</span></div></section>
      <section className="steps-section"><div className="container"><div className="section-intro centered"><div><p className="eyebrow">A simpler process</p><h2>From vehicle details to assistance.</h2></div><p>Keep the process clear, mobile-friendly and respectful of customer privacy.</p></div><div className="steps-grid"><div><span className="step-number">01</span><h3>Choose vehicle type</h3><p>Tell us whether you need a car, motorcycle, commercial or other coverage.</p></div><div><span className="step-number">02</span><h3>Share vehicle and insurance details</h3><p>Complete the vehicle profile and any renewal or previous insurer information.</p></div><div><span className="step-number">03</span><h3>Request assistance</h3><p>Submit your details and Khaacho will obtain available quotes where providers are connected.</p></div></div></div></section>
    </div>
  );
}
