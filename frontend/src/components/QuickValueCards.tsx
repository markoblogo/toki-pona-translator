type Card = {
  href: string;
  title: string;
  subtitle: string;
  kicker: string;
  imageSrc: string;
  external?: boolean;
};

const CARDS: Card[] = [
  {
    href: '/kit',
    kicker: 'FREE PDF',
    title: 'Reader’s Kit',
    subtitle: 'Beginner-friendly guide + teaser video. Fast start into reading toki pona.',
    imageSrc: '/promo/card-kit.jpg',
  },
  {
    href: 'https://stoic.abvx.xyz/en',
    kicker: 'SERIES',
    title: 'Toki Stoic',
    subtitle: 'Stoic books reimagined in toki pona (EN/TP).',
    imageSrc: '/promo/card-stoic.jpg',
    external: true,
  },
  {
    href: 'https://github.com/markoblogo/sitelen-emoji-truth',
    kicker: 'DICTIONARY',
    title: 'Sitelen Emoji “Truth”',
    subtitle: 'Pinned, versioned mapping used by this translator (single source of truth).',
    imageSrc: '/promo/card-emoji.jpg',
    external: true,
  },
];

export default function QuickValueCards() {
  return (
    <section className="max-w-5xl mx-auto px-4 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CARDS.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target={c.external ? '_blank' : undefined}
            rel={c.external ? 'noopener noreferrer' : undefined}
            className="card-gloss overflow-hidden block hover:shadow-[0_22px_70px_rgba(15,23,42,0.10)] transition"
          >
            <div className="p-5">
              <div className="text-[11px] font-semibold tracking-wide text-[#22C55E] uppercase">
                {c.kicker}
              </div>
              <div className="mt-1 text-base font-semibold text-[#111827] leading-tight">{c.title}</div>
              <div className="mt-2 text-sm text-[#6B7280] leading-relaxed">{c.subtitle}</div>
            </div>
            <div className="relative border-t border-black/5">
              <img
                src={c.imageSrc}
                alt=""
                loading="lazy"
                className="h-28 w-full object-cover"
                width={900}
                height={320}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
