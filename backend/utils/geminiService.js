const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('./logger');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
  }

  async analyzeAccessibilityViolation(url, axeRule, description, html) {
    const prompt = `You are a bilingual (English/French) accessibility expert for AODA compliance in Ontario, Canada.

Page URL: ${url}
Issue: ${axeRule} – ${description}
HTML snippet: ${html}

Task: Provide accessibility analysis in this EXACT JSON format:
{
  "explanation": "Plain language explanation in English of why this is important for WCAG 2.0 AA and AODA compliance",
  "explanationFr": "Explication en français simple de l'importance pour WCAG 2.0 AA et conformité AODA",
  "fixSample": "Corrected HTML/CSS code example",
  "screenReaderNarration": "How a screen reader would announce this content",
  "wcagCriteria": "Specific WCAG 2.0 success criteria violated",
  "aodaImpact": "Impact on AODA compliance and legal requirements in Ontario",
  "priority": "critical|high|medium|low",
  "businessImpact": "How this affects small Canadian businesses"
}

Ensure the response is valid JSON only, no additional text.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback parsing
      return JSON.parse(text);
      
    } catch (error) {
      logger.error('Gemini API error:', error);
      
      // Fallback response
      return {
        explanation: `WCAG 2.0 AA Issue: ${description}. This affects accessibility for users with disabilities and may violate Ontario's AODA requirements.`,
        explanationFr: `Problème WCAG 2.0 AA: ${description}. Ceci affecte l'accessibilité pour les utilisateurs avec des handicaps et peut violer les exigences AODA de l'Ontario.`,
        fixSample: "Manual review required - API unavailable",
        screenReaderNarration: "Content accessibility needs verification",
        wcagCriteria: "Manual review needed",
        aodaImpact: "Potential AODA compliance risk - manual review recommended",
        priority: "high",
        businessImpact: "May affect website accessibility compliance for Canadian businesses"
      };
    }
  }

  async generateScreenReaderNarration(pageContent, context = '') {
    const prompt = `Generate a screen reader narration for the following web content. 
    Focus on how assistive technology would announce this content to users.
    
    Context: ${context}
    Content: ${pageContent}
    
    Provide a natural, conversational narration that a screen reader would produce.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      logger.error('Screen reader narration generation failed:', error);
      return 'Screen reader narration unavailable - manual review needed';
    }
  }
}

module.exports = GeminiService;
