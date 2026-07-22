import HealthQuoteWizard from '@/components/HealthQuoteWizard';
import DropoffTracker from '@/components/DropoffTracker';

export default function HealthWizardPage() {
  return (
    <div className="wizard-page animate-fade-up">
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="heading-2">Find the Right Health Cover</h1>
          <p className="text-muted">Answer a few questions to get personalized health insurance quotes.</p>
        </div>
        
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <HealthQuoteWizard />
        </div>
      </div>
      <DropoffTracker vertical="health" />
    </div>
  );
}
