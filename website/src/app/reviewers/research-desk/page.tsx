import type { Metadata } from 'next';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = { title: 'Khaacho Research Desk', description: 'Source and factual-review role for Khaacho insurance content.', alternates: { canonical: '/reviewers/research-desk' } };

export default function ReviewerPage() {
  return <ContentPage eyebrow="Reviewer" title="Khaacho Research Desk" intro="The internal function that checks source authority, dates, citations and unsupported claims before publication." sections={[
    { title: 'Review checklist', body: <ul><li>Prefer regulator or insurer primary sources.</li><li>Remove unsourced prices, statistics and superlatives.</li><li>Distinguish indicative information from policy wording.</li><li>Record review dates and source links.</li><li>Escalate legal or professional interpretation for qualified external review.</li></ul> },
    { title: 'Credential statement', body: <p>The Research Desk is an editorial review function, not a licensed insurance, legal or actuarial professional. Professional review remains pending until a named, verified specialist is engaged.</p> },
  ]} />;
}
