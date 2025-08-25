import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Calendar, Clock, User, Package, AlertCircle } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import { Order, OrderStatus } from '../types';

const OrderCreate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addOrder, editOrder } = useOrders();
  
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

  // Popular customer suggestions (could come from localStorage in a real app)
  const customerSuggestions = [
    'María González',
    'Carlos Ruiz',
    'Ana López',
    'José Martínez',
    'Carmen Sánchez',
  ];

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

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
    setFormData(prev => ({ ...prev, customerName: value }));
    
    if (value.length > 0) {
      const filtered = customerSuggestions.filter(name =>
        name.toLowerCase().includes(value.toLowerCase()) &&
        name.toLowerCase() !== value.toLowerCase()
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }

    // Clear error when user starts typing
    if (errors.customerName) {
      setErrors(prev => ({ ...prev, customerName: '' }));
    }
  };

  const selectSuggestion = (name: string) => {
    setFormData(prev => ({ ...prev, customerName: name }));
    setShowSuggestions(false);
  };

  return (
    <div className="flex-1 p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-brown mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Cliente
          </label>
          <div className="relative">
            <input
              type="text"
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleCustomerNameChange(e.target.value)}
              onFocus={() => {
                if (formData.customerName && filteredSuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                // Delay hiding suggestions to allow clicking on them
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors ${
                errors.customerName ? 'border-red-300 bg-red-50' : 'border-brown/20'
              }`}
              placeholder="Nombre del cliente"
              aria-describedby={errors.customerName ? 'customerName-error' : undefined}
            />
            
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-brown/20 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                {filteredSuggestions.map((name, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(name)}
                    className="w-full text-left px-4 py-2 hover:bg-beige/50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    {name}
                  </button>
                ))}
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