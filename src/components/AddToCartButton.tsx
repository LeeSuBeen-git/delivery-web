"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface AddToCartButtonProps {
  restaurantId: string;
  restaurantName: string;
  menuItemId: string;
  name: string;
  price: number;
}

export default function AddToCartButton({
  restaurantId,
  restaurantName,
  menuItemId,
  name,
  price,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    const success = addToCart(restaurantId, restaurantName, {
      menuItemId,
      name,
      price,
    });

    if (success) {
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 1000);
    }
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full sm:w-auto rounded-lg px-4 py-2.5 text-xs font-semibold border transition-all duration-200 cursor-pointer ${
        isAdded
          ? 'bg-teal-600 border-teal-500 text-white shadow-lg shadow-teal-600/20'
          : 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500'
      }`}
    >
      {isAdded ? '✓ 담기 완료!' : '장바구니 담기'}
    </button>
  );
}
