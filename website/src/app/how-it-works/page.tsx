import type { Metadata } from 'next';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = { title: 'How It Works', description: 'See how Khaacho collects details, displays estimates and connects customers with insurers.', alternates: { canonical: '/how-it-works' } };

export default function HowItWorksPage() {
  return <ContentPage eyebrow="Process" title="Compare with context, not just price" intro="A short, transparent journey from vehicle details to comparable motor insurance information." sections={[
    { title: '1. Tell us about the vehicle', body: <p>Choose the vehicle type and enter the minimum information needed to calculate an estimate. Contact details are optional for browsing results.</p> },
    { title: '2. Review comparable plans', body: <p>Plans are shown with coverage, exclusions, deductible, data source and last verification date. Indicative prices are never presented as binding offers.</p> },
    { title: '3. Choose using your priorities', body: <p>Sort by estimated price or coverage. Our default order uses completeness and verification freshness before price. Sponsored placement, if introduced, will be clearly marked.</p> },
    { title: '4. Continue with the insurer', body: <p>The insurer confirms eligibility, final premium and policy wording. Khaacho does not approve applications or guarantee issuance.</p> },
    { title: '5. Save and service', body: <p>Signed-in customers can save quotes, track renewal dates and find claims contacts. Policy and claim decisions remain with the insurer.</p> },
  ]} cta={{ label: 'Start a motor comparison', href: '/wizard/motor' }} />;
}
