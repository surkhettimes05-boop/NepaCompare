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
        <Link href="/" className="logo">
          Nepa<span style={{ color: 'var(--primary-accent)' }}>Compare</span>
        </Link>
        <nav className="desktop-nav">
          <div className="nav-menu"><span>Insurance <small>⌄</small></span><div className="nav-dropdown"><Link href="/motor">Motor</Link><Link href="/health">Health</Link><Link href="/life">Life</Link><Link href="/travel">Travel</Link></div></div>
          <div className="nav-menu"><span>Resources <small>⌄</small></span><div className="nav-dropdown"><Link href="/blog">Guides &amp; blog</Link><Link href="/glossary">Glossary</Link></div></div>
          <Link href="/how-it-works">How it works</Link>
        </nav>
        <div className="header-actions">
          <button type="button" className="mobile-menu-button" aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={isMenuOpen} aria-controls="mobile-navigation" onClick={() => setIsMenuOpen(value => !value)}>
            <span aria-hidden="true">{isMenuOpen ? '×' : '☰'}</span>
          </button>
          {isLoggedIn ? (
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              <Link href="/dashboard" className="btn btn-secondary btn-sm">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
            </div>
          ) : (
            <><Link href="/login" className="btn btn-ghost">Sign in</Link><Link href="/compare" className="btn btn-primary">Compare plans</Link></>
          )}
        </div>
      </div>
      <nav id="mobile-navigation" className={`mobile-nav ${isMenuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
        <Link href="/motor" onClick={() => setIsMenuOpen(false)}>Motor</Link><Link href="/health" onClick={() => setIsMenuOpen(false)}>Health</Link><Link href="/life" onClick={() => setIsMenuOpen(false)}>Life</Link><Link href="/travel" onClick={() => setIsMenuOpen(false)}>Travel</Link><Link href="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link><Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link><Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
      </nav>
    </header>
  );
}
