import React from 'react';
import './compare.css';

export default function Loading() {
  return (
    <div className="compare-container animate-fade-up">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="heading-1">Compare Insurance</h1>
          <p className="text-muted">Loading indicative pricing from available insurers...</p>
        </div>

        <div className="comparison-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="compare-card glass-panel" style={{ position: 'relative' }}>
              {/* Skeleton UI blocks */}
              <div style={{ height: '24px', width: '60%', background: 'var(--border)', borderRadius: '4px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
              <div style={{ height: '20px', width: '40%', background: 'var(--border)', borderRadius: '4px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
              
              <div className="premium-block" style={{ border: 'none', padding: 0 }}>
                <div style={{ height: '32px', width: '80%', background: 'var(--border)', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }} />
              </div>
              
              <div style={{ height: '16px', width: '100%', background: 'var(--border)', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }} />
              <div style={{ height: '16px', width: '90%', background: 'var(--border)', borderRadius: '4px', marginBottom: '24px', animation: 'pulse 1.5s infinite' }} />

              <div style={{ height: '40px', width: '100%', background: 'var(--primary)', opacity: 0.5, borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
