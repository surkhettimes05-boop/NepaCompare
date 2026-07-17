import Link from 'next/link';
import './category.css';

interface Props {
  params: { vertical: string };
}

// In Next.js 15, params is a Promise. Since we don't know the exact version, 
// we'll await it if it's a promise, or just use it.
export default async function CategoryPage({ params }: Props) {
  const vertical = (await params).vertical;
  const title = vertical.charAt(0).toUpperCase() + vertical.slice(1);
  
  const getSeoContent = () => {
    switch(vertical.toLowerCase()) {
      case 'motor':
        return {
          intro: "In Nepal, having third-party motor insurance is a mandatory legal requirement under the Motor Vehicles and Transport Management Act. However, comprehensive coverage is highly recommended to protect your own vehicle against theft, riots, and natural disasters.",
          point1: "Third-Party vs Comprehensive",
          desc1: "Third-party only covers damages to other people's property or life. Comprehensive covers your own vehicle damages.",
          point2: "No Claim Bonus (NCB)",
          desc2: "Did you know you can transfer your NCB in Nepal? Drive safely and save up to 50% on your premium."
        };
      case 'health':
        return {
          intro: "Health insurance in Nepal is rapidly growing, especially with rising healthcare costs in private hospitals. Navigating the policies approved by the Nepal Insurance Authority (NIA) can save your family from catastrophic financial burdens during medical emergencies.",
          point1: "Cashless Treatment",
          desc1: "Look for insurers that offer cashless treatment at major hospitals in Kathmandu, Pokhara, and Chitwan.",
          point2: "Pre-existing Conditions",
          desc2: "Understand the waiting periods (usually 1-4 years) for pre-existing illnesses like diabetes or hypertension."
        };
      default:
        return {
          intro: `${title} insurance provides essential financial protection against unexpected events. Comparing policies ensures you get the right coverage at the right price without relying solely on a single agent's recommendation.`,
          point1: "Financial Security",
          desc1: "Avoid out-of-pocket expenses for major events.",
          point2: "Compare & Save",
          desc2: "See prices from multiple insurers side-by-side."
        };
    }
  };

  const content = getSeoContent();

  return (
    <div className="category-container animate-fade-up">
      <div className="container">
        <div className="category-header">
          <h1 className="heading-1">{title} Insurance in Nepal</h1>
          <p className="text-muted" style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
            Compare top {title.toLowerCase()} insurance providers approved by the Nepal Insurance Authority.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <Link href={`/compare/${vertical}`} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Compare {title} Quotes Now
            </Link>
          </div>
        </div>
        
        <div className="category-content glass-panel" style={{ marginTop: '3rem' }}>
          <h2 className="heading-2">Why do you need {title} Insurance?</h2>
          <p className="text-muted" style={{ marginTop: '1rem', lineHeight: '1.6' }}>
            {content.intro}
          </p>
          
          <div className="benefits-grid" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="benefit-card glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
              <h3 className="heading-3">{content.point1}</h3>
              <p className="text-muted" style={{ marginTop: '0.5rem' }}>{content.desc1}</p>
            </div>
            <div className="benefit-card glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
              <h3 className="heading-3">{content.point2}</h3>
              <p className="text-muted" style={{ marginTop: '0.5rem' }}>{content.desc2}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
