import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Coins, Edit3, Plus, Search, Tag, Trash2 } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import ConfirmDialog from '../components/ConfirmDialog';

const currency = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { products, removeProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q));
  }, [products, search]);

  const handleCreate = () => navigate('/app/products/new');
  const handleEdit = (id: string) => navigate('/app/products/new', { state: { editProductId: id } });
  const confirmDelete = () => { if (deleteId) removeProduct(deleteId); setDeleteId(null); };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/60" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-brown/20 rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 px-4">
        {filtered.length === 0 ? (
          <div className="h-full flex items-center justify-center text-brown/60">No hay productos</div>
        ) : (
          <div className="space-y-3 pb-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-brown/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-golden/20 flex items-center justify-center">
                      <Tag className="w-6 h-6 text-golden" />
                    </div>
                    <div>
                      <h3 className="text-brown font-semibold">{p.name}</h3>
                      <div className="text-brown/70 text-sm flex items-center space-x-2">
                        <Coins className="w-4 h-4" />
                        <span>{currency.format(p.priceCOP)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(p.id)} className="p-2 rounded-xl bg-beige hover:bg-golden/20 transition-colors" aria-label="Editar producto">
                      <Edit3 className="w-4 h-4 text-brown" />
                    </button>
                    <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-xl bg-red-50 hover:bg-red-100 transition-colors" aria-label="Eliminar producto">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleCreate} className="fixed bottom-20 right-4 bg-golden hover:bg-golden/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-30" aria-label="Crear producto">
        <Plus className="w-6 h-6" />
      </button>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar producto" message="¿Eliminar este producto?" confirmLabel="Eliminar" onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} type="danger" />
    </div>
  );
};

export default Products;


