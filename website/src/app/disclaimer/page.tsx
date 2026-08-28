import type { Metadata } from 'next';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = { title: 'Insurance Comparison Disclaimer', description: 'Important limitations of Khaacho estimates, rankings and insurance information.', alternates: { canonical: '/disclaimer' } };

export default function DisclaimerPage() {
  return <ContentPage eyebrow="Legal" title="Comparison Disclaimer" intro="Understand the difference between information shown by Khaacho and a binding offer issued by an insurer." sections={[
    { title: 'Not an insurer or broker', body: <p>Khaacho is an independent comparison tool and is not currently an insurer, licensed broker, agent or claims handler.</p> },
    { title: 'No binding quote', body: <p>Unless expressly stated otherwise, premiums are indicative. Final premium, eligibility, coverage and issuance are determined only by the insurer after underwriting.</p> },
    { title: 'Coverage and exclusions', body: <p>Summaries are provided for convenience. Always read the insurer’s current policy wording, schedule, exclusions, deductibles and endorsements.</p> },
    { title: 'Ranking', body: <p>The default order prioritizes verified and complete records, then estimated premium. It is not personal financial advice. Sponsored results, if introduced, will be labelled and separated from organic ranking.</p> },
    { title: 'Data freshness', body: <p>Each publishable plan should show its source and verification date. Records beyond their review window are removed from ranking until reverified.</p> },
    { title: 'Claims', body: <p>Khaacho does not guarantee claim acceptance, settlement amount or processing time. Claims are governed by the policy and insurer decision.</p> },
  ]} cta={{ label: 'Read our ranking policy', href: '/ranking-policy' }} />;
}
