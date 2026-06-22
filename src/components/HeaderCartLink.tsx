"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function HeaderCartLink() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  // SSR 불일치(hydration mismatch) 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = cart && mounted
    ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <Link
      href="/cart"
      className="relative hover:text-orange-400 transition-colors flex items-center gap-1 text-sm font-medium text-zinc-300"
    >
      <span>장바구니</span>
      {totalItems > 0 && (
        <span className="absolute -top-2.5 -right-3.5 inline-flex items-center justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white shadow-lg animate-bounce">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
