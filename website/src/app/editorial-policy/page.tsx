import type { Metadata } from 'next';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = { title: 'Editorial Policy and Review Standards', description: 'How Khaacho researches, reviews, cites and corrects insurance content.', alternates: { canonical: '/editorial-policy' } };

export default function EditorialPolicyPage() {
  return <ContentPage eyebrow="Editorial standards" title="How we research and review insurance information" intro="Insurance content can affect important financial decisions. We separate sourced facts from explanations and never invent professional credentials." sections={[
    { title: 'Primary sources first', body: <p>We prioritize the Nepal Insurance Authority, legislation, insurer policy wording, official insurer product pages and audited insurer reports. Each article lists its principal sources.</p> },
    { title: 'Authors and reviewers', body: <p>Articles are authored by the Khaacho Editorial Team. Factual and citation review is performed by the Khaacho Research Desk. No person is described as a lawyer, licensed intermediary or insurance professional unless their identity and credentials have been verified and published.</p> },
    { title: 'Review status', body: <p>“Editorially reviewed” means sources, dates and internal consistency were checked. It does not mean legal, regulatory or personal financial advice. Articles needing specialist interpretation are marked “professional review pending.”</p> },
    { title: 'Corrections', body: <p>Corrections can be requested at complaints@khaacho.com. Material corrections include a dated note. Rate tables are removed from ranking when their verification window expires.</p> },
    { title: 'Commercial independence', body: <p>Commercial relationships do not determine editorial conclusions or organic result order. Paid placement, if introduced, will be visibly labelled.</p> },
  ]} />;
}
