'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import './Header.css';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
          <Link href="/compare" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: 500 }}>Compare</Link>
          <Link href="/blog" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: 500 }}>Blog</Link>
          <Link href="/glossary" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: 500 }}>Glossary</Link>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: 500 }}>My Locker</Link>
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
          <Link href="/blog">Blog</Link>
          <Link href="/glossary">Glossary</Link>
        </nav>
        <div className="header-actions">
          {isLoggedIn ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link href="/dashboard" className="btn" style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>Dashboard</Link>
              <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'var(--accent-red)', cursor: 'pointer' }}>Logout</button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
}
