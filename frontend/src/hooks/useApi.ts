'use client';

import { useState, useCallback } from 'react';
import { apiService, APIError } from '../services/api';
import { AnalysisResponse, HealthCheck } from '../../../shared/types/api';

interface UseAnalysisState {
  data: AnalysisResponse | null;
  loading: boolean;
  error: string | null;
}

export function useAnalysis() {
  const [state, setState] = useState<UseAnalysisState>({
    data: null,
    loading: false,
    error: null,
  });

  const analyzeWebsite = useCallback(async (url: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiService.analyzeWebsite(url);
      setState({
        data: result,
        loading: false,
        error: null,
      });
      return result;
    } catch (error) {
      const errorMessage = error instanceof APIError 
        ? error.message 
        : 'An unexpected error occurred';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    analyzeWebsite,
    clearError,
    reset,
  };
}

interface UseHealthCheckState {
  data: HealthCheck | null;
  loading: boolean;
  error: string | null;
  isHealthy: boolean;
}

export function useHealthCheck() {
  const [state, setState] = useState<UseHealthCheckState>({
    data: null,
    loading: false,
    error: null,
    isHealthy: false,
  });

  const checkHealth = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiService.checkHealth();
      setState({
        data: result,
        loading: false,
        error: null,
        isHealthy: result.status === 'healthy',
      });
      return result;
    } catch (error) {
      const errorMessage = error instanceof APIError 
        ? error.message 
        : 'Failed to check API health';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        isHealthy: false,
      });
      throw error;
    }
  }, []);

  return {
    ...state,
    checkHealth,
  };
}

// Hook for API status and information
export function useApiInfo() {
  const [state, setState] = useState<{
    data: any | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const getApiInfo = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiService.getApiInfo();
      setState({
        data: result,
        loading: false,
        error: null,
      });
      return result;
    } catch (error) {
      const errorMessage = error instanceof APIError 
        ? error.message 
        : 'Failed to get API information';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, []);

  return {
    ...state,
    getApiInfo,
  };
}
