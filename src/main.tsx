import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import './index.css';
import App from './App.tsx';
import { SettingsProvider } from './hooks/use-settings.tsx';
import { ReloadPrompt } from './components/pwa/ReloadPrompt.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <App />
        <ReloadPrompt />
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
);
