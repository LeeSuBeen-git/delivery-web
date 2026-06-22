import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import LogoutButton from './LogoutButton';
import HeaderCartLink from './HeaderCartLink';

export default async function Header() {
  const user = await getCurrentUser();

  const categories = [
    { name: '카페', icon: '☕' },
    { name: '한식', icon: '🍚' },
    { name: '분식', icon: '🍢' },
    { name: '중식', icon: '🥟' },
    { name: '일식', icon: '🍣' },
    { name: '피자', icon: '🍕' },
    { name: '치킨', icon: '🍗' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/95 text-zinc-800 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl h-16 items-center justify-between px-4 sm:px-6">
        
        {/* 로고 및 좌측 네비게이션 */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-emerald-600 hover:text-emerald-500 transition-colors">
            배달리스트
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-600">
            <Link href="/" className="hover:text-emerald-600 transition-colors">홈</Link>
            
            {/* 식당 목록 및 Hover 드롭다운 */}
            <div className="group relative py-4">
              <Link href="/restaurants" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                식당 목록
                <span className="text-[10px] text-zinc-400 group-hover:rotate-180 transition-transform duration-200">▼</span>
              </Link>
              
              {/* 수직 드롭다운 박스 */}
              <div className="absolute left-0 top-full hidden group-hover:block w-48 rounded-xl border border-zinc-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={`/restaurants?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {user && (
              <Link href="/orders" className="hover:text-emerald-600 transition-colors">
                주문 내역
              </Link>
            )}
            <HeaderCartLink />
          </nav>
        </div>

        {/* 우측 유저 메뉴 및 모바일 대응 */}
        <div className="flex items-center gap-4">
          <nav className="md:hidden flex items-center gap-4 text-xs text-zinc-500 pr-2">
            <Link href="/restaurants" className="hover:text-emerald-600 transition-colors">식당</Link>
            {user && <Link href="/orders" className="hover:text-emerald-600 transition-colors">주문</Link>}
            <HeaderCartLink />
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-sm font-medium text-zinc-600">
                <span className="text-emerald-600 font-bold">{user.name}</span>님
              </span>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-400 transition-colors shadow-sm"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
