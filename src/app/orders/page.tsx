import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const revalidate = 0; // dynamic page

export default async function OrdersPage() {
  // 1. 유저 인증 체크
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // 2. 해당 유저의 주문 내역 가져오기
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      restaurant: {
        select: { name: true },
      },
      orderItems: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // 금액 포맷팅 헬퍼
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  // 날짜 포맷팅 헬퍼
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 py-12 px-4 sm:px-6 lg:px-8 text-white font-sans">
      <div className="mx-auto max-w-3xl">
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300">
            내 주문 내역
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            과거에 주문한 내역 및 실시간 접수 상태를 조회합니다.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-zinc-400 text-lg">주문 내역이 없습니다.</p>
            <p className="text-zinc-500 text-sm mt-1">맛있는 식사 주문을 먼저 시도해 보세요!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden"
              >
                {/* 주문 카드 헤더 */}
                <div className="bg-zinc-900/60 border-b border-zinc-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {order.restaurant.name}
                    </h2>
                    <span className="text-xs text-zinc-500 mt-1 block">
                      주문 일시: {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 border border-orange-500/20">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* 주문 상세 품목 리스트 */}
                <div className="p-6 divide-y divide-zinc-800/80">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0 text-sm">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-zinc-200">{item.menuName}</span>
                        <span className="text-xs text-zinc-500 block">
                          단가: {formatPrice(item.price)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-300 font-medium text-xs block">
                          {item.quantity}개
                        </span>
                        <span className="text-zinc-200 font-semibold mt-0.5 block">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* 총 결제 금액 */}
                  <div className="pt-4 mt-2 flex justify-between items-center border-t border-zinc-800 font-semibold text-sm">
                    <span className="text-zinc-400">총 결제 금액</span>
                    <span className="text-lg font-extrabold text-orange-400">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
