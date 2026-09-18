export type ContentRoute = {
  slug: string;
  title: string;
  description: string;
  href: string;
  summary: string;
};

export const contentArchitecture = {
  motor: {
    category: {
      slug: 'motor',
      title: 'Motor Insurance in Nepal',
      description: 'Understand motor insurance in Nepal, including third-party, comprehensive and renewal considerations before buying or renewing a policy.',
      href: '/motor',
      summary: 'Educational motor insurance content for Nepal, written to help buyers compare coverage and ask better questions before buying.',
    },
    guides: [
      {
        slug: 'motor/guides',
        title: 'Motor Insurance Guides',
        description: 'Travel through practical motor insurance articles covering renewal, cover differences and common questions.',
        href: '/motor/guides',
        summary: 'A hub for the most useful Nepal motor insurance articles and decision guides.',
      },
      {
        slug: 'motor/renewal',
        title: 'Insurance Renewal',
        description: 'Learn what to review when renewing a vehicle insurance policy, including IDV, excess, claims history and exclusions.',
        href: '/motor/renewal',
        summary: 'How to review your renewal terms without assuming the premium is the only important factor.',
      },
      {
        slug: 'motor/third-party',
        title: 'Third-Party Insurance',
        description: 'Understand the purpose and limits of third-party liability cover, which applies to injuries or property damage caused to others.',
        href: '/motor/third-party',
        summary: 'Educational explanation of third-party liability cover and when it may not pay for your own vehicle damage.',
      },
      {
        slug: 'motor/comprehensive',
        title: 'Comprehensive Insurance',
        description: 'Learn how comprehensive motor insurance may cover your own vehicle, while still being subject to exclusions, excess and policy wording.',
        href: '/motor/comprehensive',
        summary: 'A plain-language guide to understanding the broader protection and limitations of comprehensive cover.',
      },
      {
        slug: 'motor/faqs',
        title: 'Vehicle Insurance FAQs',
        description: 'Answering common questions about documents, cover types, premiums, renewals and claim requirements for motor insurance in Nepal.',
        href: '/motor/faqs',
        summary: 'Useful FAQ content for customers comparing policies and preparing documents before asking for a quote.',
      },
    ],
  },
} as const;

export const futureCategoryStarts = [
  '/motor',
  '/motor/guides',
  '/motor/renewal',
  '/motor/third-party',
  '/motor/comprehensive',
  '/motor/faqs',
];
