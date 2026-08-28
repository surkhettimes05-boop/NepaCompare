import type { Metadata } from 'next';
import ContentPage from '@/components/ContentPage';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('about', 'About Khaacho', 'Learn what Khaacho does, how it earns revenue, and the limits of its insurance comparison service.');

export default function AboutPage() {
  return <ContentPage eyebrow="Company" title="Insurance comparison built for clearer decisions" intro="Khaacho helps people in Nepal understand and compare insurance information without pretending that an estimate is a final insurer quote." sections={[
    { title: 'What we do', body: <p>We organize policy features, exclusions and indicative pricing so customers can compare them side by side. Final pricing, underwriting, issuance and claims decisions remain with the insurer.</p> },
    { title: 'What we do not do', body: <p>Khaacho is not an insurer and does not currently act as a licensed broker or intermediary. We do not issue policies, guarantee premiums or decide claims.</p> },
    { title: 'How we earn', body: <p>Browsing and comparing are free. If a commercial referral arrangement is introduced, it will be disclosed beside the affected result and will not change the published ranking method.</p> },
    { title: 'Our standard', body: <p>Plan data must identify its source and review date. Unsourced estimates are labelled as examples and are not ranked with verified partner data.</p> },
    { title: 'Company details', body: <p>Khaacho Private Limited is preparing its public company and office details for publication. Until those details are verified, the platform remains in limited early access.</p> },
  ]} cta={{ label: 'See how comparison works', href: '/how-it-works' }} />;
}
