import React from 'react';
// 1. ReactDOM-ஐ நீக்கிவிட்டு ViteReactSSG-ஐ import செய்கிறோம்
import { ViteReactSSG } from 'vite-react-ssg/single-page'; 
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './index.css';

// 2. createRoot-ஐ export செய்கிறோம் (SSG Build-க்காக)
export const createRoot = ViteReactSSG(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);