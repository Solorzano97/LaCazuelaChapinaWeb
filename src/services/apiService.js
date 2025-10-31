import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7001/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token en las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Si el token es inválido o expiró, redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.reload();
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// PRODUCTOS
// ============================================

export const productosService = {
  getAll: () => api.get('/productos'),
  getById: (id) => api.get(`/productos/${id}`),
  getByTipo: (tipo) => api.get(`/productos/tipo/${tipo}`),
  create: (data) => api.post('/productos', data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  delete: (id) => api.delete(`/productos/${id}`),
};

// ============================================
// VENTAS
// ============================================

export const ventasService = {
  getAll: (params) => api.get('/ventas', { params }),
  getById: (id) => api.get(`/ventas/${id}`),
  create: (data) => api.post('/ventas', data),
  updateEstado: (id, estado) => api.patch(`/ventas/${id}/estado`, { estado }),
  getResumen: (params) => api.get('/ventas/resumen', { params }),
  cancelar: (id) => api.delete(`/ventas/${id}`),
};

// ============================================
// INVENTARIO
// ============================================

export const inventarioService = {
  getMateriasPrimas: (params) => api.get('/inventario/materias-primas', { params }),
  getMateriaPrima: (id) => api.get(`/inventario/materias-primas/${id}`),
  registrarMovimiento: (data) => api.post('/inventario/movimientos', data),
  getMovimientos: (params) => api.get('/inventario/movimientos', { params }),
  getResumen: () => api.get('/inventario/resumen'),
  getAlertas: () => api.get('/inventario/alertas'),
  actualizarStockMinimo: (id, stockMinimo) =>
    api.patch(`/inventario/materias-primas/${id}/stock-minimo`, { stockMinimo }),
};

// ============================================
// COMBOS
// ============================================

export const combosService = {
  getAll: (params) => api.get('/combos', { params }),
  getById: (id) => api.get(`/combos/${id}`),
  getEstacional: () => api.get('/combos/estacional'),
  getMasVendidos: (top = 5) => api.get(`/combos/mas-vendidos?top=${top}`),
  create: (data) => api.post('/combos', data),
  update: (id, data) => api.put(`/combos/${id}`, data),
  cambiarEstado: (id, activo) => api.patch(`/combos/${id}/estado`, { activo }),
  delete: (id) => api.delete(`/combos/${id}`),
};

// ============================================
// DASHBOARD
// ============================================

export const dashboardService = {
  getKPIs: (params) => api.get('/dashboard/kpis', { params }),
  getTamalesMasVendidos: (params) => api.get('/dashboard/tamales-mas-vendidos', { params }),
  getBebidasPorHorario: (params) => api.get('/dashboard/bebidas-por-horario', { params }),
  getProporcionPicante: (params) => api.get('/dashboard/proporcion-picante', { params }),
  getUtilidadesPorLinea: (params) => api.get('/dashboard/utilidades-por-linea', { params }),
  getDesperdicioMateriasPrimas: (params) =>
    api.get('/dashboard/desperdicio-materias-primas', { params }),
  getCompleto: (params) => api.get('/dashboard/completo', { params }),
};

// ============================================
// INTELIGENCIA ARTIFICIAL
// ============================================

export const iaService = {
  consulta: (pregunta, contexto = null) =>
    api.post('/ia/consulta', { pregunta, contexto }),
  sugerirCombo: (preferencias) => api.post('/ia/sugerir-combo', preferencias),
  analizarVentas: (params) => api.get('/ia/analizar-ventas', { params }),
  recomendarProductos: (clienteId) => api.get(`/ia/recomendar-productos/${clienteId}`),
  optimizarInventario: () => api.get('/ia/optimizar-inventario'),
};

// ============================================
// ATRIBUTOS DE PRODUCTOS
// ============================================

export const atributosService = {
  // Tamales
  getMasas: () => api.get('/atributos/masas-tamal'),
  getRellenos: () => api.get('/atributos/rellenos-tamal'),
  getEnvolturas: () => api.get('/atributos/envolturas-tamal'),
  getPicantes: () => api.get('/atributos/picantes-tamal'),
  
  // Bebidas
  getTiposBebida: () => api.get('/atributos/tipos-bebida'),
  getEndulzantes: () => api.get('/atributos/endulzantes-bebida'),
  getToppings: () => api.get('/atributos/toppings-bebida'),
};

export default api;