import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import { OrderStatus } from '../types';
import OrderCard from '../components/OrderCard';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { getFilteredOrders, removeOrder, updateOrderStatus } = useOrders();
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filters = [
    { key: 'all' as const, label: 'Todos', count: getFilteredOrders().length },
    { key: 'pending' as const, label: 'Pendiente', count: getFilteredOrders('pending').length },
    { key: 'in-progress' as const, label: 'En progreso', count: getFilteredOrders('in-progress').length },
    { key: 'completed' as const, label: 'Completado', count: getFilteredOrders('completed').length },
  ];

  const getOrders = () => {
    const orders = activeFilter === 'all' ? getFilteredOrders() : getFilteredOrders(activeFilter);
    
    if (searchQuery) {
      return orders.filter(order => 
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.details.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return orders;
  };

  const orders = getOrders();

  const handleCreateOrder = () => {
    navigate('/app/orders/new');
  };

  const handleEditOrder = (order: any) => {
    navigate('/app/orders/new', { state: { editOrder: order } });
  };

  const handleDeleteOrder = (orderId: string) => {
    setDeleteConfirm(orderId);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      removeOrder(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Search and Filters */}
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/60" />
          <input
            type="text"
            placeholder="Buscar por cliente o detalles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-brown/20 rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {filters.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                activeFilter === key
                  ? 'bg-golden text-white'
                  : 'bg-white text-brown border border-brown/20 hover:bg-beige/50'
              }`}
            >
              <span>{label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeFilter === key
                    ? 'bg-white/20 text-white'
                    : 'bg-brown/10 text-brown/60'
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 px-4">
        {orders.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <EmptyState
              title={searchQuery ? 'Sin resultados' : 'No hay pedidos'}
              description={
                searchQuery
                  ? 'No se encontraron pedidos que coincidan con tu búsqueda'
                  : 'Crea tu primer pedido para comenzar a gestionar tus encargos'
              }
              actionLabel={searchQuery ? undefined : 'Crear pedido'}
              onAction={searchQuery ? undefined : handleCreateOrder}
            />
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onEdit={handleEditOrder}
                onDelete={handleDeleteOrder}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleCreateOrder}
        className="fixed bottom-20 right-4 bg-golden hover:bg-golden/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-30"
        aria-label="Crear nuevo pedido"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Eliminar pedido"
        message="¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        type="danger"
      />
    </div>
  );
};

export default Orders;