import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(seo)/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="w-full bg-[var(--bg-base)] px-4 py-24 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-[65ch]">
        <header className="mb-12">
          <span className="island-kicker mb-4 block">The Mission</span>
          <h1 className="display-title text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
            Cutting through the noise.
          </h1>
        </header>

        <div className="prose prose-lg text-[var(--sea-ink-soft)] prose-headings:text-[var(--sea-ink)] prose-headings:font-semibold prose-a:text-[var(--lagoon-deep)]">
          <p>
            Ikotofetsy serves two primary audiences, but with a singular goal: making news accessible, verifiable, and balanced.
          </p>
          
          <h2 className="mt-12 mb-6 text-2xl">The Information Problem</h2>
          <p>
            For readers who do not follow every outlet, catching up on Malagasy news can feel overwhelming. We built a system that crawls, indexes, and uses AI to summarize stories. More importantly, it compares coverage across outlets, surfacing bias-aware synthesis and tracing how a story evolved over time.
          </p>

          <h2 className="mt-12 mb-6 text-2xl">Source Plurality</h2>
          <p>
            Trust depends on making outlets, dates, and coverage differences visible instead of hiding them behind a single AI answer. Ikotofetsy doesn't just give you one version of the truth; it gives you the landscape of how a story is being told.
          </p>
          
          <div className="mt-12 island-shell rounded-2xl p-8">
            <h3 className="mb-2 font-semibold text-[var(--sea-ink)] text-xl">Our Brand Personality</h3>
            <p className="m-0 text-base">
              Serious, clever, and grounded. We carry the Ikotofetsy folklore reference as a quiet strategic idea: resourceful intelligence cutting through noise.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
