// Test CORS configuration
async function testCORS() {
  const backendUrl = 'https://dashboard-backend-nine-phi.vercel.app';
  const frontendOrigin = 'https://dashboard-frontend-one-pi.vercel.app';
  
  console.log('Testing CORS configuration...');
  console.log('Backend URL:', backendUrl);
  console.log('Frontend Origin:', frontendOrigin);
  
  try {
    // Test the basic health endpoint
    const healthResponse = await fetch(`${backendUrl}/`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Origin': frontendOrigin
      }
    });
    
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthText = await healthResponse.text();
      console.log('Health check response:', healthText);
    }
    
    // Test the whoami endpoint
    const whoamiResponse = await fetch(`${backendUrl}/auth/whoami`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Origin': frontendOrigin
      }
    });
    
    console.log('Whoami check status:', whoamiResponse.status);
    
    if (whoamiResponse.ok) {
      const whoamiData = await whoamiResponse.json();
      console.log('Whoami response:', whoamiData);
    } else {
      console.error('Whoami failed:', whoamiResponse.statusText);
    }
    
  } catch (error) {
    console.error('CORS test failed:', error);
  }
}

testCORS();
