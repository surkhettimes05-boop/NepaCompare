import type { Metadata } from 'next';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = { title: 'Ranking and Revenue Policy', description: 'How Khaacho orders results, verifies data and separates commercial relationships from ranking.', alternates: { canonical: '/ranking-policy' } };

export default function RankingPolicyPage() {
  return <ContentPage eyebrow="Transparency" title="Ranking, revenue and data policy" intro="Price is useful, but a cheap plan with missing or stale information should not be presented as the best choice." sections={[
    { title: 'Eligibility for ranking', body: <p>A plan can enter organic ranking only when the insurer or authorized source, effective date, coverage summary, exclusions, deductible and review date are present.</p> },
    { title: 'Default ordering', body: <ol><li>Verified, current records before unverified records.</li><li>Complete records before incomplete records.</li><li>Within an equal verification tier, lower indicative premium first.</li></ol> },
    { title: 'Commercial relationships', body: <p>Referral or lead fees do not improve organic position. Any paid placement is labelled “Sponsored,” visually separated and never called “Best Match.”</p> },
    { title: 'Revenue', body: <p>Comparison is free for customers. Khaacho may later earn disclosed referral or technology fees from partners. No customer data is sent merely because a partner pays a fee.</p> },
    { title: 'Verification and corrections', body: <p>Partners must supply an accountable contact and authoritative source. Users and insurers can request corrections through complaints@khaacho.com.</p> },
    { title: 'Regulatory boundary', body: <p>Khaacho does not advise on suitability, bind cover or accept premium while it operates solely as an information platform. Any expansion requires regulatory and legal review.</p> },
  ]} />;
}
