import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Order, OrderStats } from '../types';
import { getOrders, saveOrder, updateOrder, deleteOrder } from '../utils/storage';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
}

interface OrdersContextType extends OrdersState {
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  editOrder: (id: string, updates: Partial<Order>) => void;
  removeOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrderStats: () => OrderStats;
  getFilteredOrders: (status?: Order['status']) => Order[];
}

type OrdersAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: { id: string; updates: Partial<Order> } }
  | { type: 'DELETE_ORDER'; payload: string };

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const ordersReducer = (state: OrdersState, action: OrdersAction): OrdersState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload, isLoading: false };
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : order
        ),
      };
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload),
      };
    default:
      return state;
  }
};

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, {
    orders: [],
    isLoading: true,
  });

  // Load orders on mount
  useEffect(() => {
    const loadOrders = () => {
      try {
        const orders = getOrders();
        dispatch({ type: 'SET_ORDERS', payload: orders });
      } catch (error) {
        console.error('Failed to load orders:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadOrders();
  }, []);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveOrder(newOrder);
    dispatch({ type: 'ADD_ORDER', payload: newOrder });
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    updateOrder(id, { status });
    dispatch({ type: 'UPDATE_ORDER', payload: { id, updates: { status } } });
  };

  const editOrder = (id: string, updates: Partial<Order>) => {
    updateOrder(id, updates);
    dispatch({ type: 'UPDATE_ORDER', payload: { id, updates } });
  };

  const removeOrder = (id: string) => {
    deleteOrder(id);
    dispatch({ type: 'DELETE_ORDER', payload: id });
  };

  const getOrderById = (id: string): Order | undefined => {
    return state.orders.find(order => order.id === id);
  };

  const getOrderStats = (): OrderStats => {
    const stats = state.orders.reduce(
      (acc, order) => {
        acc.total++;
        switch (order.status) {
          case 'pending':
            acc.pending++;
            break;
          case 'in-progress':
            acc.inProgress++;
            break;
          case 'completed':
            acc.completed++;
            break;
        }
        return acc;
      },
      { pending: 0, inProgress: 0, completed: 0, total: 0 }
    );

    return stats;
  };

  const getFilteredOrders = (status?: Order['status']): Order[] => {
    if (!status) return state.orders;
    return state.orders.filter(order => order.status === status);
  };

  const value: OrdersContextType = {
    ...state,
    addOrder,
    updateOrderStatus,
    editOrder,
    removeOrder,
    getOrderById,
    getOrderStats,
    getFilteredOrders,
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};