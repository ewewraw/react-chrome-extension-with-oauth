export async function helloWorld() {
    try {
      // Get the JWT token using chrome.identity.getAuthToken
      const token = await new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(token);
          }
        });
      });
  
      // Make the fetch request with the token in the Authorization header
      const response = await fetch('https://email-sorter-1069217596542.europe-west2.run.app', {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      console.log('resp: ', response)
      const data = await response.json(); 
      console.log('Response data:', data);
  
    } catch (error) {
      console.error('Error sending request:', error);
    }
  }
  