import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Calendar, Clock, User, Package, AlertCircle, ChevronDown, Plus } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import { Order, OrderStatus } from '../types';
import { useClients } from '../context/ClientsContext';

const OrderCreate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addOrder, editOrder } = useOrders();
  const { clients } = useClients();
  
  // Check if we're editing an existing order
  const editingOrder = location.state?.editOrder as Order | undefined;
  const isEditing = !!editingOrder;

  const [formData, setFormData] = useState({
    customerName: '',
    details: '',
    quantity: 1,
    deliveryDate: '',
    deliveryTime: '',
    status: 'pending' as OrderStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Searchable client dropdown state
  const [clientQuery, setClientQuery] = useState('');
  const [isClientOpen, setIsClientOpen] = useState(false);
  const filteredClients = useMemo(() => {
    const q = clientQuery.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  }, [clients, clientQuery]);

  // legacy suggestion flags removed; using dropdown

  useEffect(() => {
    if (isEditing && editingOrder) {
      setFormData({
        customerName: editingOrder.customerName,
        details: editingOrder.details,
        quantity: editingOrder.quantity,
        deliveryDate: editingOrder.deliveryDate,
        deliveryTime: editingOrder.deliveryTime,
        status: editingOrder.status,
      });
    }
  }, [isEditing, editingOrder]);

  // Set minimum date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!formData.deliveryDate) {
      setFormData(prev => ({ ...prev, deliveryDate: today }));
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'El nombre del cliente es obligatorio';
    }

    if (!formData.details.trim()) {
      newErrors.details = 'Los detalles del pedido son obligatorios';
    }

    if (formData.quantity < 1) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'La fecha de entrega es obligatoria';
    } else {
      const selectedDate = new Date(formData.deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.deliveryDate = 'La fecha no puede ser anterior a hoy';
      }
    }

    if (!formData.deliveryTime) {
      newErrors.deliveryTime = 'La hora de entrega es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      element?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && editingOrder) {
        editOrder(editingOrder.id, formData);
      } else {
        addOrder(formData);
      }
      
      navigate('/app/orders');
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCustomerNameChange = (value: string) => {
    setClientQuery(value);
    setFormData(prev => ({ ...prev, customerName: value }));
    if (errors.customerName) setErrors(prev => ({ ...prev, customerName: '' }));
  };

  const selectClient = (name: string) => {
    setFormData(prev => ({ ...prev, customerName: name }));
    setClientQuery(name);
    setIsClientOpen(false);
  };

  return (
    <div className="flex-1 p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer - Searchable Dropdown */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-brown mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Cliente
          </label>
          <div className="relative">
            <input
              type="text"
              id="customerName"
              value={clientQuery}
              onChange={(e) => handleCustomerNameChange(e.target.value)}
              onFocus={() => setIsClientOpen(true)}
              onBlur={() => setTimeout(() => setIsClientOpen(false), 150)}
              className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors ${
                errors.customerName ? 'border-red-300 bg-red-50' : 'border-brown/20'
              }`}
              placeholder="Buscar por nombre, teléfono o dirección"
              aria-describedby={errors.customerName ? 'customerName-error' : undefined}
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setIsClientOpen(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/60 hover:text-brown transition-colors"
              aria-label="Desplegar clientes"
            >
              <ChevronDown className="w-5 h-5" />
            </button>

            {isClientOpen && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-brown/20 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                {filteredClients.length === 0 ? (
                  <div className="p-4 text-brown/60 text-sm">No se encontraron clientes</div>
                ) : (
                  filteredClients.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectClient(c.name)}
                      className="w-full text-left px-4 py-3 hover:bg-beige/50 transition-colors flex flex-col space-y-1 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div className="font-medium text-brown">{c.name}</div>
                      <div className="text-xs text-brown/70">{c.phone}</div>
                      <div className="text-xs text-brown/70">{c.address}</div>
                    </button>
                  ))
                )}
                <div className="border-t border-brown/10" />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => navigate('/app/clients/new')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-beige/30 hover:bg-beige/50 rounded-b-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear nuevo cliente</span>
                </button>
              </div>
            )}
          </div>

          {errors.customerName && (
            <div
              id="customerName-error"
              className="flex items-center space-x-1 text-red-600 text-sm mt-1"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.customerName}</span>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div>
          <label htmlFor="details" className="block text-sm font-medium text-brown mb-2">
            <Package className="w-4 h-4 inline mr-1" />
            Detalles del pedido
          </label>
          <textarea
            id="details"
            value={formData.details}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, details: e.target.value }));
              if (errors.details) {
                setErrors(prev => ({ ...prev, details: '' }));
              }
            }}
            rows={4}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors resize-none ${
              errors.details ? 'border-red-300 bg-red-50' : 'border-brown/20'
            }`}
            placeholder="Describe los productos del pedido..."
            aria-describedby={errors.details ? 'details-error' : undefined}
          />
          
          {errors.details && (
            <div
              id="details-error"
              className="flex items-center space-x-1 text-red-600 text-sm mt-1"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.details}</span>
            </div>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-brown mb-2">
            Cantidad
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={formData.quantity}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }));
              if (errors.quantity) {
                setErrors(prev => ({ ...prev, quantity: '' }));
              }
            }}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors ${
              errors.quantity ? 'border-red-300 bg-red-50' : 'border-brown/20'
            }`}
            aria-describedby={errors.quantity ? 'quantity-error' : undefined}
          />
          
          {errors.quantity && (
            <div
              id="quantity-error"
              className="flex items-center space-x-1 text-red-600 text-sm mt-1"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.quantity}</span>
            </div>
          )}
        </div>

        {/* Delivery Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="deliveryDate" className="block text-sm font-medium text-brown mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha de entrega
            </label>
            <input
              type="date"
              id="deliveryDate"
              value={formData.deliveryDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, deliveryDate: e.target.value }));
                if (errors.deliveryDate) {
                  setErrors(prev => ({ ...prev, deliveryDate: '' }));
                }
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors ${
                errors.deliveryDate ? 'border-red-300 bg-red-50' : 'border-brown/20'
              }`}
              aria-describedby={errors.deliveryDate ? 'deliveryDate-error' : undefined}
            />
            
            {errors.deliveryDate && (
              <div
                id="deliveryDate-error"
                className="flex items-center space-x-1 text-red-600 text-sm mt-1"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.deliveryDate}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="deliveryTime" className="block text-sm font-medium text-brown mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Hora de entrega
            </label>
            <input
              type="time"
              id="deliveryTime"
              value={formData.deliveryTime}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, deliveryTime: e.target.value }));
                if (errors.deliveryTime) {
                  setErrors(prev => ({ ...prev, deliveryTime: '' }));
                }
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors ${
                errors.deliveryTime ? 'border-red-300 bg-red-50' : 'border-brown/20'
              }`}
              aria-describedby={errors.deliveryTime ? 'deliveryTime-error' : undefined}
            />
            
            {errors.deliveryTime && (
              <div
                id="deliveryTime-error"
                className="flex items-center space-x-1 text-red-600 text-sm mt-1"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.deliveryTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status (only for editing) */}
        {isEditing && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-brown mb-2">
              Estado
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as OrderStatus }))}
              className="w-full px-4 py-3 border border-brown/20 rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors"
            >
              <option value="pending">Pendiente</option>
              <option value="in-progress">En progreso</option>
              <option value="completed">Completado</option>
            </select>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6">
          <button
            type="button"
            onClick={handleCancel}
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
            {isSubmitting 
              ? (isEditing ? 'Actualizando...' : 'Creando...') 
              : (isEditing ? 'Actualizar pedido' : 'Crear pedido')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderCreate;