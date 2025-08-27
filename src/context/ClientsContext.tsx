import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Client } from '../types';
import { getClients, saveClient, updateClient, deleteClient } from '../utils/storage';

interface ClientsState {
  clients: Client[];
  isLoading: boolean;
}

interface ClientsContextType extends ClientsState {
  addClient: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editClient: (id: string, updates: Partial<Client>) => void;
  removeClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
}

type ClientsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; updates: Partial<Client> } }
  | { type: 'DELETE_CLIENT'; payload: string };

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

const clientsReducer = (state: ClientsState, action: ClientsAction): ClientsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload, isLoading: false };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(c => (c.id === action.payload.id ? { ...c, ...action.payload.updates, updatedAt: new Date().toISOString() } : c)),
      };
    case 'DELETE_CLIENT':
      return { ...state, clients: state.clients.filter(c => c.id !== action.payload) };
    default:
      return state;
  }
};

export const ClientsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(clientsReducer, { clients: [], isLoading: true });

  useEffect(() => {
    try {
      const list = getClients();
      dispatch({ type: 'SET_CLIENTS', payload: list });
    } catch (e) {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const addClient = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveClient(newClient);
    dispatch({ type: 'ADD_CLIENT', payload: newClient });
  };

  const editClient = (id: string, updates: Partial<Client>) => {
    updateClient(id, updates);
    dispatch({ type: 'UPDATE_CLIENT', payload: { id, updates } });
  };

  const removeClient = (id: string) => {
    deleteClient(id);
    dispatch({ type: 'DELETE_CLIENT', payload: id });
  };

  const getClientById = (id: string) => state.clients.find(c => c.id === id);

  const value: ClientsContextType = { ...state, addClient, editClient, removeClient, getClientById };
  return <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>;
};

export const useClients = (): ClientsContextType => {
  const ctx = useContext(ClientsContext);
  if (!ctx) throw new Error('useClients must be used within a ClientsProvider');
  return ctx;
};


