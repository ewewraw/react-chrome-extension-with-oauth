import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Create the root div and append to body (same as before)
const root = document.createElement("div")
root.className = "container"
document.body.appendChild(root)

// Get the head element
const head = document.getElementsByTagName('head')[0];

// Create the script element
const script = document.createElement('script');
script.src = 'https://accounts.google.com/gsi/client';
script.async = true;
script.defer = true;

// Append the script to the head
head.appendChild(script);

const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <>
  <head>
    <script type="text/javascript" src="oauth.js"></script>
    <script type="text/javascript" src="gmail.js"></script>
    <title>0-Mail</title>
  </head>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </>
);
