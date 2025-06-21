const axios = require('axios');

async function testVisionSimulation() {
  try {
    console.log('Testing vision simulation API...');
    
    // Test the vision types endpoint
    console.log('\n1. Testing /vision-types endpoint...');
    const visionTypesResponse = await axios.get('http://localhost:3001/vision-types');
    console.log(`✅ Vision types: ${visionTypesResponse.data.total} types available`);
    console.log('Available vision types:', visionTypesResponse.data.visionTypes.map(vt => vt.name).join(', '));
    
    // Test vision simulation with a simple page
    console.log('\n2. Testing /simulate-vision endpoint...');
    const testUrl = 'https://example.com';
    
    console.log(`Generating vision simulations for: ${testUrl}`);
    console.log('This may take 30-60 seconds...');
    
    const startTime = Date.now();
    const simulationResponse = await axios.post('http://localhost:3001/simulate-vision', {
      url: testUrl,
      visionTypes: ['normal', 'deuteranopia', 'lowVision'] // Test with a subset
    }, {
      timeout: 120000 // 2 minutes timeout
    });
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`✅ Vision simulation completed in ${duration} seconds`);
    console.log(`Generated ${simulationResponse.data.simulations.length} simulations`);
    console.log('Simulation types:', simulationResponse.data.simulations.map(s => s.name).join(', '));
    console.log(`Success rate: ${simulationResponse.data.summary.successfulSimulations}/${simulationResponse.data.summary.totalImpairments}`);
    
    console.log('\n✅ All tests passed! The vision simulation API is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testVisionSimulation();
