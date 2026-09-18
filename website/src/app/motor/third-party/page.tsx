import type { Metadata } from 'next';
import { SeoContentTemplate } from '@/components/SeoContentTemplate';

export const metadata: Metadata = {
  title: 'Third-Party Insurance in Nepal',
  description: 'Understand third-party insurance in Nepal, what it covers, what it usually excludes, and how it differs from comprehensive cover.',
  alternates: { canonical: '/motor/third-party' },
};

export default function ThirdPartyInsurancePage() {
  return (
    <SeoContentTemplate
      title="Third-Party Insurance in Nepal"
      description="Third-party insurance protects against legal and financial liability to other people or property caused by your vehicle. It does not usually pay for damage to your own vehicle."
      updated="18 September 2026"
      breadcrumbs=[
        { label: 'Home', href: '/' },
        { label: 'Motor insurance', href: '/motor' },
        { label: 'Third-party insurance' },
      ]}
      intro="Third-party insurance focuses on liability. It is typically meant to cover damages or injury caused to another person, their vehicle, or their property, subject to the policy wording and extent of cover."
      notice="Coverage details, limits and exclusions vary by insurer and product. Always check the current policy wording before buying or renewing."
      sourceLabel="Official insurer product pages and Nepal Insurance Authority guidance"
      sourceUrl="https://nia.gov.np/"
      sections={[
        {
          title: 'What third-party cover usually addresses',
          body: (
            <>
              <p>Typical third-party liability cover may pay for damages caused to another person or their property due to the insured vehicle. The exact benefits, limits and legal definitions depend on the insurer and the policy schedule.</p>
            </>
          ),
        },
        {
          title: 'What it usually does not cover',
          body: (
            <>
              <p>In most cases, third-party cover does not pay to repair the insured vehicle itself. It also typically does not cover all forms of damage, unreported driving risks, or non-covered activities.</p>
              <ul>
                <li>Your own vehicle damage is often excluded.</li>
                <li>Driving without valid documents or under prohibited conditions may be excluded.</li>
                <li>Specific events, accessories or passenger cover may need separate terms.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'How to compare it properly',
          body: (
            <>
              <p>Compare the insurer’s actual wording, legal liability limits, deductibles, and any conditions that affect claims. The policy name alone should not be treated as a full explanation of coverage.</p>
            </>
          ),
        },
      ]}
      faq={[
        {
          question: 'Does third-party cover pay for my own car damage?',
          answer: 'Usually not. It is designed primarily for liability to third parties. Your own vehicle damage is often covered only under a more comprehensive policy or optional extension.',
        },
        {
          question: 'Is third-party insurance mandatory?',
          answer: 'Vehicle insurance requirements vary by legal and insurer requirements. Always review the current legal and insurer requirements for the specific vehicle and use case.',
        },
      ]}
      quoteHref="/wizard/motor"
      quoteLabel="Ask for motor insurance guidance"
    />
  );
}
