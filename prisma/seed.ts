import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Seed started...');

  // 1. 기존 데이터 정리 (순서 주의: OrderItem -> Order -> MenuItem -> Restaurant -> User)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing database records.');

  // 2. 테스트용 사용자 1명 생성
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash,
      name: '홍길동',
    },
  });
  console.log('Created test user:', user.email);

  // 3. 식당 및 메뉴 데이터 생성
  // 식당 1: 한식
  const restaurant1 = await prisma.restaurant.create({
    data: {
      name: '고향집 김치찌개',
      description: '어머니의 손맛이 느껴지는 깊은 국물의 김치찌개 전문점',
      category: '한식',
      menuItems: {
        create: [
          { name: '돼지고기 김치찌개', description: '국산 한돈과 묵은지로 끓여낸 대표 메뉴', price: 9000 },
          { name: '제육볶음', description: '매콤달콤한 양념에 볶아낸 밥도둑 제육볶음', price: 10000 },
          { name: '계란말이', description: '폭신폭신하고 부드러운 왕계란말이', price: 7000 },
        ],
      },
    },
  });
  console.log('Created restaurant:', restaurant1.name);

  // 식당 2: 분식
  const restaurant2 = await prisma.restaurant.create({
    data: {
      name: '바른김밥천국',
      description: '신선한 재료로 정성을 다하는 분식 브랜드',
      category: '분식',
      menuItems: {
        create: [
          { name: '원조 야채김밥', description: '기본에 충실한 꽉 찬 야채김밥', price: 3500 },
          { name: '매콤 치즈떡볶이', description: '체다치즈와 모짜렐라치즈가 듬뿍 올라간 떡볶이', price: 5500 },
          { name: '바삭 모듬튀김', description: '김말이, 오징어, 야채 튀김 등 모듬 세트', price: 4500 },
        ],
      },
    },
  });
  console.log('Created restaurant:', restaurant2.name);

  // 식당 3: 치킨
  const restaurant3 = await prisma.restaurant.create({
    data: {
      name: '황금올리브 치킨하우스',
      description: '겉바속촉의 대명사, 오리지널 올리브유 치킨 전문점',
      category: '치킨',
      menuItems: {
        create: [
          { name: '황금올리브 후라이드', description: '올리브유로 튀겨내어 세상에서 가장 바삭한 치킨', price: 20000 },
          { name: '달콤 양념치킨', description: '특제 고추장 토마토 소스로 버무린 추억의 양념치킨', price: 21000 },
          { name: '허니갈릭 소이치킨', description: '꿀과 마늘, 간장 베이스의 중독성 강한 치킨', price: 22000 },
        ],
      },
    },
  });
  console.log('Created restaurant:', restaurant3.name);

  console.log('Seed completed successfully!');
  await pool.end();
}

main()
  .catch((e) => {
    console.error('Seed script error:', e);
    process.exit(1);
  });
