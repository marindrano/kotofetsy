import { useEffect, useRef } from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

import logo from './assets/logo.svg';
import newspaperPhoto from './assets/newspaper.jpg';

const LOTTIE_SCRIPT_ID = 'osd-lottie-web';
const LOTTIE_CDN = 'https://unpkg.com/lottie-web@5.12.2/build/player/lottie.min.js';

const LOTTIE_BAGS_UNDER_EYES = 'https://fonts.gstatic.com/s/e/notoemoji/latest/1fae9/lottie.json';
const LOTTIE_DISAPPOINTED = 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/lottie.json';
const LOTTIE_HUGGING_FACE = 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f917/lottie.json';
const LOTTIE_ROCKET = 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json';

function loadLottieScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  const w = window as unknown as { lottie?: unknown };
  if (w.lottie) return Promise.resolve();

  const existing = document.getElementById(LOTTIE_SCRIPT_ID);
  if (existing) {
    return new Promise((resolve) => {
      const check = () => (w.lottie ? resolve() : setTimeout(check, 50));
      check();
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.id = LOTTIE_SCRIPT_ID;
    script.src = LOTTIE_CDN;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

const LottiePlayer = ({ src, size }: { src: string; size: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let anim: { destroy: () => void } | undefined;

    loadLottieScript().then(() => {
      if (cancelled || !containerRef.current) return;
      const lottie = (window as unknown as { lottie: { loadAnimation: (opts: unknown) => { destroy: () => void } } }).lottie;
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: src,
      });
    });

    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, [src]);

  return <div ref={containerRef} style={{ width: size, height: size, flexShrink: 0 }} />;
};

export const design: DesignSystem = {
  palette: {
    bg: '#ffffff',
    text: '#111111',
    accent: '#EAAA08',
  },
  fonts: {
    display: '-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", system-ui, sans-serif',
  },
  typeScale: {
    hero: 160,
    body: 34,
  },
  radius: 4,
};

const muted = '#6b6b6b';
const rule = 'rgba(17, 17, 17, 0.12)';

const fill = {
  width: '100%',
  height: '100%',
} as const;

const ICON_PROPS = {
  width: 30,
  height: 30,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'var(--osd-accent)',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const IconScale = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 3v16" />
    <path d="M5 7h14" />
    <path d="M3 12l2-5 2 5a2.2 2.2 0 0 1-4 0Z" />
    <path d="M17 12l2-5 2 5a2.2 2.2 0 0 1-4 0Z" />
    <path d="M8 21h8" />
  </svg>
);

const IconSpark = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 3c.6 3.4 2.6 5.4 6 6-3.4.6-5.4 2.6-6 6-.6-3.4-2.6-5.4-6-6 3.4-.6 5.4-2.6 6-6Z" />
    <path d="M19 15c.25 1.4 1 2.15 2.4 2.4-1.4.25-2.15 1-2.4 2.4-.25-1.4-1-2.15-2.4-2.4 1.4-.25 2.15-1 2.4-2.4Z" />
  </svg>
);

const IconClock = () => (
  <svg {...ICON_PROPS}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

const Feature = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    {icon}
    <span
      style={{
        fontFamily: 'var(--osd-font-body)',
        fontSize: 24,
        lineHeight: 1.3,
        color: 'var(--osd-text)',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  </div>
);

const ReraCover: Page = () => (
  <div
    style={{
      ...fill,
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
    }}
  >
    <div
      style={{
        width: '66.6%',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '110px 140px',
        minWidth: 0,
      }}
    >
      <div style={{ transform: 'rotate(-6deg)', marginLeft: 40 }}>
        <LottiePlayer src={LOTTIE_BAGS_UNDER_EYES} size={230} />
      </div>

      <span
        style={{
          fontFamily: 'var(--osd-font-body)',
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--osd-accent)',
          marginTop: 32,
        }}
      >
        Status update
      </span>

      <h1
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 118,
          fontWeight: 800,
          margin: '24px 0 0',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          maxWidth: 1150,
        }}
      >
        Reraka mitady asa aho
      </h1>

      <div
        style={{
          width: 120,
          height: 6,
          borderRadius: 3,
          background: 'var(--osd-accent)',
          marginTop: 40,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 32 }}>
        <span
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 44,
            fontWeight: 800,
            color: 'var(--osd-text)',
          }}
        >
          25 sent
        </span>
        <span style={{ fontFamily: 'var(--osd-font-body)', fontSize: 32, color: muted }}>
          →
        </span>
        <span
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 44,
            fontWeight: 800,
            color: 'var(--osd-accent)',
          }}
        >
          2 replied
        </span>
      </div>

      <div style={{ transform: 'rotate(5deg)', marginTop: 32, marginLeft: '58%' }}>
        <LottiePlayer src={LOTTIE_DISAPPOINTED} size={230} />
      </div>
    </div>

    <div
      style={{
        width: '33.4%',
        flexShrink: 0,
        height: '100%',
        background: 'rgba(234, 170, 8, 0.08)',
      }}
    />
  </div>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      fontFamily: 'var(--osd-font-body)',
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
      color: 'var(--osd-accent)',
    }}
  >
    {children}
  </span>
);

