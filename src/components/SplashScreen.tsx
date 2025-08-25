import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible, onComplete }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimate(true);
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-beige flex items-center justify-center z-50">
      <div className="text-center">
        <div 
          className={`w-24 h-16 mx-auto mb-6 transition-all duration-700 ease-out ${
            animate 
              ? 'scale-110 rotate-3 opacity-100' 
              : 'scale-75 rotate-0 opacity-70'
          }`}
        >
          <svg viewBox="0 0 120 80" className="w-full h-full">
            <defs>
              <linearGradient id="breadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#F4A933', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#E09620', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            
            <ellipse cx="62" cy="72" rx="45" ry="6" fill="rgba(90, 50, 20, 0.1)"/>
            <ellipse cx="60" cy="40" rx="40" ry="25" fill="url(#breadGradient)" stroke="#5A3214" strokeWidth="3"/>
            
            <path d="M30 25 Q35 15 40 25" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M45 20 Q50 10 55 20" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M65 20 Q70 10 75 20" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M80 25 Q85 15 90 25" stroke="#5A3214" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        
        <div className={`transition-all duration-500 delay-300 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-3xl font-bold font-poppins text-brown mb-2">PanApp</h1>
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-golden rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-golden rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-golden rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;