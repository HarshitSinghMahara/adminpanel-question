export const PREDEFINED_TAGS = [
  'Fact based',
  'Concept based',
  'Clinically integrated',
  'Image based',
  'Analytical skills',
  'Application based',
  'High yield',
  'Repeat question',
  'AIIMS pattern',
  'NEET pattern',
  'Previous year',
  'Recall based',
  'Reasoning',
  'Case based',
  'Data interpretation',
] as const

export type PredefinedTag = (typeof PREDEFINED_TAGS)[number]
