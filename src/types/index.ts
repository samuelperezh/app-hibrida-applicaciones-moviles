export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  avatar?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  priceCOP: number; // stored in COP as integer or float
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  details: string;
  quantity: number;
  deliveryDate: string;
  deliveryTime: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'in-progress' | 'completed';

export interface OrderStats {
  pending: number;
  inProgress: number;
  completed: number;
  total: number;
}