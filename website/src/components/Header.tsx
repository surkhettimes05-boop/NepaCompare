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
    <header className="site-header glass-panel">
      <div className="utility-bar">
        <div className="container utility-container">
          <Link href="/compare" className="utility-link">Compare</Link>
          <Link href="/renew" className="utility-link">Renew</Link>
          <Link href="/claims" className="utility-link">Claims</Link>
          <Link href="/dashboard" className="utility-link">My Locker</Link>
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
          <Link href="/travel">Travel</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/glossary">Glossary</Link>
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
            <Link href="/login" className="btn btn-primary">Sign In</Link>
          )}
        </div>
      </div>
      <nav id="mobile-navigation" className={`mobile-nav ${isMenuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
        <Link href="/motor" onClick={() => setIsMenuOpen(false)}>Motor</Link><Link href="/health" onClick={() => setIsMenuOpen(false)}>Health</Link><Link href="/life" onClick={() => setIsMenuOpen(false)}>Life</Link><Link href="/travel" onClick={() => setIsMenuOpen(false)}>Travel</Link><Link href="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link><Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link><Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
      </nav>
    </header>
  );
}
