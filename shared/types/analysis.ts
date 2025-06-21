export interface AnalysisRequest {
  url: string;
}

export interface PageInfo {
  title: string;
  lang: string;
  url: string;
  hasH1: boolean;
  imageCount: number;
  linkCount: number;
  formCount: number;
}

export interface ComplianceSummary {
  totalViolations: number;
  criticalIssues: number;
  seriousIssues: number;
  moderateIssues: number;
  minorIssues: number;
  isCompliant: boolean;
  complianceLevel: string;
  wcagLevel: string;
  aodaStatus: string;
  recommendations: string[];
}

export interface Screenshots {
  original: string;
  colorBlind: string;
  blurryVision: string;
}

export interface AccessibilityViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  html: string;
  target: string[];
  explanation: string;
  explanationFr?: string;
  fixSample: string;
  screenReaderNarration: string;
  wcagCriteria?: string;
  aodaImpact?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  businessImpact?: string;
}

export interface AODACompliance {
  isCompliant: boolean;
  wcagLevel: string;
  complianceLevel: string;
  ontarioRequirements: string;
  bilingualNote: string;
  recommendations: string[];
}

export interface BusinessGuidance {
  priority: 'immediate' | 'planned';
  estimatedFixes: number;
  complianceRisk: 'high' | 'medium' | 'low';
}

export interface AnalysisResponse {
  url: string;
  timestamp: string;
  pageInfo: PageInfo;
  summary: ComplianceSummary;
  screenshots: Screenshots;
  violations: AccessibilityViolation[];
  aodaCompliance: AODACompliance;
  businessGuidance: BusinessGuidance;
}
