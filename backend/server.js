require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import utilities
const logger = require('./utils/logger');
const GeminiService = require('./utils/geminiService');
const AccessibilityAnalyzer = require('./utils/accessibilityAnalyzer');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize services
const geminiService = new GeminiService();
const accessibilityAnalyzer = new AccessibilityAnalyzer();

// Rate limiting configuration
const createRateLimit = (windowMs, max, message, skipSuccessfulRequests = false) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
      res.status(429).json({ error: message });
    }
  });
};

// Different rate limits for different endpoints
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
);

const analyzeLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  10, // limit each IP to 10 analysis requests per 15 minutes
  'Too many analysis requests from this IP. Please wait before requesting more accessibility analyses.',
  true // don't count successful requests towards the limit
);

const heavyAnalyzeLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  25, // limit each IP to 25 analysis requests per hour
  'Hourly analysis limit exceeded. This helps us maintain service quality for all users.'
);

// Middleware
app.use(helmet());
app.use(cors());

// Apply rate limiting
app.use(generalLimiter); // Apply to all requests

app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Main accessibility analysis endpoint
app.post('/analyze', analyzeLimiter, heavyAnalyzeLimiter, async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }
  
  try {
    logger.info(`Starting analysis for URL: ${url}`);
    
    // Analyze the page
    const analysis = await accessibilityAnalyzer.analyzePage(url);
    
    // Process violations with Gemini
    const processedViolations = [];
    
    for (const violation of analysis.axeResults.violations.slice(0, 10)) { // Limit to first 10
      logger.info(`Processing violation: ${violation.id}`);
      
      // Get HTML snippet from first node
      const node = violation.nodes[0];
      const htmlSnippet = node.html || 'HTML snippet not available';
      
      const geminiAnalysis = await geminiService.analyzeAccessibilityViolation(
        url,
        violation.id,
        violation.description,
        htmlSnippet
      );
      
      processedViolations.push({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        tags: violation.tags,
        html: htmlSnippet,
        target: node.target,
        ...geminiAnalysis
      });
    }
    
    // Generate compliance summary
    const summary = accessibilityAnalyzer.generateComplianceSummary(
      analysis.axeResults.violations,
      analysis.pageInfo
    );
    
    // Prepare final response
    const response = {
      url,
      timestamp: analysis.timestamp,
      pageInfo: analysis.pageInfo,
      summary,
      screenshots: analysis.screenshots,
      violations: processedViolations,
      aodaCompliance: {
        isCompliant: summary.isCompliant,
        wcagLevel: summary.wcagLevel,
        complianceLevel: summary.complianceLevel,
        ontarioRequirements: summary.isCompliant ? 
          'Meets basic AODA requirements based on automated testing' : 
          'May not meet AODA requirements - manual review recommended',
        bilingualNote: 'Ensure French language accessibility equivalent to English content per AODA Section 14',
        recommendations: summary.recommendations
      },
      businessGuidance: {
        priority: processedViolations.filter(v => v.priority === 'critical').length > 0 ? 'immediate' : 'planned',
        estimatedFixes: processedViolations.length,
        complianceRisk: summary.criticalIssues > 0 ? 'high' : summary.seriousIssues > 0 ? 'medium' : 'low'
      }
    };
    
    logger.info(`Analysis completed for ${url}. Found ${processedViolations.length} violations.`);
    res.json(response);
    
  } catch (error) {
    logger.error('Analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze the website',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'AODA Accessibility Checker',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AODA Accessibility Checker API',
    description: 'Web-based accessibility checker for Canadian businesses',
    endpoints: {
      'POST /analyze': 'Analyze a website for AODA/WCAG compliance',
      'GET /health': 'Health check'
    },
    compliance: 'WCAG 2.0 AA / AODA (Accessibility for Ontarians with Disabilities Act)'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Please try again later'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`AODA Accessibility Checker running on port ${PORT}`);
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📋 API Documentation: http://localhost:${PORT}`);
});

module.exports = app;
