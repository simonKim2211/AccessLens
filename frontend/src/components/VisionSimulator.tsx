'use client';

import { useState } from 'react';
import { Eye, Download, Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface VisionSimulation {
  type: string;
  name: string;
  description: string;
  explanation: string;
  screenshot?: string;
  error?: string;
  timestamp: string;
}

interface VisionSimulationReport {
  url: string;
  simulations: VisionSimulation[];
  generatedAt: string;
  totalSimulations: number;
  recommendations: {
    category: string;
    recommendations: string[];
  }[];
  summary: {
    totalImpairments: number;
    successfulSimulations: number;
    failedSimulations: number;
  };
}

interface VisionSimulatorProps {
  url: string;
  onClose?: () => void;
}

export default function VisionSimulator({ url, onClose }: VisionSimulatorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<VisionSimulationReport | null>(null);
  const [error, setError] = useState('');
  const [selectedVision, setSelectedVision] = useState<string>('normal');

  const generateSimulations = async () => {
    if (!url) {
      setError('Please provide a valid URL');
      return;
    }

    setIsGenerating(true);
    setError('');
    setReport(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/simulate-vision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate vision simulations');
      }

      const data = await response.json();
      setReport(data);
      
      // Set the first available simulation as selected
      if (data.simulations && data.simulations.length > 0) {
        setSelectedVision(data.simulations[0].type);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate simulations');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (simulation: VisionSimulation) => {
    if (!simulation.screenshot) return;
    
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${simulation.screenshot}`;
    link.download = `${simulation.type}-simulation-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    if (!report) return;
    
    report.simulations.forEach((simulation) => {
      if (simulation.screenshot) {
        setTimeout(() => downloadImage(simulation), 100);
      }
    });
  };

  const getCurrentSimulation = () => {
    return report?.simulations.find(sim => sim.type === selectedVision);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-3 text-black">
          <Eye className="h-6 w-6 text-blue-600" />
          Visual Impairment Simulator
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        )}
      </div>

      {!report && !isGenerating && (
        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <Info className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-blue-900 mb-2">
              See Your Website Through Different Eyes
            </h4>
            <p className="text-blue-800 text-sm">
              Generate screenshots showing how your website appears to users with various visual impairments.
              This helps identify accessibility issues and improve your site's inclusivity.
            </p>
          </div>
          
          <button
            onClick={generateSimulations}
            disabled={!url}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            <Eye className="h-5 w-5" />
            Generate Vision Simulations
          </button>
          
          {!url && (
            <p className="mt-3 text-black text-sm">
              Enter a URL above to generate vision simulations
            </p>
          )}
        </div>
      )}

      {isGenerating && (
        <div className="text-center py-8">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h4 className="text-xl font-semibold mb-4 text-blue-700">Generating Vision Simulations...</h4>
          <p className="text-black mb-4">This may take 30-60 seconds while we:</p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-blue-800">
            <li className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              📸 Capture base screenshots
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              🎨 Apply vision filters
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              👁️ Generate multiple simulations
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              📋 Prepare accessibility insights
            </li>
          </ul>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <span className="font-semibold">Error:</span>
            {error}
          </div>
        </div>
      )}

      {report && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-black">Simulation Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-800">
                  {report.summary.totalImpairments}
                </div>
                <div className="text-sm text-black">Total Simulations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {report.summary.successfulSimulations}
                </div>
                <div className="text-sm text-black">Successful</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {report.summary.failedSimulations}
                </div>
                <div className="text-sm text-black">Failed</div>
              </div>
            </div>
          </div>

          {/* Vision Type Selector */}
          <div>
            <label htmlFor="vision-select" className="block text-sm font-medium text-black mb-2">
              Select Vision Type:
            </label>
            <select
              id="vision-select"
              value={selectedVision}
              onChange={(e) => setSelectedVision(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
              style={{ color: 'black' }}
            >
              {report.simulations.map((simulation) => (
                <option key={simulation.type} value={simulation.type} style={{ color: 'black' }}>
                  {simulation.name} - {simulation.description}
                </option>
              ))}
            </select>
          </div>

          {/* Current Simulation Display */}
          {getCurrentSimulation() && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg text-black">
                      {getCurrentSimulation()?.name}
                    </h4>
                    <p className="text-black">
                      {getCurrentSimulation()?.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => getCurrentSimulation() && downloadImage(getCurrentSimulation()!)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                      disabled={!getCurrentSimulation()?.screenshot}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Accessibility Impact:</strong> {getCurrentSimulation()?.explanation}
                  </p>
                </div>
              </div>
              
              <div className="p-4">
                {getCurrentSimulation()?.screenshot ? (
                  <img
                    src={`data:image/png;base64,${getCurrentSimulation()?.screenshot}`}
                    alt={`Website as seen with ${getCurrentSimulation()?.name}`}
                    className="w-full border rounded-lg shadow-sm"
                    loading="lazy"
                  />
                ) : getCurrentSimulation()?.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-700">Failed to generate this simulation</p>
                    <p className="text-red-600 text-sm">{getCurrentSimulation()?.error}</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-black">No screenshot available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bulk Download */}
          <div className="text-center">
            <button
              onClick={downloadAllImages}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
            >
              <Download className="h-4 w-4" />
              Download All Screenshots
            </button>
          </div>

          {/* Recommendations */}
          {report.recommendations && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-black mb-4">
                Accessibility Recommendations
              </h4>
              <div className="space-y-4">
                {report.recommendations.map((category, index) => (
                  <div key={index}>
                    <h5 className="font-medium text-gray-800 mb-2">
                      {category.category}
                    </h5>
                    <ul className="list-disc list-inside space-y-1">
                      {category.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="text-gray-700 text-sm">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
