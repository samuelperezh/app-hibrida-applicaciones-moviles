import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { User, Phone, MapPin, AlertCircle } from 'lucide-react';
import { useClients } from '../context/ClientsContext';

const ClientCreate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clients, addClient, editClient, getClientById } = useClients();
  const editClientId = location.state?.editClientId as string | undefined;
  const isEditing = !!editClientId;

  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && editClientId) {
      const c = getClientById(editClientId);
      if (c) setFormData({ name: c.name, phone: c.phone, address: c.address });
    }
  }, [isEditing, editClientId, getClientById]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'El nombre es obligatorio';
    if (!formData.phone.trim()) e.phone = 'El teléfono es obligatorio';
    if (!formData.address.trim()) e.address = 'La dirección es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      if (isEditing && editClientId) {
        editClient(editClientId, formData);
      } else {
        addClient(formData as any);
      }
      navigate('/app/clients');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brown mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Nombre
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors ${errors.name ? 'border-red-300 bg-red-50' : 'border-brown/20'}`}
            placeholder="Nombre del cliente"
          />
          {errors.name && (
            <div className="flex items-center space-x-1 text-red-600 text-sm mt-1" role="alert">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-brown mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Teléfono
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors ${errors.phone ? 'border-red-300 bg-red-50' : 'border-brown/20'}`}
            placeholder="Número de teléfono"
          />
          {errors.phone && (
            <div className="flex items-center space-x-1 text-red-600 text-sm mt-1" role="alert">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.phone}</span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-brown mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Dirección
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            rows={3}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors resize-none ${errors.address ? 'border-red-300 bg-red-50' : 'border-brown/20'}`}
            placeholder="Dirección completa"
          />
          {errors.address && (
            <div className="flex items-center space-x-1 text-red-600 text-sm mt-1" role="alert">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.address}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-brown py-3 px-4 rounded-xl font-medium transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-golden hover:bg-golden/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-colors"
          >
            {isSubmitting ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar cliente' : 'Crear cliente')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientCreate;


