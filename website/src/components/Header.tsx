'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import './Header.css';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <button type="button" className="mobile-menu-button" aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={isMenuOpen} aria-controls="mobile-navigation" onClick={() => setIsMenuOpen(value => !value)}>
          <span aria-hidden="true">{isMenuOpen ? '×' : '☰'}</span>
        </button>
        <Link href="/" className="logo" aria-label="Khaacho home">
          Khaacho<span style={{ color: 'var(--primary-accent)' }}>.</span>
        </Link>
        <nav className="desktop-nav">
          <div className="nav-menu"><span>Insurance <small>⌄</small></span><div className="nav-dropdown"><Link href="/motor">Motor</Link><Link href="/health">Health</Link><Link href="/life">Life</Link><Link href="/travel">Travel</Link></div></div>
          <div className="nav-menu"><span>Resources <small>⌄</small></span><div className="nav-dropdown"><Link href="/blog">Guides &amp; blog</Link><Link href="/glossary">Glossary</Link></div></div>
          <Link href="/how-it-works">How it works</Link>
        </nav>
        <div className="header-actions">
          <Link href="/contact" className="expert-button" aria-label="Contact Khaacho support"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><path d="M4 14a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2v2ZM20 14a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2v2ZM12 20h3" /></svg><span>Contact support</span></Link>
          {isLoggedIn ? (
            <button type="button" className="profile-button" aria-label="Open account menu" onClick={() => setIsMenuOpen(true)}><span aria-hidden="true">N</span></button>
          ) : (
            <><Link href="/login" className="sign-in-link">Sign in</Link><Link href="/compare" className="btn btn-primary desktop-compare-link">Compare plans</Link></>
          )}
        </div>
      </div>
      <nav id="mobile-navigation" className={`mobile-nav ${isMenuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
        <div className="mobile-nav-group"><span className="mobile-nav-label">Insurance</span><Link href="/motor" onClick={() => setIsMenuOpen(false)}>Motor</Link><Link href="/health" onClick={() => setIsMenuOpen(false)}>Health</Link><Link href="/life" onClick={() => setIsMenuOpen(false)}>Life</Link><Link href="/travel" onClick={() => setIsMenuOpen(false)}>Travel</Link></div>
        <div className="mobile-nav-group"><span className="mobile-nav-label">Account</span><Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link><Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>Saved Comparisons</Link><Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>Account</Link>{isLoggedIn && <button type="button" className="mobile-logout" onClick={handleLogout}>Logout</button>}</div>
        <div className="mobile-nav-group mobile-nav-secondary"><Link href="/blog" onClick={() => setIsMenuOpen(false)}>Guides &amp; blog</Link><Link href="/how-it-works" onClick={() => setIsMenuOpen(false)}>How it works</Link><Link href="/contact" onClick={() => setIsMenuOpen(false)}>Talk to Expert</Link></div>
      </nav>
    </header>
  );
}
