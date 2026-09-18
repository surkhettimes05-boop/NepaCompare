import type { Metadata } from 'next';
import { SeoContentTemplate } from '@/components/SeoContentTemplate';

export const metadata: Metadata = {
  title: 'Insurance Renewal in Nepal',
  description: 'Learn what to check before renewing your motor insurance in Nepal, including IDV, excess, claims history and policy wording changes.',
  alternates: { canonical: '/motor/renewal' },
};

export default function MotorRenewalPage() {
  return (
    <SeoContentTemplate
      title="Insurance Renewal in Nepal"
      description="Understand the key checks before renewing a motor insurance policy in Nepal. Renewal is not automatically about buying the cheapest offer; it is about confirming the right protection and price for your current vehicle and use case."
      updated="18 September 2026"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Motor insurance', href: '/motor' },
        { label: 'Insurance renewal' },
      ]}
      intro="A motor insurance renewal is a good time to review your vehicle value, policy exclusions, excess, claims history, and whether the insurer is still the right fit for your current need."
      notice="This page is educational. A renewal is subject to insurer underwriting, policy conditions, and the current policy wording."
      sourceLabel="Nepal Insurance Authority and official insurer product pages"
      sourceUrl="https://nia.gov.np/"
      sections={[
        {
          title: 'What to check before renewing',
          body: (
            <>
              <p>Start with the current policy schedule and the insurer’s renewal notice. Review whether the insured declared value has been updated, whether the premium includes optional covers, and whether your renewal would be impacted by claims or non-disclosure.</p>
              <ul>
                <li>Check whether the vehicle IDV or declared value reflects the current market value.</li>
                <li>Review excess, deductible and any compulsory or optional add-ons.</li>
                <li>Confirm the policy still matches the actual vehicle usage and owner information.</li>
                <li>Check for changed exclusions, new endorsements, or altered claim-document requirements.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'Common renewal mistakes',
          body: (
            <>
              <p>Many owners simply compare the premium and ignore the actual cover. A lower premium may reflect a lower declared value, a higher excess, or narrower cover.</p>
              <ul>
                <li>Not checking whether the policy still covers the correct vehicle purpose.</li>
                <li>Ignoring added exclusions or schedule changes.</li>
                <li>Forgetting to compare the renewal terms against current official insurer wording.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'Before you accept a renewal',
          body: (
            <>
              <p>Compare the renewal offer with the current insurer wording, and ask whether the final policy basis is still the same as last year. Do not assume the cheapest price is the right value; consider the total cost after deductibles and optional fees.</p>
            </>
          ),
        },
      ]}
      faq={[
        {
          question: 'Is renewal always automatic? ',
          answer: 'No. The insurer may require a renewed declaration, updated information, or a fresh premium review. Renewal terms can change between policy years.',
        },
        {
          question: 'Should I always renew with the same insurer?',
          answer: 'Not necessarily. Reassess the current coverage, claims record, service quality, excess, and policy wording before deciding.',
        },
      ]}
      quoteHref="/wizard/motor"
      quoteLabel="Compare motor insurance options"
    />
  );
}
