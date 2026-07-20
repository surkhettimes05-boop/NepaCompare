import Link from 'next/link';
import './Header.css';

export default function Header() {
  return (
    <header className="site-header glass-panel">
      <div className="utility-bar">
        <div className="container utility-container">
          <Link href="/renew" className="utility-link">Renew a Policy</Link>
          <Link href="/contact" className="utility-link">Talk to an Expert</Link>
        </div>
      </div>
      <div className="container header-container">
        <Link href="/" className="logo">
          Nepa<span style={{ color: 'var(--primary-accent)' }}>Compare</span>
        </Link>
        <nav className="desktop-nav">
          <Link href="/motor">Motor</Link>
          <Link href="/health">Health</Link>
          <Link href="/life">Life</Link>
          <Link href="/blog">Guides</Link>
        </nav>
        <div className="header-actions">
          <Link href="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    </header>
  );
}
