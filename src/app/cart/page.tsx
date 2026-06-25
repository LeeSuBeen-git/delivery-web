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

  // 주문 옵션 상태 관리
  const [orderMethod, setOrderMethod] = useState<'DELIVERY' | 'TAKEOUT'>('DELIVERY');
  const [address, setAddress] = useState('');
  const [requestNote, setRequestNote] = useState('');
  const [utensils, setUtensils] = useState<'YES' | 'NO'>('YES');
  const [paymentMethod, setPaymentMethod] = useState<'PREPAID' | 'POSTPAID' | ''>('');
  const [prepaidType, setPrepaidType] = useState<'EASY' | 'CARD' | 'BARIPAY' | 'BANK' | ''>('');
  const [pointToUse, setPointToUse] = useState<string>('0');

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

    // 1. 배달 선택 시 주소 검증
    if (orderMethod === 'DELIVERY' && !address.trim()) {
      setOrderError('배달 주소를 입력해 주세요.');
      alert('배달 주소를 입력해 주세요.');
      return;
    }

    // 2. 결제 방식 검증
    if (!paymentMethod) {
      setOrderError('결제 방식을 선택해 주세요.');
      alert('결제 방식을 선택해 주세요.');
      return;
    }

    // 3. 선결제 선택 시 하위 결제수단 검증
    if (paymentMethod === 'PREPAID' && !prepaidType) {
      setOrderError('선결제 수단을 선택해 주세요.');
      alert('선결제 수단을 선택해 주세요.');
      return;
    }

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

            {/* 주문 옵션 설정 섹션 */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
                <span>⚙️</span> 주문 옵션 설정
              </h3>

              {/* 1. 포장/배달 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">주문 방식</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderMethod('DELIVERY')}
                    className={`py-3 text-center rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                      orderMethod === 'DELIVERY'
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    🛵 배달
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderMethod('TAKEOUT')}
                    className={`py-3 text-center rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                      orderMethod === 'TAKEOUT'
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    🛍️ 포장
                  </button>
                </div>
              </div>

              {/* 2. 배달 시 주소 및 요청사항 입력 */}
              {orderMethod === 'DELIVERY' && (
                <div className="space-y-4 pt-2 border-t border-zinc-100 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">
                      배달 주소 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="배달받을 주소를 입력해 주세요"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">배달 요청사항</label>
                    <input
                      type="text"
                      value={requestNote}
                      onChange={(e) => setRequestNote(e.target.value)}
                      placeholder="배달 요청사항을 직접 작성해 주세요"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* 3. 공통 사항 - 수저포크 유무 */}
              <div className="space-y-2 pt-4 border-t border-zinc-100">
                <label className="text-sm font-bold text-zinc-700">수저·포크 제공 유무</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUtensils('YES')}
                    className={`py-2.5 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      utensils === 'YES'
                        ? 'bg-slate-800 border-slate-800 text-white shadow-sm'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    🍴 필요해요
                  </button>
                  <button
                    type="button"
                    onClick={() => setUtensils('NO')}
                    className={`py-2.5 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      utensils === 'NO'
                        ? 'bg-slate-800 border-slate-800 text-white shadow-sm'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    ❌ 안 받을게요
                  </button>
                </div>
              </div>

              {/* 4. 결제방식 선택 */}
              <div className="space-y-3 pt-4 border-t border-zinc-100">
                <label className="text-sm font-bold text-zinc-700">
                  결제 방식 <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('PREPAID');
                      setPrepaidType('');
                    }}
                    className={`py-3 text-center rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'PREPAID'
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    💳 선결제 (앱에서 결제)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('POSTPAID');
                      setPrepaidType('');
                    }}
                    className={`py-3 text-center rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'POSTPAID'
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    💵 후결제 (만나서 결제)
                  </button>
                </div>

                {/* 선결제 하위 결제수단 */}
                {paymentMethod === 'PREPAID' && (
                  <div className="grid grid-cols-4 gap-2 pt-2 animate-in fade-in duration-200">
                    {[
                      { id: 'EASY', label: '간편결제' },
                      { id: 'CARD', label: '카드결제' },
                      { id: 'BARIPAY', label: '배리페이' },
                      { id: 'BANK', label: '계좌이체' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setPrepaidType(type.id as any)}
                        className={`py-2 text-center rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          prepaidType === type.id
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-extrabold shadow-sm'
                            : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. 포인트 사용 UI */}
              <div className="space-y-2 pt-4 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-zinc-700">포인트 사용</label>
                  <span className="text-xs text-zinc-400 font-bold">
                    보유 0p / 100p(최소포인트사용금액)
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled
                    value={pointToUse}
                    onChange={(e) => setPointToUse(e.target.value)}
                    className="flex-grow rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-400 font-semibold cursor-not-allowed outline-none"
                  />
                  <button
                    type="button"
                    disabled
                    className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xs font-bold text-zinc-400 cursor-not-allowed"
                  >
                    전액 사용
                  </button>
                </div>
                <p className="text-[10px] text-zinc-400 font-medium">※ 100p 단위 사용 가능 (최대 보유 포인트 한도 내)</p>
              </div>
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
