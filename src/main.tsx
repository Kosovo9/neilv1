import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import { logger } from './lib/utils/logger';
import './index.css';

// Get Clerk publishable key
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

logger.log('🚀 Iniciando Studio Nexora...');
logger.log('📦 Variables de entorno:', {
  CLERK: clerkKey ? 'Configured' : 'Missing',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing',
  APP_URL: import.meta.env.VITE_APP_URL ? 'Configured' : 'Missing',
});

// Wait for DOM to be ready
function initApp() {
  logger.log('🔍 Buscando elemento root...');
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    logger.error('❌ ERROR: No se encontró el elemento #root');
    logger.error('El DOM actual:', document.body.innerHTML.substring(0, 200));
    // Show visible error
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: Arial; background: #f5f5f5;">
        <div style="text-align: center; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px;">
          <h1 style="color: #ef4444; margin-bottom: 16px;">⚠️ Error de Inicialización</h1>
          <p style="color: #666; margin-bottom: 24px;">No se encontró el elemento root. Verifica que index.html tenga &lt;div id="root"&gt;&lt;/div&gt;</p>
          <button onclick="window.location.reload()" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px;">🔄 Recargar Página</button>
        </div>
      </div>
    `;
    return;
  }
  
  logger.log('✅ Elemento root encontrado');
  logger.log('🎨 Renderizando aplicación...');
  
  try {
    // Render app with or without Clerk
    const AppWithAuth = clerkKey ? (
      <ClerkProvider publishableKey={clerkKey}>
        <App />
      </ClerkProvider>
    ) : (
      <App />
    );
    
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          {AppWithAuth}
        </ErrorBoundary>
      </StrictMode>
    );
    
    logger.log('✅ Aplicación renderizada exitosamente!');
  } catch (error) {
    logger.error('❌ Error al renderizar:', error);
    throw error;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  logger.log('⏳ Esperando a que el DOM esté listo...');
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  logger.log('✅ DOM ya está listo');
  initApp();
}
