import MotorQuoteWizard from '@/components/MotorQuoteWizard';
import { Suspense } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('wizard/motor', 'Motor Insurance Quote Wizard', 'Provide vehicle details to request indicative motor insurance information in Nepal.', { robots: { index: false, follow: true } });

export default function MotorWizardPage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-1">Get Your Free Motor Quote</h1>
        <p className="text-muted" style={{ marginTop: '0.5rem' }}>Takes less than 2 minutes.</p>
      </div>
      <div style={{ width: '100%', maxWidth: '600px', padding: '0 1rem' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading Wizard...</div>}>
          <MotorQuoteWizard />
        </Suspense>
      </div>
    </div>
  );
}
