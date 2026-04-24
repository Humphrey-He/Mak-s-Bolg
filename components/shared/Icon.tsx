export function Icon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true
  } as const;

  const icons: Record<string, React.ReactNode> = {
    search: <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
    terminal: <svg {...common}><path d="m7 8 4 4-4 4" /><path d="M13 16h4" /><rect x="3" y="4" width="18" height="16" rx="2" /></svg>,
    github: <svg {...common}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5a10.4 10.4 0 0 0-6 0C8 2.5 7 2.5 7 2.5a6.7 6.7 0 0 0 0 3.5A5.4 5.4 0 0 0 6 9.5C6 13 9 15 12 15a4.8 4.8 0 0 0-1 3v4" /><path d="M9 18c-4.5 2-5-2-7-2" /></svg>,
    rss: <svg {...common}><path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" /></svg>,
    book: <svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" /></svg>,
    cpu: <svg {...common}><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M9 1v3" /><path d="M15 1v3" /><path d="M9 20v3" /><path d="M15 20v3" /><path d="M20 9h3" /><path d="M20 14h3" /><path d="M1 9h3" /><path d="M1 14h3" /></svg>,
    tag: <svg {...common}><path d="M20.5 13.5 13.5 20.5a2 2 0 0 1-2.8 0L3 12.8V3h9.8l7.7 7.7a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1" /></svg>,
    calendar: <svg {...common}><path d="M8 2v4" /><path d="M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /></svg>,
    arrow: <svg {...common}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>,
    chevron: <svg {...common}><path d="m9 18 6-6-6-6" /></svg>,
    home: <svg {...common}><path d="m3 10 9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></svg>,
    globe: <svg {...common}><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" /></svg>,
    zap: <svg {...common}><path d="M13 2 3 14h8l-1 8 11-13h-8l0-7Z" /></svg>,
    chat: <svg {...common}><path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1.3-5.2A8 8 0 1 1 21 12Z" /></svg>,
    sparkles: <svg {...common}><path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" /><path d="M5 14l.9 2.1L8 17l-2.1.9L5 20l-.9-2.1L2 17l2.1-.9L5 14Z" /><path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" /></svg>
  };

  return icons[name] ?? null;
}
