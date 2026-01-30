type Card = {
  href: string;
  title: string;
  subtitle: string;
  icon: string;
  external?: boolean;
};

const CARDS: Card[] = [
  {
    href: '/kit',
    title: 'Free Reader’s Kit',
    subtitle: 'Beginner-friendly PDF + teaser video. Fast start into reading toki pona.',
    icon: 'FREE',
  },
  {
    href: 'https://stoic.abvx.xyz/en',
    title: 'Toki Stoic',
    subtitle: 'Stoic classics reimagined in toki pona (EN/TP).',
    icon: 'S',
    external: true,
  },
  {
    href: 'https://github.com/markoblogo/sitelen-emoji-truth',
    title: 'Sitelen Emoji “Truth”',
    subtitle: 'Pinned, versioned mapping used by this translator (single source of truth).',
    icon: '✓',
    external: true,
  },
];

export default function QuickValueCards() {
  return (
    <section className="max-w-5xl mx-auto px-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CARDS.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target={c.external ? '_blank' : undefined}
            rel={c.external ? 'noopener noreferrer' : undefined}
            className="card-gloss p-5 block hover:shadow-[0_22px_70px_rgba(15,23,42,0.10)] transition"
          >
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#ECFDF3] border border-[#22C55E]/20 flex items-center justify-center">
                <span className="text-[#22C55E] font-extrabold leading-none">{c.icon}</span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[#111827] leading-tight">{c.title}</div>
                <div className="mt-1 text-sm text-[#6B7280] leading-relaxed">{c.subtitle}</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
