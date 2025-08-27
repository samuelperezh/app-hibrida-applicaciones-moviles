import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Plus, ArrowLeft } from 'lucide-react';

interface NavBarProps {
  title?: string;
  showBackButton?: boolean;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ 
  title, 
  showBackButton = false, 
  showCreateButton = false,
  onCreateClick 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTitle = () => {
    if (title) return title;
    
    switch (location.pathname) {
      case '/app/home':
        return 'PanApp';
      case '/app/clients':
        return 'Clientes';
      case '/app/clients/new':
        return 'Nuevo Cliente';
      case '/app/orders':
        return 'Pedidos';
      case '/app/orders/new':
        return 'Nuevo Pedido';
      case '/app/profile':
        return 'Perfil';
      default:
        return 'PanApp';
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav className="bg-white border-b border-brown/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        {showBackButton ? (
          <button
            onClick={handleBack}
            className="p-2 rounded-xl bg-beige hover:bg-golden/20 transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-brown" />
          </button>
        ) : (
          <div className="w-8 h-6">
            <svg viewBox="0 0 120 80" className="w-full h-full">
              <defs>
                <linearGradient id="breadGradientNav" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#F4A933', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#E09620', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <ellipse cx="60" cy="40" rx="40" ry="25" fill="url(#breadGradientNav)" stroke="#5A3214" strokeWidth="3"/>
              <path d="M30 25 Q35 15 40 25" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M45 20 Q50 10 55 20" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M65 20 Q70 10 75 20" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M80 25 Q85 15 90 25" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        )}
        <h1 className="text-xl font-bold font-poppins text-brown">{getTitle()}</h1>
      </div>

      {showCreateButton && (
        <button
          onClick={onCreateClick}
          className="flex items-center space-x-2 bg-golden hover:bg-golden/90 text-white px-4 py-2 rounded-xl font-medium transition-colors"
          aria-label="Crear nuevo pedido"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      )}
    </nav>
  );
};

export default NavBar;