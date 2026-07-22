export const metadata = {
  title: 'Insurance Glossary A-Z | NepaCompare',
  description: 'Understand complex insurance terms. Our comprehensive A-Z glossary explains deductibles, premiums, IDV, and more for the Nepali market.',
};

const glossaryTerms = [
  {
    term: "Comprehensive Insurance",
    definition: "A policy that covers third-party liabilities as well as damages to your own vehicle due to accidents, theft, fire, or natural disasters."
  },
  {
    term: "Compulsory Excess (Deductible)",
    definition: "The fixed amount you must pay out of pocket before the insurance company pays the rest of the claim."
  },
  {
    term: "IDV (Insured Declared Value)",
    definition: "The current market value of your vehicle. In case of total loss or theft, this is the maximum amount the insurer will pay."
  },
  {
    term: "No Claim Bonus (NCB)",
    definition: "A discount on your renewal premium given by the insurer if you have not made any claims in the previous policy year."
  },
  {
    term: "OPD (Outpatient Department)",
    definition: "Medical treatment that does not require you to be admitted to a hospital (e.g., doctor consultations, X-rays, pharmacy bills)."
  },
  {
    term: "Premium",
    definition: "The amount you pay to the insurance company (usually annually) to keep your policy active."
  },
  {
    term: "Sum Assured",
    definition: "The maximum guaranteed amount the insurance company will pay in the event of a covered loss or maturity (common in Life and Health insurance)."
  },
  {
    term: "Third-Party Liability",
    definition: "Mandatory insurance that covers damages, injury, or death caused by your vehicle to another person or their property. It does not cover your own vehicle."
  }
];

export default function Glossary() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": glossaryTerms.map(item => ({
      "@type": "Question",
      "name": `What is ${item.term}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.definition
      }
    }))
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-color)' }}>
          Insurance <span style={{ color: 'var(--primary-color)' }}>Glossary</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
          Confusing jargon, explained simply.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {glossaryTerms.map((item, index) => (
          <div key={index} className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>
              {item.term}
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-color)', lineHeight: 1.6 }}>
              {item.definition}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '4rem', padding: '3rem', background: 'var(--primary-color)', color: 'white', borderRadius: '12px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', color: 'white' }}>Ready to get covered?</h2>
        <p style={{ marginBottom: '2rem', fontSize: '1.1rem', opacity: 0.9 }}>
          Now that you know the terms, compare policies like an expert.
        </p>
        <a href="/compare" style={{ 
          display: 'inline-block', 
          background: 'white', 
          color: 'var(--primary-color)', 
          padding: '1rem 2rem', 
          borderRadius: '8px', 
          fontWeight: 600, 
          textDecoration: 'none' 
        }}>
          Compare Quotes
        </a>
      </div>
    </div>
  );
}
