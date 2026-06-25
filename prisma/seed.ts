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
    update: {},
    create: {
      email: 'test@example.com',
      passwordHash,
      name: '홍길동',
    },
  });
  console.log('Upserted test user.');

  // 2. 7대 카테고리별 각 5개 식당 및 3개씩 메뉴 구성 (국내 대표 프랜차이즈 샘플 데이터)
  const restaurantsData = [
    // === 1. 카페 ===
    {
      id: 'c1a2e3f4-5678-90ab-cdef-1234567890ab', // 기존 유지
      name: '달콤한 오후',
      description: '매일 아침 직접 굽는 타르트와 프리미엄 원두 커피 전문점',
      category: '카페',
      menuItems: [
        { id: 'caf-item-1111-2222-3333-444455556666', name: '아메리카노', description: '진하고 부드러운 풍미의 하우스 블렌드 커피', price: 3500 },
        { id: 'caf-item-1111-2222-3333-444455556667', name: '바닐라 빈 라떼', description: '천연 바닐라 빈 시럽을 넣어 깊고 달콤한 라떼', price: 4800 },
        { id: 'caf-item-1111-2222-3333-444455556668', name: '딸기 생크림 조각케이크', description: '신선한 딸기와 동물성 100% 우유 생크림 케이크', price: 6500 },
      ],
    },
    {
      id: 'cafe-mega-01',
      name: '메가커피 타운',
      description: '대용량의 선두주자, 합리적이고 다양한 음료를 만나는 대표 브랜드',
      category: '카페',
      menuItems: [
        { id: 'menu-mega-01-item-1', name: '아메리카노', description: '메가커피의 시그니처 넉넉한 대용량 아메리카노', price: 2000 },
        { id: 'menu-mega-01-item-2', name: '메가초코', description: '진하고 달콤한 초콜릿 시럽이 듬뿍 들어간 아이스 초코', price: 3800 },
        { id: 'menu-mega-01-item-3', name: '허니 브레드', description: '겉은 바삭하고 속은 부드러운 시나몬 허니 브레드', price: 4500 },
      ],
    },
    {
      id: 'cafe-star-02',
      name: '스타벅스 센트럴',
      description: '글로벌 커피 문화를 선도하는 프리미엄 에스프레소 스토어',
      category: '카페',
      menuItems: [
        { id: 'menu-star-02-item-1', name: '카페 라떼', description: '부드러운 에스프레소 샷과 신선한 스팀 우유의 완벽한 조화', price: 5000 },
        { id: 'menu-star-02-item-2', name: '자바 칩 프라푸치노', description: '달콤한 초콜릿 에스프레소에 자바 칩을 갈아 넣은 블렌디드', price: 6300 },
        { id: 'menu-star-02-item-3', name: '생크림 카스텔라', description: '부드럽고 촉촉한 가루 카스텔라 안에 달콤한 우유 생크림', price: 4800 },
      ],
    },
    {
      id: 'cafe-twosome-03',
      name: '투썸플레이스 스튜디오',
      description: '디저트 카페 명가, 품격 있는 케이크와 원두를 선사하는 디저트 맛집',
      category: '카페',
      menuItems: [
        { id: 'menu-twosome-03-item-1', name: '스트로베리 초콜릿 생크림 조각케이크', description: '초코 크런치 볼이 씹히는 초코 생크림 케이크 위에 상큼한 딸기', price: 6700 },
        { id: 'menu-twosome-03-item-2', name: '로얄 밀크티', description: '진하게 우려낸 홍차 향과 우유가 부드럽게 매칭된 프리미엄 밀크티', price: 5500 },
        { id: 'menu-twosome-03-item-3', name: '콜드 브루', description: '차가운 물로 천천히 내려 깊고 깔끔한 맛을 자랑하는 콜드 브루', price: 4900 },
      ],
    },
    {
      id: 'cafe-ediya-04',
      name: '이디야 에스프레소',
      description: '우리 곁에 늘 함께하는 친근하고 부드러운 커피 브랜드',
      category: '카페',
      menuItems: [
        { id: 'menu-ediya-04-item-1', name: '토피넛 라떼', description: '고소한 견과류와 달콤한 코코아가 어우러진 이디야 대표 스테디셀러', price: 4200 },
        { id: 'menu-ediya-04-item-2', name: '민트 초코칩 플랫치노', description: '상쾌한 민트와 달콤한 초코칩이 시원하게 블렌딩된 음료', price: 4500 },
        { id: 'menu-ediya-04-item-3', name: '플레인 베이글', description: '담백하고 쫄깃하게 구워내어 커피와 함께 즐기기 좋은 베이글', price: 2500 },
      ],
    },

    // === 2. 한식 ===
    {
      id: '1ed8e44d-c116-4edf-b44f-e518dd8cb938', // 기존 유지
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
      id: 'kor-bon-01',
      name: '본죽 & 비빔밥 하우스',
      description: '따뜻한 온기와 정성으로 가득한 웰빙 건강 한식 스토어',
      category: '한식',
      menuItems: [
        { id: 'menu-bon-01-item-1', name: '전복죽', description: '바다의 인삼 전복을 통째로 갈아 영양이 듬뿍 들어간 보양죽', price: 13000 },
        { id: 'menu-bon-01-item-2', name: '매콤 낙지 비빔밥', description: '매콤하게 볶아낸 쫄깃한 낙지와 신선한 야채가 어우러진 비빔밥', price: 10000 },
        { id: 'menu-bon-01-item-3', name: '단호박죽', description: '단호박의 은은한 달콤함과 부드러운 옹심이가 어우러진 전통죽', price: 9500 },
      ],
    },
    {
      id: 'kor-saemaul-02',
      name: '새마을식당 연탄구이',
      description: '추억의 고기 향과 얼큰한 찌개 요리로 가득 찬 대중 음식점',
      category: '한식',
      menuItems: [
        { id: 'menu-saemaul-02-item-1', name: '열탄 불고기', description: '얇게 썬 돼지고기에 중독성 넘치는 특제 소스를 얹어 구워 먹는 고기', price: 10900 },
        { id: 'menu-saemaul-02-item-2', name: '7분 돼지김치', description: '자작하게 끓여내어 밥에 쓱쓱 비벼 김가루와 함께 먹는 김치찌개', price: 8000 },
        { id: 'menu-saemaul-02-item-3', name: '멸치 국수', description: '진하고 깊은 멸치 육수에 소면을 쫄깃하게 말아낸 클래식 국수', price: 6000 },
      ],
    },
    {
      id: 'kor-ssambap-03',
      name: '백종원의 원조쌈밥',
      description: '푸릇푸릇한 신선 쌈야채와 특제 쌈장이 어우러진 웰빙 식단',
      category: '한식',
      menuItems: [
        { id: 'menu-ssambap-03-item-1', name: '대패 삼겹살 쌈밥정식', description: '대패 삼겹살을 특제 간장 소스에 적셔 쌈채소와 함께 즐기는 정식', price: 12000 },
        { id: 'menu-ssambap-03-item-2', name: '제육 우렁 쌈밥정식', description: '매콤한 제육볶음과 고소하고 쫄깃한 우렁쌈장이 포함된 든든 정식', price: 11000 },
        { id: 'menu-ssambap-03-item-3', name: '해물 쌈장', description: '오징어, 조개 등 각종 해물을 다져 고소하게 끓여낸 쌈밥 동반자', price: 4000 },
      ],
    },
    {
      id: 'kor-hansot-04',
      name: '한솥도시락 스테이션',
      description: '매일 즐기는 맛있고 균형 잡힌 가성비 1등 도시락 전문점',
      category: '한식',
      menuItems: [
        { id: 'menu-hansot-04-item-1', name: '치킨 마요 도시락', description: '밥 위에 잘게 썬 치킨과 계란 지단, 마요 소스를 얹어 비벼 먹는 도시락', price: 4000 },
        { id: 'menu-hansot-04-item-2', name: '돈까스 도련님 도시락', description: '돈까스, 떡햄버그, 치킨 등 다양한 반찬이 들어간 베스트 도시락', price: 4800 },
        { id: 'menu-hansot-04-item-3', name: '제육볶음 도시락', description: '달콤 짭조름한 한국식 제육볶음 반찬으로 밥 한 공기 뚝딱인 도시락', price: 4500 },
      ],
    },

    // === 3. 분식 ===
    {
      id: '1ec05752-a32d-4059-aaba-ad0c62b9be48', // 기존 유지
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
      id: 'bns-yup-01',
      name: '엽기떡볶이 존',
      description: '화끈하고 중독성 있는 매운맛, 전국에 마니아층을 둔 대표 떡볶이',
      category: '분식',
      menuItems: [
        { id: 'menu-yup-01-item-1', name: '엽기 떡볶이', description: '특제 매운 소스에 치즈와 어묵, 소시지가 듬뿍 든 대용량 매운 떡볶이', price: 14000 },
        { id: 'menu-yup-01-item-2', name: '엽기 오뎅', description: '떡볶이 떡 대신 부드러운 판어묵과 봉어묵을 풍성히 담은 오뎅파 떡볶이', price: 14000 },
        { id: 'menu-yup-01-item-3', name: '모듬 튀김', description: '야채튀김, 야끼만두, 김말이 튀김이 골고루 담겨 소스에 찍어 먹기 좋은 메뉴', price: 3000 },
      ],
    },
    {
      id: 'bns-sinjeon-02',
      name: '신전떡볶이 팩토리',
      description: '후추 베이스의 매콤한 카레향 떡볶이와 바삭한 튀김 전문 매장',
      category: '분식',
      menuItems: [
        { id: 'menu-sinjeon-02-item-1', name: '신전 떡볶이', description: '특유의 감칠맛 나는 국물과 얇고 말랑말랑한 밀떡이 어우러진 대표 국물 떡볶이', price: 3500 },
        { id: 'menu-sinjeon-02-item-2', name: '신전 치즈 김밥', description: '매콤하게 양념된 빨간 비빔밥 안에 쫄깃한 모짜렐라 치즈가 가득 든 김밥', price: 4000 },
        { id: 'menu-sinjeon-02-item-3', name: '오뎅 튀김', description: '어묵을 기름에 바삭하게 튀겨내어 쫀득한 식감과 고소함을 올린 신전 시그니처', price: 1700 },
      ],
    },
    {
      id: 'bns-young-03',
      name: '청년다방 차돌떡볶이',
      description: '기나긴 롱 떡과 고급 토핑으로 요리가 되는 즉석 떡볶이 레스토랑',
      category: '분식',
      menuItems: [
        { id: 'menu-young-03-item-1', name: '차돌 즉석 떡볶이', description: '달콤한 즉석 떡볶이 위에 불향을 입혀 고소하게 구워낸 우삼겹/차돌박이 토핑', price: 16500 },
        { id: 'menu-young-03-item-2', name: '버터 갈릭 감자튀김', description: '바삭하게 튀긴 감자 위 갈릭 파우더와 크리미하고 달콤한 갈릭 소스 듬뿍', price: 5500 },
        { id: 'menu-young-03-item-3', name: '청포도 에이드 음료', description: '달콤하고 청량한 청포도 베이스에 시원한 탄산수를 믹스한 대용량 음료', price: 3500 },
      ],
    },
    {
      id: 'bns-gukdae-04',
      name: '국대떡볶이 스토어',
      description: '옛날 학교 앞 분식집에서 먹던 그 맛 그대로, 추억을 담은 분식',
      category: '분식',
      menuItems: [
        { id: 'menu-gukdae-04-item-1', name: '국대 떡볶이', description: '말랑한 밀떡과 얇은 어묵을 넣고 옛날 고유의 달콤칼칼한 고추장으로 조려낸 맛', price: 3500 },
        { id: 'menu-gukdae-04-item-2', name: '찰 순대', description: '비린내 없이 쫀득하고 고소한 당면 찰순대와 신선한 내장 모듬', price: 4000 },
        { id: 'menu-gukdae-04-item-3', name: '바삭 군만두', description: '당면 속이 꽉 찬 군만두를 겉은 바삭하고 속은 부드럽게 튀겨낸 서브 사이드', price: 2500 },
      ],
    },

    // === 4. 중식 ===
    {
      id: 'c2a2e3f4-5678-90ab-cdef-1234567890ab', // 기존 유지
      name: '가화만사성',
      description: '30년 전통의 수타면과 깔끔하고 바삭한 튀김 요리 맛집',
      category: '중식',
      menuItems: [
        { id: 'chn-item-1111-2222-3333-444455556666', name: '옛날 정통 짜장면', description: '춘장의 고소한 풍미와 수타 고유의 쫄깃한 면발', price: 6500 },
        { id: 'chn-item-1111-2222-3333-444455556667', name: '삼선 해물짬뽕', description: '신선한 오징어, 홍합, 새우가 듬뿍 들어가 칼칼하고 시원한 짬뽕', price: 8500 },
        { id: 'chn-item-1111-2222-3333-444455556668', name: '찹쌀 탕수육 소(小)', description: '쫄깃한 찹쌀 튀김옷과 새콤달콤한 소스의 만남', price: 17000 },
      ],
    },
    {
      id: 'chn-hong-01',
      name: '홍콩반점 0410',
      description: '백종원의 중식 대중화 브랜드, 불맛 가득 볶아낸 시원한 중화 요리 전문점',
      category: '중식',
      menuItems: [
        { id: 'menu-hong-01-item-1', name: '불맛 짬뽕', description: '강한 화력에 돼지고기와 야채를 빠르게 볶아내 불맛이 일품인 대표 짬뽕', price: 7000 },
        { id: 'menu-hong-01-item-2', name: '짜장면', description: '고기와 야채가 듬뿍 들어간 춘장 소스를 얹어 윤기가 좌르르 흐르는 국수', price: 6000 },
        { id: 'menu-hong-01-item-3', name: '찹쌀 탕수육', description: '자연산 찹쌀 전분을 사용해 쫄깃하고 바삭하며 부드러운 고기 맛의 베스트셀러', price: 15000 },
      ],
    },
    {
      id: 'chn-chui-02',
      name: '취영루 딤섬',
      description: '전통 만두와 중국 현지 느낌의 담백한 만두 전문점',
      category: '중식',
      menuItems: [
        { id: 'menu-chui-02-item-1', name: '정통 고기만두', description: '얇은 만두피 안에 신선한 야채와 돼지고기 소가 가득 차 육즙이 배어나오는 만두', price: 6000 },
        { id: 'menu-chui-02-item-2', name: '소룡포 (샤오롱바오)', description: '숟가락에 얹어 만두피를 살짝 터뜨린 후 깊고 뜨거운 육즙을 즐기는 중국식 만두', price: 7000 },
        { id: 'menu-chui-02-item-3', name: '새우 하가우', description: '투명하고 쫄깃한 전분 피 안에 탱글탱글한 통통 새우를 꽉 채워 쪄낸 고밀도 딤섬', price: 7500 },
      ],
    },
    {
      id: 'chn-lanzhou-03',
      name: '란주라멘 도삭면',
      description: '중국 전통 도삭 기법으로 썰어낸 특별하고 쫄깃한 면발 면집',
      category: '중식',
      menuItems: [
        { id: 'menu-lanzhou-03-item-1', name: '삼선 해물 도삭면', description: '칼로 썰어낸 울퉁불퉁 쫄깃한 도삭면에 꽃게, 쭈꾸미 등 해물이 들어간 면 요리', price: 9500 },
        { id: 'menu-lanzhou-03-item-2', name: '꿔바로우', description: '납작하게 썬 돼지고기를 감자 전분으로 튀겨 소스에 조린 북경식 탕수육', price: 18000 },
        { id: 'menu-lanzhou-03-item-3', name: '마라 지탕면', description: '칼칼하고 얼얼한 마라 육수에 도삭면과 건두부, 차슈 토핑이 어우러진 특이 메뉴', price: 9000 },
      ],
    },
    {
      id: 'chn-kungfu-04',
      name: '마라탕 쿵푸',
      description: '내 맘대로 토핑하고 즐기는 대중 마라 요리 브랜드',
      category: '중식',
      menuItems: [
        { id: 'menu-kungfu-04-item-1', name: '대표 마라탕', description: '사골 육수에 알알한 마라 기름, 청경채, 팽이버섯, 소고기가 믹스된 마라탕', price: 10000 },
        { id: 'menu-kungfu-04-item-2', name: '마라샹궈', description: '각종 채소와 넓적당면, 소고기를 매콤하고 알싸한 마라유에 바짝 볶아낸 술안주', price: 18000 },
        { id: 'menu-kungfu-04-item-3', name: '바삭 꿔바로우 (소)', description: '새콤달콤한 소스에 갓 튀겨낸 쫄깃쫄깃하고 겉은 바삭한 꿔바로우', price: 10000 },
      ],
    },

    // === 5. 일식 ===
    {
      id: 'c3a2e3f4-5678-90ab-cdef-1234567890ab', // 기존 유지
      name: '동경식당',
      description: '신선한 생선으로 쥐어내는 명품 초밥과 정통 덮밥 전문점',
      category: '일식',
      menuItems: [
        { id: 'jpn-item-1111-2222-3333-444455556666', name: '모듬초밥 10pc', description: '광어, 연어, 새우, 참치 등 신선한 스시 세트', price: 15000 },
        { id: 'jpn-item-1111-2222-3333-444455556667', name: '수제 등심돈카츠', description: '두툼한 돼지 등심을 튀겨낸 바삭한 정통 일식 돈카츠', price: 11000 },
        { id: 'jpn-item-1111-2222-3333-444455556668', name: '차슈 온센 타마고동', description: '부드러운 삼겹 차슈에 수비드 계란이 올라간 덮밥', price: 9500 },
      ],
    },
    {
      id: 'jpn-misoya-01',
      name: '미소야 돈카츠',
      description: '정통 일식 돈카츠와 우동, 덮밥을 편안히 만나는 돈카츠 명소',
      category: '일식',
      menuItems: [
        { id: 'menu-misoya-01-item-1', name: '로스카츠 정식', description: '돼지 등심 돈카츠에 밥, 미니 우동, 양배추 샐러드가 곁들여진 정식 세트', price: 10500 },
        { id: 'menu-misoya-01-item-2', name: '뚝배기 알밥 정식', description: '뜨거운 돌솥에 톡톡 터지는 날치알과 볶음김치가 올라간 인기 알밥 정식', price: 9500 },
        { id: 'menu-misoya-01-item-3', name: '돈카츠 야끼우동', description: '가쓰오부시가 춤을 추는 매콤달콤 볶음우동 위에 바삭한 돈카츠 토핑', price: 9000 },
      ],
    },
    {
      id: 'jpn-abiko-02',
      name: '아비꼬 카레',
      description: '백시간 동안 끓여내어 매운맛 단계를 선택하는 숙성 카레 스토어',
      category: '일식',
      menuItems: [
        { id: 'menu-abiko-02-item-1', name: '기본 카레라이스', description: '100시간 저온 숙성으로 고소하고 깊은 아비꼬 고유의 기본 카레라이스', price: 7500 },
        { id: 'menu-abiko-02-item-2', name: '허브 치킨 카레', description: '카레 소스에 부드러운 닭가슴살 찢어 넣어 씹는 맛을 극대화한 카레', price: 9500 },
        { id: 'menu-abiko-02-item-3', name: '버섯 비프 카레', description: '얇게 썬 소고기와 신선한 송이버섯이 가득 우러난 진하고 고급스러운 카레', price: 10500 },
      ],
    },
    {
      id: 'jpn-baek-03',
      name: '백소정 마제소바',
      description: '비벼 먹는 면 마제소바와 두툼한 일식 돈카츠 명가',
      category: '일식',
      menuItems: [
        { id: 'menu-baek-03-item-1', name: '전통 마제소바', description: '다진 고기, 계란 노른자, 파, 부추, 가쓰오 가루를 우동 면과 비벼 먹는 별미', price: 9500 },
        { id: 'menu-baek-03-item-2', name: '카라이 마제소바', description: '특제 매운 고추 다대기를 첨가하여 중독성 있는 매운맛을 연출한 마제소바', price: 10500 },
        { id: 'menu-baek-03-item-3', name: '냉소바', description: '살얼음 둥둥 뜬 가쓰오 육수에 쫄깃한 메밀 면발과 야채가 올라간 시원한 소바', price: 9000 },
      ],
    },
    {
      id: 'jpn-gaemi-04',
      name: '홍대개미 덮밥',
      description: '다채롭고 푸짐한 토핑이 올라간 고밀도 일식 돈부리 전문점',
      category: '일식',
      menuItems: [
        { id: 'menu-gaemi-04-item-1', name: '큐브 스테이크 덮밥', description: '그릴에 구워 불맛 가득한 스테이크를 특제 데리야끼 소스로 조린 대표 덮밥', price: 11900 },
        { id: 'menu-gaemi-04-item-2', name: '신선 연어 덮밥', description: '신선한 생연어 슬라이스를 밥 위에 얹어 와사비, 무순과 함께 먹는 사케동', price: 12900 },
        { id: 'menu-gaemi-04-item-3', name: '매운 목살 덮밥', description: '돼지 목살을 매콤하고 불향 나게 볶아내어 파채와 어우러지는 대중적 덮밥', price: 9900 },
      ],
    },

    // === 6. 피자 ===
    {
      id: 'c4a2e3f4-5678-90ab-cdef-1234567890ab', // 기존 유지
      name: '피자스튜디오',
      description: '자연산 치즈를 아낌없이 올린 프리미엄 화덕 피자',
      category: '피자',
      menuItems: [
        { id: 'pza-item-1111-2222-3333-444455556666', name: '콤비네이션 클래식 피자', description: '페퍼로니, 고기, 각종 야채가 풍성한 대표 피자', price: 18900 },
        { id: 'pza-item-1111-2222-3333-444455556667', name: '베이컨 더블 포테이토 피자', description: '베이컨과 부드러운 감자, 고소한 마요 소스의 조합', price: 20900 },
        { id: 'pza-item-1111-2222-3333-444455556668', name: '리얼 치즈폭탄 피자', description: '모짜렐라, 고르곤졸라, 체다 등 치즈가 듬뿍 올라간 피자', price: 19900 },
      ],
    },
    {
      id: 'pza-domino-01',
      name: '도미노피자 딜리버리',
      description: '세계 배달 피자 리더, 신선하고 꽉 찬 토핑의 프리미엄 배달 피자',
      category: '피자',
      menuItems: [
        { id: 'menu-domino-01-item-1', name: '포테이토 피자 (L)', description: '고소한 마요네즈와 베이컨, 부드러운 포테이토가 어우러진 도미노 베스트셀러', price: 27900 },
        { id: 'menu-domino-01-item-2', name: '슈퍼디럭스 피자 (L)', description: '쇠고기, 페퍼로니, 피망, 버섯 등 올 가이드 토핑의 가장 클래식한 피자', price: 26900 },
        { id: 'menu-domino-01-item-3', name: '갈릭 크림 치즈볼', description: '고소한 갈릭 버터 향 속에 크림치즈가 꽉 차 달콤하고 부드러운 사이드', price: 5000 },
      ],
    },
    {
      id: 'pza-pizzahut-02',
      name: '피자헛 캐슬',
      description: '오리지널 팬 피자부터 프리미엄 엣지 피자까지, 역사 깊은 피자 브랜드',
      category: '피자',
      menuItems: [
        { id: 'menu-pizzahut-02-item-1', name: '수퍼 슈프림 피자 (L)', description: '전통 오리지널 도우 위에 페퍼로니, 미트, 치즈가 조화로운 시그니처', price: 28900 },
        { id: 'menu-pizzahut-02-item-2', name: '치즈킹 피자 (L)', description: '모짜렐라, 체다, 크림 치즈와 고소한 비프 토핑이 아낌없이 올라간 치즈 피자', price: 29900 },
        { id: 'menu-pizzahut-02-item-3', name: '리치 치즈 오븐 스파게티', description: '미트 소스 스파게티 위에 모짜렐라 치즈를 가득 올려 오븐에 구워낸 면 요리', price: 7900 },
      ],
    },
    {
      id: 'pza-mr-03',
      name: '미스터피자 가든',
      description: '수제 칠포우 도우와 천연 치즈를 담은 담백하고 건강한 한국식 피자',
      category: '피자',
      menuItems: [
        { id: 'menu-mr-03-item-1', name: '포테이토 골드 피자 (L)', description: '부드러운 고구마무스 엣지와 짭짤한 감자, 베이컨 토핑의 최고 스테디셀러', price: 28900 },
        { id: 'menu-mr-03-item-2', name: '쉬림프 골드 피자 (L)', description: '매콤달콤 시즈닝된 통통한 새우가 한 조각에 가득 얹어진 골드 엣지 피자', price: 30900 },
        { id: 'menu-mr-03-item-3', name: '오븐 베이크 핫 윙', description: '기름기를 쏙 뺀 오븐구이 버팔로 윙으로 매콤하고 짭조름한 닭날개 사이드', price: 6900 },
      ],
    },
    {
      id: 'pza-banolim-04',
      name: '반올림피자샵',
      description: '자체 개발 소스와 아낌없는 가성비 토핑으로 인기 폭발하는 로컬 피자샵',
      category: '피자',
      menuItems: [
        { id: 'menu-banolim-04-item-1', name: '소보로 고구마 피자 (L)', description: '고구마무스를 아끼지 않고 꽉 채우고 도우 끝은 바삭한 소보로 엣지로 마감한 피자', price: 21900 },
        { id: 'menu-banolim-04-item-2', name: '반올림 불고기 피자 (L)', description: '특제 불고기 양념을 얹어 한국인의 입맛에 딱 맞춘 달콤 고소한 불고기 피자', price: 20900 },
        { id: 'menu-banolim-04-item-3', name: '오븐 치즈 토마토 스파게티', description: '토마토 페이스트에 치즈가 녹아들어 피자와 함께 먹기 가장 좋은 정통 스파게티', price: 6000 },
      ],
    },

    // === 7. 치킨 ===
    {
      id: 'f0baa694-8b17-4a4c-a6fd-5c0ce5f33d41', // 기존 유지
      name: '황금올리브 치킨하우스',
      description: '겉바속촉의 대명사, 오리지널 올리브유 치킨 전문점',
      category: '치킨',
      menuItems: [
        { id: '3ee2a5f6-60bc-432e-b326-9050ef0c7dc1', name: '황금올리브 후라이드', description: '올리브유로 튀겨내어 세상에서 가장 바삭한 치킨', price: 20000 },
        { id: '3ee2a5f6-60bc-432e-b326-9050ef0c7dc2', name: '달콤 양념치킨', description: '특제 고추장 토마토 소스로 버무린 추억의 양념치킨', price: 21000 },
        { id: '3ee2a5f6-60bc-432e-b326-9050ef0c7dc3', name: '허니갈릭 소이치킨', description: '꿀 and 마늘, 간장 베이스의 중독성 강한 치킨', price: 22000 },
      ],
    },
    {
      id: 'chk-kyochon-01',
      name: '교촌치킨 오리지널',
      description: '특제 마늘 간장 소스의 풍미와 극강의 얇고 바삭한 튀김옷 치킨',
      category: '치킨',
      menuItems: [
        { id: 'menu-kyochon-01-item-1', name: '교촌 허니 오리지날', description: '달콤한 꿀과 간장의 짭조름함이 어우러진 최고 인기의 단짠 치킨', price: 19000 },
        { id: 'menu-kyochon-01-item-2', name: '교촌 레드 오리지날', description: '청양 홍고추의 매콤함을 입혀 입안이 칼칼하고 개운한 매운맛 치킨', price: 20000 },
        { id: 'menu-kyochon-01-item-3', name: '바삭 웨지 감자', description: '감자를 통째로 썰어 겉은 바삭하고 속은 부드럽게 튀긴 고소한 감자튀김', price: 4000 },
      ],
    },
    {
      id: 'chk-bhc-02',
      name: 'BHC 뿌링클 월드',
      description: '치즈 야채 가루를 뿌린 뿌링클 등 이색 치킨 문화를 이끄는 브랜드',
      category: '치킨',
      menuItems: [
        { id: 'menu-bhc-02-item-1', name: '뿌링클 치킨', description: '바삭하게 튀긴 치킨 위에 블루치즈, 양파, 마늘이 믹스된 마법의 가루를 솔솔', price: 21000 },
        { id: 'menu-bhc-02-item-2', name: '맛초킹 치킨', description: '달콤 짭조름한 간장 소스에 매콤한 홍고추와 대파를 듬뿍 올려 볶아낸 치킨', price: 21000 },
        { id: 'menu-bhc-02-item-3', name: '달콤 바삭 치즈볼', description: '쫀득한 찹쌀 도우 안에 모짜렐라 치즈가 가득 차 한 입 물면 달콤한 맛', price: 6000 },
      ],
    },
    {
      id: 'chk-goobne-03',
      name: '굽네치킨 오븐구이',
      description: '기름을 쏙 빼고 오븐에 노릇하게 구워내어 칼로리는 줄이고 육즙은 보존한 오븐구이',
      category: '치킨',
      menuItems: [
        { id: 'menu-goobne-03-item-1', name: '굽네 오리지널', description: '오븐에서 구워 껍질은 바삭하고 속살은 야들야들하며 담백한 오리지널 구이', price: 17900 },
        { id: 'menu-goobne-03-item-2', name: '고추 바사삭', description: '청양고추 가루를 튀김옷에 섞어 구워 매콤하고 바삭한 식감의 초인기 치킨', price: 19900 },
        { id: 'menu-goobne-03-item-3', name: '볼케이노 치킨', description: '화끈하고 강렬한 매운 양념 소스를 발라 구운 한국식 핫 오븐 바베큐 치킨', price: 19900 },
      ],
    },
    {
      id: 'chk-puradak-04',
      name: '푸라닭 명품치킨',
      description: '명품 백에 담겨오는 요리 같은 오븐-후라이드 치킨 브랜드',
      category: '치킨',
      menuItems: [
        { id: 'menu-puradak-04-item-1', name: '블랙 알리오 치킨', description: '깊고 진한 간장 소스와 고소하고 바삭한 갈릭 칩이 어우러진 대표 메뉴', price: 20900 },
        { id: 'menu-puradak-04-item-2', name: '고추 마요 치킨', description: '매콤달콤한 마요 소스에 고소한 할라피뇨를 가득 얹어 크리미하게 맵싹한 치킨', price: 20900 },
        { id: 'menu-puradak-04-item-3', name: '블랙 치즈볼', description: '체다와 모짜렐라 치즈가 가득 차 겉은 블랙 크런키로 바삭하게 코팅된 치즈볼', price: 5000 },
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
