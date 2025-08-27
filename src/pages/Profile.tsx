import React, { useState } from 'react';
import { Edit3, LogOut, User, Lock, Info, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';

const Profile: React.FC = () => {
  const { user, logout, updateUser, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Change password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [isChangingPwd, setIsChangingPwd] = useState(false);

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

  const handlePasswordSubmit = async () => {
    setPwdError('');
    setPwdSuccess('');
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setPwdError('Completa todos los campos');
      return;
    }
    if (passwords.next.length < 6) {
      setPwdError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPwdError('La confirmación no coincide');
      return;
    }
    setIsChangingPwd(true);
    const result = await changePassword(passwords.current, passwords.next);
    setIsChangingPwd(false);
    if (result.ok) {
      setPwdSuccess('Contraseña actualizada correctamente');
      setPasswords({ current: '', next: '', confirm: '' });
      setShowPwd({ current: false, next: false, confirm: false });
      // Keep the form open to show success; allow user to close manually
    } else {
      setPwdError(result.error || 'No se pudo actualizar la contraseña');
    }
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

        <button
          onClick={() => setShowPasswordForm(prev => !prev)}
          className="w-full flex items-center justify-between p-4 bg-beige/30 hover:bg-beige/50 rounded-xl transition-colors text-left"
        >
          <div>
            <p className="font-medium text-brown">Cambiar contraseña</p>
            <p className="text-brown/60 text-sm">Actualiza tu contraseña de acceso</p>
          </div>
          <div className="text-brown/40">
            <Lock className="w-5 h-5" />
          </div>
        </button>

        {showPasswordForm && (
          <div className="mt-4 space-y-4">
            {pwdError && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700" role="alert">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{pwdError}</span>
              </div>
            )}
            {pwdSuccess && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700" role="status">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">{pwdSuccess}</span>
              </div>
            )}

            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-brown mb-2">Contraseña actual</label>
              <div className="relative">
                <input
                  type={showPwd.current ? 'text' : 'password'}
                  id="currentPassword"
                  value={passwords.current}
                  onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 border border-brown/20 rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors"
                  placeholder="Ingresa tu contraseña actual"
                  disabled={isChangingPwd}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/60 hover:text-brown transition-colors"
                  disabled={isChangingPwd}
                >
                  {showPwd.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-brown mb-2">Nueva contraseña</label>
              <div className="relative">
                <input
                  type={showPwd.next ? 'text' : 'password'}
                  id="newPassword"
                  value={passwords.next}
                  onChange={(e) => setPasswords(prev => ({ ...prev, next: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 border border-brown/20 rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors"
                  placeholder="Mínimo 6 caracteres"
                  disabled={isChangingPwd}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(prev => ({ ...prev, next: !prev.next }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/60 hover:text-brown transition-colors"
                  disabled={isChangingPwd}
                >
                  {showPwd.next ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-brown mb-2">Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showPwd.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 border border-brown/20 rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors"
                  placeholder="Repite la nueva contraseña"
                  disabled={isChangingPwd}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/60 hover:text-brown transition-colors"
                  disabled={isChangingPwd}
                >
                  {showPwd.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswords({ current: '', next: '', confirm: '' });
                  setPwdError('');
                  setPwdSuccess('');
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-brown py-2 px-4 rounded-xl font-medium transition-colors"
                disabled={isChangingPwd}
              >
                Cancelar
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 bg-golden hover:bg-golden/90 text-white py-2 px-4 rounded-xl font-medium transition-colors"
                disabled={isChangingPwd}
              >
                {isChangingPwd ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </div>
          </div>
        )}
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
            <span className="text-brown font-medium">Agosto 2025</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brown/70">Desarrollado por</span>
            <span className="text-brown font-medium">Samuel Pérez</span>
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