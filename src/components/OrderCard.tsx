import React from 'react';
import { Edit3, Trash2, Clock, User, Package } from 'lucide-react';
import { Order } from '../types';
import StatusBadge from './StatusBadge';

interface OrderCardProps {
  order: Order;
  onEdit?: (order: Order) => void;
  onDelete?: (orderId: string) => void;
  onStatusChange?: (orderId: string, status: Order['status']) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  onEdit, 
  onDelete, 
  onStatusChange 
}) => {
  const formatDate = (dateString: string) => {
    // Parse YYYY-MM-DD as local date to avoid timezone shift
    const [y, m, d] = dateString.split('-').map(Number);
    const date = new Date(y, (m || 1) - 1, d || 1);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const handleStatusChange = (newStatus: Order['status']) => {
    onStatusChange?.(order.id, newStatus);
  };

  const getNextStatus = (): Order['status'] | null => {
    switch (order.status) {
      case 'pending':
        return 'in-progress';
      case 'in-progress':
        return 'completed';
      default:
        return null;
    }
  };

  const getStatusButtonText = () => {
    switch (order.status) {
      case 'pending':
        return 'Iniciar';
      case 'in-progress':
        return 'Completar';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();
  const statusButtonText = getStatusButtonText();

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-brown/5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-4 h-4 text-brown/60" />
            <h3 className="font-semibold text-brown">{order.customerName}</h3>
          </div>
          <StatusBadge status={order.status} size="sm" />
        </div>
        
        <div className="flex items-center space-x-1">
          {onEdit && (
            <button
              onClick={() => onEdit(order)}
              className="p-2 rounded-lg text-brown/60 hover:text-brown hover:bg-beige/50 transition-colors"
              aria-label="Editar pedido"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(order.id)}
              className="p-2 rounded-lg text-red-600/60 hover:text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Eliminar pedido"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start space-x-2">
          <Package className="w-4 h-4 text-brown/60 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-brown/80 line-clamp-2">{order.details}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-brown/60">
          <span>Cantidad: {order.quantity}</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>
              {formatDate(order.deliveryDate)} - {formatTime(order.deliveryTime)}
            </span>
          </div>
        </div>
      </div>

      {nextStatus && statusButtonText && (
        <button
          onClick={() => handleStatusChange(nextStatus)}
          className="w-full bg-golden hover:bg-golden/90 text-white py-2 px-4 rounded-xl font-medium text-sm transition-colors"
        >
          {statusButtonText}
        </button>
      )}
    </div>
  );
};

export default OrderCard;