const WhySlide: Page = () => (
  <div
    style={{
      ...fill,
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 140px',
    }}
  >
    <Eyebrow>The reason</Eyebrow>

    <h1
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 96,
        fontWeight: 800,
        margin: '32px 0 0',
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        maxWidth: 1400,
      }}
    >
      I don't have proof of what counts as work currency.
    </h1>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 48 }}>
      {['A diploma', 'Provable experience', 'Visibility', 'A solid GitHub profile'].map((item) => (
        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: 'var(--osd-accent)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--osd-font-body)', fontSize: 34, color: muted }}>{item}</span>
        </div>
      ))}
    </div>

    <p
      style={{
        fontFamily: 'var(--osd-font-body)',
        fontSize: 30,
        lineHeight: 1.5,
        color: muted,
        maxWidth: 1300,
        margin: '40px 0 0',
      }}
    >
      3 years of experience — but most of it lives in projects I can't talk about. One or two things aside, none of it is provable.
    </p>
  </div>
);

const MistakeSlide: Page = () => (
  <div
    style={{
      ...fill,
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 140px',
    }}
  >
    <Eyebrow>The mistake</Eyebrow>

    <h1
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 90,
        fontWeight: 800,
        margin: '32px 0 0',
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        maxWidth: 1400,
      }}
    >
      I made a fatal mistake.
    </h1>

    <p
      style={{
        fontFamily: 'var(--osd-font-body)',
        fontSize: 34,
        lineHeight: 1.6,
        color: muted,
        maxWidth: 1300,
        margin: '48px 0 0',
      }}
    >
      Back when I wasn't professionally tied to anything, I didn't use Git — even when my brother told me to.
    </p>

    <p
      style={{
        fontFamily: 'var(--osd-font-body)',
        fontSize: 34,
        lineHeight: 1.6,
        color: 'var(--osd-text)',
        maxWidth: 1300,
        margin: '32px 0 0',
      }}
    >
      One day, he decided to delete everything on his computer. I didn't use GitHub either — so there was nowhere else it lived.
    </p>
  </div>
);

const BuriedSlide: Page = () => (
  <div
    style={{
      ...fill,
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 140px',
    }}
  >
    <Eyebrow>The years after</Eyebrow>

    <h1
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 96,
        fontWeight: 800,
        margin: '32px 0 0',
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        maxWidth: 1450,
      }}
    >
      My GitHub history is basically garbage.
    </h1>

    <p
      style={{
        fontFamily: 'var(--osd-font-body)',
        fontSize: 34,
        lineHeight: 1.6,
        color: muted,
        maxWidth: 1300,
        margin: '48px 0 0',
      }}
    >
      After that, I got employed. My GitHub account was never used there — they had their own self-hosted GitLab, and gave me a company email for everything.
    </p>

    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 40 }}>
      <span
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 44,
          fontWeight: 800,
          color: 'var(--osd-text)',
        }}
      >
        8 years coding
      </span>
      <span style={{ fontFamily: 'var(--osd-font-body)', fontSize: 32, color: muted }}>
        →
      </span>
      <span
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 44,
          fontWeight: 800,
          color: 'var(--osd-accent)',
        }}
      >
        0 public history
      </span>
    </div>

    <p
      style={{
        fontFamily: 'var(--osd-font-body)',
        fontSize: 34,
        fontWeight: 700,
        color: 'var(--osd-accent)',
        margin: '56px 0 0',
      }}
    >
      So here's what we're going to do.
    </p>
  </div>
);

const NewsBlindSlide: Page = () => (
  <div
    style={{
      ...fill,
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 140px',
    }}
  >
    <Eyebrow>Also true</Eyebrow>

    <h1
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 90,
        fontWeight: 800,
        margin: '32px 0 0',
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        maxWidth: 1400,
      }}
    >
      I don't read the news either.
    </h1>

    <p
      style={{
        fontFamily: 'var(--osd-font-body)',
        fontSize: 34,
        lineHeight: 1.6,
        color: muted,
        maxWidth: 1300,
        margin: '48px 0 0',
      }}
    >
      Not unless it's impossible to miss — a strike. Or that girl who supposedly died from watching Death Note. I still don't know what actually happened there.
    </p>

    <p
      style={{
        fontFamily: 'var(--osd-font-body)',
        fontSize: 34,
        fontWeight: 700,
        color: 'var(--osd-accent)',
        maxWidth: 1300,
        margin: '32px 0 0',
      }}
    >
      Beyond that, I have no idea what's being built in this country, or what's falling apart.
    </p>
  </div>
);

