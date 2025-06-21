const puppeteer = require('puppeteer');
const logger = require('./logger');

class VisionSimulator {
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

    // Vision impairment definitions with CSS filters
    this.visionTypes = {
      normal: {
        name: 'Normal Vision',
        description: 'How the website appears to users with normal vision',
        filter: 'none',
        explanation: 'This is the baseline view that most users see.'
      },
      protanopia: {
        name: 'Protanopia',
        description: 'Red-blind color vision deficiency (1% of men)',
        filter: 'sepia(100%) hue-rotate(180deg) saturate(0.8)',
        explanation: 'Users cannot distinguish between red and green colors. Ensure information is not conveyed through color alone.'
      },
      deuteranopia: {
        name: 'Deuteranopia',
        description: 'Green-blind color vision deficiency (1% of men)',
        filter: 'sepia(100%) hue-rotate(90deg) saturate(0.6)',
        explanation: 'The most common form of color blindness. Red and green colors appear similar or identical.'
      },
      tritanopia: {
        name: 'Tritanopia',
        description: 'Blue-blind color vision deficiency (rare)',
        filter: 'sepia(100%) hue-rotate(270deg) saturate(0.7)',
        explanation: 'Users have difficulty distinguishing between blue and green, and between yellow and red.'
      },
      achromatopsia: {
        name: 'Achromatopsia',
        description: 'Complete color blindness (very rare)',
        filter: 'grayscale(100%)',
        explanation: 'Users see the world in shades of gray. All design must work without any color information.'
      },
      lowVision: {
        name: 'Low Vision',
        description: 'Blurred vision and reduced contrast sensitivity',
        filter: 'blur(2px) contrast(0.6) brightness(0.8)',
        explanation: 'Users have significantly reduced visual acuity. Text must be large and high contrast.'
      },
      cataracts: {
        name: 'Cataracts',
        description: 'Cloudy, hazy vision with glare sensitivity',
        filter: 'blur(1px) contrast(0.5) brightness(1.5) saturate(0.8)',
        explanation: 'Vision is cloudy and hazy, with increased sensitivity to bright lights and glare.'
      },
      diabeticRetinopathy: {
        name: 'Diabetic Retinopathy',
        description: 'Dark spots and blurred central vision',
        filter: 'blur(1.5px) contrast(0.7)',
        additionalCSS: `
          body::before {
            content: '';
            position: fixed;
            top: 40%;
            left: 40%;
            width: 20%;
            height: 20%;
            background: radial-gradient(circle, rgba(0,0,0,0.7) 30%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
          }
        `,
        explanation: 'Dark spots in central vision with overall blurriness. Critical information should not be centrally located.'
      },
      glaucoma: {
        name: 'Glaucoma',
        description: 'Peripheral vision loss (tunnel vision)',
        filter: 'none',
        additionalCSS: `
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, transparent 25%, rgba(0,0,0,0.8) 60%);
            pointer-events: none;
            z-index: 9999;
          }
        `,
        explanation: 'Severe peripheral vision loss creating tunnel vision. Important UI elements should be centrally located.'
      },
      maculaDegeneration: {
        name: 'Macular Degeneration',
        description: 'Central vision loss with dark spot',
        filter: 'contrast(0.8)',
        additionalCSS: `
          body::before {
            content: '';
            position: fixed;
            top: 45%;
            left: 45%;
            width: 10%;
            height: 10%;
            background: radial-gradient(circle, rgba(0,0,0,0.9) 50%, transparent 80%);
            pointer-events: none;
            z-index: 9999;
          }
        `,
        explanation: 'Central vision is blocked by a dark spot. Users rely on peripheral vision for navigation.'
      }
    };
  }

  async simulateVisionImpairments(url, visionTypes = null) {
    let browser;
    const results = [];

    try {
      logger.info(`Starting vision simulation for: ${url}`);
      
      browser = await puppeteer.launch(this.browserConfig);
      const page = await browser.newPage();
      
      // Set viewport and user agent
      await page.setViewport({ width: 1024, height: 768 }); // Reduced size for stability
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      
      // Navigate to URL
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      // Wait for page to be fully loaded
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Determine which vision types to simulate
      const typesToSimulate = visionTypes || Object.keys(this.visionTypes);

      for (const visionType of typesToSimulate) {
        if (!this.visionTypes[visionType]) {
          logger.warn(`Unknown vision type: ${visionType}`);
          continue;
        }

        const visionConfig = this.visionTypes[visionType];
        
        try {
          logger.info(`Capturing screenshot for: ${visionConfig.name}`);

          // Reset any previous styles
          await page.evaluate(() => {
            // Remove any previously added style tags
            const existingStyles = document.querySelectorAll('style');
            existingStyles.forEach(style => {
              if (style.innerHTML && (style.innerHTML.includes('filter:') || style.innerHTML.includes('html {'))) {
                style.remove();
              }
            });
          });

          // Apply vision-specific CSS
          let cssContent = `
            html {
              filter: ${visionConfig.filter} !important;
            }
          `;

          if (visionConfig.additionalCSS) {
            cssContent += visionConfig.additionalCSS;
          }

          await page.addStyleTag({
            content: cssContent
          });

          // Wait for filter to apply
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Capture screenshot
          const screenshot = await page.screenshot({
            type: 'png',
            fullPage: false // Change to false to avoid potential issues
          });

          results.push({
            type: visionType,
            name: visionConfig.name,
            description: visionConfig.description,
            explanation: visionConfig.explanation,
            screenshot: screenshot.toString('base64'),
            timestamp: new Date().toISOString()
          });

          logger.info(`Successfully captured ${visionConfig.name} simulation`);

        } catch (error) {
          logger.error(`Failed to capture ${visionConfig.name} simulation:`, error);
          results.push({
            type: visionType,
            name: visionConfig.name,
            description: visionConfig.description,
            explanation: visionConfig.explanation,
            error: `Failed to capture screenshot: ${error.message}`,
            timestamp: new Date().toISOString()
          });
        }
      }

      logger.info(`Vision simulation completed. Generated ${results.length} simulations`);
      
      return {
        url,
        simulations: results,
        generatedAt: new Date().toISOString(),
        totalSimulations: results.length
      };

    } catch (error) {
      logger.error('Vision simulation failed:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  getAvailableVisionTypes() {
    return Object.keys(this.visionTypes).map(key => ({
      type: key,
      name: this.visionTypes[key].name,
      description: this.visionTypes[key].description,
      explanation: this.visionTypes[key].explanation
    }));
  }

  async generateVisionReport(url, visionTypes = null) {
    const simulations = await this.simulateVisionImpairments(url, visionTypes);
    
    return {
      ...simulations,
      recommendations: this.generateAccessibilityRecommendations(),
      summary: {
        totalImpairments: simulations.simulations.length,
        successfulSimulations: simulations.simulations.filter(s => !s.error).length,
        failedSimulations: simulations.simulations.filter(s => s.error).length
      }
    };
  }

  generateAccessibilityRecommendations() {
    return [
      {
        category: 'Color and Contrast',
        recommendations: [
          'Use sufficient color contrast ratios (4.5:1 for normal text, 3:1 for large text)',
          'Never rely on color alone to convey information',
          'Provide text labels or patterns in addition to color coding',
          'Test your site with color blindness simulators'
        ]
      },
      {
        category: 'Visual Layout',
        recommendations: [
          'Ensure important information is not placed only in peripheral areas',
          'Provide multiple ways to access critical functionality',
          'Use clear, readable fonts at appropriate sizes',
          'Maintain consistent navigation and layout patterns'
        ]
      },
      {
        category: 'Low Vision Support',
        recommendations: [
          'Support browser zoom up to 200% without horizontal scrolling',
          'Provide high contrast mode options',
          'Use focus indicators that are clearly visible',
          'Ensure text can be resized without breaking layout'
        ]
      },
      {
        category: 'General Accessibility',
        recommendations: [
          'Provide alternative text for all images',
          'Use proper heading structure (h1, h2, h3, etc.)',
          'Ensure keyboard navigation works for all interactive elements',
          'Include skip links for main content areas'
        ]
      }
    ];
  }
}

module.exports = VisionSimulator;
