'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const CommerceContext = createContext(null);
const CART_STORAGE_KEY = 'demoCart';
const FAVORITES_STORAGE_KEY = 'demoFavorites';

function readStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(value)) return [];

    return value.flatMap((item) => {
      const validProduct =
        item &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        Number.isFinite(item.basePrice) &&
        item.basePrice >= 0;

      if (!validProduct) return [];
      if (key !== CART_STORAGE_KEY) return [item];

      const stockQuantity = Number.isInteger(item.stockQuantity)
        ? item.stockQuantity
        : item.quantity;
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        !Number.isInteger(stockQuantity) ||
        stockQuantity < item.quantity
      ) {
        return [];
      }

      return [{ ...item, stockQuantity }];
    });
  } catch (error) {
    console.error(`Unable to read ${key} from local storage:`, error);
    return [];
  }
}

export function CommerceProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setCartItems(readStoredArray(CART_STORAGE_KEY));
    setFavoriteItems(readStoredArray(FAVORITES_STORAGE_KEY));
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Unable to save the shopping cart:', error);
    }
  }, [cartItems, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;

    try {
      localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favoriteItems),
      );
    } catch (error) {
      console.error('Unable to save liked products:', error);
    }
  }, [favoriteItems, hasHydrated]);

  const addToCart = useCallback(
    (product, quantity = 1) => {
      if (
        !product?.id ||
        !product?.title ||
        !Number.isFinite(product.basePrice) ||
        product.basePrice < 0 ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        throw new Error('This product cannot be added to the cart.');
      }

      const available = Number.isInteger(product.stockQuantity)
        ? product.stockQuantity
        : 1;
      const existing = cartItems.find((item) => item.id === product.id);
      if (available < 1 || (existing?.quantity || 0) + quantity > available) {
        throw new Error('The requested quantity is not available.');
      }

      setCartItems((items) => {
        const current = items.find((item) => item.id === product.id);
        if (current) {
          return items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [...items, { ...product, stockQuantity: available, quantity }];
      });
    },
    [cartItems],
  );

  const updateQuantity = useCallback((productId, quantity) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: Math.min(
                  Math.max(1, quantity),
                  Number.isInteger(item.stockQuantity) ? item.stockQuantity : 1,
                ),
              }
            : item,
        )
        .filter((item) => item.stockQuantity !== 0),
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((items) => items.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const toggleFavorite = useCallback((product) => {
    if (!product?.id) return;

    setFavoriteItems((items) =>
      items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : [...items, product],
    );
  }, []);

  const isFavorite = useCallback(
    (productId) => favoriteItems.some((item) => item.id === productId),
    [favoriteItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      favoriteItems,
      hasHydrated,
      cartCount: cartItems.reduce((count, item) => count + item.quantity, 0),
      cartTotal: cartItems.reduce(
        (total, item) => total + item.basePrice * item.quantity,
        0,
      ),
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleFavorite,
      isFavorite,
    }),
    [
      cartItems,
      favoriteItems,
      hasHydrated,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleFavorite,
      isFavorite,
    ],
  );

  return (
    <CommerceContext.Provider value={value}>
      {children}
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error('useCommerce must be used within CommerceProvider.');
  }
  return context;
}
