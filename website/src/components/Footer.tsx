import Link from 'next/link';

const groups = [
  { title: 'Insurance', links: [['Motor insurance', '/motor'], ['Health insurance', '/health'], ['Life insurance', '/life'], ['Travel insurance', '/travel']] },
  { title: 'Service', links: [['Compare', '/compare'], ['Renew a policy', '/renew'], ['Claims help', '/claims'], ['My Locker', '/dashboard']] },
  { title: 'Company', links: [['About us', '/about'], ['How it works', '/how-it-works'], ['Contact us', '/contact'], ['Editorial policy', '/editorial-policy'], ['नेपाली', '/np']] },
  { title: 'Legal', links: [['Privacy policy', '/privacy'], ['Terms of service', '/terms'], ['Disclaimer', '/disclaimer'], ['Ranking & revenue', '/ranking-policy']] },
];

export default function Footer() {
  return <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', padding: 'var(--space-20) 0 var(--space-16)', marginTop: 'auto' }}><div className="container">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-12)', marginBottom: 'var(--space-16)' }}>
      <div><h2 className="heading-3" style={{ marginBottom: 'var(--space-3)' }}>Khaacho<span style={{ color: 'var(--primary)' }}>.</span></h2><p className="text-muted" style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)', lineHeight: 1.5, maxWidth: '280px' }}>An insurance information and comparison tool for Nepal. Motor comparison is in early access; other products remain educational previews.</p></div>
      {groups.map(group => <div key={group.title}><h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group.title}</h2><ul style={{ listStyle: 'none', display: 'grid', gap: 'var(--space-2)' }}>{group.links.map(([label, href]) => <li key={href}><Link href={href} style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color var(--transition-fast)' }} className="footer-link">{label}</Link></li>)}</ul></div>)}
    </div>
    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-8)', textAlign: 'center' }}><p className="text-muted" style={{ fontSize: 'var(--text-xs)', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto' }}>Khaacho is an independent information platform — not an insurer, broker or licensed intermediary. Pricing is indicative. Final premiums, policy issuance and claims decisions are determined by the insurer.</p><p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-4)' }}>© {new Date().getFullYear()} Khaacho Private Limited. All rights reserved.</p></div>
  </div></footer>;
}
