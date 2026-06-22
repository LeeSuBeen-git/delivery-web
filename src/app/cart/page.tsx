"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  // 가격 포맷팅 헬퍼
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  // 총 금액 계산
  const totalPrice = cart
    ? cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  return (
    <div className="flex-1 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 py-12 px-4 sm:px-6 lg:px-8 text-white font-sans">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300">
            장바구니
          </h1>
          {cart && cart.items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-zinc-400 hover:text-red-400 transition-colors"
            >
              전체 비우기
            </button>
          )}
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md">
            <div className="text-4xl mb-4">🛒</div>
            <p className="text-zinc-400 text-lg">장바구니가 비어 있습니다.</p>
            <p className="text-zinc-500 text-sm mt-1">맛있는 음식을 장바구니에 담아보세요!</p>
            <div className="mt-8">
              <Link
                href="/restaurants"
                className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-400 transition-colors inline-block"
              >
                식당 목록 둘러보기
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 식당 이름 표시 */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-6 py-4 backdrop-blur-md">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">주문 대상 식당</span>
              <h2 className="text-xl font-bold text-white mt-1">
                {cart.restaurantName}
              </h2>
            </div>

            {/* 품목 리스트 */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 divide-y divide-zinc-800 backdrop-blur-md overflow-hidden">
              {cart.items.map((item) => (
                <div key={item.menuItemId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 hover:bg-zinc-900/10 transition-colors">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">{item.name}</h3>
                    <p className="text-xs text-zinc-500">단가: {formatPrice(item.price)}</p>
                    <p className="text-sm font-semibold text-orange-400 pt-1">
                      합계: {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* 수량 조절 인터랙션 */}
                    <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/80 p-1">
                      <button
                        onClick={() => updateQuantity(item.menuItemId, -1)}
                        className="h-8 w-8 rounded bg-zinc-800 hover:bg-zinc-700 font-bold transition-colors flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="px-4 text-sm font-bold w-12 text-center text-zinc-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, 1)}
                        className="h-8 w-8 rounded bg-zinc-800 hover:bg-zinc-700 font-bold transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    {/* 개별 항목 삭제 */}
                    <button
                      onClick={() => removeFromCart(item.menuItemId)}
                      className="text-xs font-semibold text-zinc-500 hover:text-red-400 p-2 transition-colors"
                      title="삭제"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 주문 요약 및 결제 요청 (아직 orders 저장은 안 됨) */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between text-zinc-400 text-sm">
                <span>총 품목 수량</span>
                <span className="font-semibold text-zinc-200">
                  {cart.items.reduce((sum, item) => sum + item.quantity, 0)}개
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                <span className="text-lg font-bold text-zinc-300">총 결제 금액</span>
                <span className="text-2xl font-extrabold text-orange-400">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              
              <div className="pt-4">
                <button
                  disabled
                  className="w-full rounded-xl bg-zinc-800 py-4 text-center text-sm font-bold text-zinc-500 border border-zinc-700 cursor-not-allowed select-none transition-colors"
                >
                  주문하기 (다음 단계 연결 예정)
                </button>
                <p className="text-[11px] text-zinc-500 text-center mt-2.5">
                  * 다음 7단계 최종 주문 저장 기능 개발 후 주문이 가능합니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
