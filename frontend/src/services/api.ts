import { 
  AnalysisRequest, 
  AnalysisResponse, 
  APIResponse, 
  HealthCheck 
} from '../../../shared/types/api';
import { API_ENDPOINTS, BASE_URL, HTTP_STATUS } from '../../../shared/constants/api';

class APIService {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.details
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      // Network or parsing errors
      throw new APIError(
        'Network error or server unavailable',
        0,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Analyze a website for accessibility violations
   */
  async analyzeWebsite(url: string): Promise<AnalysisResponse> {
    const requestData: AnalysisRequest = { url };
    
    return this.request<AnalysisResponse>(API_ENDPOINTS.ANALYZE, {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  /**
   * Check API health status
   */
  async checkHealth(): Promise<HealthCheck> {
    return this.request<HealthCheck>(API_ENDPOINTS.HEALTH, {
      method: 'GET',
    });
  }

  /**
   * Get API information
   */
  async getApiInfo(): Promise<any> {
    return this.request<any>('/', {
      method: 'GET',
    });
  }
}

// Custom error class for API errors
class APIError extends Error {
  public status: number;
  public details?: string;

  constructor(message: string, status: number = 0, details?: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

// Export singleton instance
export const apiService = new APIService();
export { APIService, APIError };
export type { AnalysisRequest, AnalysisResponse, HealthCheck };
