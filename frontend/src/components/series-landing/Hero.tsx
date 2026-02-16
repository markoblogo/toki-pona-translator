import type { LandingEntry, SeriesLandingConfig } from './types';

type HeroProps = {
  hero: SeriesLandingConfig['hero'];
  entries: LandingEntry[];
  targetId: string;
  faqId: string;
};

export default function Hero({ hero, entries, targetId, faqId }: HeroProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
      <div>
        <h1 className="font-serif text-4xl leading-tight text-[#111827] sm:text-5xl">{hero.title}</h1>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-black/80">{hero.lead}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={`#${targetId}`}
            className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            {hero.primaryCtaLabel}
          </a>
          <a
            href={`#${faqId}`}
            className="inline-flex items-center justify-center rounded-full border border-black/30 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
          >
            {hero.secondaryCtaLabel}
          </a>
        </div>
        {hero.note ? <p className="mt-3 text-xs text-black/55">{hero.note}</p> : null}
        <p className="mt-1 text-xs font-semibold text-[#166534]">Build: 2c0c9b6</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {entries.slice(0, 2).map((entry) => (
          <article key={entry.id} className="relative mx-auto w-full max-w-[230px]">
            {entry.badges?.includes('FREE') ? (
              <div className="absolute -top-3 -right-3 z-10 select-none">
                <div className="h-14 w-14 rotate-[-10deg] rounded-full bg-[#E53935] shadow-[0_12px_30px_rgba(0,0,0,0.20)]">
                  <div className="flex h-full w-full items-center justify-center rounded-full border-[3px] border-white">
                    <div className="flex h-[86%] w-[86%] items-center justify-center rounded-full border-2 border-white/70 border-dashed">
                      <span className="text-xs font-black tracking-widest text-white">FREE</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <img
              src={entry.coverImage}
              alt={`${entry.title} cover`}
              className="h-auto w-full rounded-xl border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.14)]"
              loading="eager"
              width={560}
              height={800}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
