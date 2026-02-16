import type { SeriesLandingConfig } from './types';

type MoreBooksProps = {
  section: SeriesLandingConfig['moreSection'];
};

export default function MoreBooks({ section }: MoreBooksProps) {
  return (
    <section className="section moreBooksSection">
      <header className="heading">
        <h2 className="title">{section.title}</h2>
        {section.subtitle ? <p className="subtitle">{section.subtitle}</p> : null}
      </header>

      <div className="grid">
        {section.entries.map((entry) => (
          <article key={entry.id} className="card">
            <div className="inner">
              <div className="media">
                <img src={entry.coverImage} alt={`${entry.title} cover`} className="promoImg" loading="lazy" width={560} height={800} />
              </div>

              <div className="content">
                <h3 className="bookTitle">{entry.title}</h3>
                <p className="bookSubtitle">{entry.subtitle}</p>

                <div className="actions">
                  <div className="ctas">
                    {entry.pdfUrl ? (
                      <a href={entry.pdfUrl} download className="btn btnSecondary btnCompact">
                        Download PDF
                      </a>
                    ) : null}
                    {entry.seriesUrl ? (
                      <a href={entry.seriesUrl} target="_blank" rel="noopener noreferrer" className="btn btnPill btnCompact">
                        {entry.seriesLabel ?? 'Open series'}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
