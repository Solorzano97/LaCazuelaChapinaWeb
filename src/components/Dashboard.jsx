import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { dashboardService } from '../services/apiService';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const sucursalId = 1;
      const fechaDesde = new Date();
      fechaDesde.setDate(fechaDesde.getDate() - 30);

      const response = await dashboardService.getCompleto({
        sucursalId,
        desde: fechaDesde.toISOString(),
      });

      const KPIs = await dashboardService.getKPIs({
        sucursalId,
        desde: fechaDesde.toISOString(),
      });

      console.log("kapis" , KPIs)
      setDashboardData(response.data.data);
      console.log("todo" , response.data.data)
    } catch (err) {
      setError('Error al cargar dashboard: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={loadDashboard}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { KPIs, TamalesMasVendidos, BebidasPorHorario, ProporcionPicante, UtilidadesPorLinea, DesperdicioMateriasPrimas } = dashboardData || {};
  console.log("a ver " , KPIs)
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard - La Cazuela Chapina</h1>
        <p className="text-gray-600 mt-2">Panel de control y análisis de ventas</p>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Ventas del Día"
          value={`Q ${KPIs?.VentasDia?.Total?.toFixed(2) || '0.00'}`}
          subtitle={`${KPIs?.VentasDia?.NumeroOrdenes || 0} órdenes`}
          icon={<DollarSign className="w-6 h-6" />}
          color="bg-emerald-500"
        />
        <KPICard
          title="Ventas del Mes"
          value={`Q ${dashboardData?.kpIs.ventasMes.total || '0.00'}`}
          subtitle={`${dashboardData?.kpIs.VentasMes?.CrecimientoVsMesAnterior >= 0 ? '+' : ''}${dashboardData?.kpIs.VentasMes?.CrecimientoVsMesAnterior?.toFixed(1) || 0}% vs mes anterior`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-blue-500"
        />
        <KPICard
          title="Ticket Promedio"
          value={`Q ${dashboardData?.kpIs.ventasDia?.ticketPromedio?.toFixed(2) || '0.00'}`}
          subtitle="Por orden"
          icon={<ShoppingCart className="w-6 h-6" />}
          color="bg-amber-500"
        />
        <KPICard
          title="Inventario"
          value={dashboardData?.desperdicioMateriasPrimas?.length || 0}
          subtitle="Materias con merma"
          icon={<Package className="w-6 h-6" />}
          color="bg-purple-500"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tamales Más Vendidos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tamales Más Vendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData?.tamalesMasVendidos || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidadVendida" fill="#10b981" name="Cantidad Vendida" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Proporción de Picante */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Proporción Picante vs No Picante</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData?.proporcionPicante || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nivelPicante, porcentaje }) => `${nivelPicante}: ${porcentaje}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {(ProporcionPicante || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Utilidades por Línea */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Utilidades por Línea</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.utilidadesPorLinea || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="linea" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventaTotal" fill="#3b82f6" name="Venta Total" />
              <Bar dataKey="utilidadEstimada" fill="#10b981" name="Utilidad Estimada" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bebidas por Horario */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Bebidas por Franja Horaria</h2>
          <div className="space-y-4">
            {(dashboardData.bebidasPorHorario || []).map((franja) => (
              <div key={franja.franjaHoraria} className="border-b pb-4">
                <h3 className="font-semibold text-gray-700 mb-2">{franja.franjaHoraria}</h3>
                <div className="space-y-1">
                  {franja.bebidas.map((bebida, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{bebida.nombre}</span>
                      <span className="font-medium">{bebida.cantidad} unidades</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desperdicios */}
      {DesperdicioMateriasPrimas && DesperdicioMateriasPrimas.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-semibold">Desperdicio de Materias Primas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Materia Prima</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {DesperdicioMateriasPrimas.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.materiaPrima}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.cantidadDesperdiciada}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Q {item.costoTotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function KPICard({ title, value, subtitle, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;