export default function Home() {
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
        
        <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
          배달앱 프로젝트 시작
        </p>

        <div className="mt-10 flex gap-4">
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

