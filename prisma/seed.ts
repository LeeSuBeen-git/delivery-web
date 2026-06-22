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

  console.log('Seed started (upsert mode)...');

  // 1. 테스트 사용자 upsert
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {}, // 이미 존재하면 패스워드나 이름 업데이트 안 하고 둠
    create: {
      email: 'test@example.com',
      passwordHash,
      name: '홍길동',
    },
  });
  console.log('Upserted test user.');

  // 2. 식당 및 메뉴 upsert 데이터셋
  const restaurantsData = [
    {
      id: '1ed8e44d-c116-4edf-b44f-e518dd8cb938',
      name: '고향집 김치찌개',
      description: '어머니의 손맛이 느껴지는 깊은 국물의 김치찌개 전문점',
      category: '한식',
      menuItems: [
        { id: '3ee2a5f6-60bc-432e-b326-9050ef0c7da6', name: '돼지고기 김치찌개', description: '국산 한돈 and 묵은지로 끓여낸 대표 메뉴', price: 9000 },
        { id: '3ee2a5f6-60bc-432e-b326-9050ef0c7da7', name: '제육볶음', description: '매콤달콤한 양념에 볶아낸 밥도둑 제육볶음', price: 10000 },
        { id: '3ee2a5f6-60bc-432e-b326-9050ef0c7da8', name: '계란말이', description: '폭신폭신하고 부드러운 왕계란말이', price: 7000 },
      ],
    },
    {
      id: '1ec05752-a32d-4059-aaba-ad0c62b9be48',
      name: '바른김밥천국',
      description: '신선한 재료로 정성을 다하는 분식 브랜드',
      category: '분식',
      menuItems: [
        { id: '3ee2a5f6-60bc-432e-b326-9050ef0c7db1', name: '원조 야채김밥', description: '기본에 충실한 꽉 찬 야채김밥', price: 3500 },
        { id: '3ee2a5f6-60bc-432e-b326-9050ef0c7db2', name: '매콤 치즈떡볶이', description: '체다치즈와 모짜렐라치즈가 듬뿍 올라간 떡볶이', price: 5500 },
        { id: '3ee2a5f6-60bc-432e-b326-9050ef0c7db3', name: '바삭 모듬튀김', description: '김말이, 오징어, 야채 튀김 등 모듬 세트', price: 4500 },
      ],
    },
    {
      id: 'f0baa694-8b17-4a4c-a6fd-5c0ce5f33d41',
      name: '황금올리브 치킨하우스',
      description: '겉바속촉의 대명사, 오리지널 올리브유 치킨 전문점',
      category: '치킨',
      menuItems: [
        { id: '3ee2a5f6-60bc-432e-b326-9050ef0c7dc1', name: '황금올리브 후라이드', description: '올리브유로 튀겨내어 세상에서 가장 바삭한 치킨', price: 20000 },
        { id: '3ee2a5f6-60bc-432e-b326-9050ef0c7dc2', name: '달콤 양념치킨', description: '특제 고추장 토마토 소스로 버무린 추억의 양념치킨', price: 21000 },
        { id: '3ee2a5f6-60bc-432e-b326-9050ef0c7dc3', name: '허니갈릭 소이치킨', description: '꿀과 마늘, 간장 베이스의 중독성 강한 치킨', price: 22000 },
      ],
    },
    // 신규 추가 식당: 카페
    {
      id: 'c1a2e3f4-5678-90ab-cdef-1234567890ab',
      name: '달콤한 오후',
      description: '매일 아침 직접 굽는 타르트와 프리미엄 원두 커피 전문점',
      category: '카페',
      menuItems: [
        { id: 'caf-item-1111-2222-3333-444455556666', name: '아메리카노', description: '진하고 부드러운 풍미의 하우스 블렌드 커피', price: 3500 },
        { id: 'caf-item-1111-2222-3333-444455556667', name: '바닐라 빈 라떼', description: '천연 바닐라 빈 시럽을 넣어 깊고 달콤한 라떼', price: 4800 },
        { id: 'caf-item-1111-2222-3333-444455556668', name: '딸기 생크림 조각케이크', description: '신선한 딸기와 동물성 100% 우유 생크림 케이크', price: 6500 },
      ],
    },
    // 신규 추가 식당: 중식
    {
      id: 'c2a2e3f4-5678-90ab-cdef-1234567890ab',
      name: '가화만사성',
      description: '30년 전통의 수타면과 깔끔하고 바삭한 튀김 요리 맛집',
      category: '중식',
      menuItems: [
        { id: 'chn-item-1111-2222-3333-444455556666', name: '옛날 정통 짜장면', description: '춘장의 고소한 풍미와 수타 고유의 쫄깃한 면발', price: 6500 },
        { id: 'chn-item-1111-2222-3333-444455556667', name: '삼선 해물짬뽕', description: '신선한 오징어, 홍합, 새우가 듬뿍 들어가 칼칼하고 시원한 짬뽕', price: 8500 },
        { id: 'chn-item-1111-2222-3333-444455556668', name: '찹쌀 탕수육 소(小)', description: '쫄깃한 찹쌀 튀김옷과 새콤달콤한 소스의 만남', price: 17000 },
      ],
    },
    // 신규 추가 식당: 일식
    {
      id: 'c3a2e3f4-5678-90ab-cdef-1234567890ab',
      name: '동경식당',
      description: '신선한 생선으로 쥐어내는 명품 초밥과 정통 덮밥 전문점',
      category: '일식',
      menuItems: [
        { id: 'jpn-item-1111-2222-3333-444455556666', name: '모듬초밥 10pc', description: '광어, 연어, 새우, 참치 등 신선한 스시 세트', price: 15000 },
        { id: 'jpn-item-1111-2222-3333-444455556667', name: '수제 등심돈카츠', description: '두툼한 돼지 등심을 튀겨낸 바삭한 정통 일식 돈카츠', price: 11000 },
        { id: 'jpn-item-1111-2222-3333-444455556668', name: '차슈 온센 타마고동', description: '부드러운 삼겹 차슈에 수비드 계란이 올라간 덮밥', price: 9500 },
      ],
    },
    // 신규 추가 식당: 피자
    {
      id: 'c4a2e3f4-5678-90ab-cdef-1234567890ab',
      name: '피자스튜디오',
      description: '자연산 치즈를 아낌없이 올린 프리미엄 화덕 피자',
      category: '피자',
      menuItems: [
        { id: 'pza-item-1111-2222-3333-444455556666', name: '콤비네이션 클래식 피자', description: '페퍼로니, 고기, 각종 야채가 풍성한 대표 피자', price: 18900 },
        { id: 'pza-item-1111-2222-3333-444455556667', name: '베이컨 더블 포테이토 피자', description: '베이컨과 부드러운 감자, 고소한 마요 소스의 조합', price: 20900 },
        { id: 'pza-item-1111-2222-3333-444455556668', name: '리얼 치즈폭탄 피자', description: '모짜렐라, 고르곤졸라, 체다 등 치즈가 듬뿍 올라간 피자', price: 19900 },
      ],
    },
  ];

  // 3. 식당 및 메뉴 upsert 순회 실행
  for (const rest of restaurantsData) {
    // 식당 upsert
    await prisma.restaurant.upsert({
      where: { id: rest.id },
      update: {
        name: rest.name,
        description: rest.description,
        category: rest.category,
      },
      create: {
        id: rest.id,
        name: rest.name,
        description: rest.description,
        category: rest.category,
      },
    });
    console.log(`Upserted restaurant: ${rest.name}`);

    // 소속 메뉴 upsert
    for (const menu of rest.menuItems) {
      await prisma.menuItem.upsert({
        where: { id: menu.id },
        update: {
          name: menu.name,
          description: menu.description,
          price: menu.price,
          restaurantId: rest.id,
        },
        create: {
          id: menu.id,
          name: menu.name,
          description: menu.description,
          price: menu.price,
          restaurantId: rest.id,
        },
      });
    }
    console.log(`Upserted ${rest.menuItems.length} menu items for ${rest.name}`);
  }

  console.log('Seed completed successfully!');
  await pool.end();
}

main().catch((e) => {
  console.error('Seed script error:', e);
  process.exit(1);
});
