import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Tag, Coins, AlertCircle } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addProduct, editProduct, getProductById } = useProducts();
  const editProductId = location.state?.editProductId as string | undefined;
  const isEditing = !!editProductId;

  const [formData, setFormData] = useState({ name: '', priceCOP: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && editProductId) {
      const p = getProductById(editProductId);
      if (p) setFormData({ name: p.name, priceCOP: String(p.priceCOP) });
    }
  }, [isEditing, editProductId, getProductById]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'El nombre es obligatorio';
    const price = Number(formData.priceCOP);
    if (isNaN(price) || price <= 0) e.priceCOP = 'El precio debe ser mayor a 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const price = Number(formData.priceCOP);
      if (isEditing && editProductId) {
        editProduct(editProductId, { name: formData.name.trim(), priceCOP: price });
      } else {
        addProduct({ name: formData.name.trim(), priceCOP: price } as any);
      }
      navigate('/app/products');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brown mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Nombre del producto
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors ${errors.name ? 'border-red-300 bg-red-50' : 'border-brown/20'}`}
            placeholder="Ej. Pan Baguette"
          />
          {errors.name && (
            <div className="flex items-center space-x-1 text-red-600 text-sm mt-1" role="alert">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-brown mb-2">
            <Coins className="w-4 h-4 inline mr-1" />
            Precio (COP)
          </label>
          <input
            id="price"
            type="number"
            min="1"
            value={formData.priceCOP}
            onChange={(e) => setFormData(prev => ({ ...prev, priceCOP: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors ${errors.priceCOP ? 'border-red-300 bg-red-50' : 'border-brown/20'}`}
            placeholder="Ej. 2500"
          />
          {errors.priceCOP && (
            <div className="flex items-center space-x-1 text-red-600 text-sm mt-1" role="alert">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.priceCOP}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-4 pt-6">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-brown py-3 px-4 rounded-xl font-medium transition-colors" disabled={isSubmitting}>Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="flex-1 bg-golden hover:bg-golden/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-colors">
            {isSubmitting ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar producto' : 'Crear producto')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;


