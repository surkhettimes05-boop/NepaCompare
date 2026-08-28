import type { Metadata } from 'next';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'How Khaacho collects, uses, shares, retains and protects personal information.', alternates: { canonical: '/privacy' } };

export default function PrivacyPage() {
  return <ContentPage eyebrow="Legal" title="Privacy Policy" intro="This policy explains the information Khaacho processes when you browse, compare plans, create an account or request support." sections={[
    { title: 'Information we collect', body: <><p>We may collect account details, contact information, quote criteria, saved quotes, support messages and technical information such as device, browser and security logs.</p><p>Health and identity information should only be requested when necessary for the selected product and after a clear purpose notice.</p></> },
    { title: 'How we use information', body: <ul><li>Provide comparisons and saved-quote features.</li><li>Secure accounts and prevent abuse.</li><li>Respond to support and privacy requests.</li><li>Improve reliability using aggregated analytics.</li><li>Meet legal obligations.</li></ul> },
    { title: 'Sharing and insurer referrals', body: <p>Browsing does not authorize us to send your details to an insurer. Before any referral, we will identify the recipient, the fields being shared and the purpose, and ask for affirmative consent. We do not sell personal information.</p> },
    { title: 'Retention', body: <p>Account and saved-quote information is retained while the account is active and for a limited period needed for security, disputes and legal obligations. Unsubmitted quote criteria should be discarded when the session ends. Final schedules must be documented before production launch.</p> },
    { title: 'Security', body: <p>We use access controls, encryption in transit, password hashing and operational logging. No online system is risk-free. Never send passwords or payment credentials through support messages.</p> },
    { title: 'Your choices and rights', body: <p>You may request access, correction, export or deletion by contacting privacy@khaacho.com. You may withdraw optional marketing or referral consent without losing access to browsing.</p> },
    { title: 'Cookies and analytics', body: <p>Essential storage may be used for authentication and security. Non-essential analytics or advertising cookies require a separate consent choice before activation.</p> },
    { title: 'Contact and changes', body: <p>Questions can be sent to privacy@khaacho.com. Material changes will be dated and highlighted before they take effect.</p> },
  ]} />;
}
