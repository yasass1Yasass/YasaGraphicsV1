import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// Register Service Worker for notifications (non-blocking)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
  // Handle navigation messages from the Service Worker after notification clicks
  navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
    const data: any = event.data;
    if (data && data.type === 'NAVIGATE' && typeof data.url === 'string') {
      window.location.href = data.url;
    }
  });
}
