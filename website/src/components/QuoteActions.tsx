'use client';

import { useState } from 'react';

export default function QuoteActions({ quote }: { quote: Record<string, unknown> }) {
  const [saved, setSaved] = useState(false);
  const save = () => {
    const existing = JSON.parse(localStorage.getItem('saved_motor_quotes') || '[]') as Record<string, unknown>[];
    const next = [quote, ...existing.filter(item => item.id !== quote.id)].slice(0, 10);
    localStorage.setItem('saved_motor_quotes', JSON.stringify(next));
    setSaved(true);
  };
  return <button type="button" className="btn btn-outline" style={{ width: '100%', marginTop: '.65rem' }} onClick={save}>{saved ? 'Saved on this device' : 'Save quote'}</button>;
}
