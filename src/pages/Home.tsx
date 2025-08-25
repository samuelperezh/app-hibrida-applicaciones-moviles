import React from 'react';
import { useNavigate } from 'react-router';
import { Clock, CheckCircle, AlertCircle, Plus, TrendingUp, Package } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { getOrderStats, orders } = useOrders();
  const stats = getOrderStats();

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const handleCreateOrder = () => {
    navigate('/app/orders/new');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    return `Hace ${diffDays} días`;
  };

  if (stats.total === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          icon={<Package className="w-8 h-8 text-brown/40" />}
          title="¡Comienza a gestionar tus pedidos!"
          description="Crea tu primer pedido para comenzar a usar PanApp y mantener organizados todos tus encargos."
          actionLabel="Crear primer pedido"
          onAction={handleCreateOrder}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-brown/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-poppins text-brown mb-1">
              Estado de pedidos
            </h2>
            <p className="text-brown/60">Resumen de tu actividad</p>
          </div>
          <TrendingUp className="w-8 h-8 text-golden" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            title="Pendiente"
            value={stats.pending}
            color="golden"
            icon={<Clock className="w-5 h-5" />}
          />
          <StatCard
            title="En progreso"
            value={stats.inProgress}
            color="blue"
            icon={<AlertCircle className="w-5 h-5" />}
          />
          <StatCard
            title="Completado"
            value={stats.completed}
            color="green"
            icon={<CheckCircle className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Quick Action */}
      <div className="bg-gradient-to-r from-golden to-golden/90 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold font-poppins mb-1">
              ¿Nuevo pedido?
            </h3>
            <p className="text-white/90 text-sm">
              Agrega un pedido rápidamente
            </p>
          </div>
          <button
            onClick={handleCreateOrder}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-xl transition-colors"
            aria-label="Crear nuevo pedido"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-brown/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold font-poppins text-brown">
            Actividad reciente
          </h3>
          <button
            onClick={() => navigate('/app/orders')}
            className="text-golden hover:text-golden/80 text-sm font-medium transition-colors"
          >
            Ver todos
          </button>
        </div>

        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 bg-beige/30 rounded-xl hover:bg-beige/50 transition-colors cursor-pointer"
              onClick={() => navigate('/app/orders')}
            >
              <div className="flex-1">
                <p className="font-medium text-brown text-sm">
                  {order.customerName}
                </p>
                <p className="text-brown/60 text-xs truncate max-w-[200px]">
                  {order.details}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-brown/60">
                  {formatDate(order.createdAt)}
                </p>
                <div className="flex justify-end mt-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    order.status === 'pending' ? 'bg-yellow-400' :
                    order.status === 'in-progress' ? 'bg-blue-400' :
                    'bg-green-400'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;