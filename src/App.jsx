import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Warehouse, Sparkles, Menu, X, LogOut, User } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Productos from './components/Productos';
import Ventas from './components/Ventas';
import Inventario from './components/Inventario';
import ChatIA from './components/ChatIA';
import Login from './components/Login';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [paginaActual, setPaginaActual] = useState('dashboard');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (token && usuarioGuardado) {
      try {
        const decoded = jwtDecode(token);
        const exp = decoded.exp * 1000; // Convertir a milisegundos
        
        if (exp > Date.now()) {
          setIsAuthenticated(true);
          setUsuario(JSON.parse(usuarioGuardado));
        } else {
          // Token expirado
          handleLogout();
        }
      } catch (error) {
        console.error('Error al decodificar token:', error);
        handleLogout();
      }
    }
  };

  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true);
    setUsuario(data.usuario);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setIsAuthenticated(false);
    setUsuario(null);
  };

  const navegacion = [
    { id: 'dashboard', nombre: 'Dashboard', icono: LayoutDashboard, componente: Dashboard },
    { id: 'productos', nombre: 'Productos', icono: Package, componente: Productos },
    { id: 'ventas', nombre: 'Ventas', icono: ShoppingCart, componente: Ventas },
    { id: 'inventario', nombre: 'Inventario', icono: Warehouse, componente: Inventario },
    { id: 'ia', nombre: 'Asistente IA', icono: Sparkles, componente: ChatIA },
  ];

  const paginaSeleccionada = navegacion.find(nav => nav.id === paginaActual);
  const ComponenteActual = paginaSeleccionada?.componente || Dashboard;

  // Si no está autenticado, mostrar Login
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-emerald-600 to-teal-700 text-white">
        <div className="p-6 border-b border-emerald-500">
          <h1 className="text-2xl font-bold">La Cazuela Chapina</h1>
          <p className="text-emerald-100 text-sm mt-1">Sistema de Gestión</p>
        </div>
        
        {/* Info del Usuario */}
        {usuario && (
          <div className="px-4 py-3 border-b border-emerald-500">
            <div className="flex items-center gap-3 bg-emerald-500/30 rounded-lg p-3">
              <div className="bg-emerald-400 rounded-full p-2">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{usuario.nombre || usuario.email}</p>
                <p className="text-xs text-emerald-100 truncate">{usuario.email}</p>
              </div>
            </div>
          </div>
        )}
        
        <nav className="flex-1 p-4 space-y-2">
          {navegacion.map((item) => {
            const Icon = item.icono;
            const activo = paginaActual === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setPaginaActual(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activo
                    ? 'bg-white text-emerald-600 shadow-lg'
                    : 'text-emerald-50 hover:bg-emerald-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.nombre}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-emerald-500 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
          <div className="bg-emerald-500 rounded-lg p-4">
            <p className="text-sm font-medium">Sistema v1.0</p>
            <p className="text-xs text-emerald-100 mt-1">Todos los derechos reservados</p>
          </div>
        </div>
      </aside>

      {/* Mobile Menu */}
      <div className="md:hidden">
        {/* Overlay */}
        {menuAbierto && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMenuAbierto(false)}
          />
        )}

        {/* Sidebar Mobile */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-emerald-600 to-teal-700 text-white z-50 transform transition-transform duration-300 ${
            menuAbierto ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 border-b border-emerald-500 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">La Cazuela</h1>
              <p className="text-emerald-100 text-sm mt-1">Chapina</p>
            </div>
            <button
              onClick={() => setMenuAbierto(false)}
              className="text-white hover:bg-emerald-500 p-2 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {usuario && (
            <div className="px-4 py-3 border-b border-emerald-500">
              <div className="flex items-center gap-3 bg-emerald-500/30 rounded-lg p-3">
                <div className="bg-emerald-400 rounded-full p-2">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{usuario.nombre || usuario.email}</p>
                  <p className="text-xs text-emerald-100 truncate">{usuario.email}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 p-4 space-y-2">
            {navegacion.map((item) => {
              const Icon = item.icono;
              const activo = paginaActual === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setPaginaActual(item.id);
                    setMenuAbierto(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activo
                      ? 'bg-white text-emerald-600 shadow-lg'
                      : 'text-emerald-50 hover:bg-emerald-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.nombre}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-emerald-500">
            <button
              onClick={() => {
                handleLogout();
                setMenuAbierto(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setMenuAbierto(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">{paginaSeleccionada?.nombre}</h1>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-700"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <ComponenteActual />
      </main>
    </div>
  );
}

export default App;