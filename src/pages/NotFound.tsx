import React from 'react';
import { useNavigate } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/app/home');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-16 mx-auto mb-6 opacity-60">
          <svg viewBox="0 0 120 80" className="w-full h-full">
            <defs>
              <linearGradient id="breadGradient404" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#F4A933', stopOpacity: 0.7 }} />
                <stop offset="100%" style={{ stopColor: '#E09620', stopOpacity: 0.7 }} />
              </linearGradient>
            </defs>
            <ellipse cx="62" cy="72" rx="45" ry="6" fill="rgba(90, 50, 20, 0.1)"/>
            <ellipse cx="60" cy="40" rx="40" ry="25" fill="url(#breadGradient404)" stroke="#5A3214" strokeWidth="3"/>
            <path d="M30 25 Q35 15 40 25" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M45 20 Q50 10 55 20" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M65 20 Q70 10 75 20" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M80 25 Q85 15 90 25" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 className="text-6xl font-bold font-poppins text-brown mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold font-poppins text-brown mb-4">
          Página no encontrada
        </h2>
        
        <p className="text-brown/70 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida a otra ubicación.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center space-x-2 bg-golden hover:bg-golden/90 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Ir al inicio</span>
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-beige/50 text-brown py-3 px-6 rounded-xl font-semibold border border-brown/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver atrás</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;