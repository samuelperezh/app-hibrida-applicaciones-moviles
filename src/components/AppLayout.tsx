import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import NavBar from './NavBar';
import TabBar from './TabBar';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isOrderCreatePage = location.pathname === '/app/orders/new';
  const isOrdersPage = location.pathname === '/app/orders';
  const isClientsPage = location.pathname === '/app/clients';

  const handleCreateOrder = () => {
    if (isOrdersPage) {
      navigate('/app/orders/new');
    } else if (isClientsPage) {
      navigate('/app/clients/new');
    }
  };

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      <NavBar
        showBackButton={isOrderCreatePage}
        showCreateButton={isOrdersPage || isClientsPage}
        onCreateClick={handleCreateOrder}
      />
      
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      <TabBar />
    </div>
  );
};

export default AppLayout;