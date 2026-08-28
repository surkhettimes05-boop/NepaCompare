import type { Metadata } from 'next';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = { title: 'Contact and Complaints', description: 'Contact Khaacho for support, privacy questions, corrections, partnerships or complaints.', alternates: { canonical: '/contact' } };

export default function ContactPage() {
  return <ContentPage eyebrow="Support" title="Contact Khaacho" intro="Use the appropriate channel so your request reaches the right team. Do not send passwords, payment details or medical documents by email." sections={[
    { title: 'Customer support', body: <p>Email <a href="mailto:support@khaacho.com">support@khaacho.com</a>. Target response time: two business days. The address must be activated on the production domain before launch.</p> },
    { title: 'Complaints and corrections', body: <p>Email <a href="mailto:complaints@khaacho.com">complaints@khaacho.com</a> with the page URL and issue. We acknowledge complaints within two business days and provide a status update within seven business days.</p> },
    { title: 'Privacy requests', body: <p>Email <a href="mailto:privacy@khaacho.com">privacy@khaacho.com</a> to request access, correction or deletion of personal information.</p> },
    { title: 'Insurers and partners', body: <p>Email <a href="mailto:partners@khaacho.com">partners@khaacho.com</a>. Data feeds must include authorization, policy wording, effective dates and an accountable source owner.</p> },
    { title: 'Claims emergencies', body: <p>Khaacho does not handle emergencies or decide claims. Contact the insurer using the number printed on the policy schedule.</p> },
  ]} />;
}
