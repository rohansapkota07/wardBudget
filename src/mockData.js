export const MUNICIPALITY = {
  name: 'बनेपा नगरपालिका',
  nameEn: 'Banepa Municipality',
  district: 'Kavrepalanchok',
  fiscalYear: '२०८२/०८३',
  totalBudgetNPR: 163657100,
  wardCount: 14,
};

export const WARDS = [
  { id: 1,  name: 'वडा नं. १',  nameEn: 'Ward 1',  district: 'Kavrepalanchok' },
  { id: 2,  name: 'वडा नं. २',  nameEn: 'Ward 2',  district: 'Kavrepalanchok' },
  { id: 3,  name: 'वडा नं. ३',  nameEn: 'Ward 3',  district: 'Kavrepalanchok' },
  { id: 4,  name: 'वडा नं. ४',  nameEn: 'Ward 4',  district: 'Kavrepalanchok' },
  { id: 5,  name: 'वडा नं. ५',  nameEn: 'Ward 5',  district: 'Kavrepalanchok' },
  { id: 6,  name: 'वडा नं. ६',  nameEn: 'Ward 6',  district: 'Kavrepalanchok' },
  { id: 7,  name: 'वडा नं. ७',  nameEn: 'Ward 7',  district: 'Kavrepalanchok' },
  { id: 8,  name: 'वडा नं. ८',  nameEn: 'Ward 8',  district: 'Kavrepalanchok' },
  { id: 9,  name: 'वडा नं. ९',  nameEn: 'Ward 9',  district: 'Kavrepalanchok' },
  { id: 10, name: 'वडा नं. १०', nameEn: 'Ward 10', district: 'Kavrepalanchok' },
  { id: 11, name: 'वडा नं. ११', nameEn: 'Ward 11', district: 'Kavrepalanchok' },
  { id: 12, name: 'वडा नं. १२', nameEn: 'Ward 12', district: 'Kavrepalanchok' },
  { id: 13, name: 'वडा नं. १३', nameEn: 'Ward 13', district: 'Kavrepalanchok' },
  { id: 14, name: 'वडा नं. १४', nameEn: 'Ward 14', district: 'Kavrepalanchok' },
];

export const CATEGORIES = [
  'पूर्वाधार',
  'स्वास्थ्य',
  'शिक्षा',
  'खानेपानी तथा ढल',
  'कृषि',
  'सामाजिक सुरक्षा',
  'वातावरण',
  'प्रशासन',
];

export const STATUS = {
  ALLOCATED:   'Allocated',
  IN_PROGRESS: 'In Progress',
  COMPLETED:   'Completed',
  FLAGGED:     'Flagged',
};

export const formatNPR = (amount) => {
  if (!amount) return 'रु. ०';
  if (amount >= 100000000) return 'रु. ' + (amount / 100000000).toFixed(2) + ' अर्ब';
  if (amount >= 10000000)  return 'रु. ' + (amount / 10000000).toFixed(2) + ' करोड';
  if (amount >= 100000)    return 'रु. ' + (amount / 100000).toFixed(1) + ' लाख';
  if (amount >= 1000)      return 'रु. ' + (amount / 1000).toFixed(0) + 'K';
  return 'रु. ' + amount;
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Allocated':   return 'badge badge-allocated';
    case 'In Progress': return 'badge badge-progress';
    case 'Completed':   return 'badge badge-completed';
    case 'Flagged':     return 'badge badge-flagged';
    default: return 'badge';
  }
};
