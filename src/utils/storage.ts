import { User, Order } from '../types';

const STORAGE_KEYS = {
  USER: 'panapp_user',
  ORDERS: 'panapp_orders',
} as const;

// User storage functions
export const getUser = (): User | null => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user from localStorage:', error);
    return null;
  }
};

export const saveUser = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

export const clearUser = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error clearing user from localStorage:', error);
  }
};

// Orders storage functions
export const getOrders = (): Order[] => {
  try {
    const ordersData = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return ordersData ? JSON.parse(ordersData) : getInitialOrders();
  } catch (error) {
    console.error('Error getting orders from localStorage:', error);
    return getInitialOrders();
  }
};

export const saveOrder = (order: Order): void => {
  try {
    const orders = getOrders();
    const existingIndex = orders.findIndex(o => o.id === order.id);
    
    if (existingIndex !== -1) {
      orders[existingIndex] = { ...order, updatedAt: new Date().toISOString() };
    } else {
      orders.push(order);
    }
    
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving order to localStorage:', error);
  }
};

export const updateOrder = (id: string, updates: Partial<Order>): void => {
  try {
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === id);
    
    if (orderIndex !== -1) {
      orders[orderIndex] = { 
        ...orders[orderIndex], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  } catch (error) {
    console.error('Error updating order in localStorage:', error);
  }
};

export const deleteOrder = (id: string): void => {
  try {
    const orders = getOrders();
    const filteredOrders = orders.filter(o => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(filteredOrders));
  } catch (error) {
    console.error('Error deleting order from localStorage:', error);
  }
};

// Initial seed data
const getInitialOrders = (): Order[] => [
  {
    id: '1',
    customerName: 'María González',
    details: '2 baguettes francesas, 1 pan integral',
    quantity: 3,
    deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    deliveryTime: '09:00',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    customerName: 'Carlos Ruiz',
    details: '1 tarta de chocolate para cumpleaños',
    quantity: 1,
    deliveryDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    deliveryTime: '15:00',
    status: 'in-progress',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];