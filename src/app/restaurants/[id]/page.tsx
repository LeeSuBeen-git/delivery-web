import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import AddToCartButton from '@/components/AddToCartButton';

export const revalidate = 0; // dynamic fetch

interface RestaurantDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RestaurantDetailPage({ params }: RestaurantDetailPageProps) {
  const { id } = await params;

  // 식당과 메뉴 목록 함께 쿼리
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      menuItems: {
        orderBy: { name: 'asc' },
      },
    },
  });

  if (!restaurant) {
    notFound();
  }

  // 가격 포맷팅 헬퍼 (예: 20000 -> 20,000원)
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  return (
    <div className="flex-grow bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-4xl">
        {/* 뒤로 가기 링크 */}
        <div className="mb-6">
          <Link href="/restaurants" className="text-sm font-bold text-zinc-500 hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer">
            &larr; 식당 목록으로 돌아가기
          </Link>
        </div>

        {/* 식당 대표 카드 */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm mb-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-3xl font-extrabold text-zinc-900">
              {restaurant.name}
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-600 border border-emerald-100">
              {restaurant.category}
            </span>
          </div>
          <p className="mt-4 text-zinc-500 leading-relaxed text-sm">
            {restaurant.description || '식당 소개 정보가 없습니다.'}
          </p>
        </div>

        {/* 메뉴 목록 타이틀 */}
        <h2 className="text-2xl font-bold text-zinc-800 mb-6">
          🍴 대표 메뉴
        </h2>

        {restaurant.menuItems.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <p className="text-zinc-500 font-medium">등록된 메뉴가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {restaurant.menuItems.map((menuItem) => (
              <div
                key={menuItem.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm hover:border-emerald-500/30 transition-all"
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900">{menuItem.name}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-xl">
                    {menuItem.description || '메뉴 설명이 제공되지 않습니다.'}
                  </p>
                  <p className="text-base font-extrabold text-emerald-600 pt-1">
                    {formatPrice(menuItem.price)}
                  </p>
                </div>
                
                <div className="flex flex-col items-start sm:items-end justify-center">
                  <AddToCartButton
                    restaurantId={restaurant.id}
                    restaurantName={restaurant.name}
                    menuItemId={menuItem.id}
                    name={menuItem.name}
                    price={menuItem.price}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
