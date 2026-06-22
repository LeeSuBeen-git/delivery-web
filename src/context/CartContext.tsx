"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  addToCart: (restaurantId: string, restaurantName: string, item: Omit<CartItem, 'quantity'>) => boolean;
  updateQuantity: (menuItemId: string, change: number) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. 초기 마운트 시 localStorage 로드
  useEffect(() => {
    const savedCart = localStorage.getItem('delivery-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. 장바구니 변경 시 localStorage 반영
  useEffect(() => {
    if (isInitialized) {
      if (cart) {
        localStorage.setItem('delivery-cart', JSON.stringify(cart));
      } else {
        localStorage.removeItem('delivery-cart');
      }
    }
  }, [cart, isInitialized]);

  // 3. 장바구니 추가
  const addToCart = (
    restaurantId: string,
    restaurantName: string,
    newItem: Omit<CartItem, 'quantity'>
  ): boolean => {
    // 이미 장바구니에 데이터가 있고, 식당이 다른 경우
    if (cart && cart.restaurantId !== restaurantId) {
      const confirmReset = window.confirm(
        `장바구니에는 같은 식당의 메뉴만 담을 수 있습니다.\n` +
        `'${cart.restaurantName}'의 메뉴를 비우고 '${restaurantName}'의 메뉴를 새로 담으시겠습니까?`
      );

      if (!confirmReset) {
        return false; // 추가 취소
      }

      // 기존 장바구니 리셋 후 신규 담기
      setCart({
        restaurantId,
        restaurantName,
        items: [{ ...newItem, quantity: 1 }],
      });
      return true;
    }

    // 기존 장바구니가 비어있는 경우 새로 생성
    if (!cart) {
      setCart({
        restaurantId,
        restaurantName,
        items: [{ ...newItem, quantity: 1 }],
      });
      return true;
    }

    // 동일 식당의 기존 장바구니에 항목 추가
    const existingItemIndex = cart.items.findIndex(
      (item) => item.menuItemId === newItem.menuItemId
    );

    if (existingItemIndex > -1) {
      // 이미 같은 메뉴가 있는 경우 수량 증가
      const updatedItems = [...cart.items];
      updatedItems[existingItemIndex].quantity += 1;
      setCart({ ...cart, items: updatedItems });
    } else {
      // 새로운 메뉴 추가
      setCart({
        ...cart,
        items: [...cart.items, { ...newItem, quantity: 1 }],
      });
    }
    return true;
  };

  // 4. 수량 변경 (+1 또는 -1)
  const updateQuantity = (menuItemId: string, change: number) => {
    if (!cart) return;

    const updatedItems = cart.items
      .map((item) => {
        if (item.menuItemId === menuItemId) {
          const newQty = item.quantity + change;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // 수량이 0 이하가 되면 제외

    if (updatedItems.length === 0) {
      setCart(null); // 장바구니 내 품목이 모두 없어지면 비우기
    } else {
      setCart({ ...cart, items: updatedItems });
    }
  };

  // 5. 항목 제거
  const removeFromCart = (menuItemId: string) => {
    if (!cart) return;

    const updatedItems = cart.items.filter((item) => item.menuItemId !== menuItemId);

    if (updatedItems.length === 0) {
      setCart(null);
    } else {
      setCart({ ...cart, items: updatedItems });
    }
  };

  // 6. 전체 비우기
  const clearCart = () => {
    setCart(null);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
