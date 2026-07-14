import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(dash)/app/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Dashboard</h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Welcome back. Here is your personalized news intelligence overview.
        </p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards for dashboard metrics/content */}
        <div className="island-shell rounded-2xl p-6">
          <h3 className="mb-2 font-semibold text-[var(--sea-ink)]">Latest Summaries</h3>
          <p className="text-sm text-[var(--sea-ink-soft)]">No new summaries today.</p>
        </div>
        <div className="island-shell rounded-2xl p-6">
          <h3 className="mb-2 font-semibold text-[var(--sea-ink)]">Saved Stories</h3>
          <p className="text-sm text-[var(--sea-ink-soft)]">You have 0 saved stories.</p>
        </div>
        <div className="island-shell rounded-2xl p-6">
          <h3 className="mb-2 font-semibold text-[var(--sea-ink)]">Active Trends</h3>
          <p className="text-sm text-[var(--sea-ink-soft)]">Tracking 3 regional topics.</p>
        </div>
      </div>
    </div>
  );
}
