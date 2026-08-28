import Link from 'next/link';
import './page.css';

export default function Home() {
  return (
    <div className="home-container">
      <section className="home-hero">
        <div className="container">
          
          <div className="hero-layout">
            <div className="hero-content-stack">
              <div className="hero-text">
                <h1 className="heading-1">
                  Compare insurance.<br/>
                  <em>Choose with confidence.</em>
                </h1>
                <p className="hero-subtitle text-muted">
                  Compare indicative Motor, Health and Life insurance options from one place. Understand coverage before requesting a quote.
                </p>
              </div>

              {/* Primary Actions */}
              <div className="hero-actions">
                <Link href="/compare" className="btn btn-primary btn-large">
                  Compare insurance <span aria-hidden="true">-&gt;</span>
                </Link>
                <Link href="/how-it-works" className="btn btn-ghost btn-large">
                  How it works
                </Link>
              </div>

              <div className="trust-indicators text-muted">
                <span className="trust-item"><span className="status-dot" /> Free to compare</span><span className="trust-dot">•</span><span className="trust-item">No obligation to buy</span>
              </div>
            </div>

            <div className="hero-panel" aria-label="Insurance planning overview">
              <div className="panel-topline"><span>YOUR COVERAGE PLAN</span><span className="panel-check">✓ Ready to explore</span></div>
              <div className="coverage-score"><div><span className="score-label">A clearer way to start</span><strong>Cover what<br />matters.</strong></div><div className="score-ring">3<br /><small>paths</small></div></div>
              <div className="panel-list"><div><span className="mini-icon blue">⌁</span><span>Know your cover</span><b>01</b></div><div><span className="mini-icon violet">◇</span><span>Compare options</span><b>02</b></div><div><span className="mini-icon green">✓</span><span>Request a quote</span><b>03</b></div></div>
              </div>
            </div>
          </div>
      </section>

      <section className="category-section"><div className="container"><div className="section-intro"><div><p className="eyebrow">Start with what you need</p><h2>Find the right cover.</h2></div><p>Simple paths for the moments and milestones that matter.</p></div><div className="category-grid">
            <Link href="/wizard/motor" className="category-card motor-card">
              <div className="icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 18H3c-.6 0-1-.4-1-1v-4c0-1.7 1.3-3 3-3h1.5l2-4.5c.3-.6 1-1 1.7-1h7.6c.7 0 1.4.4 1.7 1l2 4.5H22c1.7 0 3 1.3 3 3v4c0 .6-.4 1-1 1h-2"/>
                  <circle cx="7.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <span className="card-arrow">-&gt;</span><h3>Motor Insurance</h3>
              <p>Compare coverage and indicative premiums for your vehicle.</p><span className="card-link">Compare motor plans <span aria-hidden="true">-&gt;</span></span>
            </Link>

            <Link href="/health" className="category-card health-card">
              <div className="icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
                <svg style={{position: 'absolute', top: '10px', left: '10px'}} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <span className="card-arrow">-&gt;</span><h3>Health Insurance</h3>
              <p>Understand individual and family protection before you choose.</p><span className="card-link">Explore health cover <span aria-hidden="true">-&gt;</span></span>
            </Link>

            <Link href="/life" className="category-card life-card">
              <div className="icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4" stroke="var(--success)"/>
                </svg>
              </div>
              <span className="card-arrow">-&gt;</span><h3>Life Insurance</h3>
              <p>Explore cover designed around your family's future.</p><span className="card-link">Explore life cover <span aria-hidden="true">-&gt;</span></span>
            </Link>

          </div></div>
      </section>
      <section className="trust-strip"><div className="container trust-grid"><span><b>✓</b> Free to compare</span><span><b>✓</b> Transparent information</span><span><b>✓</b> Built for Nepal</span><span><b>✓</b> No obligation to buy</span></div></section>
      <section className="steps-section"><div className="container"><div className="section-intro centered"><div><p className="eyebrow">A simpler process</p><h2>From curious to covered.</h2></div><p>Move at your own pace, with the information you need at each step.</p></div><div className="steps-grid"><div><span className="step-number">01</span><h3>Tell us what you need</h3><p>Choose a product and share a few details about your situation.</p></div><div><span className="step-number">02</span><h3>Compare available options</h3><p>Review indicative pricing, coverage and important exclusions side by side.</p></div><div><span className="step-number">03</span><h3>Request a quote</h3><p>Send your details when you are ready. There is no pressure to buy.</p></div></div></div></section>
      <section className="comparison-section"><div className="container"><div className="comparison-heading"><div><p className="eyebrow">A look at comparison</p><h2>See the details clearly.</h2></div><Link href="/compare" className="text-link">View comparison <span aria-hidden="true">-&gt;</span></Link></div><div className="comparison-table-wrap"><p className="sample-label">Illustrative example data. Final insurer premiums and eligibility may vary.</p><div className="comparison-table"><div className="table-row table-header"><span>Provider</span><span>Plan</span><span>Coverage</span><span>Indicative premium</span><span /></div><div className="table-row"><strong>Example provider</strong><span>Comprehensive motor</span><span>Own damage + third party</span><b>NPR 9,200 <small>/ year</small></b><Link href="/wizard/motor" aria-label="Compare this example motor plan">-&gt;</Link></div><div className="table-row"><strong>Example provider</strong><span>Third-party motor</span><span>Third-party liability</span><span>Request indicative price</span><Link href="/wizard/motor" aria-label="Compare this example motor plan">-&gt;</Link></div></div></div></div></section>
      <section className="why-section"><div className="container why-layout"><div><p className="eyebrow">Why NepaCompare</p><h2>Insurance should be easier to understand.</h2><p className="why-lead">We bring clarity to the first step, so you can make a considered decision before speaking with an insurer.</p></div><div className="why-list"><div><span>01</span><div><h3>Transparent comparison</h3><p>See the factors that shape a policy, not just a headline price.</p></div></div><div><span>02</span><div><h3>Understand coverage</h3><p>Learn what is included and what to look out for.</p></div></div><div><span>03</span><div><h3>Nepal-focused information</h3><p>Useful context for the products and journeys available here.</p></div></div><div><span>04</span><div><h3>Simple quote request</h3><p>Share your details only when you are ready to continue.</p></div></div></div></div></section>
      <section className="guides-section"><div className="container"><div className="section-intro"><div><p className="eyebrow">Learn before you choose</p><h2>Useful insurance guides.</h2></div><Link href="/blog" className="text-link">Explore resources <span aria-hidden="true">-&gt;</span></Link></div><div className="guide-grid"><Link href="/blog" className="guide-card"><span>Motor</span><h3>Motor insurance guide</h3><p>Start with the basics of vehicle cover.</p><b>-&gt;</b></Link><Link href="/health" className="guide-card"><span>Health</span><h3>Health insurance guide</h3><p>Understand the questions worth asking.</p><b>-&gt;</b></Link><Link href="/life" className="guide-card"><span>Life</span><h3>Life insurance guide</h3><p>Explore protection for your future plans.</p><b>-&gt;</b></Link><Link href="/claims" className="guide-card"><span>Practical help</span><h3>Claims guide</h3><p>Know what to expect when making a claim.</p><b>-&gt;</b></Link><Link href="/glossary" className="guide-card"><span>Language</span><h3>Insurance glossary</h3><p>Plain-English explanations of common terms.</p><b>-&gt;</b></Link></div></div>
      </section>
    </div>
  );
}
