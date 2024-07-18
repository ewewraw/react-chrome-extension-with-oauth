import { sortEmails } from "./sorter";

export const getUnreadEmails = function() {
  getUnread()
    .then(unreadEmailsData => {
      // Once you have unreadEmailsData, you can use it
      // For example:
      console.log("unread: ", unreadEmailsData)
      sortEmails(unreadEmailsData).then(sorted => {
        console.log("Sorting...")
        console.log(sorted)
      }).catch(e => {
        console.error('Error sorting:', error);
      })

      console.log('Why nothing was logged before??')
    })
    .catch(error => {
      // Handle errors that occur during the entire process
      console.error('Error getting unread emails:', error);
    });
}

function getUnread() {
  return new Promise((resolve, reject) => {
    const unreadEmailsData = []; 

    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError); // Reject the promise on authentication error
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

        const fetchPromises = unreadEmailIds.map((emailId, index) => {
          // Calculate the delay for this request
          const delay = index * 200; // 200ms delay between each request 
      
          return new Promise(resolve => setTimeout(resolve, delay)) // Introduce the delay
              .then(() => {
                  return fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}?format=metadata`, {
                      headers: {
                          'Authorization': 'Bearer ' + token
                      }
                  })
                      .then(response => response.json()) 
                      .then(emailData => {
                          unreadEmailsData.push(emailData); 
                      });
              });
      });

        // Wait for all fetch promises to complete
        Promise.all(fetchPromises)
          .then(() => {
            resolve(unreadEmailsData); // Resolve the promise with the email data
          })
          .catch(error => {
            reject(error); // Reject the promise if any fetch fails
          });
      })
      .catch(error => {
        reject(error); // Reject the promise on error fetching unread email list
      });
    });
  });
}
  
  
  
  

