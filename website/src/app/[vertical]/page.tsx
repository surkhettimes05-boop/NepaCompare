import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import './category.css';
import { absoluteUrl, pageMetadata } from '@/lib/seo';

interface Props { params: Promise<{ vertical: string }>; }
const allowedVerticals = ['motor', 'health', 'life', 'travel'] as const;
type Vertical = typeof allowedVerticals[number];
type Source = { title: string; url: string };
type ProductGuide = { title: string; description: string; summary: string; availability: string; choices: { title: string; body: string }[]; checklist: string[]; questions: { title: string; body: string }[]; sources: Source[] };

const guides: Record<Vertical, ProductGuide> = {
  motor: {
    title: 'Motor Insurance in Nepal',
    description: 'Compare motor insurance in Nepal and understand third-party and comprehensive cover, exclusions, excesses and claims documents.',
    summary: 'Motor policies can protect you against liabilities arising from use of a vehicle and, depending on the policy, loss or damage to your own vehicle. The cover is defined by the insurer’s schedule, wording, endorsements, excess and exclusions—not by the product name alone.',
    availability: 'Motor comparison is available in early access. Results are indicative and must be confirmed against the insurer’s current quotation and policy wording before purchase.',
    choices: [
      { title: 'Third-party cover', body: 'This is designed around liability to other people or property. It generally does not pay to repair your own vehicle after an accident. Confirm the insured limits and the exact liabilities covered in the schedule.' },
      { title: 'Comprehensive cover', body: 'This may combine third-party liability with insured loss or damage to your own vehicle. Official insurer product pages list risks such as accidental damage, fire, theft and specified natural events, but exclusions and excesses still apply.' },
      { title: 'Optional extensions', body: 'Some benefits may be optional, restricted or priced separately. Ask whether accessories, passenger benefits, roadside support or geographically extended cover appear in the written quotation.' },
    ],
    checklist: ['Vehicle and owner details match the registration documents', 'Insured value and basis of valuation are clear', 'Excess or deductible for each type of claim is shown', 'Named drivers, usage and geographic restrictions are understood', 'Exclusions, depreciation and claim-document requirements are reviewed', 'Premium, taxes and any fees are separated in the final quotation'],
    questions: [
      { title: 'Is the cheapest quotation automatically best?', body: 'No. Compare like-for-like insured value, excess, exclusions, optional benefits and service terms. A lower premium can reflect narrower cover or a higher amount payable by you at claim time.' },
      { title: 'Can Khaacho issue or approve a policy?', body: 'No. Khaacho is an information and comparison platform. The insurer confirms eligibility, premium, policy issuance and claims decisions.' },
    ],
    sources: [{ title: 'Shikhar Insurance — Vehicle Insurance', url: 'https://shikharinsurance.com/products/vehicle-insurance' }, { title: 'Siddhartha Premier Insurance — Motor Insurance', url: 'https://siddharthapremier.com.np/?p=152' }, { title: 'Nepal Insurance Authority', url: 'https://nia.gov.np/' }],
  },
  health: {
    title: 'Health Insurance in Nepal',
    description: 'Learn how to compare health insurance in Nepal, including benefit limits, waiting periods, networks, exclusions and claims procedures.',
    summary: 'Health insurance products differ in who can be insured, eligible treatment, benefit limits, waiting periods, hospital arrangements and claims procedures. Treat a headline sum insured as only one part of the comparison.',
    availability: 'This page is educational. Interactive health-plan comparison is not yet available, and every benefit must be verified with the insurer.',
    choices: [
      { title: 'Hospital and treatment benefits', body: 'Check whether inpatient care, day-care procedures, diagnostics, medicines and emergency treatment are included, and whether each has a separate limit or sub-limit.' },
      { title: 'Waiting periods and exclusions', body: 'Do not assume a standard waiting period. The policy wording may apply different periods to pre-existing conditions, maternity or named treatments. Ask the insurer for the exact clause that applies to you.' },
      { title: 'Network and reimbursement', body: 'A network or cashless arrangement can change over time and may require pre-authorisation. Confirm the current hospital list, emergency procedure and reimbursement documentation directly with the insurer.' },
    ],
    checklist: ['Eligibility ages and family definitions suit the applicants', 'Overall limit and treatment-specific sub-limits are compared', 'Waiting periods are quoted from the current policy wording', 'Co-payment, deductible and room-category restrictions are understood', 'Current hospital network and pre-authorisation steps are confirmed', 'Renewal, cancellation and claim-notification terms are read'],
    questions: [{ title: 'Does every policy cover an existing illness?', body: 'No. Treatment of pre-existing conditions varies by product and may be excluded, delayed or subject to additional terms. Make complete and accurate disclosures and obtain the insurer’s written response.' }, { title: 'Is a listed hospital guaranteed to provide cashless service?', body: 'No. Networks and authorisation decisions can change. Confirm availability with both the insurer and hospital before planned treatment; follow the emergency process stated in the policy.' }],
    sources: [{ title: 'Shikhar Insurance — Health Insurance', url: 'https://shikharinsurance.com/products/health-insurance/' }, { title: 'Shikhar Insurance — Swasthya Surakshya', url: 'https://shikharinsurance.com/products/shikhar-swasthya-surakshya' }, { title: 'Nepal Insurance Authority — Digital Insurance Policy Guideline', url: 'https://www.nia.gov.np/Admin/images/Law/Directive/664c2a602f50f_1716267616.pdf' }],
  },
  life: {
    title: 'Life Insurance in Nepal',
    description: 'Understand term, endowment and whole-life insurance in Nepal, and compare cover periods, benefits, disclosures and exclusions.',
    summary: 'Life insurance can serve different goals: protection for a defined period, longer-duration protection, or products that combine insurance with savings features. Start with the financial need and policy term before comparing illustrations or premiums.',
    availability: 'This page is educational. Interactive life-plan comparison is not yet available, and Khaacho does not provide personal financial advice.',
    choices: [
      { title: 'Term insurance', body: 'Term products focus on protection for a stated period. Review the insured event, term, premium schedule, renewal conditions and exclusions rather than assuming all term products operate the same way.' },
      { title: 'Endowment or savings-linked products', body: 'These may include maturity or survival benefits alongside life cover. Request the official benefit illustration and distinguish guaranteed amounts from bonuses or other non-guaranteed values.' },
      { title: 'Whole-life or long-duration cover', body: 'These products are intended for longer protection. Check how long premiums are payable, when benefits become due and what happens if premiums stop.' },
    ],
    checklist: ['Purpose, beneficiaries, cover amount and term are defined first', 'Guaranteed and non-guaranteed benefits are separated', 'Medical and financial disclosures are complete and accurate', 'Exclusions and contestability-related terms are read', 'Premium frequency and consequences of missed payments are understood', 'Surrender, loan and paid-up terms are checked where relevant'],
    questions: [{ title: 'How much life cover should I buy?', body: 'There is no universal number. Consider outstanding debts, dependants’ ongoing needs, education costs, existing assets and the length of support required. For a personalised recommendation, use a suitably qualified adviser.' }, { title: 'Is an illustration a guaranteed return?', body: 'Not necessarily. Ask the insurer to identify which figures are contractually guaranteed and which depend on bonuses, declarations or assumptions.' }],
    sources: [{ title: 'Nepal Life Insurance — Products', url: 'https://www.nepallife.com.np/en/products' }, { title: 'Nepal Life Insurance — Term Products', url: 'https://www.nepallife.com.np/en/products/term' }, { title: 'Nepal Insurance Authority', url: 'https://nia.gov.np/' }],
  },
  travel: {
    title: 'Travel Insurance in Nepal',
    description: 'Learn how to compare travel insurance in Nepal, including medical limits, exclusions, destinations, activities and assistance.',
    summary: 'Travel insurance can include emergency medical costs and other journey-related benefits, but cover is limited by the destination, dates, traveller eligibility, declared conditions, activities and policy wording.',
    availability: 'This page is educational. Interactive travel-plan comparison is not yet available, and visa or entry acceptance must be confirmed with the relevant authority.',
    choices: [
      { title: 'Emergency medical cover', body: 'Compare the medical limit, deductible, evacuation or repatriation terms, pre-authorisation rules and exclusions for pre-existing conditions. Keep the assistance contact details available during travel.' },
      { title: 'Trip and baggage benefits', body: 'Cancellation, interruption, delay and baggage benefits may have separate triggers, limits and evidence requirements. A disruption by itself does not guarantee payment.' },
      { title: 'Destination and activities', body: 'Check territorial scope, travel advisories, trip duration, altitude and excluded activities. Trekking, adventure sports or work-related travel may need specific written acceptance.' },
    ],
    checklist: ['All destinations and the full travel period are covered', 'Medical and evacuation limits meet personal or visa needs', 'Existing medical conditions are disclosed and answered in writing', 'Planned sports, trekking, work and vehicle use are permitted', 'Cancellation and baggage evidence requirements are understood', 'Emergency assistance and claim contacts are saved offline'],
    questions: [{ title: 'Does a travel policy guarantee a visa?', body: 'No. Immigration or consular authorities decide their own requirements. Confirm current requirements directly with the relevant authority and ensure the certificate accurately reflects the purchased cover.' }, { title: 'Can I buy after the trip starts?', body: 'Eligibility and start-date rules depend on the insurer. Do not assume cover is active until the insurer has accepted the proposal and issued documentation showing the effective period.' }],
    sources: [{ title: 'Siddhartha Premier Insurance — Travel Medical Insurance Policy', url: 'https://siddharthapremier.com.np/wp-content/uploads/simple-file-list/TMI-Policy-SPIL.pdf' }, { title: 'Nepal Insurance Authority — Digital Insurance Policy Guideline', url: 'https://www.nia.gov.np/Admin/images/Law/Directive/664c2a602f50f_1716267616.pdf' }, { title: 'Nepal Insurance Authority', url: 'https://nia.gov.np/' }],
  },
};

