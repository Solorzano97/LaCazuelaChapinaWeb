import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Warehouse, Sparkles, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Productos from './components/Productos';
import Ventas from './components/Ventas';
import Inventario from './components/Inventario';
import ChatIA from './components/ChatIA';

function App() {
  const [paginaActual, setPaginaActual] = useState('dashboard');
  const [menuAbierto, setMenuAbierto] = useState(false);

  const navegacion = [
    { id: 'dashboard', nombre: 'Dashboard', icono: LayoutDashboard, componente: Dashboard },
    { id: 'productos', nombre: 'Productos', icono: Package, componente: Productos },
    { id: 'ventas', nombre: 'Ventas', icono: ShoppingCart, componente: Ventas },
    { id: 'inventario', nombre: 'Inventario', icono: Warehouse, componente: Inventario },
    { id: 'ia', nombre: 'Asistente IA', icono: Sparkles, componente: ChatIA },
  ];

  const paginaSeleccionada = navegacion.find(nav => nav.id === paginaActual);
  const ComponenteActual = paginaSeleccionada?.componente || Dashboard;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-emerald-600 to-teal-700 text-white">
        <div className="p-6 border-b border-emerald-500">
          <h1 className="text-2xl font-bold">La Cazuela Chapina</h1>
          <p className="text-emerald-100 text-sm mt-1">Sistema de Gestión</p>
        </div>
        
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

        <div className="p-4 border-t border-emerald-500">
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

          <nav className="p-4 space-y-2">
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
            <div className="w-10"></div>
          </div>
        </div>

        {/* Page Content */}
        <ComponenteActual />
      </main>
    </div>
  );
}

export default App;