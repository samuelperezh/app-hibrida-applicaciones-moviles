import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Product } from '../types';
import { getProducts, saveProduct, updateProduct, deleteProduct } from '../utils/storage';

interface ProductsState {
  products: Product[];
  isLoading: boolean;
}

interface ProductsContextType extends ProductsState {
  addProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
}

type ProductsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; updates: Partial<Product> } }
  | { type: 'DELETE_PRODUCT'; payload: string };

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const productsReducer = (state: ProductsState, action: ProductsAction): ProductsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, isLoading: false };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => (p.id === action.payload.id ? { ...p, ...action.payload.updates, updatedAt: new Date().toISOString() } : p)),
      };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };
    default:
      return state;
  }
};

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, { products: [], isLoading: true });

  useEffect(() => {
    try {
      const list = getProducts();
      dispatch({ type: 'SET_PRODUCTS', payload: list });
    } catch (e) {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const addProduct = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProduct(newProduct);
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
  };

  const editProduct = (id: string, updates: Partial<Product>) => {
    updateProduct(id, updates);
    dispatch({ type: 'UPDATE_PRODUCT', payload: { id, updates } });
  };

  const removeProduct = (id: string) => {
    deleteProduct(id);
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
  };

  const getProductById = (id: string) => state.products.find(p => p.id === id);

  const value: ProductsContextType = { ...state, addProduct, editProduct, removeProduct, getProductById };
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = (): ProductsContextType => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider');
  return ctx;
};


