import { createFileRoute, Link } from '@tanstack/react-router';
import { Mail, Lock, LogIn, Github } from 'lucide-react';

export const Route = createFileRoute('/(auth)/signin')({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="island-shell rise-in rounded-3xl p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="display-title mb-2 text-2xl font-bold text-[var(--sea-ink)]">Welcome back</h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Sign in to access your saved stories and history.
        </p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-[var(--sea-ink)]">
            Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-4 w-4 text-[var(--sea-ink-soft)]" />
            </div>
            <input
              type="email"
              name="email"
              id="email"
              className="block w-full rounded-xl border border-[var(--sea-ink)]/20 bg-white/50 py-2.5 pl-10 pr-3 text-sm text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon-deep)]"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-[var(--sea-ink)]">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-4 w-4 text-[var(--sea-ink-soft)]" />
            </div>
            <input
              type="password"
              name="password"
              id="password"
              className="block w-full rounded-xl border border-[var(--sea-ink)]/20 bg-white/50 py-2.5 pl-10 pr-3 text-sm text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon-deep)]"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--sea-ink)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--sea-ink)]/90 active:scale-[0.98]"
        >
          <LogIn className="h-4 w-4" />
          Sign in
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--line)]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-[#e7f3ec] px-2 text-[var(--sea-ink-soft)]">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-white py-2.5 text-sm font-semibold text-[var(--sea-ink)] transition hover:bg-gray-50 active:scale-[0.98]"
      >
        <Github className="h-4 w-4" />
        GitHub
      </button>

      <p className="mt-8 text-center text-sm text-[var(--sea-ink-soft)]">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-[var(--lagoon-deep)] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
