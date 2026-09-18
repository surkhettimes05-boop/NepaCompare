export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'REQUIREMENTS_PENDING'
  | 'REQUIREMENTS_VERIFIED'
  | 'QUOTE_REQUESTED'
  | 'QUOTE_RECEIVED'
  | 'CUSTOMER_DECIDING'
  | 'APPLICATION_STARTED'
  | 'DOCUMENTS_PENDING'
  | 'PAYMENT_PENDING'
  | 'POLICY_ISSUED'
  | 'LOST'
  | 'CANCELLED';

export type LeadPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type CommunicationType = 'SMS' | 'CALL' | 'EMAIL' | 'WHATSAPP';

export type LeadRecord = {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  product: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriority;
  assignedTo: string;
  assignedTeam: string;
  scope: string[];
  createdAt: string;
  updatedAt: string;
  notes: string[];
  activity: Array<{ type: string; message: string; timestamp: string; actor: string }>;
  quotes: Array<{ id: string; insurer: string; premium: string; status: string; createdAt: string }>;
  applications: Array<{ id: string; insurer: string; status: string; createdAt: string }>;
  policies: Array<{ id: string; insurer: string; number: string; premium: string; status: string }>;
  communicationHistory: Array<{ channel: CommunicationType; summary: string; timestamp: string; direction: 'INBOUND' | 'OUTBOUND' }>;
  customerProfile: {
    dob: string;
    district: string;
    province: string;
    vehicle: { make: string; model: string; registration: string; year: number };
    insuranceNeed: string;
  };
  auditTrail: Array<{ action: string; actor: string; timestamp: string; detail: string }>;
};

export const leadStatusOptions: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'REQUIREMENTS_PENDING',
  'REQUIREMENTS_VERIFIED',
  'QUOTE_REQUESTED',
  'QUOTE_RECEIVED',
  'CUSTOMER_DECIDING',
  'APPLICATION_STARTED',
  'DOCUMENTS_PENDING',
  'PAYMENT_PENDING',
  'POLICY_ISSUED',
  'LOST',
  'CANCELLED',
];

export const leadPriorityOptions: LeadPriority[] = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];

export const staffOptions = ['Aarati', 'Bikash', 'Nikita', 'Rabin', 'Sangita'];

