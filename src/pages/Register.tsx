import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { Eye, EyeOff, AlertCircle, UserPlus } from 'lucide-react';
import SplashScreen from '../components/SplashScreen';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { user, register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  if (!isLoading && user) {
    return <Navigate to="/app/home" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const result = await register({
        username: formData.username.trim(),
        password: formData.password,
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
      });
      if (result.ok) {
        setShowSplash(true);
      } else {
        setError(result.error || 'No se pudo crear la cuenta');
      }
    } catch (err) {
      setError('Error al registrarse. Inténtalo de nuevo.');
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

  const isValid =
    formData.username.trim().length >= 3 &&
    formData.password.length >= 6 &&
    formData.name.trim().length >= 2;

  return (
    <>
      <div className="min-h-screen bg-beige flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-14 mx-auto mb-4">
              <svg viewBox="0 0 120 80" className="w-full h-full">
                <defs>
                  <linearGradient id="breadGradientRegister" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#F4A933', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#E09620', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <ellipse cx="62" cy="72" rx="45" ry="6" fill="rgba(90, 50, 20, 0.1)"/>
                <ellipse cx="60" cy="40" rx="40" ry="25" fill="url(#breadGradientRegister)" stroke="#5A3214" strokeWidth="3"/>
                <path d="M30 25 Q35 15 40 25" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M45 20 Q50 10 55 20" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M65 20 Q70 10 75 20" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M80 25 Q85 15 90 25" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold font-poppins text-brown mb-2">Crear cuenta</h1>
            <p className="text-brown/70">Regístrate para empezar a gestionar pedidos</p>
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
                <label htmlFor="name" className="block text-sm font-medium text-brown mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-brown/20 rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors"
                  placeholder="Tu nombre"
                  required
                  disabled={isSubmitting}
                />
              </div>

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
                  placeholder="Elige un usuario"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brown mb-2">
                  Correo electrónico (opcional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-brown/20 rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors"
                  placeholder="tu@email.com"
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
                    placeholder="Mínimo 6 caracteres"
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
                disabled={isSubmitting || !isValid}
                className="w-full bg-golden hover:bg-golden/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>{isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-brown/70 hover:text-brown font-medium"
                disabled={isSubmitting}
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <SplashScreen isVisible={showSplash} onComplete={handleSplashComplete} />
      {showSplash && <Navigate to="/app/home" replace />}
    </>
  );
};

export default Register;


