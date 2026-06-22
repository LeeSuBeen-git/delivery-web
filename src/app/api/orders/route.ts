import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 1. 로그인 여부 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요한 서비스입니다.' },
        { status: 401 }
      );
    }

    const { restaurantId, items, totalPrice } = await request.json();

    if (!restaurantId || !items || !Array.isArray(items) || items.length === 0 || !totalPrice) {
      return NextResponse.json(
        { error: '주문 정보가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    // 2. Prisma 트랜잭션을 통한 동시 적재
    const order = await prisma.$transaction(async (tx) => {
      // 2-1. 주문 데이터 추가
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          restaurantId,
          totalPrice,
          status: '접수',
        },
      });

      // 2-2. 주문 품목 데이터 추가
      const orderItemsData = items.map((item: any) => ({
        orderId: newOrder.id,
        menuItemId: item.menuItemId,
        menuName: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      message: '주문이 정상적으로 접수되었습니다.',
      orderId: order.id,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: '주문 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
