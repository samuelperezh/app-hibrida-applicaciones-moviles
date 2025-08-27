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
      case '/app/products':
        return 'Productos';
      case '/app/products/new':
        return 'Nuevo Producto';
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
          <div className="w-8 h-6" />
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