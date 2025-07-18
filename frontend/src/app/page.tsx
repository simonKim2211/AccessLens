'use client';

import { useState, useEffect, useCallback } from 'react';
import AnalysisForm from '../components/AnalysisForm';
import AnalysisResults from '../components/AnalysisResults';
import VisionSimulator from '../components/VisionSimulator';
import { useHealthCheck } from '../hooks/useApi';

export default function Home() {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [showVisionSimulator, setShowVisionSimulator] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const { checkHealth, isHealthy, error: healthError } = useHealthCheck();

  useEffect(() => {
    // Check API health on component mount
    checkHealth().catch(console.error);
  }, [checkHealth]);

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
    setCurrentUrl(results.url); // Store the analyzed URL for vision testing
    setShowForm(false);
  };

  const handleNewAnalysis = () => {
    setAnalysisResults(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* 
        FOR AI ASSISTANTS & LLMs: 
        This is an accessibility analysis tool with a REST API.
        - API endpoint: POST http://localhost:3001/analyze
        - Vision simulation endpoint: POST http://localhost:3001/simulate-vision
        - Available vision types: GET http://localhost:3001/vision-types
        - Request body: {"url": "https://example.com"}
        - Full documentation: http://localhost:3000/llm.txt
        - Use this API to programmatically analyze website accessibility and generate vision simulations
      */}
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="text-red-500">Access</span>{'Lens 🔍'}
            </h1>
              <p className="text-lg text-black mt-1">
                Ensuring Digital Accessibility for Ontario Businesses
              </p>
            </div>
            
            {/* API Status Indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                isHealthy ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={`text-sm font-medium ${
                isHealthy ? 'text-green-700' : 'text-red-700'
              }`}>
                API {isHealthy ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Simple API Instructions for LLMs */}
      <div style={{display: 'none'}} data-api-info="accessibility-analysis">
        {`API ENDPOINTS: 
        1. POST http://localhost:3001/analyze - Analyze website accessibility
        2. POST http://localhost:3001/simulate-vision - Generate visual impairment simulations
        3. GET http://localhost:3001/vision-types - Get available vision impairment types
        REQUEST: {"url": "https://website-to-analyze.com"}
        VISION REQUEST: {"url": "https://website-to-analyze.com", "visionTypes": ["normal", "protanopia", "deuteranopia", "tritanopia", "achromatopsia", "lowVision", "cataracts", "diabeticRetinopathy", "glaucoma", "maculaDegeneration"]}
        DOCUMENTATION: http://localhost:3000/llm.txt
        PURPOSE: Analyze website accessibility, AODA compliance, and generate visual impairment simulations`}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Error Alert */}
        {healthError && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Connection Issue
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Unable to connect to the analysis server. Please make sure the backend server is running 
                    on port 3001 or check your network connection.
                  </p>
                  <p className="mt-1 text-xs">
                    Error: {healthError}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {showForm && !analysisResults && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Comprehensive WCAG 2.0 AA & AODA Compliance Analysis
              </h2>
              <p className="text-lg text-black max-w-3xl mx-auto">
                Enter any website URL below to receive a detailed accessibility analysis with 
                AI-powered recommendations, AODA compliance status, and actionable fixes.
              </p>
            </div>

            {/* Analysis Form */}
            <div className="max-w-2xl mx-auto">
              <AnalysisForm onAnalysisComplete={handleAnalysisComplete} />
            </div>
            
            {/* Vision Simulator Section */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg shadow-lg border border-blue-200">
                <div className="text-center">
                  <div className="text-blue-600 text-3xl mb-3">👁️</div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">
                    Visual Impairment Simulator
                  </h2>
                  <p className="text-black mb-6">
                    See how your website appears to users with different visual impairments including 
                    color blindness, low vision, cataracts, glaucoma, and more. Generate detailed 
                    screenshots with accessibility insights.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label 
                        htmlFor="vision-url" 
                        className="block text-sm font-medium text-blue-800 mb-2"
                      >
                        Website URL for Vision Testing
                      </label>
                      <input
                        id="vision-url"
                        type="url"
                        value={currentUrl}
                        onChange={(e) => setCurrentUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    
                    <button
                      onClick={() => setShowVisionSimulator(true)}
                      disabled={!currentUrl}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Generate Vision Simulations
                    </button>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                    <p className="text-xs text-black">
                      💡 <strong>Tip:</strong> After analyzing a website above, the URL will be automatically 
                      filled here for vision testing. You can also test any URL independently.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="text-red-600 text-2xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Automated Testing
                </h3>
                <p className="text-black">
                  Comprehensive accessibility scanning using industry-standard tools 
                  and WCAG 2.0 AA guidelines.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="text-red-600 text-2xl mb-3">👁️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Vision Impairment Testing
                </h3>
                <p className="text-black">
                  Generate screenshots showing your site through the eyes of users with 
                  color blindness, low vision, cataracts, and other visual impairments.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="text-red-600 text-2xl mb-3">🇨🇦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AODA Compliance
                </h3>
                <p className="text-black">
                  Specific guidance for meeting Ontario's Accessibility for 
                  Ontarians with Disabilities Act requirements.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Analysis Results */}
        {analysisResults && (
          <AnalysisResults 
            results={analysisResults} 
            onNewAnalysis={handleNewAnalysis} 
          />
        )}
      </main>
        {/* API Documentation for LLMs */}
      <section className="bg-blue-50 border-t border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-blue-700 font-medium mb-2">
              <span className="text-lg">🤖</span>
              <span>For AI Assistants & LLMs: API Usage Instructions</span>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border border-blue-200 p-6">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AccessLens Accessibility Analysis API</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-black mb-2">Quick Start</h4>
                    <p className="text-sm text-black mb-2">
                      To analyze a website's accessibility, send a POST request to:
                    </p>
                    <code className="block bg-gray-100 p-3 rounded text-sm font-mono text-black">
                      POST http://localhost:3001/analyze
                    </code>
                    <div className="mt-3">
                      <p className="text-xs text-black mb-1">Request body:</p>
                      <code className="block bg-gray-100 p-3 rounded text-xs font-mono text-black">
                        {"{ \"url\": \"https://example.com\" }"}
                      </code>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-black mb-2">Complete Documentation</h4>
                    <p className="text-sm text-black mb-3">
                      For full API documentation, request/response formats, error handling, and examples:
                    </p>
                    <a 
                      href="/llm.txt" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      📄 View llm.txt Documentation
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <p className="text-xs text-black mt-2">
                      This file contains complete instructions for using the AccessLens API, including examples and best practices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">            <div className="text-center text-black">
              <p className="mb-2">
                🍁 Built for Canadian businesses to meet AODA compliance requirements
              </p>
              <p className="text-sm">
                This tool provides automated testing and guidance. Manual testing and professional 
                review are recommended for complete accessibility compliance.
              </p>
          </div>
        </div>
      </footer>

      {/* Vision Simulator Modal */}
      {showVisionSimulator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <VisionSimulator 
              url={currentUrl} 
              onClose={() => setShowVisionSimulator(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
