"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface RestaurantInfo {
  id: string;
  name: string;
  category: string;
  description: string | null;
}

interface HomeClientProps {
  user: { id: string; name: string; email: string } | null;
  recentRestaurants: RestaurantInfo[];
  popularRestaurants: RestaurantInfo[];
}

const getTodayStr = () => {
  const localDate = new Date();
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function HomeClient({
  user,
  recentRestaurants,
  popularRestaurants,
}: HomeClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdVisible, setIsAdVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 7대 카테고리 구성
  const categories = [
    { name: '카페', icon: '☕', color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300' },
    { name: '한식', icon: '🍚', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300' },
    { name: '분식', icon: '🍢', color: 'bg-orange-50 text-orange-600 border-orange-100 hover:border-orange-300' },
    { name: '중식', icon: '🥟', color: 'bg-red-50 text-red-600 border-red-100 hover:border-red-300' },
    { name: '일식', icon: '🍣', color: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300' },
    { name: '피자', icon: '🍕', color: 'bg-yellow-50 text-yellow-600 border-yellow-100 hover:border-yellow-300' },
    { name: '치킨', icon: '🍗', color: 'bg-amber-50 text-amber-700 border-amber-100 hover:border-amber-300' },
  ];

  useEffect(() => {
    setMounted(true);
    if (user) {
      // 오늘 날짜 문자열 YYYY-MM-DD
      const todayStr = getTodayStr();
      const hiddenDate = localStorage.getItem('delivery-ad-hidden-date');
      
      if (hiddenDate !== todayStr) {
        setIsAdVisible(true);
      }
    }
  }, [user]);

  // 검색 실행
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // 광고 닫기 (이번 세션 동안만 닫기)
  const handleCloseAd = () => {
    setIsAdVisible(false);
  };

  // 광고 오늘 하루 보지 않기 (localStorage 저장)
  const handleHideAdToday = () => {
    const todayStr = getTodayStr();
    localStorage.setItem('delivery-ad-hidden-date', todayStr);
    setIsAdVisible(false);
  };

  return (
    <div className="flex-grow flex flex-col bg-slate-50 font-sans">
      
      {/* 1. 광고 배너 (로그인 사용자 대상 노출) */}
      {mounted && user && isAdVisible && (
        <div className="w-full bg-emerald-600 text-white py-4 px-4 sm:px-6 lg:px-8 shadow-inner animate-in fade-in slide-in-from-top duration-350">
          <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* 배너 정보 */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">오늘의 배달리스트 혜택</p>
                <p className="text-sm font-extrabold sm:text-base">
                  <span className="text-yellow-300 font-black">{user.name}</span>님만을 위한 첫 주문 5,000원 특별 할인 쿠폰팩 지급 완료!
                </p>
              </div>
            </div>

            {/* 제어 버튼 */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleHideAdToday}
                className="rounded bg-emerald-700/60 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-bold border border-emerald-500/30 transition-colors cursor-pointer"
              >
                오늘 하루 보지 않기
              </button>
              <button
                onClick={handleCloseAd}
                className="rounded bg-white text-emerald-700 hover:bg-emerald-50 px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden py-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-zinc-100 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 border border-emerald-100 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            원하는 맛집을 빠르고 위생적으로
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-zinc-900 leading-tight">
            오늘 뭐 먹지? <br className="sm:hidden" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">배달리스트</span>에서 검색해보세요!
          </h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-500 max-w-lg mx-auto leading-relaxed">
            프랜차이즈부터 동네 숨은 맛집까지 간편하게 주문해보세요.
          </p>

          {/* 가게명 검색창 */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-md mx-auto relative flex items-center">
            <input
              type="text"
              required
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="가게명을 검색해 보세요"
              className="block w-full rounded-2xl border border-zinc-300 bg-white pl-5 pr-14 py-3.5 text-sm text-zinc-800 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 p-2 text-white transition-colors cursor-pointer shadow-sm"
              title="검색"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* 카테고리 그리드 섹션 */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <h2 className="text-lg font-bold text-zinc-800 mb-5 flex items-center gap-2">
          <span>📂</span> 카테고리별 맛집 탐색
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/restaurants?category=${encodeURIComponent(cat.name)}`}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${cat.color}`}
            >
              <span className="text-3xl mb-2.5">{cat.icon}</span>
              <span className="text-sm font-bold">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 중단 메인 콘텐츠 섹션 (인기 랭킹 및 최근 주문 리스트) */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full grid gap-8 md:grid-cols-12">
        
        {/* 좌측: 실시간 인기 가게 랭킹 (8컬럼) */}
        <div className="md:col-span-7 lg:col-span-8 space-y-5">
          <h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
            <span>🔥</span> 실시간 인기 가게 순위
          </h2>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm divide-y divide-zinc-100">
            {popularRestaurants.map((restaurant, idx) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.id}`}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group transition-all"
              >
                {/* 등수 숫자 표시 */}
                <div className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-black border ${
                  idx === 0 ? 'bg-amber-100 border-amber-200 text-amber-600' :
                  idx === 1 ? 'bg-slate-100 border-slate-200 text-slate-500' :
                  idx === 2 ? 'bg-orange-50 border-orange-100 text-orange-600' :
                  'bg-white border-zinc-200 text-zinc-400'
                }`}>
                  {idx + 1}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                      {restaurant.name}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 border border-emerald-100">
                      {restaurant.category}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                    {restaurant.description || '인기 급상승 중인 우리동네 대표 맛집!'}
                  </p>
                </div>

                <span className="text-xs text-zinc-300 group-hover:text-emerald-500 font-bold transition-colors">
                  방문하기 &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 우측: 최근 주문한 가게 & 로그인 웰컴 보드 (4컬럼) */}
        <div className="md:col-span-5 lg:col-span-4 space-y-6">
          
          {/* 로그인 웰컴 보드 */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            {user ? (
              <div className="text-center space-y-3.5">
                <p className="text-zinc-700 font-medium text-sm">
                  👋 <span className="text-emerald-600 font-bold">{user.name}</span>님, 반갑습니다!
                </p>
                <div className="flex justify-center gap-2">
                  <Link
                    href="/restaurants"
                    className="rounded-lg bg-emerald-500 hover:bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition-colors shadow-sm cursor-pointer"
                  >
                    가게 목록
                  </Link>
                  <Link
                    href="/orders"
                    className="rounded-lg bg-slate-100 hover:bg-slate-200 px-4 py-1.5 text-xs font-bold text-zinc-600 transition-colors cursor-pointer border border-zinc-200/50"
                  >
                    주문 내역
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-zinc-500 text-xs font-medium">
                  로그인 후 특별 혜택 쿠폰을 확인하세요!
                </p>
                <div className="flex justify-center gap-2 pt-1">
                  <Link
                    href="/login"
                    className="rounded-lg bg-emerald-500 hover:bg-emerald-600 px-5 py-2 text-xs font-bold text-white transition-colors shadow-sm cursor-pointer"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    회원가입
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 최근 주문한 가게 영역 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
              <span>🍛</span> 최근 주문한 가게
            </h2>

            {user ? (
              recentRestaurants.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-center">
                  <p className="text-2xl mb-1.5">🥘</p>
                  <p className="text-xs font-bold text-zinc-500">최근 주문한 가게가 없습니다.</p>
                  <p className="text-[10px] text-zinc-400 mt-1">맛있는 프랜차이즈 요리를 첫 주문해 보세요!</p>
                  <Link
                    href="/restaurants"
                    className="mt-4 inline-block rounded bg-emerald-50 px-3.5 py-1.5 text-[10px] font-bold text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-all cursor-pointer"
                  >
                    첫 주문하러 가기
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRestaurants.map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      href={`/restaurants/${restaurant.id}`}
                      className="block rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:border-emerald-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-zinc-400">{restaurant.category}</span>
                        <span className="text-[9px] bg-amber-50 text-amber-600 font-bold border border-amber-100 rounded-full px-2 py-0.5">단골매장</span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-800 mt-1.5 group-hover:text-emerald-600 transition-colors">
                        {restaurant.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                        {restaurant.description || '이전 주문에 대단히 만족한 매장'}
                      </p>
                    </Link>
                  ))}
                </div>
              )
            ) : (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-center">
                <p className="text-zinc-400 text-xs font-semibold">로그인 하시면 최근 주문한<br />가게 목록을 불러옵니다.</p>
                <Link
                  href="/login"
                  className="mt-4 inline-block rounded bg-emerald-50 px-4 py-1.5 text-[10px] font-bold text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-all cursor-pointer"
                >
                  로그인하기
                </Link>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
