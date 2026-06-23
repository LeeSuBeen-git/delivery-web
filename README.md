# 🍔 배달리스트 (delivery-web)

Next.js App Router와 Prisma를 기반으로 구축된, 밝고 세련된 디자인의 모던 배달 웹 서비스 **배달리스트**입니다.

---

## 💻 프로젝트 설명
* 본 프로젝트는 식당 목록 조회, 장바구니 담기, 실시간 주문 적재 및 주문 영수증을 제공하는 배달 대행 서비스 형태의 웹 애플리케이션입니다.
* 기존 다크 글래스모피즘 테마를 완전히 배제하고, **초록색/민트색 메인 포인트** 및 **노란색/주황색 보조 포인트**를 사용한 화사하고 밝은 배달앱 감성 UI/UX로 리뉴얼되었습니다.

---

## 🛠️ 기술 스택 (Tech Stack)
* **Framework**: Next.js 16.2 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4, PostCSS
* **ORM**: Prisma 7 (With `prisma.config.ts` 및 `@prisma/adapter-pg` 드라이버 어댑터)
* **Database**: PostgreSQL (Local: Docker Compose, Production: Neon PostgreSQL)
* **Deployment**: Vercel

---

## ✨ 주요 기능 (Features)
1. **자체 사용자 인증**: 이메일/비밀번호 기반 회원가입, JWT 세션 쿠키 로그인, 로그아웃 기능
2. **7대 카테고리 고정 탐색**: 카페 ☕, 한식 🍚, 분식 🍢, 중식 🥟, 일식 🍣, 피자 🍕, 치킨 🍗 카테고리별 맛집 필터링
3. **식당 및 메뉴 상세 보기**: 각 식당별 대표 메뉴 목록 조회 및 가격 정보 제공
4. **LocalStorage 기반 장바구니**: 로컬 스토리지(`delivery-cart`)를 이용해 임시 담기 및 실시간 수량 제어 구현
5. **안전한 주문 트랜잭션**: Prisma `$transaction`을 이용해 `orders` 및 `order_items`에 주문 시점의 정보를 무결하게 보존
6. **영수증 완료 UI**: 주문 완료 시 최상단에 실제 절취선(✂️) 및 펀칭 홈이 뚫린 영수증 카드 렌더링 (본인 인증 교차 검증)
7. **내 주문 내역 조회**: 과거 주문 리스트 및 실시간 주문 접수 상태 카드 뷰 제공

---

## ⚙️ 환경변수 설정 (Environment Variables)
프로젝트 루트 폴더에 `.env` 파일을 생성하고 아래 형식을 채워주세요. (상세 내용은 `.env.example` 참고)

```env
# 데이터베이스 접속 URL (풀러 및 다이렉트 예시)
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DB_NAME]?schema=public"
# DIRECT_URL="postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DB_NAME]?schema=public" # Neon 등 배포 마이그레이션 전용

# 자체 JWT 세션 복호화용 비밀키 (최소 32자 이상 권장)
JWT_SECRET="your-jwt-secret-key-string"
```

---

## 🚀 로컬 실행 방법 (How to Run Locally)

### 1. 로컬 데이터베이스 기동 (Docker Compose)
로컬 환경에 PostgreSQL을 구동합니다.
```bash
docker-compose up -d
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 데이터베이스 스키마 푸시 및 초기 시드 적재
Prisma DB 동기화 및 7대 카테고리 시드 데이터를 DB에 Upsert 적재합니다.
```bash
npm run db:push
npm run db:seed
```

### 4. 로컬 개발 서버 기동
```bash
npm run dev

```
이후 브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.

---

## 📦 배포 시 주의사항 (Deployment Guide)
1. **Prisma Client 자동 생성**: `package.json` 내 `postinstall` 훅에 `prisma generate`를 추가해 두었으므로, Vercel 배포 시 별도 빌드 설정 변경 없이 자동으로 Prisma Client가 컴파일되어 로드됩니다.
2. **Neon Serverless PostgreSQL 연동**: Neon PostgreSQL 등 서버리스 DB에 배포할 경우 Connection Pooling이 걸린 URL은 `DATABASE_URL`에 설정하고, 마이그레이션이 필요하다면 `DIRECT_URL` 환경 변수 설정을 지원하도록 인프라를 연동할 수 있습니다.
3. **환경변수 주입**: 배포 플랫폼(Vercel 등) 환경변수 관리 탭에 `DATABASE_URL` 및 `JWT_SECRET`을 필수적으로 주입해야 정상 작동합니다.
