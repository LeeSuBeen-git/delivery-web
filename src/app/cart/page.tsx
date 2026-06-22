"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  // 가격 포맷팅 헬퍼
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  // 총 금액 계산
  const totalPrice = cart
    ? cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  // 주문 접수 처리
  const handleOrder = async () => {
    if (!cart || cart.items.length === 0) return;
    setSubmitting(true);
    setOrderError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: cart.restaurantId,
          items: cart.items,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        alert('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || '주문 처리 중 오류가 발생했습니다.');
      }

      alert('주문이 정상적으로 접수되었습니다!');
      clearCart(); // localStorage 비우기
      router.push(`/orders?newOrderId=${data.orderId}`);
      router.refresh();
    } catch (err: any) {
      setOrderError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-grow bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-zinc-800 font-sans">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-zinc-900">
            장바구니
          </h1>
          {cart && cart.items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              전체 비우기
            </button>
          )}
        </div>

        {orderError && (
          <div className="mb-6 rounded-lg border border-rose-100 bg-rose-50 p-3 text-sm text-rose-600">
            {orderError}
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="text-4xl mb-4">🛒</div>
            <p className="text-zinc-700 font-bold text-lg">장바구니가 비어 있습니다.</p>
            <p className="text-zinc-400 text-sm mt-1.5">맛있는 음식을 장바구니에 담아보세요!</p>
            <div className="mt-8">
              <Link
                href="/restaurants"
                className="rounded-lg bg-emerald-500 hover:bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors inline-block cursor-pointer shadow-sm"
              >
                식당 목록 둘러보기
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 식당 이름 표시 */}
            <div className="rounded-xl border border-zinc-200/80 bg-white px-6 py-4 shadow-sm">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">주문 대상 식당</span>
              <h2 className="text-xl font-bold text-zinc-900 mt-1">
                {cart.restaurantName}
              </h2>
            </div>

            {/* 품목 리스트 */}
            <div className="rounded-2xl border border-zinc-200 bg-white divide-y divide-zinc-100 shadow-sm overflow-hidden">
              {cart.items.map((item) => (
                <div key={item.menuItemId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 hover:bg-zinc-50/50 transition-colors">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-zinc-900">{item.name}</h3>
                    <p className="text-xs text-zinc-400">단가: {formatPrice(item.price)}</p>
                    <p className="text-sm font-extrabold text-emerald-600 pt-1">
                      합계: {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* 수량 조절 인터랙션 */}
                    <div className="flex items-center rounded-lg border border-zinc-200 bg-slate-50 p-1">
                      <button
                        onClick={() => updateQuantity(item.menuItemId, -1)}
                        className="h-8 w-8 rounded bg-white border border-zinc-200 hover:bg-slate-100 font-bold transition-all flex items-center justify-center cursor-pointer text-zinc-600"
                      >
                        -
                      </button>
                      <span className="px-4 text-sm font-bold w-12 text-center text-zinc-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, 1)}
                        className="h-8 w-8 rounded bg-white border border-zinc-200 hover:bg-slate-100 font-bold transition-all flex items-center justify-center cursor-pointer text-zinc-600"
                      >
                        +
                      </button>
                    </div>

                    {/* 개별 항목 삭제 */}
                    <button
                      onClick={() => removeFromCart(item.menuItemId)}
                      className="text-xs font-semibold text-zinc-400 hover:text-rose-500 p-2 transition-colors cursor-pointer"
                      title="삭제"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 주문 요약 및 결제 요청 */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-zinc-500 text-sm">
                <span>총 품목 수량</span>
                <span className="font-semibold text-zinc-800">
                  {cart.items.reduce((sum, item) => sum + item.quantity, 0)}개
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                <span className="text-base font-bold text-zinc-700">총 결제 금액</span>
                <span className="text-2xl font-extrabold text-emerald-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={handleOrder}
                  disabled={submitting}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-4 text-center text-sm font-bold text-white border border-emerald-500 hover:opacity-95 transition-all disabled:opacity-50 shadow-md shadow-emerald-500/10 cursor-pointer"
                >
                  {submitting ? '주문 처리 중...' : '주문하기'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