const Cover: Page = () => (
  <div
    style={{
      ...fill,
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
    }}
  >
    <div
      style={{
        width: '66.6%',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '140px',
        minWidth: 0,
      }}
    >
      <Eyebrow>Our first project, built in public</Eyebrow>

      <img src={logo} alt="Ikotofetsy" width={128} height={128} style={{ display: 'block', marginTop: 32 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 48 }}>
        <h1
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 'var(--osd-size-hero)',
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
          }}
        >
          Ikotofetsy
        </h1>
        <LottiePlayer src={LOTTIE_HUGGING_FACE} size={110} />
      </div>

      <p
        style={{
          fontFamily: 'var(--osd-font-body)',
          fontSize: 36,
          lineHeight: 1.5,
          color: muted,
          maxWidth: 1080,
          margin: '28px 0 0',
        }}
      >
        An AI news reader for Malagasy media — it reads across newspapers,
        summarizes stories, and shows how they developed over time.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 40 }}>
        <Feature icon={<IconScale />} label="Unbiased, cross-outlet takes" />
        <Feature icon={<IconSpark />} label="AI-powered summaries" />
        <Feature icon={<IconClock />} label="Full story history" />
      </div>
    </div>

    <div
      style={{
        width: '33.4%',
        flexShrink: 0,
        height: '100%',
        display: 'flex',
      }}
    >
      <img
        src={newspaperPhoto}
        alt="Stack of newspapers"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>

    <div
      style={{
        position: 'absolute',
        bottom: 64,
        left: 140,
        fontFamily: 'var(--osd-font-body)',
        fontSize: 22,
        color: muted,
      }}
    >
      RANDRIAMANASINA Tianiazy Marindrano — Cross-Platform Full-Stack Developer
    </div>
  </div>
);

const StackRow = ({ role, tech }: { role: string; tech: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'baseline',
      padding: '22px 0',
      borderBottom: `1px solid ${rule}`,
      gap: 48,
    }}
  >
    <span
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 34,
        fontWeight: 700,
        width: 320,
        flexShrink: 0,
      }}
    >
      {role}
    </span>
    <span style={{ fontFamily: 'var(--osd-font-body)', fontSize: 30, color: muted }}>
      {tech}
    </span>
  </div>
);

const Stack: Page = () => (
  <div
    style={{
      ...fill,
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      padding: '140px',
    }}
  >
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 80,
        fontWeight: 800,
        margin: 0,
      }}
    >
      Stack
    </h2>

    <div style={{ marginTop: 56 }}>
      <div
        style={{
          display: 'flex',
          gap: 48,
          paddingBottom: 16,
          borderBottom: `2px solid ${design.palette.text}`,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--osd-font-body)',
            fontSize: 22,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--osd-accent)',
            width: 320,
            flexShrink: 0,
          }}
        >
          Role
        </span>
        <span
          style={{
            fontFamily: 'var(--osd-font-body)',
            fontSize: 22,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--osd-accent)',
          }}
        >
          Technology
        </span>
      </div>

      <StackRow role="Crawler" tech="Python + Scrapling" />
      <StackRow role="Backend" tech="Go + PocketBase + Meilisearch" />
      <StackRow role="Frontend" tech="TanStack Start" />
      <StackRow role="Agent" tech="Eve (Vercel)" />
      <StackRow role="Local tooling" tech="Charm (charmbracelet) — CLIs for on-device jobs" />
    </div>
  </div>
);

const WhatToExpectSlide: Page = () => (
  <div
    style={{
      ...fill,
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 140px',
    }}
  >
    <Eyebrow>Along the way</Eyebrow>

    <h1
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 90,
        fontWeight: 800,
        margin: '32px 0 0',
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        maxWidth: 1400,
      }}
    >
      We will research, learn, and build — in public.
    </h1>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 48 }}>
      {[
        'Real problems getting solved, not a highlight reel',
        'Mistakes included — you learn exactly when I do',
        'A Malagasy AI product going from zero to shipped',
      ].map((item) => (
        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: 'var(--osd-accent)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--osd-font-body)', fontSize: 34, color: muted }}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

const LetsGoSlide: Page = () => (
  <div
    style={{
      ...fill,
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 140px',
    }}
  >
    <LottiePlayer src={LOTTIE_ROCKET} size={260} />

    <h1
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 'var(--osd-size-hero)',
        fontWeight: 800,
        margin: '48px 0 0',
        lineHeight: 1.05,
        letterSpacing: '-0.02em',
        textAlign: 'center',
      }}
    >
      Let's build.
    </h1>

    <p
      style={{
        fontFamily: 'var(--osd-font-body)',
        fontSize: 34,
        lineHeight: 1.5,
        color: muted,
        maxWidth: 1100,
        margin: '32px 0 0',
        textAlign: 'center',
      }}
    >
      And you're watching it get built.
    </p>
  </div>
);

export const meta: SlideMeta = {
  title: 'Ikotofetsy — Intro',
  createdAt: '2026-07-02T20:24:12.135Z',
};
export default [ReraCover, WhySlide, MistakeSlide, BuriedSlide, NewsBlindSlide, Cover, Stack, WhatToExpectSlide, LetsGoSlide] satisfies Page[];