export function generateStaticParams() { return allowedVerticals.map(vertical => ({ vertical })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical } = await params;
  if (!allowedVerticals.includes(vertical as Vertical)) return {};
  const guide = guides[vertical as Vertical];
  return pageMetadata(`/${vertical}`, `${guide.title} | Compare Cover`, guide.description, { alternates: { languages: vertical === 'motor' ? { en: '/motor', ne: '/np/motor', 'x-default': '/motor' } : undefined } });
}

export default async function CategoryPage({ params }: Props) {
  const vertical = (await params).vertical as Vertical;
  if (!allowedVerticals.includes(vertical)) notFound();
  const guide = guides[vertical];
  const url = absoluteUrl(`/${vertical}`);
  const schema = [
    { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#webpage`, name: guide.title, url, description: guide.description, inLanguage: 'en-NP', isPartOf: { '@id': `${absoluteUrl('/')}#website` }, dateModified: '2026-09-01', reviewedBy: { '@id': `${absoluteUrl('/reviewers/research-desk')}#organization` } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') }, { '@type': 'ListItem', position: 2, name: guide.title, item: url }] },
  ];
  return <div className="category-container animate-fade-up"><div className="container">
    <header className="category-header"><p className="eyebrow">Independent insurance information</p><h1 className="heading-1">{guide.title}</h1><p className="category-lead">{guide.description}</p><Link href={vertical === 'motor' ? '/wizard/motor' : '/compare'} className="btn btn-primary">{vertical === 'motor' ? 'Compare indicative motor plans' : 'View available comparisons'}</Link><p className="availability-note">{guide.availability}</p></header>
    <article className="category-content">
      <section aria-labelledby="how-it-works"><h2 id="how-it-works" className="heading-2">What this cover is designed to do</h2><p>{guide.summary}</p><p>Policy names are shortcuts, not contracts. Use this guide to prepare questions, then rely on the insurer’s current quotation, schedule and full policy wording for the final terms.</p></section>
      <section aria-labelledby="cover-choices"><h2 id="cover-choices" className="heading-2">Cover choices to compare</h2><div className="benefits-grid">{guide.choices.map(choice => <div className="benefit-card" key={choice.title}><h3>{choice.title}</h3><p>{choice.body}</p></div>)}</div></section>
      <section aria-labelledby="comparison-checklist"><h2 id="comparison-checklist" className="heading-2">Before you choose</h2><ul className="comparison-checklist">{guide.checklist.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section aria-labelledby="common-questions"><h2 id="common-questions" className="heading-2">Common questions</h2><div className="question-list">{guide.questions.map(question => <div key={question.title}><h3>{question.title}</h3><p>{question.body}</p></div>)}</div></section>
      <aside className="source-panel" aria-labelledby="sources"><h2 id="sources" className="heading-3">Primary sources</h2><p>Reviewed 1 September 2026. Insurer products and regulatory material can change; verify the latest document before acting.</p><ul>{guide.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul></aside>
    </article>
  </div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></div>;
}
