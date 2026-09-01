import type { Metadata } from 'next';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = { title: 'Khaacho Editorial Team', description: 'About the team responsible for Khaacho research and insurance guides.', alternates: { canonical: '/authors/editorial-team' } };

export default function AuthorPage() {
  const schema = { '@context': 'https://schema.org', '@type': 'Organization', '@id': 'https://www.khaacho.com/authors/editorial-team#organization', name: 'Khaacho Editorial Team', url: 'https://www.khaacho.com/authors/editorial-team', parentOrganization: { '@id': 'https://www.khaacho.com#organization' }, description: 'A collaborative editorial byline for Khaacho insurance explainers researched from primary public sources.' };
  return <><ContentPage eyebrow="Author" title="Khaacho Editorial Team" intro="A collaborative byline for researched insurance explainers produced from primary public sources." sections={[
    { title: 'What the team does', body: <p>The team researches regulator publications, official insurer materials and policy documents; writes plain-language explanations; and records source and review dates.</p> },
    { title: 'What the byline does not mean', body: <p>This byline does not claim that an article was written by a lawyer, regulator, actuary or licensed insurance intermediary. Content is general information, not personal advice.</p> },
    { title: 'Review process', body: <p>Every published guide requires a source list, factual review and a next-review date. See the Editorial Policy for corrections and commercial-independence rules.</p> },
  ]} cta={{ label: 'Read the editorial policy', href: '/editorial-policy' }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></>;
}
