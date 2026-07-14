import { createFileRoute, Outlet, Link } from '@tanstack/react-router';
import { LayoutDashboard, Bookmark, Settings, LogOut } from 'lucide-react';

export const Route = createFileRoute('/(dash)/_dash')({
  component: DashLayout,
});

function DashLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-[var(--line)] bg-white/40 backdrop-blur-md md:flex">
        <div className="flex h-16 items-center px-6">
          <Link to="/" className="font-bold tracking-tight text-[var(--sea-ink)] text-lg">
            Ikotofetsy
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          <Link
            to="/app"
            className="flex items-center gap-3 rounded-lg bg-[var(--lagoon)]/10 px-3 py-2 text-sm font-semibold text-[var(--lagoon-deep)]"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--sea-ink-soft)] hover:bg-[var(--line)] hover:text-[var(--sea-ink)]"
          >
            <Bookmark className="h-4 w-4" />
            Saved Stories
          </a>
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--sea-ink-soft)] hover:bg-[var(--line)] hover:text-[var(--sea-ink)]"
          >
            <Settings className="h-4 w-4" />
            Settings
          </a>
        </nav>
        <div className="p-4 border-t border-[var(--line)]">
          <Link
            to="/"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--sea-ink-soft)] hover:bg-[var(--line)] hover:text-[var(--sea-ink)]"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex h-16 items-center border-b border-[var(--line)] bg-white/40 px-6 backdrop-blur-md md:hidden">
           <Link to="/" className="font-bold tracking-tight text-[var(--sea-ink)]">
            Ikotofetsy
          </Link>
        </header>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
