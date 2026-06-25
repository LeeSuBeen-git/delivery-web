import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';

export const revalidate = 0; // dynamic page

export default async function Home() {
  const user = await getCurrentUser();

  // 1. 최근 주문한 식당 목록 가져오기 (최대 3개, 중복 제거)
  let recentRestaurants: any[] = [];
  if (user) {
    const recentOrders = await prisma.order.findMany({
      where: { userId: user.id },
      take: 5, // 중복 제거를 고려해 넉넉히 가져옴
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            category: true,
            description: true,
          },
        },
      },
    });

    const seenIds = new Set<string>();
    recentRestaurants = recentOrders
      .map((o) => o.restaurant)
      .filter((r) => {
        if (seenIds.has(r.id)) return false;
        seenIds.add(r.id);
        return true;
      })
      .slice(0, 3); // 최대 3개 매장만
  }

  // 2. 실시간 인기 가게 목록 가져오기 (주문량 상위 5개 또는 샘플 5개)
  const popularOrderCounts = await prisma.order.groupBy({
    by: ['restaurantId'],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
    take: 5,
  });

  let popularRestaurants: any[] = [];
  if (popularOrderCounts.length > 0) {
    const ids = popularOrderCounts.map((o) => o.restaurantId);
    const dbRestaurants = await prisma.restaurant.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
      },
    });
    // 순서 유지 정렬
    popularRestaurants = ids
      .map((id) => dbRestaurants.find((r) => r.id === id))
      .filter(Boolean);
  }

  // 주문 데이터가 없거나 부족할 때, 정적으로 5개를 채워 랭킹 제공 (국내 대표 프랜차이즈 샘플)
  if (popularRestaurants.length < 5) {
    const extraRestaurants = await prisma.restaurant.findMany({
      where: {
        id: { notIn: popularRestaurants.map((r) => r.id) },
      },
      take: 5 - popularRestaurants.length,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
      },
    });
    popularRestaurants = [...popularRestaurants, ...extraRestaurants];
  }

  return (
    <HomeClient
      user={user}
      recentRestaurants={recentRestaurants}
      popularRestaurants={popularRestaurants}
    />
  );
}