export const leadSeed: LeadRecord[] = [
  {
    id: 'LD-1042',
    customerId: 'C-1001',
    customerName: 'Suman Gurung',
    phone: '9860123456',
    email: 'suman.gurung@gmail.com',
    product: 'Motor Insurance',
    source: 'Website',
    status: 'QUOTE_REQUESTED',
    priority: 'HIGH',
    assignedTo: 'Aarati',
    assignedTeam: 'Sales',
    scope: ['KTM', 'BKT'],
    createdAt: '2026-09-12T08:45:00.000Z',
    updatedAt: '2026-09-17T14:05:00.000Z',
    notes: ['Customer requested third-party and comprehensive plan comparison.', 'Driver has excellent KYC and valid license.'],
    activity: [
      { type: 'lead', message: 'Lead created from website quote request', timestamp: '2026-09-12T08:45:00.000Z', actor: 'Website Bot' },
      { type: 'call', message: 'Called customer to confirm vehicle details', timestamp: '2026-09-13T09:30:00.000Z', actor: 'Aarati' },
      { type: 'status', message: 'Status moved to QUOTE_REQUESTED', timestamp: '2026-09-14T12:10:00.000Z', actor: 'Aarati' },
    ],
    quotes: [
      { id: 'QT-2210', insurer: 'Neco Insurance', premium: 'NPR 17,500', status: 'Received', createdAt: '2026-09-15' },
      { id: 'QT-2211', insurer: 'Sanima', premium: 'NPR 19,200', status: 'Received', createdAt: '2026-09-16' },
    ],
    applications: [
      { id: 'APP-910', insurer: 'Neco Insurance', status: 'Documents pending', createdAt: '2026-09-16' },
    ],
    policies: [{ id: 'POL-881', insurer: 'Neco Insurance', number: 'NE-88219', premium: 'NPR 17,500', status: 'Active' }],
    communicationHistory: [
      { channel: 'SMS', summary: 'Sent quote summary and next steps', timestamp: '2026-09-15T15:00:00.000Z', direction: 'OUTBOUND' },
      { channel: 'CALL', summary: 'Confirmed vehicle registration and driver details', timestamp: '2026-09-13T09:30:00.000Z', direction: 'OUTBOUND' },
    ],
    customerProfile: {
      dob: '1991-06-04',
      district: 'Kathmandu',
      province: 'Bagmati',
      vehicle: { make: 'Honda', model: 'City', registration: 'Ba 2 Cha 3360', year: 2022 },
      insuranceNeed: 'Comprehensive cover with roadside assistance',
    },
    auditTrail: [
      { action: 'Lead assigned', actor: 'Aarati', timestamp: '2026-09-12T12:00:00.000Z', detail: 'Assigned to sales queue' },
      { action: 'Status update', actor: 'Aarati', timestamp: '2026-09-14T12:10:00.000Z', detail: 'Moved to QUOTE_REQUESTED' },
    ],
  },
  {
    id: 'LD-1038',
    customerId: 'C-1002',
    customerName: 'Prakash Shrestha',
    phone: '9843456789',
    email: 'prakash.shrestha@outlook.com',
    product: 'Motor Insurance',
    source: 'Referral',
    status: 'DOCUMENTS_PENDING',
    priority: 'URGENT',
    assignedTo: 'Rabin',
    assignedTeam: 'Operations',
    scope: ['KTM'],
    createdAt: '2026-09-10T09:15:00.000Z',
    updatedAt: '2026-09-17T10:22:00.000Z',
    notes: ['Customer requested urgent insurance before vehicle transfer.'],
    activity: [
      { type: 'lead', message: 'Referral received from a partner agent', timestamp: '2026-09-10T09:15:00.000Z', actor: 'Partner Team' },
      { type: 'document', message: 'Requested vehicle ownership documents', timestamp: '2026-09-16T11:00:00.000Z', actor: 'Rabin' },
    ],
    quotes: [{ id: 'QT-2190', insurer: 'Nepal Insurance', premium: 'NPR 21,900', status: 'Received', createdAt: '2026-09-14' }],
    applications: [{ id: 'APP-899', insurer: 'Nepal Insurance', status: 'Under review', createdAt: '2026-09-15' }],
    policies: [],
    communicationHistory: [
      { channel: 'WHATSAPP', summary: 'Shared required document checklist', timestamp: '2026-09-16T11:23:00.000Z', direction: 'OUTBOUND' },
      { channel: 'CALL', summary: 'Followed up on pending documents', timestamp: '2026-09-17T10:22:00.000Z', direction: 'OUTBOUND' },
    ],
    customerProfile: {
      dob: '1988-01-19',
      district: 'Lalitpur',
      province: 'Bagmati',
      vehicle: { make: 'Suzuki', model: 'Swift', registration: 'Lu 3 Pa 1189', year: 2021 },
      insuranceNeed: 'Fast-track policy before ownership transfer',
    },
    auditTrail: [
      { action: 'Priority escalated', actor: 'Operations', timestamp: '2026-09-17T10:22:00.000Z', detail: 'Urgent customer due to transfer deadline' },
    ],
  },
  {
    id: 'LD-1032',
    customerId: 'C-1003',
    customerName: 'Anita Karki',
    phone: '9801122334',
    email: 'anita.karki@gmail.com',
    product: 'Travel Insurance',
    source: 'Organic',
    status: 'CONTACTED',
    priority: 'NORMAL',
    assignedTo: 'Nikita',
    assignedTeam: 'Customer Support',
    scope: ['BKT', 'PKR'],
    createdAt: '2026-09-07T06:20:00.000Z',
    updatedAt: '2026-09-13T08:00:00.000Z',
    notes: ['Customer is comparing travel options but active motor lead is not yet in scope.'],
    activity: [
      { type: 'contact', message: 'Customer replied to enquiry and requested call back', timestamp: '2026-09-08T11:00:00.000Z', actor: 'Nikita' },
    ],
    quotes: [],
    applications: [],
    policies: [],
    communicationHistory: [{ channel: 'EMAIL', summary: 'Shared travel plan options', timestamp: '2026-09-08T11:30:00.000Z', direction: 'OUTBOUND' }],
    customerProfile: {
      dob: '1993-11-11',
      district: 'Bhaktapur',
      province: 'Bagmati',
      vehicle: { make: 'Hyundai', model: 'Creta', registration: 'Bh 3 Ka 8111', year: 2023 },
      insuranceNeed: 'Travel protection for upcoming international travel',
    },
    auditTrail: [{ action: 'Contact attempted', actor: 'Nikita', timestamp: '2026-09-08T11:00:00.000Z', detail: 'Customer replied to enquiry' }],
  },
  {
    id: 'LD-1026',
    customerId: 'C-1004',
    customerName: 'Dipesh Pandey',
    phone: '9819988991',
    email: 'dipesh.pandey@hotmail.com',
    product: 'Motor Insurance',
    source: 'Paid Search',
    status: 'APPLICATION_STARTED',
    priority: 'HIGH',
    assignedTo: 'Bikash',
    assignedTeam: 'Sales',
    scope: ['KTM'],
    createdAt: '2026-09-04T13:10:00.000Z',
    updatedAt: '2026-09-17T09:40:00.000Z',
    notes: ['Customer selected a preferred insurer and is preparing documents.'],
    activity: [
      { type: 'status', message: 'Application started after quote acceptance', timestamp: '2026-09-15T10:30:00.000Z', actor: 'Bikash' },
      { type: 'document', message: 'Uploaded driver license and vehicle ownership proof', timestamp: '2026-09-17T09:40:00.000Z', actor: 'Customer' },
    ],
    quotes: [{ id: 'QT-2144', insurer: 'Himalayan', premium: 'NPR 18,700', status: 'Accepted', createdAt: '2026-09-15' }],
    applications: [{ id: 'APP-878', insurer: 'Himalayan', status: 'In progress', createdAt: '2026-09-15' }],
    policies: [],
    communicationHistory: [{ channel: 'CALL', summary: 'Discussed quote comparison and preferred insurer', timestamp: '2026-09-15T10:00:00.000Z', direction: 'OUTBOUND' }],
    customerProfile: {
      dob: '1986-04-25',
      district: 'Kathmandu',
      province: 'Bagmati',
      vehicle: { make: 'Toyota', model: 'Corolla', registration: 'Ka 1 La 6744', year: 2020 },
      insuranceNeed: 'Affordable premium with flexible payment plan',
    },
    auditTrail: [{ action: 'Application started', actor: 'Bikash', timestamp: '2026-09-15T10:30:00.000Z', detail: 'Accepted quote from Himalayan' }],
  },
  {
    id: 'LD-1011',
    customerId: 'C-1005',
    customerName: 'Maya Rai',
    phone: '9809876543',
    email: 'maya.rai@gmail.com',
    product: 'Motor Insurance',
    source: 'Website',
    status: 'NEW',
    priority: 'LOW',
    assignedTo: 'Sangita',
    assignedTeam: 'Sales',
    scope: ['PKR', 'KTM'],
    createdAt: '2026-09-17T07:30:00.000Z',
    updatedAt: '2026-09-17T07:30:00.000Z',
    notes: ['Fresh lead without pricing request.'],
    activity: [{ type: 'lead', message: 'Lead created from homepage form', timestamp: '2026-09-17T07:30:00.000Z', actor: 'Website Bot' }],
    quotes: [],
    applications: [],
    policies: [],
    communicationHistory: [],
    customerProfile: {
      dob: '1995-09-14',
      district: 'Pokhara',
      province: 'Gandaki',
      vehicle: { make: 'Mitsubishi', model: 'Lancer', registration: 'Po 3 Ka 2022', year: 2019 },
      insuranceNeed: 'Basic third-party cover for commuter vehicle',
    },
    auditTrail: [{ action: 'Lead created', actor: 'Website Bot', timestamp: '2026-09-17T07:30:00.000Z', detail: 'Initial lead entry' }],
  },
];

