
  export async function sortEmails(rawEmails) {
   console.log('the passed data: ', rawEmails)
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

      const response = await fetch('some-end-point/', {
        method: 'POST', 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rawEmails) 

      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      console.log('resp: ', response)
      const data = await response.json(); 
      console.log('Response data:', data);
      return data;
  
    } catch (error) {
      console.error('Error sending request:', error);
    }
  }