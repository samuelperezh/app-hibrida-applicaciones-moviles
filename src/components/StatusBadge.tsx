import React from 'react';
import { OrderStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pendiente',
          classes: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        };
      case 'in-progress':
        return {
          label: 'En progreso',
          classes: 'bg-blue-100 text-blue-700 border-blue-200',
        };
      case 'completed':
        return {
          label: 'Completado',
          classes: 'bg-green-100 text-green-700 border-green-200',
        };
      default:
        return {
          label: 'Desconocido',
          classes: 'bg-gray-100 text-gray-700 border-gray-200',
        };
    }
  };

  const { label, classes } = getStatusConfig(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-lg font-medium border ${classes} ${sizeClasses}`}
      role="status"
      aria-label={`Estado: ${label}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;