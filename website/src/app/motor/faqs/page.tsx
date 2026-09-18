import type { Metadata } from 'next';
import { SeoContentTemplate } from '@/components/SeoContentTemplate';

export const metadata: Metadata = {
  title: 'Vehicle Insurance FAQs in Nepal',
  description: 'Read practical answers about vehicle insurance in Nepal, including policy types, renewals, required documents, excess and claims information.',
  alternates: { canonical: '/motor/faqs' },
};

export default function VehicleInsuranceFaqPage() {
  return (
    <SeoContentTemplate
      title="Vehicle Insurance FAQs in Nepal"
      description="Common questions about motor insurance in Nepal, from policy types and documentation to excess, renewals and the difference between policy wording and product marketing."
      updated="18 September 2026"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Motor insurance', href: '/motor' },
        { label: 'Vehicle insurance FAQs' },
      ]}
      intro="These answers are a shortcut to better questions — not a substitute for official insurer policy wording. Final cover, premium and acceptance are determined by the insurer and the current policy documents."
      notice="Educational questions do not create a contractual promise or insurer approval."
      sourceLabel="Official insurer pages and Nepal Insurance Authority materials"
      sourceUrl="https://nia.gov.np/"
      sections={[
        {
          title: 'What is the difference between third-party and comprehensive cover?',
          body: <p>Third-party cover is generally aimed at liabilities to other people or property. Comprehensive cover may add cover for your own vehicle and other specified risks, but only if the policy wording and exclusions allow it.</p>,
        },
        {
          title: 'Do I need to compare IDV or just premium?',
          body: <p>Both matter, but the premium alone is not enough. Compare declared value, deductible, coverage limits, exclusions, and any optional add-ons before choosing a policy.</p>,
        },
        {
          title: 'What documents are usually needed?',
          body: <p>Vehicle ownership details, registration information, previous policy references, and driver or vehicle-use details may be required. The insurer decides the exact documentation needed for a valid quote or policy review.</p>,
        },
      ]}
      faq={[
        {
          question: 'Can I rely on a brand name alone?',
          answer: 'No. Product names and advertisements do not replace the policy schedule, policy wording, exclusions, and the insurer’s final terms.',
        },
        {
          question: 'Does Khaacho guarantee claim approval?',
          answer: 'No. Khaacho is an information and comparison platform. The insurer decides coverage, premium, acceptance, and claim approval according to policy terms and underwriting rules.',
        },
        {
          question: 'What should I review at renewal?',
          answer: 'Review the current declared value, policy exclusions, deductible, claims record, and whether the vehicle use and ownership details still match the policy.',
        },
      ]}
      quoteHref="/wizard/motor"
      quoteLabel="Start a motor insurance request"
    />
  );
}
