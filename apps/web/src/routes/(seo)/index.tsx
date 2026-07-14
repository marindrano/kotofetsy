import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { Search, Compass, BookOpen, Layers } from 'lucide-react';

export const Route = createFileRoute('/(seo)/')({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="w-full overflow-hidden bg-[var(--bg-base)]">
      {/* Hero Section - 50/50 Split */}
      <section className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8 lg:pt-32 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start space-y-6">
            <span className="island-kicker">Resourceful Intelligence</span>
            <h1 className="display-title text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl lg:text-6xl leading-[1.05]">
              Malagasy news, <br /> distilled and clear.
            </h1>
            <p className="max-w-[480px] text-lg leading-relaxed text-[var(--sea-ink-soft)]">
              Crawl, index, and synthesize. Understand the complete story across outlets without the noise, using balanced AI comparison.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--sea-ink)] px-8 text-sm font-semibold text-white transition hover:-translate-y-[1px] hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)] focus:ring-offset-2 active:scale-[0.98]"
              >
                Start reading
              </Link>
              <Link
                to="/about"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--sea-ink)]/10 bg-transparent px-8 text-sm font-semibold text-[var(--sea-ink)] transition hover:-translate-y-[1px] hover:bg-black/5 active:scale-[0.98]"
              >
                How it works
              </Link>
            </div>
          </div>
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--sea-ink)]/5 shadow-2xl ring-1 ring-[var(--line)]"
            >
              <img
                src="/images/hero.jpg"
                alt="Editorial representation of Ikotofetsy workspace"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
              {/* Optional inner glare for liquid glass effect */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-12">
          <h2 className="display-title text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
            A clearer lens on the media.
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--sea-ink-soft)] text-lg">
            Built for those who want the balanced version quickly, without following every outlet.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Bento Cell 1 */}
          <div className="island-shell flex flex-col justify-between rounded-[2rem] p-8 md:col-span-2">
            <div className="mb-12">
              <Search className="mb-6 h-8 w-8 text-[var(--lagoon-deep)]" strokeWidth={1.5} />
              <h3 className="mb-3 text-xl font-semibold text-[var(--sea-ink)]">Fast, cross-outlet search</h3>
              <p className="max-w-[40ch] text-[var(--sea-ink-soft)]">
                Find stories across all major Malagasy publications instantly. We index the news so you don't have to hunt for it.
              </p>
            </div>
          </div>

          {/* Bento Cell 2 */}
          <div className="island-shell flex flex-col justify-between rounded-[2rem] p-8 bg-[var(--lagoon)]/5">
            <div className="mb-12">
              <Compass className="mb-6 h-8 w-8 text-[var(--lagoon-deep)]" strokeWidth={1.5} />
              <h3 className="mb-3 text-xl font-semibold text-[var(--sea-ink)]">Bias-aware synthesis</h3>
              <p className="text-[var(--sea-ink-soft)]">
                See how different sources cover the same event, side by side.
              </p>
            </div>
          </div>

          {/* Bento Cell 3 */}
          <div className="island-shell flex flex-col justify-between rounded-[2rem] p-8">
            <div className="mb-12">
              <Layers className="mb-6 h-8 w-8 text-[var(--lagoon-deep)]" strokeWidth={1.5} />
              <h3 className="mb-3 text-xl font-semibold text-[var(--sea-ink)]">Story history</h3>
              <p className="text-[var(--sea-ink-soft)]">
                Trace how a narrative evolved over time, catching up without feeling buried.
              </p>
            </div>
          </div>

          {/* Bento Cell 4 */}
          <div className="island-shell flex flex-col justify-between rounded-[2rem] p-8 md:col-span-2 relative overflow-hidden group">
            <div className="relative z-10 mb-12">
              <BookOpen className="mb-6 h-8 w-8 text-[var(--lagoon-deep)]" strokeWidth={1.5} />
              <h3 className="mb-3 text-xl font-semibold text-[var(--sea-ink)]">Plain-language summaries</h3>
              <p className="max-w-[45ch] text-[var(--sea-ink-soft)]">
                AI distills complex political and economic news into clear, accessible briefings.
              </p>
            </div>
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[var(--lagoon)]/10 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