export const customersSeed = [
  {
    id: 'C-1001',
    name: 'Suman Gurung',
    email: 'suman.gurung@gmail.com',
    phone: '9860123456',
    scope: ['KTM', 'BKT'],
    customerTier: 'Priority',
    vehicles: [
      { make: 'Honda', model: 'City', registration: 'Ba 2 Cha 3360', year: 2022, policyStatus: 'Active' },
    ],
    leads: ['LD-1042'],
    quotes: ['QT-2210', 'QT-2211'],
    applications: ['APP-910'],
    policies: ['POL-881'],
    renewals: ['REN-441'],
    claims: [],
    documents: ['Driving License', 'Vehicle Registration'],
    notes: ['Customer prefers insurer with easy claim support.'],
    communicationHistory: [
      { channel: 'CALL', summary: 'Approved comparison summary and requested final quote', timestamp: '2026-09-15T15:00:00.000Z', direction: 'INBOUND' },
    ],
    auditHistory: [
      { action: 'Customer profile updated', actor: 'Aarati', timestamp: '2026-09-15T15:00:00.000Z', detail: 'Added preferred insurer note' },
    ],
  },
  {
    id: 'C-1002',
    name: 'Prakash Shrestha',
    email: 'prakash.shrestha@outlook.com',
    phone: '9843456789',
    scope: ['KTM'],
    customerTier: 'VIP',
    vehicles: [{ make: 'Suzuki', model: 'Swift', registration: 'Lu 3 Pa 1189', year: 2021, policyStatus: 'Pending' }],
    leads: ['LD-1038'],
    quotes: ['QT-2190'],
    applications: ['APP-899'],
    policies: [],
    renewals: [],
    claims: [],
    documents: ['Vehicle ownership transfer form'],
    notes: ['Urgent due to transfer deadline.'],
    communicationHistory: [{ channel: 'WHATSAPP', summary: 'Shared checklist', timestamp: '2026-09-16T11:23:00.000Z', direction: 'OUTBOUND' }],
    auditHistory: [{ action: 'Escalated', actor: 'Operations', timestamp: '2026-09-17T10:22:00.000Z', detail: 'Priority increased in workflow' }],
  },
  {
    id: 'C-1003',
    name: 'Anita Karki',
    email: 'anita.karki@gmail.com',
    phone: '9801122334',
    scope: ['BKT', 'PKR'],
    customerTier: 'Standard',
    vehicles: [{ make: 'Hyundai', model: 'Creta', registration: 'Bh 3 Ka 8111', year: 2023, policyStatus: 'Not started' }],
    leads: ['LD-1032'],
    quotes: [],
    applications: [],
    policies: [],
    renewals: [],
    claims: [],
    documents: ['Travel itinerary'],
    notes: ['Customer is comparing travel insurance before departure.'],
    communicationHistory: [{ channel: 'EMAIL', summary: 'Sent travel plan options', timestamp: '2026-09-08T11:30:00.000Z', direction: 'OUTBOUND' }],
    auditHistory: [{ action: 'Contact attempted', actor: 'Nikita', timestamp: '2026-09-08T11:00:00.000Z', detail: 'Customer replied to enquiry' }],
  },
  {
    id: 'C-1004',
    name: 'Dipesh Pandey',
    email: 'dipesh.pandey@hotmail.com',
    phone: '9819988991',
    scope: ['KTM'],
    customerTier: 'Priority',
    vehicles: [{ make: 'Toyota', model: 'Corolla', registration: 'Ka 1 La 6744', year: 2020, policyStatus: 'Applying' }],
    leads: ['LD-1026'],
    quotes: ['QT-2144'],
    applications: ['APP-878'],
    policies: [],
    renewals: [],
    claims: [],
    documents: ['Driver license', 'Vehicle ownership proof'],
    notes: ['Application is in progress after quote acceptance.'],
    communicationHistory: [{ channel: 'CALL', summary: 'Preferred insurer selected and application started', timestamp: '2026-09-15T10:00:00.000Z', direction: 'OUTBOUND' }],
    auditHistory: [{ action: 'Application started', actor: 'Bikash', timestamp: '2026-09-15T10:30:00.000Z', detail: 'Accepted quote from Himalayan' }],
  },
  {
    id: 'C-1005',
    name: 'Maya Rai',
    email: 'maya.rai@gmail.com',
    phone: '9809876543',
    scope: ['PKR', 'KTM'],
    customerTier: 'Standard',
    vehicles: [{ make: 'Mitsubishi', model: 'Lancer', registration: 'Po 3 Ka 2022', year: 2019, policyStatus: 'New lead' }],
    leads: ['LD-1011'],
    quotes: [],
    applications: [],
    policies: [],
    renewals: [],
    claims: [],
    documents: [],
    notes: ['Fresh lead.'],
    communicationHistory: [],
    auditHistory: [{ action: 'Lead created', actor: 'Website Bot', timestamp: '2026-09-17T07:30:00.000Z', detail: 'Initial lead entry' }],
  },
];
