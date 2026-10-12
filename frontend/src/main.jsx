import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import { TimerProvider } from './context/TimerContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <TimerProvider>
          <App />
        </TimerProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
