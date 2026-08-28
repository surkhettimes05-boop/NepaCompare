import type { Metadata } from 'next';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = { title: 'Terms of Service', description: 'Terms governing use of the Khaacho insurance comparison service.', alternates: { canonical: '/terms' } };

export default function TermsPage() {
  return <ContentPage eyebrow="Legal" title="Terms of Service" intro="These terms govern access to Khaacho. They should be reviewed by Nepal-qualified counsel before commercial launch." sections={[
    { title: 'The service', body: <p>Khaacho provides general information and comparison tools. It is not an insurer and does not currently issue, underwrite, bind, sell or approve insurance policies.</p> },
    { title: 'Indicative information', body: <p>Displayed premiums and benefits are estimates unless explicitly identified as a current insurer offer. The insurer’s proposal, underwriting decision, policy schedule and wording control.</p> },
    { title: 'User responsibilities', body: <p>You must provide accurate information, use the service lawfully, protect account credentials and review the insurer’s documents before proceeding.</p> },
    { title: 'Accounts', body: <p>You are responsible for account activity. We may restrict access where necessary to protect users, investigate abuse or comply with law. Account recovery requires identity checks.</p> },
    { title: 'Referrals and third parties', body: <p>Continuing to an insurer subjects you to that insurer’s terms and privacy policy. Khaacho is not responsible for underwriting, payment processing, issuance or claims decisions performed by third parties.</p> },
    { title: 'Intellectual property', body: <p>Khaacho’s original interface and content may not be copied or misrepresented. Insurer names and marks belong to their respective owners and require permission for commercial use.</p> },
    { title: 'Liability', body: <p>To the extent permitted by applicable law, Khaacho is not liable for decisions based solely on indicative information or for third-party acts. Nothing here excludes rights that cannot legally be excluded.</p> },
    { title: 'Changes and contact', body: <p>Changes will be dated on this page. Questions or complaints may be sent through the Contact page.</p> },
  ]} />;
}
