'use client';

import { useState } from 'react';
import { useAnalysis } from '../hooks/useApi';

interface AnalysisFormProps {
  onAnalysisComplete?: (result: any) => void;
}

export default function AnalysisForm({ onAnalysisComplete }: AnalysisFormProps) {
  const [url, setUrl] = useState('');
  const { loading, error, analyzeWebsite, clearError } = useAnalysis();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      return;
    }

    try {
      const result = await analyzeWebsite(url.trim());
      onAnalysisComplete?.(result);
    } catch (error) {
      // Error is already handled in the hook
      console.error('Analysis failed:', error);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) {
      clearError();
    }
  };

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const canSubmit = url.trim() && isValidUrl(url.trim()) && !loading;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🔍 Website Accessibility Analysis
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="website-url" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Website URL to Analyze
          </label>
          <input
            id="website-url"
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-black bg-white"
            style={{ color: 'black' }}
            disabled={loading}
            required
          />
          {url && !isValidUrl(url) && (
            <p className="mt-2 text-sm text-red-600">
              Please enter a valid URL (including http:// or https://)
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Analysis Failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
            canSubmit
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Website...
            </div>
          ) : (
            '🚀 Start AODA Analysis'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          🇨🇦 About AODA Compliance
        </h3>
        <p className="text-sm text-blue-700">
          This tool checks your website against WCAG 2.0 AA standards and provides 
          guidance for AODA (Accessibility for Ontarians with Disabilities Act) compliance. 
          Results include automated testing and AI-powered recommendations.
        </p>
      </div>
    </div>
  );
}
