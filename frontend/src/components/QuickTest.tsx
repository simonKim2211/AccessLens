'use client';

import { useState } from 'react';
import { apiService } from '../services/api';

export default function QuickTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [testing, setTesting] = useState(false);

  const runQuickTest = async () => {
    setTesting(true);
    setTestResult('Testing...');
    
    try {
      // Test 1: Health check
      const health = await apiService.checkHealth();
      setTestResult(prev => prev + `\n✅ Health check: ${health.status}`);
      
      // Test 2: API info
      const info = await apiService.getApiInfo();
      setTestResult(prev => prev + `\n✅ API info: ${info.message}`);
      
      // Test 3: Quick analysis test
      const analysis = await apiService.analyzeWebsite('https://example.com');
      setTestResult(prev => prev + `\n✅ Analysis test: Found ${analysis.violations?.length || 0} violations`);
      
    } catch (error: any) {
      setTestResult(prev => prev + `\n❌ Error: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="font-semibold text-gray-900 mb-3">🧪 API Integration Test</h3>
      
      <button
        onClick={runQuickTest}
        disabled={testing}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-3"
      >
        {testing ? 'Testing...' : 'Run Quick Test'}
      </button>
      
      {testResult && (
        <pre className="text-sm bg-white p-3 rounded border overflow-auto max-h-32">
          {testResult}
        </pre>
      )}
    </div>
  );
}
