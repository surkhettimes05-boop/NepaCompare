import Link from 'next/link';
import './page.css';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('/', 'Compare Insurance in Nepal | Motor, Health & Life', 'Compare indicative motor, health and life insurance information in Nepal and understand coverage before requesting a quote.');

const categories = [
  { name: 'Motor Insurance', href: '/wizard/motor', tone: 'motor-card', icon: 'car', badge: 'Popular', description: 'Cover for your car, bike or vehicle.' },
  { name: 'Health Insurance', href: '/health', tone: 'health-card', icon: 'heart', badge: 'Popular', description: 'Support for everyday health costs.' },
  { name: 'Life Insurance', href: '/life', tone: 'life-card', icon: 'shield', badge: '', description: 'Protection for the people you love.' },
  { name: 'Travel Insurance', href: '/travel', tone: 'travel-card', icon: 'plane', badge: '', description: 'Travel with a little more confidence.' },
  { name: 'Family Health', href: '/health', tone: 'family-card', icon: 'family', badge: 'Recommended', description: 'One simple place for family cover.' },
  { name: 'Business Insurance', href: '/compare', tone: 'business-card', icon: 'briefcase', badge: '', description: 'Help protect the work you are building.' },
];

function CategoryIcon({ type }: { type: string }) {
  const paths: Record<string, React.ReactNode> = {
    car: <><path d="m5 17 1.5-5h11l1.5 5" /><path d="M3 17h18v3H3z" /><circle cx="7" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></>,
    heart: <path d="M20.8 8.6c0 5.4-8.8 10.1-8.8 10.1S3.2 14 3.2 8.6A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8.8 2.6Z" />,
    shield: <><path d="M12 21s7-3.6 7-9V5l-7-3-7 3v7c0 5.4 7 9 7 9Z" /><path d="m9 12 2 2 4-4" /></>,
    plane: <><path d="m3 11 18-6-6 18-3-8-9-4Z" /><path d="m12 15 3-3" /></>,
    family: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14c3.3 0 5 2 5 6" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5h8v2M3 12h18M10 12v2h4v-2" /></>,
  };
  return <svg className="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}

export default function Home() {
  return <div className="home-container">
    <section className="home-hero"><div className="container"><div className="hero-layout">
      <div className="hero-content-stack"><div className="hero-text"><p className="eyebrow">Insurance, made clearer</p><h1 className="heading-1">Compare insurance.<br /><em>Choose with confidence.</em></h1><p className="hero-subtitle text-muted">Compare indicative motor, health and life insurance options from one place. Understand coverage before requesting a quote.</p></div>
        <div className="hero-actions"><Link href="/compare" className="btn btn-primary btn-large">Compare insurance <span aria-hidden="true">-&gt;</span></Link><Link href="/how-it-works" className="btn btn-ghost btn-large">How it works</Link></div>
        <div className="trust-indicators text-muted">{['Free to compare', 'No obligation', 'Transparent options'].map(label => <span className="trust-item" key={label}><span className="trust-check" aria-hidden="true">✓</span>{label}</span>)}</div>
      </div>
      <div className="hero-panel" aria-label="Insurance planning overview"><div className="panel-topline"><span>YOUR COVERAGE PLAN</span><span className="panel-check">✓ Ready to explore</span></div><div className="coverage-score"><div><span className="score-label">A clearer way to start</span><strong>Cover what<br />matters.</strong></div><div className="score-ring">3<br /><small>paths</small></div></div><div className="panel-list"><div><span className="mini-icon blue">⌁</span><span>Know your cover</span><b>01</b></div><div><span className="mini-icon violet">◇</span><span>Compare options</span><b>02</b></div><div><span className="mini-icon green">✓</span><span>Request a quote</span><b>03</b></div></div></div>
    </div></div></section>

    <section className="category-section"><div className="container"><div className="section-intro"><div><p className="eyebrow">Start with what you need</p><h2>What would you like to insure?</h2></div><p>Simple paths for the moments and milestones that matter.</p></div><div className="category-grid">{categories.map(category => <Link href={category.href} className={`category-card ${category.tone}`} key={category.name}><div className="category-card-top"><div className="icon-wrapper"><CategoryIcon type={category.icon} /></div>{category.badge && <span className="category-badge">{category.badge}</span>}<span className="card-arrow" aria-hidden="true">-&gt;</span></div><h3>{category.name}</h3><p>{category.description}</p><span className="card-link">Explore cover <span aria-hidden="true">-&gt;</span></span></Link>)}</div></div></section>

    <section className="promo-section"><div className="container"><div className="promo-card"><div><p className="eyebrow">A better first step</p><h2>Compare before<br />you commit.</h2><p>Understand coverage, benefits and exclusions before you decide what feels right.</p><Link href="/compare" className="btn btn-light">Explore plans <span aria-hidden="true">-&gt;</span></Link></div><div className="promo-illustration" aria-hidden="true"><div className="illustration-circle" /><div className="illustration-card"><span>Coverage</span><strong>Clearer choices</strong><i>✓</i></div><span className="illustration-line line-one" /><span className="illustration-line line-two" /></div></div></div></section>

    <section className="steps-section"><div className="container"><div className="section-intro"><div><p className="eyebrow">A simpler process</p><h2>How it works</h2></div><p>Move at your own pace, with useful information at each step.</p></div><div className="steps-grid"><div className="step-card"><span className="step-icon">01</span><h3>Tell us what you need</h3><p>Choose a product and share a few details about your situation.</p></div><div className="step-card"><span className="step-icon">02</span><h3>Compare suitable options</h3><p>Review coverage, benefits and important exclusions side by side.</p></div><div className="step-card"><span className="step-icon">03</span><h3>Request a quote</h3><p>Continue when you are ready. There is no pressure to buy.</p></div></div></div></section>

    <section className="why-section"><div className="container"><div className="section-intro"><div><p className="eyebrow">Why NepaCompare</p><h2>Why people use NepaCompare</h2></div><p>Insurance information that respects your time and your choices.</p></div><div className="benefit-grid">{[['◎', 'Compare in one place', 'See relevant options together, without the noise.'], ['◌', 'Clear coverage details', 'Understand what is included before you ask for a quote.'], ['↗', 'No pressure to buy', 'Take your time and continue only when it feels right.'], ['⌂', 'Built for Nepal', 'Useful context for local products and journeys.']].map(([icon, title, text]) => <div className="benefit" key={title}><span className="benefit-icon">{icon}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>

    <section className="faq-section"><div className="container faq-layout"><div><p className="eyebrow">Good to know</p><h2>Questions, answered.</h2><p className="faq-intro">A few things people often ask before comparing.</p></div><div className="faq-list">{[['Is it free to compare?', 'Yes. Comparing information on NepaCompare is free, and there is no obligation to request or buy a policy.'], ['Are the prices final?', 'No. Any prices shown are indicative. Final premiums and eligibility are confirmed by the insurer.'], ['What information do I need?', 'Usually just a few details about you, your vehicle, trip or family. We keep the first step simple.'], ['Can I speak to an insurer?', 'Yes. When you are ready, you can request a quote and share your details with the relevant insurer.'], ['Is NepaCompare an insurance company?', 'NepaCompare is an independent information and comparison platform, not an insurer or broker.']].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>

    <section className="final-cta"><div className="container"><div><p className="eyebrow">Your next step</p><h2>Ready to compare?</h2><p>Start with what matters to you. It only takes a few minutes.</p></div><Link href="/compare" className="btn btn-primary btn-large">Compare insurance <span aria-hidden="true">-&gt;</span></Link></div></section>
  </div>;
}
