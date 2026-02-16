import type { LandingEntry, SeriesLandingConfig } from './types';

type MoreBooksProps = {
  section: SeriesLandingConfig['moreSection'];
};

export default function MoreBooks({ section }: MoreBooksProps) {
  return (
    <section className="mt-8">
      <h2 className="font-serif text-3xl leading-tight text-[#111827]">{section.title}</h2>
      {section.subtitle ? <p className="mt-2 text-sm text-black/70">{section.subtitle}</p> : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {section.entries.map((entry: LandingEntry) => (
          <article key={entry.id} className="card-gloss overflow-hidden p-4">
            <div className="flex items-center gap-4">
              <img
                src={entry.coverImage}
                alt={`${entry.title} cover thumbnail`}
                className="h-20 w-16 rounded-md border border-black/10 object-cover"
                loading="lazy"
                width={140}
                height={220}
              />
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-[#111827] line-clamp-2">{entry.title}</h3>
                <p className="mt-1 text-xs text-black/60 line-clamp-2">{entry.subtitle}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {entry.pdfUrl ? (
                    <a
                      href={entry.pdfUrl}
                      download
                      className="inline-flex items-center justify-center rounded-full border border-black/20 bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-black/[0.03]"
                    >
                      Download PDF
                    </a>
                  ) : null}
                  {entry.seriesUrl ? (
                    <a
                      href={entry.seriesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-[#22C55E]/30 bg-[#ECFDF3] px-3 py-1.5 text-xs font-semibold text-[#166534] transition hover:bg-[#dcfce7]"
                    >
                      {entry.seriesLabel ?? 'Open series'}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
