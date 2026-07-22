'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem', textAlign: 'center' }}>
      <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <h2 style={{ fontSize: '2rem', color: 'var(--text-color)', marginBottom: '1rem' }}>Something went wrong!</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '2rem' }}>
        We encountered an unexpected error while trying to fetch the best insurance data for you. Please try again.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => reset()}
          className="btn btn-primary"
        >
          Try again
        </button>
        <Link href="/" className="btn" style={{ background: 'white', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}>
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
