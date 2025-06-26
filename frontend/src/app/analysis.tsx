'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertTriangle, Eye, ArrowLeft, Download } from 'lucide-react';
import VisionSimulator from '../components/VisionSimulator';

interface AnalysisResults {
  url: string;
  timestamp: string;
  pageInfo: {
    title: string;
    lang: string;
    url: string;
    hasH1: boolean;
    imageCount: number;
    linkCount: number;
    formCount: number;
  };
  summary: {
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
  };
  violations: Array<{
    id: string;
    impact: string;
    description: string;
    help: string;
    helpUrl: string;
    tags: string[];
    explanation?: string;
    fixSample?: string;
  }>;
  screenshots?: {
    original?: string;
    simulations?: Array<{
      type: string;
      description: string;
      screenshot: string;
    }>;
  };
  aodaCompliance: {
    isCompliant: boolean;
    wcagLevel: string;
    complianceLevel: string;
    ontarioRequirements: string;
    bilingualNote: string;
    recommendations: string[];
  };
}

export default function AnalysisPage() {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showVisionSimulator, setShowVisionSimulator] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Try to get results from sessionStorage or URL params
    const savedResults = sessionStorage.getItem('analysisResults');
    const urlParam = searchParams.get('url');
    
    if (savedResults) {
      try {
        const parsed = JSON.parse(savedResults);
        setResults(parsed);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load analysis results');
        setIsLoading(false);
      }
    } else if (urlParam) {
      // If no saved results but URL param exists, could trigger new analysis
      setError('No analysis results found. Please run an analysis first.');
      setIsLoading(false);
    } else {
      setError('No analysis results available');
      setIsLoading(false);
    }
  }, [searchParams]);

  const downloadReport = () => {
    if (!results) return;
    
    const reportData = {
      ...results,
      generatedAt: new Date().toISOString(),
      reportType: 'AODA Accessibility Analysis'
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accessibility-report-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Analysis Results</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🍁</div>
              <h1 className="text-2xl font-bold text-gray-900">
                Analysis Results
              </h1>
              <div className="text-xl">🇨🇦</div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={downloadReport}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Report
              </button>
              <a
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                New Analysis
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Info Header */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{results.pageInfo.title}</h2>
                <p className="text-gray-600">{results.url}</p>
                <p className="text-sm text-gray-500">Analyzed on {new Date(results.timestamp).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setShowVisionSimulator(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Eye className="h-5 w-5" />
                Vision Simulator
              </button>
            </div>
          </div>

          {/* Compliance Summary */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              📊 Accessibility Analysis Results
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="mb-2"><strong>Page:</strong> {results.pageInfo?.title}</p>
                <p className="mb-2"><strong>URL:</strong> {results.url}</p>
                <p className="mb-4">
                  <strong>AODA Status:</strong> {' '}
                  {results.aodaCompliance?.isCompliant ? (
                    <span className="text-green-600 font-semibold">✅ COMPLIANT</span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ NON-COMPLIANT</span>
                  )}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{results.summary?.totalViolations || 0}</div>
                  <div className="text-sm text-gray-600">Total Issues</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{results.summary?.criticalIssues || 0}</div>
                  <div className="text-sm text-gray-600">Critical</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{results.summary?.seriousIssues || 0}</div>
                  <div className="text-sm text-gray-600">Serious</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">{results.summary?.moderateIssues || 0}</div>
                  <div className="text-sm text-gray-600">Moderate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Violations List */}
          {results.violations && results.violations.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">🔍 Accessibility Issues Found</h3>
              <div className="space-y-4">
                {results.violations.map((violation, index) => (
                  <div key={index} className={`border-l-4 p-4 rounded-r-lg ${{
                    critical: 'border-red-500 bg-red-50',
                    serious: 'border-orange-500 bg-orange-50',
                    moderate: 'border-yellow-500 bg-yellow-50',
                    minor: 'border-blue-500 bg-blue-50'
                  }[violation.impact] || 'border-gray-500 bg-gray-50'}`}>
                    <h4 className="font-semibold text-lg mb-2">{violation.help}</h4>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase mb-3 ${{
                      critical: 'bg-red-200 text-red-800',
                      serious: 'bg-orange-200 text-orange-800',
                      moderate: 'bg-yellow-200 text-yellow-800',
                      minor: 'bg-blue-200 text-blue-800'
                    }[violation.impact] || 'bg-gray-200 text-gray-800'}`}>
                      {violation.impact}
                    </span>
                    <p className="mb-3"><strong>Issue:</strong> {violation.description}</p>
                    {violation.explanation && (
                      <p className="mb-3"><strong>Why it matters:</strong> {violation.explanation}</p>
                    )}
                    {violation.fixSample && (
                      <div className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                        <strong>How to fix:</strong>
                        <pre className="mt-1">{violation.fixSample}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vision Simulation Viewer */}
          {results.screenshots && (
            <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Eye className="h-6 w-6" />
                Basic Vision Simulations
              </h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <strong>Need more detailed vision testing?</strong> Use the "Vision Simulator" button above for comprehensive visual impairment simulations.
                </p>
              </div>

              {results.screenshots.simulations?.length > 0 ? (
                <>
                  <div className="mb-6">
                    <label htmlFor="vision-type" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Vision Type:
                    </label>
                    <select
                      id="vision-type"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-black bg-white rounded-md"
                      style={{ color: 'black' }}
                      defaultValue={results.screenshots.simulations[0]?.type}
                      onChange={(e) => {
                        const screenshots = document.querySelectorAll('.vision-simulation');
                        screenshots.forEach(img => {
                          if (img instanceof HTMLElement) {
                            img.style.display = 'none';
                          }
                        });
                        const selected = document.getElementById(`${e.target.value}-view`);
                        if (selected instanceof HTMLElement) {
                          selected.style.display = 'block';
                        }
                      }}
                    >
                      {results.screenshots.simulations.map((sim) => (
                        <option key={sim.type} value={sim.type} style={{ color: 'black' }}>
                          {sim.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-6">
                    {results.screenshots.simulations.map((simulation, index) => (
                      <div
                        key={simulation.type}
                        id={`${simulation.type}-view`}
                        className="vision-simulation"
                        style={{ display: index === 0 ? 'block' : 'none' }}
                      >
                        <h4 className="text-lg font-semibold mb-2 text-black">{simulation.description}</h4>
                        <div className="border rounded-lg overflow-hidden">
                          {simulation.screenshot && (
                            <img
                              src={`data:image/png;base64,${simulation.screenshot}`}
                              alt={`Website appearance with ${simulation.description}`}
                              className="w-full"
                              loading="lazy"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No basic vision simulations available</p>
                  <button
                    onClick={() => setShowVisionSimulator(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Eye className="h-4 w-4" />
                    Generate Detailed Vision Simulations
                  </button>
                </div>
              )}
            </div>
          )}

          {/* AODA Guidance */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-green-800 mb-4">🇨🇦 AODA Compliance Summary</h3>
            <div className="space-y-3 text-green-700">
              <p><strong>Ontario Requirements:</strong> {results.aodaCompliance?.ontarioRequirements}</p>
              <p><strong>Bilingual Note:</strong> {results.aodaCompliance?.bilingualNote}</p>
              {results.aodaCompliance?.recommendations && results.aodaCompliance.recommendations.length > 0 && (
                <div>
                  <p><strong>Recommendations:</strong></p>
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    {results.aodaCompliance.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vision Simulator Modal */}
        {showVisionSimulator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <VisionSimulator 
                url={results.url} 
                onClose={() => setShowVisionSimulator(false)} 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
