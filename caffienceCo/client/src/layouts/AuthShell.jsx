import { Link, Outlet } from 'react-router-dom';

function AuthHeader() {
  return (
    <header className="border-b border-line bg-white">
      <div className="page-shell flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.png" alt="" className="h-8 w-8" />
          <span className="text-sm font-bold">Caffeine.co</span>
        </Link>
        <Link to="/" className="text-[11px] tracking-widest text-muted uppercase hover:text-espresso">
          Back to store
        </Link>
      </div>
    </header>
  );
}

export default function AuthShell() {
  return (
    <div className="min-h-screen bg-cream">
      <AuthHeader />
      <main className="page-shell flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}