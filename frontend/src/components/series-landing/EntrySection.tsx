import type { LandingEntry } from './types';

type EntrySectionProps = {
  entry: LandingEntry;
  reverse?: boolean;
};

export default function EntrySection({ entry, reverse = false }: EntrySectionProps) {
  return (
    <section id={entry.id} className="border-t border-black/8 py-12 sm:py-14">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr,1fr] lg:gap-12">
        <div className={reverse ? 'lg:order-2' : ''}>
          <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
            <img
              src={entry.promoImage}
              alt={`${entry.title} promo`}
              className="h-auto w-full"
              loading="lazy"
              width={1400}
              height={900}
            />
          </div>
        </div>

        <div className={reverse ? 'lg:order-1' : ''}>
          <header>
            <h2 className="font-serif text-3xl leading-tight text-[#111827] sm:text-4xl">{entry.title}</h2>
            <p className="mt-2 text-sm font-semibold tracking-wide text-black/55">{entry.subtitle}</p>
          </header>

          <p className="mt-4 text-base leading-relaxed text-black/80">{entry.shortDescription}</p>

          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-black/80">
            {entry.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="mt-[2px] text-[#22C55E]">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            {entry.pdfUrl ? (
              <a
                href={entry.pdfUrl}
                download
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/90"
              >
                Download PDF
              </a>
            ) : null}
            {entry.teaserUrl ? (
              <a
                href={entry.teaserUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-black/30 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
              >
                Watch teaser
              </a>
            ) : null}
            {entry.seriesUrl ? (
              <a
                href={entry.seriesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#22C55E]/30 bg-[#ECFDF3] px-5 py-2.5 text-sm font-semibold text-[#166534] transition hover:bg-[#dcfce7]"
              >
                {entry.seriesLabel ?? 'Open series'}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
