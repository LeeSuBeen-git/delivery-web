import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const revalidate = 0; // dynamic page

interface OrdersPageProps {
  searchParams: Promise<{ newOrderId?: string }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  // 1. 유저 인증 체크
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const { newOrderId } = await searchParams;

  // 2. 방금 주문한 건이 쿼리 파라미터로 들어왔을 때, 본인 주문인지 교차 매칭하여 가져오기
  let newOrder = null;
  if (newOrderId) {
    newOrder = await prisma.order.findFirst({
      where: {
        id: newOrderId,
        userId: user.id,
      },
      include: {
        restaurant: {
          select: { name: true },
        },
        orderItems: true,
      },
    });
  }

  // 3. 해당 유저의 주문 내역 가져오기 (방금 주문한 건은 최상단 영수증으로 노출하므로 제외)
  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
      NOT: newOrderId ? { id: newOrderId } : undefined,
    },
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
    <div className="flex-grow bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-zinc-800 font-sans">
      <div className="mx-auto max-w-3xl">
        
        {/* 방금 주문한 건의 영수증 UI */}
        {newOrder && (
          <div className="mb-12">
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-lg p-6 max-w-md mx-auto relative overflow-hidden">
              
              {/* 상단 펀칭 구멍 데코 */}
              <div className="absolute -top-3 left-0 right-0 flex justify-between px-6">
                <span className="w-5 h-5 rounded-full bg-slate-50 border border-zinc-200"></span>
                <span className="w-5 h-5 rounded-full bg-slate-50 border border-zinc-200"></span>
                <span className="w-5 h-5 rounded-full bg-slate-50 border border-zinc-200"></span>
                <span className="w-5 h-5 rounded-full bg-slate-50 border border-zinc-200"></span>
                <span className="w-5 h-5 rounded-full bg-slate-50 border border-zinc-200"></span>
                <span className="w-5 h-5 rounded-full bg-slate-50 border border-zinc-200"></span>
              </div>
              
              <div className="text-center pt-5">
                <div className="text-4xl mb-2.5">🎉</div>
                <h2 className="text-xl font-extrabold text-zinc-900">주문이 완료되었습니다</h2>
                <p className="text-xs font-bold text-zinc-400 mt-1">방금 주문하신 내역입니다</p>
              </div>

              {/* 좌우 반원 컷팅 데코를 포함한 절취선 점선 */}
              <div className="border-t border-dashed border-zinc-300 my-6 relative">
                <span className="absolute -left-8 -top-2 w-4 h-4 rounded-full bg-slate-50 border-r border-zinc-200"></span>
                <span className="absolute -right-8 -top-2 w-4 h-4 rounded-full bg-slate-50 border-l border-zinc-200"></span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                  <span className="text-xs font-bold text-zinc-400">식당명</span>
                  <span className="text-sm font-extrabold text-zinc-900">{newOrder.restaurant.name}</span>
                </div>

                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-zinc-400 block mb-1">주문 메뉴</span>
                  {newOrder.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs text-zinc-600">
                      <span>{item.menuName} x {item.quantity}</span>
                      <span className="font-semibold text-zinc-800">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* 두 번째 절취선 점선 */}
                <div className="border-t border-dashed border-zinc-300 my-6 relative">
                  <span className="absolute -left-8 -top-2 w-4 h-4 rounded-full bg-slate-50 border-r border-zinc-200"></span>
                  <span className="absolute -right-8 -top-2 w-4 h-4 rounded-full bg-slate-50 border-l border-zinc-200"></span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-zinc-600">총 결제금액</span>
                    <span className="text-xl font-black text-emerald-600">{formatPrice(newOrder.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs font-bold text-zinc-400">주문 상태</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-100">
                      {newOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* 하단 영수증 절취선 문구 */}
              <div className="border-t border-dashed border-zinc-300 mt-6 pt-4 text-center text-[10px] text-zinc-400 font-bold flex items-center justify-center gap-1">
                <span>✂️</span>
                <span>이 부분을 보관해 주세요 (배달리스트 영수증)</span>
              </div>
            </div>
          </div>
        )}

        <div className="border-b border-zinc-200 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-zinc-900">
            내 주문 내역
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            과거에 주문한 내역 및 실시간 접수 상태를 조회합니다.
          </p>
        </div>

        {orders.length === 0 && !newOrder ? (
          <div className="text-center py-20 rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-zinc-600 font-bold text-lg">주문 내역이 없습니다.</p>
            <p className="text-zinc-400 text-sm mt-1.5">맛있는 식사 주문을 먼저 시도해 보세요!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden"
              >
                {/* 주문 카드 헤더 */}
                <div className="bg-slate-50 border-b border-zinc-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900">
                      {order.restaurant.name}
                    </h2>
                    <span className="text-xs text-zinc-400 mt-1 block">
                      주문 일시: {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-100">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* 주문 상세 품목 리스트 */}
                <div className="p-6 divide-y divide-zinc-100">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0 text-sm">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-zinc-800">{item.menuName}</span>
                        <span className="text-xs text-zinc-400 block">
                          단가: {formatPrice(item.price)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-500 font-medium text-xs block">
                          {item.quantity}개
                        </span>
                        <span className="text-zinc-800 font-bold mt-0.5 block">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* 총 결제 금액 */}
                  <div className="pt-4 mt-2 flex justify-between items-center border-t border-zinc-100 font-semibold text-sm">
                    <span className="text-zinc-500">총 결제 금액</span>
                    <span className="text-lg font-extrabold text-emerald-600">
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
