import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SplashScreen from '../components/SplashScreen';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, isLoading } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  // Redirect if already logged in
  if (!isLoading && user) {
    return <Navigate to="/app/home" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        setShowSplash(true);
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (isLoading) {
    return <SplashScreen isVisible={true} />;
  }

  return (
    <>
      <div className="min-h-screen bg-beige flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-14 mx-auto mb-4">
              <svg viewBox="0 0 120 80" className="w-full h-full">
                <defs>
                  <linearGradient id="breadGradientLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#F4A933', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#E09620', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <ellipse cx="62" cy="72" rx="45" ry="6" fill="rgba(90, 50, 20, 0.1)"/>
                <ellipse cx="60" cy="40" rx="40" ry="25" fill="url(#breadGradientLogin)" stroke="#5A3214" strokeWidth="3"/>
                <path d="M30 25 Q35 15 40 25" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M45 20 Q50 10 55 20" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M65 20 Q70 10 75 20" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M80 25 Q85 15 90 25" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold font-poppins text-brown mb-2">PanApp</h1>
            <p className="text-brown/70">Gestión de pedidos para panaderías</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700" role="alert">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-brown mb-2">
                  Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 border border-brown/20 rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors"
                  placeholder="Ingresa tu usuario"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-brown mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-brown/20 rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors"
                    placeholder="Ingresa tu contraseña"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/60 hover:text-brown transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.username || !formData.password}
                className="w-full bg-golden hover:bg-golden/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-semibold transition-colors"
              >
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/register')}
                className="text-brown/70 hover:text-brown font-medium"
                disabled={isSubmitting}
              >
                ¿Aún no tienes cuenta? Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>

      <SplashScreen isVisible={showSplash} onComplete={handleSplashComplete} />
      
      {showSplash && (
        <Navigate to="/app/home" replace />
      )}
    </>
  );
};

export default Login;