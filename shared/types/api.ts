export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface APIError {
  error: string;
  details?: string;
  status?: number;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  service: string;
  version: string;
  timestamp: string;
}

// Re-export types from analysis for convenience
export type { AnalysisRequest, AnalysisResponse } from './analysis';
