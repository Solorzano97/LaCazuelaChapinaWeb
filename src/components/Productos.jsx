import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Package } from 'lucide-react';
import { productosService, atributosService } from '../services/apiService';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [atributos, setAtributos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [configuracion, setConfiguracion] = useState({});

  useEffect(() => {
    cargarProductos();
    cargarAtributos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await productosService.getAll();
      setProductos(response.data.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarAtributos = async () => {
    try {
      const response = await atributosService.getTodos();
      setAtributos(response.data.data);
    } catch (error) {
      console.error('Error al cargar atributos:', error);
    }
  };

  const productosFiltrados = productos.filter(producto => {
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleTipo = filtroTipo === 'todos' || 
                       producto.tipo.toLowerCase() === filtroTipo.toLowerCase();
    return cumpleBusqueda && cumpleTipo;
  });

  const abrirPersonalizador = (producto) => {
    setProductoSeleccionado(producto);
    setConfiguracion({});
    setMostrarModal(true);
  };

  const calcularPrecioTotal = () => {
    if (!productoSeleccionado || !atributos) return productoSeleccionado?.precioBase || 0;

    let total = productoSeleccionado.precioBase;

    if (productoSeleccionado.tipo === 'Tamal') {
      const masa = atributos.tamales.masas.find(m => m.id === configuracion.masaId);
      const relleno = atributos.tamales.rellenos.find(r => r.id === configuracion.rellenoId);
      const envoltura = atributos.tamales.envolturas.find(e => e.id === configuracion.envolturaId);
      const picante = atributos.tamales.picantes.find(p => p.id === configuracion.picanteId);

      total += (masa?.costoAdicional || 0);
      total += (relleno?.costoAdicional || 0);
      total += (envoltura?.costoAdicional || 0);
      total += (picante?.costoAdicional || 0);
    } else if (productoSeleccionado.tipo === 'Bebida') {
      const tipo = atributos.bebidas.tipos.find(t => t.id === configuracion.tipoId);
      const endulzante = atributos.bebidas.endulzantes.find(e => e.id === configuracion.endulzanteId);
      const topping = atributos.bebidas.toppings.find(t => t.id === configuracion.toppingId);

      total += (tipo?.costoAdicional || 0);
      total += (endulzante?.costoAdicional || 0);
      total += (topping?.costoAdicional || 0);
    }

    return total;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
          <p className="text-gray-600 mt-2">Tamales y bebidas tradicionales guatemaltecas</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
              >
                <option value="todos">Todos los productos</option>
                <option value="tamal">Tamales</option>
                <option value="bebida">Bebidas</option>
              </select>
            </div>

            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Plus className="w-5 h-5" />
              Nuevo Producto
            </button>
          </div>
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosFiltrados.map((producto) => (
            <div key={producto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`h-40 flex items-center justify-center ${
                producto.tipo === 'Tamal' ? 'bg-gradient-to-br from-amber-100 to-orange-100' : 'bg-gradient-to-br from-blue-100 to-cyan-100'
              }`}>
                <Package className={`w-16 h-16 ${producto.tipo === 'Tamal' ? 'text-amber-600' : 'text-blue-600'}`} />
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{producto.nombre}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      producto.tipo === 'Tamal' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {producto.tipo}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">
                    Q{producto.precioBase.toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {producto.tipo === 'Tamal' 
                    ? 'Personaliza tu tamal con masa, relleno, envoltura y picante'
                    : 'Personaliza tu bebida con tipo, endulzante y topping'}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => abrirPersonalizador(producto)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Personalizar
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {productosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No se encontraron productos</p>
          </div>
        )}

        {/* Modal Personalizador */}
        {mostrarModal && productoSeleccionado && atributos && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Personalizar {productoSeleccionado.nombre}
                  </h2>
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {productoSeleccionado.tipo === 'Tamal' ? (
                  <div className="space-y-6">
                    {/* Masa */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Masa</label>
                      <div className="grid grid-cols-3 gap-3">
                        {atributos.tamales.masas.map((masa) => (
                          <button
                            key={masa.id}
                            onClick={() => setConfiguracion({...configuracion, masaId: masa.id})}
                            className={`p-3 border rounded-lg text-sm transition-colors ${
                              configuracion.masaId === masa.id
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-300 hover:border-emerald-300'
                            }`}
                          >
                            <div className="font-medium">{masa.nombre}</div>
                            {masa.costoAdicional > 0 && (
                              <div className="text-xs text-gray-500">+Q{masa.costoAdicional}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Relleno */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Relleno</label>
                      <div className="grid grid-cols-2 gap-3">
                        {atributos.tamales.rellenos.map((relleno) => (
                          <button
                            key={relleno.id}
                            onClick={() => setConfiguracion({...configuracion, rellenoId: relleno.id})}
                            className={`p-3 border rounded-lg text-sm transition-colors ${
                              configuracion.rellenoId === relleno.id
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-300 hover:border-emerald-300'
                            }`}
                          >
                            <div className="font-medium">{relleno.nombre}</div>
                            {relleno.costoAdicional > 0 && (
                              <div className="text-xs text-gray-500">+Q{relleno.costoAdicional}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Envoltura */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Envoltura</label>
                      <div className="grid grid-cols-2 gap-3">
                        {atributos.tamales.envolturas.map((envoltura) => (
                          <button
                            key={envoltura.id}
                            onClick={() => setConfiguracion({...configuracion, envolturaId: envoltura.id})}
                            className={`p-3 border rounded-lg text-sm transition-colors ${
                              configuracion.envolturaId === envoltura.id
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-300 hover:border-emerald-300'
                            }`}
                          >
                            <div className="font-medium">{envoltura.nombre}</div>
                            {envoltura.costoAdicional > 0 && (
                              <div className="text-xs text-gray-500">+Q{envoltura.costoAdicional}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Picante */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Picante</label>
                      <div className="grid grid-cols-3 gap-3">
                        {atributos.tamales.picantes.map((picante) => (
                          <button
                            key={picante.id}
                            onClick={() => setConfiguracion({...configuracion, picanteId: picante.id})}
                            className={`p-3 border rounded-lg text-sm transition-colors ${
                              configuracion.picanteId === picante.id
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-300 hover:border-emerald-300'
                            }`}
                          >
                            <div className="font-medium">{picante.nombre}</div>
                            {picante.costoAdicional > 0 && (
                              <div className="text-xs text-gray-500">+Q{picante.costoAdicional}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Tipo Bebida */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Bebida</label>
                      <div className="grid grid-cols-2 gap-3">
                        {atributos.bebidas.tipos.map((tipo) => (
                          <button
                            key={tipo.id}
                            onClick={() => setConfiguracion({...configuracion, tipoId: tipo.id})}
                            className={`p-3 border rounded-lg text-sm transition-colors ${
                              configuracion.tipoId === tipo.id
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-300'
                            }`}
                          >
                            <div className="font-medium">{tipo.nombre}</div>
                            {tipo.costoAdicional > 0 && (
                              <div className="text-xs text-gray-500">+Q{tipo.costoAdicional}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Endulzante */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Endulzante</label>
                      <div className="grid grid-cols-3 gap-3">
                        {atributos.bebidas.endulzantes.map((endulzante) => (
                          <button
                            key={endulzante.id}
                            onClick={() => setConfiguracion({...configuracion, endulzanteId: endulzante.id})}
                            className={`p-3 border rounded-lg text-sm transition-colors ${
                              configuracion.endulzanteId === endulzante.id
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-300'
                            }`}
                          >
                            <div className="font-medium">{endulzante.nombre}</div>
                            {endulzante.costoAdicional > 0 && (
                              <div className="text-xs text-gray-500">+Q{endulzante.costoAdicional}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Topping */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Topping</label>
                      <div className="grid grid-cols-3 gap-3">
                        {atributos.bebidas.toppings.map((topping) => (
                          <button
                            key={topping.id}
                            onClick={() => setConfiguracion({...configuracion, toppingId: topping.id})}
                            className={`p-3 border rounded-lg text-sm transition-colors ${
                              configuracion.toppingId === topping.id
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-300'
                            }`}
                          >
                            <div className="font-medium">{topping.nombre}</div>
                            {topping.costoAdicional > 0 && (
                              <div className="text-xs text-gray-500">+Q{topping.costoAdicional}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Precio Total */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium text-gray-700">Precio Total:</span>
                    <span className="text-3xl font-bold text-emerald-600">
                      Q{calcularPrecioTotal().toFixed(2)}
                    </span>
                  </div>

                  <button className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Productos;