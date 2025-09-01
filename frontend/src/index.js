import React from 'react';
import ReactDOM from 'react-dom/client';
// Install API base URL shim before anything else
import './setupApiBaseUrl';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
