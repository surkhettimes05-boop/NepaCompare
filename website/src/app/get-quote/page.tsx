import LeadForm from '@/components/LeadForm';
import { Suspense } from 'react';

export default function GetQuotePage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-1">Request help with this plan</h1>
        <p className="text-muted" style={{ marginTop: '0.5rem' }}>Khaacho can contact you about next steps. Final application and pricing remain with the insurer.</p>
      </div>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <Suspense fallback={<div>Loading form...</div>}>
          <LeadForm />
        </Suspense>
      </div>
    </div>
  );
}
