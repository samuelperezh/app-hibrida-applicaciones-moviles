import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { OrdersProvider } from './context/OrdersContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Orders from './pages/Orders';
import OrderCreate from './pages/OrderCreate';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<Login />} />
              
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/app/home" replace />} />
                <Route path="home" element={<Home />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/new" element={<OrderCreate />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </Router>
      </OrdersProvider>
    </AuthProvider>
  );
}

export default App;