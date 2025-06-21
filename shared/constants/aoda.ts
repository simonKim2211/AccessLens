export const AODA_SECTIONS = {
  SECTION_14: {
    title: 'Information and Communications Standards',
    description: 'Requirements for accessible websites and digital content',
    deadline: '2021-01-01',
  },
  SECTION_11: {
    title: 'Information and Communication Standards',
    description: 'Accessible formats and communication supports',
    deadline: '2021-01-01',
  },
} as const;

export const COMPLIANCE_LEVELS = {
  COMPLIANT: 'compliant',
  PARTIAL: 'partial',
  NON_COMPLIANT: 'non-compliant',
} as const;

export const BUSINESS_SIZES = {
  SMALL: 'small', // 1-49 employees
  MEDIUM: 'medium', // 50-249 employees  
  LARGE: 'large', // 250+ employees
} as const;

export const ONTARIO_REQUIREMENTS = {
  WCAG_LEVEL: 'AA',
  DEADLINE: '2021-01-01',
  BILINGUAL: true,
  SECTORS: ['public', 'private', 'non-profit'],
} as const;
