'use client';

import { useState } from 'react';
import { useHealthCheck, useApiInfo } from '../hooks/useApi';

export default function APITestPanel() {
  const [testUrl, setTestUrl] = useState('https://example.com');
  const { isHealthy, checkHealth, data: healthData, loading: healthLoading } = useHealthCheck();
  const { getApiInfo, data: apiData, loading: apiLoading } = useApiInfo();

  const handleTestConnection = async () => {
    try {
      await checkHealth();
      await getApiInfo();
    } catch (error) {
      console.error('Connection test failed:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 API Connection Test</h3>
      
      <div className="space-y-4">
        <button
          onClick={handleTestConnection}
          disabled={healthLoading || apiLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {healthLoading || apiLoading ? 'Testing...' : 'Test API Connection'}
        </button>

        {/* Health Status */}
        {healthData && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <h4 className="font-medium text-green-900">✅ Health Check</h4>
            <p className="text-sm text-green-800">
              Status: {healthData.status} | Service: {healthData.service} | Version: {healthData.version}
            </p>
          </div>
        )}

        {/* API Info */}
        {apiData && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-medium text-blue-900">ℹ️ API Information</h4>
            <p className="text-sm text-blue-800 mb-2">{apiData.description}</p>
            <div className="text-xs text-blue-700">
              <p>Endpoints:</p>
              <ul className="list-disc list-inside ml-2">
                {Object.entries(apiData.endpoints || {}).map(([endpoint, description]) => (
                  <li key={endpoint}>{endpoint}: {description as string}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Quick Test Form */}
        <div className="border-t pt-4">
          <label htmlFor="test-url" className="block text-sm font-medium text-gray-700 mb-2">
            Quick Test URL
          </label>
          <div className="flex gap-2">
            <input
              id="test-url"
              type="url"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
            />
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
              onClick={() => setTestUrl('https://example.com')}
            >
              Reset
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use this to quickly test the analysis with a sample URL
          </p>
        </div>
      </div>
    </div>
  );
}
