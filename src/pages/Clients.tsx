import React, { useMemo, useState } from 'react';
import { Plus, Search, Phone, MapPin, User, Edit3, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useClients } from '../context/ClientsContext';
import ConfirmDialog from '../components/ConfirmDialog';

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const { clients, removeClient } = useClients();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter(c =>
      c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q) || c.address.toLowerCase().includes(q)
    );
  }, [clients, search]);

  const handleCreate = () => {
    navigate('/app/clients/new');
  };

  const handleEdit = (id: string) => {
    navigate('/app/clients/new', { state: { editClientId: id } });
  };

  const confirmDelete = () => {
    if (deleteId) removeClient(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/60" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-brown/20 rounded-xl focus:ring-2 focus:ring-golden focus:border-transparent outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 px-4">
        {filtered.length === 0 ? (
          <div className="h-full flex items-center justify-center text-brown/60">
            No hay clientes. Crea tu primer cliente.
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {filtered.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm border border-brown/10">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-full bg-golden/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-golden" />
                    </div>
                    <div>
                      <h3 className="text-brown font-semibold">{c.name}</h3>
                      <div className="text-brown/70 text-sm flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{c.phone}</span>
                      </div>
                      <div className="text-brown/70 text-sm flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{c.address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(c.id)}
                      className="p-2 rounded-xl bg-beige hover:bg-golden/20 transition-colors"
                      aria-label="Editar cliente"
                    >
                      <Edit3 className="w-4 h-4 text-brown" />
                    </button>
                    <button
                      onClick={() => setDeleteId(c.id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
                      aria-label="Eliminar cliente"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleCreate}
        className="fixed bottom-20 right-4 bg-golden hover:bg-golden/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-30"
        aria-label="Crear cliente"
      >
        <Plus className="w-6 h-6" />
      </button>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Eliminar cliente"
        message="¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        type="danger"
      />
    </div>
  );
};

export default Clients;


