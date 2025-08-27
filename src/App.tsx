import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext.tsx';
import { OrdersProvider } from './context/OrdersContext.tsx';
import { ClientsProvider } from './context/ClientsContext.tsx';
import { ProductsProvider } from './context/ProductsContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AppLayout from './components/AppLayout.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Home from './pages/Home.tsx';
import Clients from './pages/Clients.tsx';
import ClientCreate from './pages/ClientCreate.tsx';
import Products from './pages/Products.tsx';
import ProductCreate from './pages/ProductCreate.tsx';
import Orders from './pages/Orders.tsx';
import OrderCreate from './pages/OrderCreate.tsx';
import Profile from './pages/Profile.tsx';
import NotFound from './pages/NotFound.tsx';

function App() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <ClientsProvider>
        <ProductsProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
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
                <Route path="clients" element={<Clients />} />
                <Route path="clients/new" element={<ClientCreate />} />
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<ProductCreate />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/new" element={<OrderCreate />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </Router>
        </ProductsProvider>
        </ClientsProvider>
      </OrdersProvider>
    </AuthProvider>
  );
}

export default App;