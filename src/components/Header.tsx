import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import LogoutButton from './LogoutButton';

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md text-white">
      <div className="mx-auto flex max-w-6xl h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300">
            delivery-web
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
            <Link href="/" className="hover:text-orange-400 transition-colors">홈</Link>
            <Link href="/restaurants" className="hover:text-orange-400 transition-colors">식당 목록</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <nav className="md:hidden flex items-center gap-4 text-xs text-zinc-400">
            <Link href="/restaurants" className="hover:text-orange-400 transition-colors">식당 목록</Link>
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-sm text-zinc-300">
                <span className="text-orange-400 font-bold">{user.name}</span>님
              </span>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-400 transition-colors"
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
