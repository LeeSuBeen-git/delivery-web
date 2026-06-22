import Link from 'next/link';
import prisma from '@/lib/prisma';

export const revalidate = 0; // dynamic fetch

export default async function RestaurantsPage() {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="flex-1 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center md:text-left mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300">
            인기 맛집 리스트
          </h1>
          <p className="mt-2 text-zinc-400">
            검증된 맛집의 메뉴를 한눈에 둘러보고 주문하세요.
          </p>
        </div>

        {restaurants.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md">
            <p className="text-zinc-500">등록된 식당이 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-orange-500/50 hover:bg-zinc-900/60 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-400 border border-orange-500/20">
                      {restaurant.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                    {restaurant.description || '식당 소개 정보가 없습니다.'}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center justify-end text-xs font-semibold text-orange-400 group-hover:translate-x-1 transition-transform">
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
