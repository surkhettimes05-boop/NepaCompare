import LeadForm from '@/components/LeadForm';

export default function GetQuotePage() {
  return (
    <div style={{ padding: 'var(--space-xl) 0', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="heading-1">Get Your Free Quote</h1>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '1rem auto 0' }}>
            It takes less than 2 minutes. We just need a few details to fetch your personalized quotes and assign a licensed advisor to help you.
          </p>
        </div>
        
        <LeadForm />
      </div>
    </div>
  );
}
