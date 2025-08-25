import React, { useState } from 'react';
import { Edit3, LogOut, User, Lock, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';

const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      updateUser(formData);
    } else {
      // Start editing
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  if (!user) return null;

  return (
    <div className="flex-1 p-4 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-brown/5">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-golden/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-golden" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-poppins text-brown">
              {user.name}
            </h2>
            <p className="text-brown/60">@{user.username}</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brown mb-2">
              Nombre completo
            </label>
            {isEditing ? (
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-brown/20 rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors"
                placeholder="Tu nombre completo"
              />
            ) : (
              <div className="px-4 py-3 bg-beige/30 rounded-xl text-brown">
                {user.name}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brown mb-2">
              Correo electrónico
            </label>
            {isEditing ? (
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-brown/20 rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors"
                placeholder="tu@email.com"
              />
            ) : (
              <div className="px-4 py-3 bg-beige/30 rounded-xl text-brown">
                {user.email}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-brown py-2 px-4 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditToggle}
                  className="flex-1 bg-golden hover:bg-golden/90 text-white py-2 px-4 rounded-xl font-medium transition-colors"
                >
                  Guardar cambios
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center justify-center space-x-2 bg-golden hover:bg-golden/90 text-white py-2 px-4 rounded-xl font-medium transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar perfil</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-brown/5">
        <h3 className="text-lg font-semibold font-poppins text-brown mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          Seguridad
        </h3>
        
        <button className="w-full flex items-center justify-between p-4 bg-beige/30 hover:bg-beige/50 rounded-xl transition-colors text-left">
          <div>
            <p className="font-medium text-brown">Cambiar contraseña</p>
            <p className="text-brown/60 text-sm">Actualiza tu contraseña de acceso</p>
          </div>
          <div className="text-brown/40">
            <Lock className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-brown/5">
        <h3 className="text-lg font-semibold font-poppins text-brown mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Información de la app
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-brown/70">Versión</span>
            <span className="text-brown font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brown/70">Última actualización</span>
            <span className="text-brown font-medium">Enero 2025</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brown/70">Desarrollado por</span>
            <span className="text-brown font-medium">PanApp Team</span>
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-brown/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Cerrar sesión"
        message="¿Estás seguro de que quieres cerrar sesión? Tendrás que iniciar sesión nuevamente para acceder a la aplicación."
        confirmLabel="Cerrar sesión"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        type="info"
      />
    </div>
  );
};

export default Profile;