import 'mac-scrollbar/dist/mac-scrollbar.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './app.tsx';
import './i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
