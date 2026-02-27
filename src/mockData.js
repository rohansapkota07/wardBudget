// ============================================================
// mockData.js — Simulated on-chain budget entries
// In production these come from your Anchor program accounts
// ============================================================

export const WARDS = [
  { id: 1, name: 'Ward 1 – Thamel', district: 'Kathmandu' },
  { id: 2, name: 'Ward 2 – Patan', district: 'Lalitpur' },
  { id: 3, name: 'Ward 3 – Bhaktapur', district: 'Bhaktapur' },
  { id: 4, name: 'Ward 4 – Kirtipur', district: 'Kathmandu' },
  { id: 5, name: 'Ward 5 – Boudha', district: 'Kathmandu' },
];

export const CATEGORIES = [
  'Infrastructure',
  'Health',
  'Education',
  'Sanitation',
  'Agriculture',
  'Social Welfare',
  'Administration',
];

export const STATUS = {
  ALLOCATED: 'Allocated',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  FLAGGED: 'Flagged',
};

export const MOCK_ENTRIES = [
  {
    id: 'ENT001',
    txSignature: '3xK9pQ...7mNz',
    wardId: 1,
    wardName: 'Ward 1 – Thamel',
    title: 'Road Repair – Thamel Chowk to Chhetrapati',
    description: 'Resurfacing of 1.2km road segment, includes drainage repair.',
    category: 'Infrastructure',
    amountNPR: 2500000,
    spentNPR: 1800000,
    status: STATUS.IN_PROGRESS,
    postedBy: '8xGf...K3mP',
    postedAt: '2025-01-15T09:30:00Z',
    flags: 0,
  },
  {
    id: 'ENT002',
    txSignature: '9aB2cR...4kWx',
    wardId: 1,
    wardName: 'Ward 1 – Thamel',
    title: 'Community Health Camp',
    description: 'Free health checkup and medicine distribution for ward residents.',
    category: 'Health',
    amountNPR: 350000,
    spentNPR: 350000,
    status: STATUS.COMPLETED,
    postedBy: '8xGf...K3mP',
    postedAt: '2025-01-10T11:00:00Z',
    flags: 0,
  },
  {
    id: 'ENT003',
    txSignature: '2mL7nV...1pQr',
    wardId: 2,
    wardName: 'Ward 2 – Patan',
    title: 'Primary School Renovation – Patan Model School',
    description: 'Roof replacement and classroom painting for 3 blocks.',
    category: 'Education',
    amountNPR: 1200000,
    spentNPR: 0,
    status: STATUS.ALLOCATED,
    postedBy: '5tHj...W9kL',
    postedAt: '2025-02-01T14:00:00Z',
    flags: 0,
  },
  {
    id: 'ENT004',
    txSignature: '7yC4dS...8nMo',
    wardId: 2,
    wardName: 'Ward 2 – Patan',
    title: 'Sewage Pipeline Extension – Mangalbazar',
    description: 'Extension of main sewage line by 800m covering 120 households.',
    category: 'Sanitation',
    amountNPR: 3800000,
    spentNPR: 3800000,
    status: STATUS.COMPLETED,
    postedBy: '5tHj...W9kL',
    postedAt: '2024-12-20T08:00:00Z',
    flags: 2,
  },
  {
    id: 'ENT005',
    txSignature: '1kP5eT...2rLm',
    wardId: 3,
    wardName: 'Ward 3 – Bhaktapur',
    title: 'Agricultural Equipment Subsidy',
    description: 'Distribution of subsidized tools and seeds for 80 farming families.',
    category: 'Agriculture',
    amountNPR: 600000,
    spentNPR: 420000,
    status: STATUS.IN_PROGRESS,
    postedBy: 'BhPq...Z2xN',
    postedAt: '2025-01-28T10:30:00Z',
    flags: 0,
  },
  {
    id: 'ENT006',
    txSignature: '4wQ8fU...5sSv',
    wardId: 4,
    wardName: 'Ward 4 – Kirtipur',
    title: 'Elderly Social Welfare Fund',
    description: 'Monthly allowance disbursement to 45 senior citizens.',
    category: 'Social Welfare',
    amountNPR: 270000,
    spentNPR: 270000,
    status: STATUS.COMPLETED,
    postedBy: 'KrRs...A7bC',
    postedAt: '2025-01-05T09:00:00Z',
    flags: 0,
  },
  {
    id: 'ENT007',
    txSignature: '6vN3gW...9tUz',
    wardId: 5,
    wardName: 'Ward 5 – Boudha',
    title: 'Street Lighting Installation – Ring Road Section',
    description: 'Solar-powered LED street lights for 2.5km stretch.',
    category: 'Infrastructure',
    amountNPR: 1750000,
    spentNPR: 500000,
    status: STATUS.FLAGGED,
    postedBy: 'BdKk...P1yM',
    postedAt: '2025-01-20T13:00:00Z',
    flags: 4,
  },
];

export const formatNPR = (amount) => {
  if (amount >= 10000000) return `Rs ${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `Rs ${(amount / 100000).toFixed(1)} L`;
  if (amount >= 1000) return `Rs ${(amount / 1000).toFixed(0)}K`;
  return `Rs ${amount}`;
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case STATUS.ALLOCATED:   return 'badge badge-allocated';
    case STATUS.IN_PROGRESS: return 'badge badge-progress';
    case STATUS.COMPLETED:   return 'badge badge-completed';
    case STATUS.FLAGGED:     return 'badge badge-flagged';
    default: return 'badge';
  }
};
