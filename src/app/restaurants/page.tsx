import Link from 'next/link';
import prisma from '@/lib/prisma';

export const revalidate = 0; // dynamic fetch

interface RestaurantsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  const { category } = await searchParams;

  // 카테고리가 지정되었으면 해당 카테고리 식당만 조회
  const restaurants = await prisma.restaurant.findMany({
    where: category ? { category } : undefined,
    orderBy: { name: 'asc' },
  });

  const categories = [
    { name: '전체보기', path: '/restaurants' },
    { name: '카페', path: '/restaurants?category=' + encodeURIComponent('카페'), icon: '☕' },
    { name: '한식', path: '/restaurants?category=' + encodeURIComponent('한식'), icon: '🍚' },
    { name: '분식', path: '/restaurants?category=' + encodeURIComponent('분식'), icon: '🍢' },
    { name: '중식', path: '/restaurants?category=' + encodeURIComponent('중식'), icon: '🥟' },
    { name: '일식', path: '/restaurants?category=' + encodeURIComponent('일식'), icon: '🍣' },
    { name: '피자', path: '/restaurants?category=' + encodeURIComponent('피자'), icon: '🍕' },
    { name: '치킨', path: '/restaurants?category=' + encodeURIComponent('치킨'), icon: '🍗' },
  ];

  return (
    <div className="flex-grow bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-6xl">
        
        {/* 상단 소개글 */}
        <div className="text-center md:text-left mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900">
            인기 맛집 리스트
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            검증된 맛집의 메뉴를 한눈에 둘러보고 주문하세요.
          </p>
        </div>

        {/* 카테고리 필터 칩 */}
        <div className="flex flex-wrap gap-2.5 mb-10 pb-2 border-b border-zinc-200/60">
          {categories.map((cat) => {
            const isSelected = (!category && cat.name === '전체보기') || (category === cat.name);
            return (
              <Link
                key={cat.name}
                href={cat.path}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold border transition-all duration-200 cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-600/10'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-800'
                }`}
              >
                {cat.icon && <span>{cat.icon}</span>}
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>

        {/* 식당 카드 리스트 */}
        {restaurants.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-zinc-200 bg-white shadow-sm max-w-2xl mx-auto">
            <p className="text-4xl mb-4">🍳</p>
            <p className="text-zinc-600 font-bold text-lg">해당 카테고리의 식당은 준비 중입니다!</p>
            <p className="text-zinc-400 text-sm mt-1.5">다른 카테고리의 맛있는 음식들을 구경해 보세요.</p>
            <div className="mt-6">
              <Link
                href="/restaurants"
                className="rounded-lg bg-emerald-500 hover:bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition-colors shadow-sm cursor-pointer inline-block"
              >
                전체 식당 보기
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-500/50 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-100">
                      {restaurant.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                    {restaurant.description || '식당 소개 정보가 없습니다.'}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center justify-end text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                  메뉴 보기 &rarr;
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
