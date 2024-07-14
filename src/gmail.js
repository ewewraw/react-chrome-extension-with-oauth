export const getUnreadEmails = function() {
  getUnread();
}



function getUnread() {
    const unreadEmailsData = []; 
  
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        // Handle authentication error in UI (e.g., display an error message)
        return;
      }
  
      fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread', { 
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(response => response.json())
      .then(data => {
        const unreadEmailIds = data.messages.map(message => message.id);
  
        processBatches(unreadEmailIds, token, unreadEmailsData)
          .then(() => {
            console.log("All unread emails data:", unreadEmailsData); 
            // Update UI to display the fetched email data
          });
      })
      .catch(error => {
        console.error('Error fetching unread email list:', error);
        // Handle this error appropriately in your UI
      });
    });
  }
  
  function processBatches(emailIds, token, unreadEmailsData, startIndex = 0) {
    const batchSize = 90;
    const endIndex = Math.min(startIndex + batchSize, emailIds.length);
    const batch = emailIds.slice(startIndex, endIndex);
  
    const fetchPromises = batch.map(emailId => {
      return fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}?format=metadata`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(response => response.json());
    });
  
    const batchStartTime = Date.now();
  
    return Promise.all(fetchPromises)
      .then(batchData => {
        unreadEmailsData.push(...batchData); 
  
        if (endIndex < emailIds.length) {
          const batchEndTime = Date.now();
          const batchDuration = batchEndTime - batchStartTime;
          const remainingDelay = Math.max(0, 10000 - batchDuration);
  
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(processBatches(emailIds, token, unreadEmailsData, endIndex)); 
            }, remainingDelay);
          });
        } else {
          return unreadEmailsData; 
        }
      })
      .catch(error => {
        console.error('Error fetching unread email details:', error);
        // Implement robust error handling, potentially with exponential backoff
        // Consider retrying the failed batch or informing the user about the error
      });
  }
  
  
  
  

