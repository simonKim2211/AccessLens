const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing AODA Accessibility Checker API...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('✅ Health check:', healthResponse.data.status);
    
    // Test root endpoint
    console.log('\n2. Testing root endpoint...');
    const rootResponse = await axios.get('http://localhost:3001/');
    console.log('✅ Service:', rootResponse.data.message);
    
    // Test analyze endpoint with a simple site
    console.log('\n3. Testing analyze endpoint with example.com...');
    const analyzeResponse = await axios.post('http://localhost:3001/analyze', {
      url: 'https://example.com'
    }, {
      timeout: 60000 // 60 second timeout
    });
    
    console.log('✅ Analysis completed!');
    console.log('📊 Summary:');
    console.log(`   - Total violations: ${analyzeResponse.data.summary.totalViolations}`);
    console.log(`   - Critical issues: ${analyzeResponse.data.summary.criticalIssues}`);
    console.log(`   - Serious issues: ${analyzeResponse.data.summary.seriousIssues}`);
    console.log(`   - Page title: ${analyzeResponse.data.pageInfo.title}`);
    console.log(`   - Language: ${analyzeResponse.data.pageInfo.lang}`);
    console.log(`   - AODA compliant: ${analyzeResponse.data.aodaCompliance.isCompliant}`);
    
    if (analyzeResponse.data.violations.length > 0) {
      console.log('\n🔍 Sample violation:');
      const violation = analyzeResponse.data.violations[0];
      console.log(`   - Issue: ${violation.id}`);
      console.log(`   - Impact: ${violation.impact}`);
      console.log(`   - Description: ${violation.description.substring(0, 100)}...`);
    }
    
    console.log('\n✅ All tests passed! API is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Install axios if not present
try {
  require('axios');
  testAPI();
} catch (error) {
  console.log('Installing axios...');
  const { exec } = require('child_process');
  exec('npm install axios', (error) => {
    if (error) {
      console.error('Failed to install axios:', error);
      return;
    }
    console.log('Axios installed, running tests...');
    delete require.cache[require.resolve('axios')];
    testAPI();
  });
}
