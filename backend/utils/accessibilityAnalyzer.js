const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const logger = require('./logger');

class AccessibilityAnalyzer {
  constructor() {
    this.browserConfig = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    };
  }

  async analyzePage(url) {
    let browser;
    
    try {
      logger.info(`Starting accessibility analysis for: ${url}`);
      
      browser = await puppeteer.launch(this.browserConfig);
      const page = await browser.newPage();
      
      // Set viewport and user agent
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      
      // Navigate to URL
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Get page info
      const pageInfo = await page.evaluate(() => ({
        title: document.title,
        lang: document.documentElement.lang || 'not-specified',
        url: window.location.href,
        hasH1: !!document.querySelector('h1'),
        imageCount: document.querySelectorAll('img').length,
        linkCount: document.querySelectorAll('a').length,
        formCount: document.querySelectorAll('form').length
      }));
      
      // Inject axe-core
      await page.addScriptTag({ content: axeCore.source });
      
      // Run axe-core analysis
      const axeResults = await page.evaluate(() => {
        return new Promise((resolve) => {
          // Configure axe with proper rules format
          axe.configure({
            tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
          });
          
          axe.run((err, results) => {
            if (err) {
              resolve({ violations: [], passes: [], incomplete: [] });
            } else {
              resolve(results);
            }
          });
        });
      });
      
      // Capture screenshots
      const screenshots = await this.captureScreenshots(page);
      
      logger.info(`Analysis completed. Found ${axeResults.violations.length} violations`);
      
      return {
        pageInfo,
        axeResults,
        screenshots,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      logger.error('Page analysis failed:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async captureScreenshots(page) {
    try {
      // Original screenshot
      const original = await page.screenshot({
        fullPage: true,
        type: 'png'
      });
      
      // Color-blind simulation (Deuteranopia - most common)
      await page.addStyleTag({
        content: `
          html {
            filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><defs><filter id="deuteranopia"><feColorMatrix values="0.43 0.72 -.15 0 0 0.34 0.57 0.09 0 0 -.02 0.03 1.00 0 0 0 0 0 1 0"/></filter></defs></svg>#deuteranopia') !important;
          }
        `
      });
      
      const colorBlind = await page.screenshot({
        fullPage: true,
        type: 'png'
      });
      
      // Remove color-blind filter and add blur for low vision simulation
      await page.addStyleTag({
        content: `
          html {
            filter: blur(3px) contrast(0.7) !important;
          }
        `
      });
      
      const blurryVision = await page.screenshot({
        fullPage: true,
        type: 'png'
      });
      
      return {
        original: original.toString('base64'),
        colorBlind: colorBlind.toString('base64'),
        blurryVision: blurryVision.toString('base64')
      };
      
    } catch (error) {
      logger.error('Screenshot capture failed:', error);
      throw error;
    }
  }

  processViolations(violations) {
    return violations.map(violation => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      tags: violation.tags,
      nodes: violation.nodes.slice(0, 5).map(node => ({
        html: node.html,
        target: node.target,
        failureSummary: node.failureSummary,
        xpath: node.xpath
      }))
    }));
  }

  generateComplianceSummary(violations, pageInfo) {
    const criticalIssues = violations.filter(v => v.impact === 'critical').length;
    const seriousIssues = violations.filter(v => v.impact === 'serious').length;
    const moderateIssues = violations.filter(v => v.impact === 'moderate').length;
    const minorIssues = violations.filter(v => v.impact === 'minor').length;
    
    const isCompliant = violations.length === 0;
    const complianceLevel = criticalIssues === 0 && seriousIssues === 0 ? 'AA' : 'Partial';
    
    return {
      totalViolations: violations.length,
      criticalIssues,
      seriousIssues,
      moderateIssues,
      minorIssues,
      isCompliant,
      complianceLevel,
      wcagLevel: 'AA',
      aodaStatus: isCompliant ? 'Compliant' : 'Non-compliant',
      recommendations: this.generateRecommendations(violations, pageInfo)
    };
  }

  generateRecommendations(violations, pageInfo) {
    const recommendations = [];
    
    if (!pageInfo.hasH1) {
      recommendations.push('Add a main heading (h1) to improve page structure');
    }
    
    if (!pageInfo.lang || pageInfo.lang === 'not-specified') {
      recommendations.push('Specify page language for screen readers (AODA requirement)');
    }
    
    if (violations.some(v => v.id === 'color-contrast')) {
      recommendations.push('Improve color contrast ratios to meet WCAG AA standards');
    }
    
    if (violations.some(v => v.id === 'image-alt')) {
      recommendations.push('Add alternative text to images for screen reader users');
    }
    
    if (violations.some(v => v.id === 'label')) {
      recommendations.push('Ensure all form controls have proper labels');
    }
    
    return recommendations;
  }
}

module.exports = AccessibilityAnalyzer;
