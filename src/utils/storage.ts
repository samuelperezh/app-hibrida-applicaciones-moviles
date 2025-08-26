import { User, Order } from '../types';

const STORAGE_KEYS = {
  USER: 'panapp_user',
  ORDERS: 'panapp_orders',
  USERS: 'panapp_users',
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

// Users database (credentials) helpers
type StoredUser = User & { passwordHash: string };

const getAllStoredUsers = (): StoredUser[] => {
  try {
    const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
    return usersData ? JSON.parse(usersData) : [];
  } catch (error) {
    console.error('Error getting users from localStorage:', error);
    return [];
  }
};

const saveAllStoredUsers = (users: StoredUser[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

const findStoredUserByUsername = (username: string): StoredUser | undefined => {
  const users = getAllStoredUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase());
};

// Note: findStoredUserById was unused and removed to keep lints clean

const toHexString = (buffer: ArrayBuffer): string => {
  const byteArray = new Uint8Array(buffer);
  const hexCodes: string[] = [];
  for (let i = 0; i < byteArray.length; i++) {
    const hex = byteArray[i].toString(16).padStart(2, '0');
    hexCodes.push(hex);
  }
  return hexCodes.join('');
};

export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return toHexString(hashBuffer);
};

export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  const existing = findStoredUserByUsername(username);
  if (!existing) return null;
  const passwordHash = await hashPassword(password);
  if (existing.passwordHash !== passwordHash) return null;
  const { passwordHash: _ph, ...publicUser } = existing;
  return publicUser;
};

export const registerNewUser = async (data: { username: string; password: string; name: string; email?: string }): Promise<{ ok: boolean; error?: string; user?: User }> => {
  const { username, password, name, email } = data;
  if (!username || !password || !name) {
    return { ok: false, error: 'Faltan campos obligatorios' };
  }
  const users = getAllStoredUsers();
  const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
  if (exists) {
    return { ok: false, error: 'El usuario ya existe' };
  }
  const passwordHash = await hashPassword(password);
  const newUser: StoredUser = {
    id: Date.now().toString(),
    username,
    name,
    email,
    createdAt: new Date().toISOString(),
    passwordHash,
  };
  users.push(newUser);
  saveAllStoredUsers(users);
  const { passwordHash: _ph, ...publicUser } = newUser;
  return { ok: true, user: publicUser };
};

export const updateStoredUserProfile = (userId: string, updates: Partial<User>): void => {
  try {
    const users = getAllStoredUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return;
    users[idx] = { ...users[idx], ...updates } as StoredUser;
    saveAllStoredUsers(users);
  } catch (error) {
    console.error('Error updating user profile in localStorage:', error);
  }
};

// Orders storage functions
export const getOrders = (): Order[] => {
  try {
    const ordersData = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return ordersData ? JSON.parse(ordersData) : [];
  } catch (error) {
    console.error('Error getting orders from localStorage:', error);
    return [];
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

export const changeStoredUserPassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> => {
  try {
    const users = getAllStoredUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return { ok: false, error: 'Usuario no encontrado' };
    const current = users[idx];
    const oldHash = await hashPassword(oldPassword);
    if (current.passwordHash !== oldHash) return { ok: false, error: 'Contraseña actual incorrecta' };
    const newHash = await hashPassword(newPassword);
    users[idx] = { ...current, passwordHash: newHash };
    saveAllStoredUsers(users);
    return { ok: true };
  } catch (error) {
    console.error('Error changing user password in localStorage:', error);
    return { ok: false, error: 'No se pudo cambiar la contraseña' };
  }
};