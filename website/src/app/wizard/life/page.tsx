import LifeQuoteWizard from '@/components/LifeQuoteWizard';
import DropoffTracker from '@/components/DropoffTracker';

export default function LifeWizardPage() {
  return (
    <div className="wizard-page animate-fade-up">
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="heading-2">Secure Your Family's Future</h1>
          <p className="text-muted">Answer a few questions to get personalized life insurance quotes.</p>
        </div>
        
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <LifeQuoteWizard />
        </div>
      </div>
      <DropoffTracker vertical="life" />
    </div>
  );
}
