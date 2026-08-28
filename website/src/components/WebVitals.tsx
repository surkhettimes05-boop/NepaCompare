'use client';

import { useReportWebVitals } from 'next/web-vitals';

export default function WebVitals() {
  useReportWebVitals(metric => {
    if (process.env.NODE_ENV === 'development') console.info('[web-vital]', metric.name, metric.value, metric.rating);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('khaacho:web-vital', { detail: metric }));
  });
  return null;
}
