export const WCAG_LEVELS = {
  A: 'A',
  AA: 'AA',
  AAA: 'AAA',
} as const;

export const IMPACT_LEVELS = {
  CRITICAL: 'critical',
  SERIOUS: 'serious', 
  MODERATE: 'moderate',
  MINOR: 'minor',
} as const;

export const WCAG_PRINCIPLES = {
  PERCEIVABLE: 'perceivable',
  OPERABLE: 'operable',
  UNDERSTANDABLE: 'understandable',
  ROBUST: 'robust',
} as const;

export const COMMON_VIOLATIONS = {
  COLOR_CONTRAST: 'color-contrast',
  IMAGE_ALT: 'image-alt',
  HTML_HAS_LANG: 'html-has-lang',
  LABEL: 'label',
  BUTTON_NAME: 'button-name',
  LINK_NAME: 'link-name',
  HEADING_ORDER: 'heading-order',
  FOCUS_ORDER: 'focus-order-semantics',
} as const;
