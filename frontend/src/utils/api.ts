import { AnalysisRequest, AnalysisResponse } from '../../../shared/types/analysis';
import { ERROR_MESSAGES } from '../../../shared/constants/errors';

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || ERROR_MESSAGES.SERVER_ERROR);
  }
  return response.json();
}

export async function analyzeWebsite(url: string): Promise<AnalysisResponse> {
  const request: AnalysisRequest = { url };
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  
  return handleApiResponse<AnalysisResponse>(response);
}
