'use client';

import { useState } from 'react';
import { Search, Shield, Globe, CheckCircle2, AlertTriangle, Eye, Palette, Volume2 } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const analyzeWebsite = async () => {
    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🍁</div>
              <h1 className="text-2xl font-bold text-gray-900">
                AODA Accessibility Checker
              </h1>
              <div className="text-xl">🇨🇦</div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-red-600 transition-colors">About AODA</a>
              <a href="#" className="text-gray-600 hover:text-red-600 transition-colors">Resources</a>
              <a href="#" className="text-gray-600 hover:text-red-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ensure Your Website Meets AODA Standards
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Help your Canadian business meet accessibility requirements with our AODA compliance checker. 
            Get automated testing + AI-powered insights in plain language.
          </p>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Eye className="h-8 w-8 text-red-600 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Visual Simulations</h3>
              <p className="text-gray-600 text-sm">See how your site appears to users with visual impairments</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Volume2 className="h-8 w-8 text-red-600 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Screen Reader Testing</h3>
              <p className="text-gray-600 text-sm">AI-powered analysis of screen reader compatibility</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Shield className="h-8 w-8 text-red-600 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">AODA Compliance</h3>
              <p className="text-gray-600 text-sm">Ontario-specific legal compliance guidance</p>
            </div>
          </div>
        </div>

        {/* URL Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <label htmlFor="url-input" className="block text-lg font-semibold text-gray-900 mb-4">
              Website URL to Analyze:
            </label>
            <div className="flex gap-4">
              <input
                id="url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-lg"
                disabled={isAnalyzing}
              />
              <button
                onClick={analyzeWebsite}
                disabled={isAnalyzing || !url}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Analyze
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-4">🚀 Analyzing your website...</h3>
            <p className="text-gray-600 mb-4">This may take 30-60 seconds while we:</p>
            <ul className="text-left max-w-md mx-auto space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                📸 Capture screenshots
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                🔍 Run accessibility tests
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                🤖 Generate AI-powered insights
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                📋 Prepare AODA compliance report
              </li>
            </ul>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-8">
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
                  Vision Impairment Simulation
                </h3>
                
                {results.screenshots.simulations?.length > 0 ? (
                  <>
                    <div className="mb-6">
                      <label htmlFor="vision-type" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Vision Type:
                      </label>
                      <select
                        id="vision-type"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
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
                          <option key={sim.type} value={sim.type}>
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
                          style={{ display: index === 0 ? 'block' : 'none' }}
                        >
                          <h4 className="text-lg font-semibold mb-2">{simulation.description}</h4>
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
                  <p className="text-gray-500">No vision simulations available</p>
                )}
              </div>
            )}

            {/* AODA Guidance */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-black-800 mb-4">🇨🇦 AODA Compliance Summary</h3>
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
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About AODA</h3>
              <p className="text-gray-300 text-sm">
                The Accessibility for Ontarians with Disabilities Act (AODA) requires Ontario businesses 
                to make their websites accessible to people with disabilities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">WCAG 2.0 Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AODA Requirements</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessibility Testing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Report Issues</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 AODA Accessibility Checker. Built for Canadian businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
