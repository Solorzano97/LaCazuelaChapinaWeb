import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Lock, Mail, User, Building2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7001/api';

function Login({ onLoginSuccess }) {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    sucursalId: 1
  });

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('usuario', JSON.stringify(data.data.usuario));
        onLoginSuccess(data.data);
      } else {
        setError(data.message || 'Error al autenticar');
      }
    } catch (err) {
      setError('Error al autenticar con Google');
      console.error('Error Google login:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Error al conectar con Google. Intenta de nuevo.');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint = modoRegistro ? '/auth/register' : '/auth/login';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('usuario', JSON.stringify(data.data.usuario));
        onLoginSuccess(data.data);
      } else {
        setError(data.message || 'Error en autenticación');
      }
    } catch (err) {
      setError(`Error al ${modoRegistro ? 'registrar' : 'iniciar sesión'}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-4xl">🫔</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">La Cazuela Chapina</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestión</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            {modoRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              text={modoRegistro ? 'signup_with' : 'signin_with'}
              theme="filled_blue"
              size="large"
              width="100%"
            />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">O continuar con email</span>
            </div>
          </div>

          <div>
            {modoRegistro && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Juan Pérez"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {modoRegistro && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sucursal</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={formData.sucursalId}
                    onChange={(e) => setFormData({...formData, sucursalId: parseInt(e.target.value)})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
                  >
                    <option value="1">Sucursal Centro</option>
                    <option value="2">Sucursal Zona 10</option>
                    <option value="3">Sucursal Antigua</option>
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Procesando...' : (modoRegistro ? 'Crear Cuenta' : 'Iniciar Sesión')}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setModoRegistro(!modoRegistro);
                setError('');
              }}
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
            >
              {modoRegistro 
                ? '¿Ya tienes cuenta? Inicia sesión' 
                : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          Sistema seguro con autenticación OAuth 2.0
        </p>
      </div>
    </div>
  );
}

export default Login;