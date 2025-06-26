'use client';

interface AnalysisResultsProps {
  results: any;
  onNewAnalysis?: () => void;
}

export default function AnalysisResults({ results, onNewAnalysis }: AnalysisResultsProps) {
  if (!results) {
    return null;
  }

  const { 
    url, 
    timestamp, 
    pageInfo, 
    summary, 
    violations, 
    aodaCompliance, 
    businessGuidance 
  } = results;

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500';
      case 'serious': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'minor': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              📊 Analysis Results
            </h2>
            <p className="text-gray-600">{url}</p>
            <p className="text-sm text-gray-500">
              Analyzed on {formatTimestamp(timestamp)}
            </p>
          </div>
          <button
            onClick={onNewAnalysis}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            New Analysis
          </button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-xl font-semibold mb-4 text-black">🇨🇦 AODA Compliance Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className={`p-4 rounded-lg border-2 ${
              aodaCompliance.isCompliant 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h4 className={`font-semibold ${
                aodaCompliance.isCompliant ? 'text-green-800' : 'text-red-800'
              }`}>
                {aodaCompliance.isCompliant ? '✅ Compliant' : '❌ Non-Compliant'}
              </h4>
              <p className={`text-sm mt-1 ${
                aodaCompliance.isCompliant ? 'text-green-700' : 'text-red-700'
              }`}>
                WCAG {aodaCompliance.wcagLevel} - {aodaCompliance.complianceLevel}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-700">
                {aodaCompliance.ontarioRequirements}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                {aodaCompliance.bilingualNote}
              </p>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Business Impact</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Priority:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  businessGuidance.priority === 'immediate' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {businessGuidance.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Risk Level:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  businessGuidance.complianceRisk === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : businessGuidance.complianceRisk === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {businessGuidance.complianceRisk}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Estimated Fixes:</span>
                <span className="text-sm font-medium">{businessGuidance.estimatedFixes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-xl font-semibold mb-4 text-black">📈 Violation Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{summary.totalViolations}</div>
            <div className="text-sm text-gray-600">Total Issues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{summary.criticalIssues}</div>
            <div className="text-sm text-gray-600">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{summary.seriousIssues}</div>
            <div className="text-sm text-gray-600">Serious</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{summary.moderateIssues}</div>
            <div className="text-sm text-gray-600">Moderate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{summary.minorIssues}</div>
            <div className="text-sm text-gray-600">Minor</div>
          </div>
        </div>
      </div>

      {/* Page Information */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-xl font-semibold mb-4 text-black">📄 Page Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-600">Page Title</div>
            <div className="font-medium text-gray-700">{pageInfo.title || 'No title'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Language</div>
            <div className="font-medium text-gray-700">{pageInfo.lang || 'Not specified'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Images</div>
            <div className="font-medium text-gray-700">{pageInfo.imageCount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Links</div>
            <div className="font-medium text-gray-700">{pageInfo.linkCount}</div>
          </div>
        </div>
      </div>

      {/* Violations Details */}
      {violations && violations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-xl font-semibold mb-4 text-black">🔍 Detailed Violations</h3>
          <div className="space-y-4">
            {violations.map((violation: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-3 h-3 rounded-full ${getImpactColor(violation.impact)}`}></span>
                      <h4 className="font-semibold text-gray-900">{violation.id}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(violation.priority)}`}>
                        {violation.priority}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{violation.description}</p>
                    <p className="text-sm text-gray-600">{violation.help}</p>
                  </div>
                </div>
                
                {violation.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <h5 className="font-medium text-blue-900 mb-1">💡 AI Explanation</h5>
                    <p className="text-sm text-blue-800">{violation.explanation}</p>
                  </div>
                )}
                
                {violation.fixSample && (
                  <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                    <h5 className="font-medium text-green-900 mb-1">🔧 Suggested Fix</h5>
                    <pre className="text-sm text-green-800 whitespace-pre-wrap font-mono">{violation.fixSample}</pre>
                  </div>
                )}
                
                {violation.html && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      View HTML Element
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded border">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">{violation.html}</pre>
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {summary.recommendations && summary.recommendations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-xl font-semibold mb-4">💡 Recommendations</h3>
          <ul className="space-y-2">
            {summary.recommendations.map((recommendation: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
