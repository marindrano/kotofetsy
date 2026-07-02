import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

import logo from './assets/logo.svg';
import newspaperPhoto from './assets/newspaper.jpg';

export const design: DesignSystem = {
  palette: {
    bg: '#ffffff',
    text: '#111111',
    accent: '#EAAA08',
  },
  fonts: {
    display: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", system-ui, sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", system-ui, sans-serif',
  },
  typeScale: { hero: 160, body: 34 },
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
      <img src={logo} alt="Ikotofetsy" width={128} height={128} style={{ display: 'block' }} />

      <h1
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 800,
          margin: '48px 0 0',
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
        }}
      >
        Ikotofetsy
      </h1>

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
    </div>
  </div>
);

export const meta: SlideMeta = {
  title: 'Ikotofetsy — Intro',
  createdAt: '2026-07-02T20:24:12.135Z',
};
export default [Cover, Stack] satisfies Page[];
