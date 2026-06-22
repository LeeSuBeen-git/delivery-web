import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import LogoutButton from '@/components/LogoutButton';

export default async function Home() {
  const user = await getCurrentUser();

  const categories = [
    { name: '카페', icon: '☕', color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300' },
    { name: '한식', icon: '🍚', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300' },
    { name: '분식', icon: '🍢', color: 'bg-orange-50 text-orange-600 border-orange-100 hover:border-orange-300' },
    { name: '중식', icon: '🥟', color: 'bg-red-50 text-red-600 border-red-100 hover:border-red-300' },
    { name: '일식', icon: '🍣', color: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300' },
    { name: '피자', icon: '🍕', color: 'bg-yellow-50 text-yellow-600 border-yellow-100 hover:border-yellow-300' },
    { name: '치킨', icon: '🍗', color: 'bg-amber-50 text-amber-700 border-amber-100 hover:border-amber-300' },
  ];

  return (
    <div className="flex-grow flex flex-col bg-slate-50 font-sans">
      
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-zinc-100 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 border border-emerald-100 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            쉽고 빠른 우리 동네 맛집 찾기
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-zinc-900 leading-tight">
            오늘 뭐 먹지? <br className="sm:hidden" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">배달리스트</span>에서 골라보세요!
          </h1>
          <p className="mt-4 text-base text-zinc-500 max-w-lg mx-auto">
            신선하고 맛있는 음식을 간편하게 주문할 수 있습니다. <br />
            원하는 카테고리를 선택하고 맛집을 찾아보세요.
          </p>
        </div>
      </section>

      {/* 카테고리 그리드 섹션 */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <h2 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
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

      {/* 로그인 상태 및 바로가기 섹션 */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto w-full">
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          {user ? (
            <div className="text-center space-y-4">
              <p className="text-zinc-700 font-medium text-base">
                👋 안녕하세요, <span className="text-emerald-600 font-bold">{user.name}</span>님!
              </p>
              <p className="text-xs text-zinc-400">{user.email}</p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/restaurants"
                  className="rounded-lg bg-emerald-500 hover:bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition-colors shadow-sm cursor-pointer"
                >
                  식당 둘러보기
                </Link>
                <LogoutButton />
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-zinc-500 text-sm">
                현재 로그인되어 있지 않습니다.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="rounded-lg bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm cursor-pointer"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  회원가입
                </Link>
              </div>
            </div>
          )}

          {user && (
            <div className="mt-6 pt-6 border-t border-zinc-100">
              <Link
                href="/orders"
                className="flex w-full justify-center items-center gap-1.5 rounded-lg bg-emerald-50 py-3 text-sm font-semibold text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-all cursor-pointer"
              >
                📦 나의 주문 내역 확인하기 &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

