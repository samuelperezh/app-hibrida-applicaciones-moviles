import React from 'react';
import { Package } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-beige flex items-center justify-center mb-4">
        {icon || <Package className="w-8 h-8 text-brown/40" />}
      </div>
      
      <h3 className="text-lg font-semibold font-poppins text-brown mb-2">
        {title}
      </h3>
      
      <p className="text-brown/60 mb-6 max-w-sm">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-golden hover:bg-golden/90 text-white px-6 py-2 rounded-xl font-medium transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;