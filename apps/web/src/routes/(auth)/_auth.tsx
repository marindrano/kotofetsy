import { createFileRoute, Outlet, Link } from '@tanstack/react-router';
import { Compass } from 'lucide-react';

export const Route = createFileRoute('/(auth)/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-base)]">
      <header className="flex h-20 items-center px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-[var(--sea-ink)] hover:opacity-80 transition-opacity">
          <Compass className="h-6 w-6 text-[var(--lagoon)]" strokeWidth={2} />
          <span className="font-bold tracking-tight text-lg">Ikotofetsy</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-[400px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
