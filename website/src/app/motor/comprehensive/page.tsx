import type { Metadata } from 'next';
import { SeoContentTemplate } from '@/components/SeoContentTemplate';

export const metadata: Metadata = {
  title: 'Comprehensive Insurance in Nepal',
  description: 'Learn how comprehensive motor insurance works in Nepal, including what it may cover and when exclusions, deductibles or policy conditions still apply.',
  alternates: { canonical: '/motor/comprehensive' },
};

export default function ComprehensiveInsurancePage() {
  return (
    <SeoContentTemplate
      title="Comprehensive Insurance in Nepal"
      description="Comprehensive motor insurance may provide broader cover than third-party liability, including damage to the insured vehicle itself under the terms of the policy. It still depends on the insurer’s wording and exclusions."
      updated="18 September 2026"
      breadcrumbs=[
        { label: 'Home', href: '/' },
        { label: 'Motor insurance', href: '/motor' },
        { label: 'Comprehensive insurance' },
      ]}
      intro="A comprehensive motor policy often combines third-party liability with cover for own vehicle damage, but the real value depends on what is named in the schedule, the deductible, and the specific exclusions listed by the insurer."
      notice="Product details vary significantly by insurer and policy. Never assume a policy includes every accident, theft, or natural event without confirming the wording."
      sourceLabel="Official motor insurance product pages and insurer policy wording"
      sourceUrl="https://shikharinsurance.com/products/vehicle-insurance"
      sections={[
        {
          title: 'What comprehensive cover may include',
          body: (
            <>
              <p>Depending on the insurer, comprehensive motor cover may include accidental damages, fire, theft, and certain natural or external events affecting the insured vehicle. Check the official product details and policy wording for exactly what is covered.</p>
            </>
          ),
        },
        {
          title: 'Where limits still apply',
          body: (
            <>
              <p>Most comprehensive policies still have exclusions, deductibles, limits and conditions. A cover name alone is not enough; compare the same terms across products before deciding.</p>
              <ul>
                <li>Deductibles or excess may be applied to claim payments.</li>
                <li>General exclusions may apply to certain driver conditions, vehicle use, or incident types.</li>
                <li>Accessories, modification, passenger cover, or roadside help may require separate cover or written terms.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'How to compare properly',
          body: (
            <>
              <p>Look at the same structure across insurers: liability limits, excess, claim-support terms, excluded events, and required documentation. This makes the comparison more meaningful than comparing only the premium.</p>
            </>
          ),
        },
      ]}
      faq={[
        {
          question: 'Is comprehensive insurance always better than third-party?',
          answer: 'Not necessarily. It depends on the value of the vehicle, ownership situation, risk tolerance, and the terms of the product. The right product is the one that fits the actual risk and budget.',
        },
        {
          question: 'Does comprehensive cover guarantee repair payments?',
          answer: 'No. The insurer will evaluate whether the loss is covered by the policy wording, whether required conditions were met, and whether any deductible or exclusion applies.',
        },
      ]}
      quoteHref="/wizard/motor"
      quoteLabel="Request a motor insurance quote"
    />
  );
}
