import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import LogoutButton from '@/components/LogoutButton';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white font-sans selection:bg-orange-500 selection:text-white">
      <main className="flex flex-col items-center justify-center p-8 text-center max-w-xl">
        <div className="relative mb-6">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 opacity-75 blur animate-pulse"></div>
          <div className="relative rounded-lg bg-zinc-900 px-7 py-4 text-sm leading-none text-zinc-200">
            Computer Science Capstone Project
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300">
          delivery-web
        </h1>
        
        <p className="mt-4 text-lg text-zinc-400">
          배달앱 프로젝트 시작
        </p>

        {/* 인증 세션에 따른 조건부 렌더링 */}
        <div className="mt-10 w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
          {user ? (
            <div className="space-y-4">
              <p className="text-zinc-200 font-medium">
                👋 안녕하세요, <span className="text-orange-400 font-bold">{user.name}</span>님!
              </p>
              <p className="text-xs text-zinc-500">{user.email}</p>
              <div className="pt-2">
                <LogoutButton />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-zinc-400 text-sm">
                현재 로그인되어 있지 않습니다.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-400 transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  회원가입
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-zinc-800/80">
            <Link
              href="/restaurants"
              className="flex w-full justify-center items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500/20 to-amber-500/20 py-3 text-sm font-semibold text-orange-400 border border-orange-500/30 hover:from-orange-500/30 hover:to-amber-500/30 hover:border-orange-500/50 transition-all"
            >
              🍽️ 맛있는 식당 구경하기 &rarr;
            </Link>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Next.js App Router
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
            Tailwind CSS
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
            TypeScript
          </span>
        </div>
      </main>
    </div>
  );
}

