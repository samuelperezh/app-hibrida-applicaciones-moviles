import React from 'react';
import { NavLink } from 'react-router';
import { Home, ClipboardList, User, Users, Tag } from 'lucide-react';

const TabBar: React.FC = () => {
  const tabs = [
    { to: '/app/home', icon: Home, label: 'Inicio' },
    { to: '/app/clients', icon: Users, label: 'Clientes' },
    { to: '/app/products', icon: Tag, label: 'Productos' },
    { to: '/app/orders', icon: ClipboardList, label: 'Pedidos' },
    { to: '/app/profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="bg-white border-t border-brown/10 px-4 py-2 fixed bottom-0 left-0 right-0 z-40">
      <div className="flex justify-around items-center">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 py-2 px-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-golden bg-golden/10'
                  : 'text-brown/60 hover:text-brown hover:bg-beige/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'text-golden' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-golden' : ''}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default TabBar;