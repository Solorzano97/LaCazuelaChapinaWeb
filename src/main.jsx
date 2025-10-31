import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Validar que el Client ID esté configurado
if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'TU_CLIENT_ID_DE_GOOGLE_AQUI') {
  console.error('⚠️ ERROR: VITE_GOOGLE_CLIENT_ID no está configurado correctamente.');
  console.error('Por favor, configura tu Client ID de Google en el archivo .env');
  console.error('Obtén tu Client ID en: https://console.cloud.google.com/apis/credentials');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'TU_CLIENT_ID_DE_GOOGLE_AQUI' ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuración Requerida</h1>
          <p className="text-gray-600 mb-6">
            El Client ID de Google no está configurado. Por favor, sigue estos pasos:
          </p>
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Ve a <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Google Cloud Console</a></li>
              <li>Crea o selecciona un proyecto</li>
              <li>Ve a "APIs y servicios" → "Credenciales"</li>
              <li>Crea un "ID de cliente OAuth 2.0"</li>
              <li>Tipo: "Aplicación web"</li>
              <li>Orígenes autorizados: <code className="bg-gray-200 px-1 rounded">http://localhost:5173</code></li>
              <li>Copia el Client ID y pégalo en el archivo <code className="bg-gray-200 px-1 rounded">.env</code></li>
            </ol>
          </div>
          <p className="text-sm text-gray-500">
            El archivo <code className="bg-gray-200 px-1 rounded">.env</code> debe contener:<br/>
            <code className="bg-gray-200 px-2 py-1 rounded block mt-2">VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui</code>
          </p>
        </div>
      </div>
    )}
  </StrictMode>,
)
