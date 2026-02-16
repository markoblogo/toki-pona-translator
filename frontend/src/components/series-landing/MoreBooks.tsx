import type { SeriesLandingConfig } from './types';

type MoreBooksProps = {
  section: SeriesLandingConfig['moreSection'];
};

export default function MoreBooks({ section }: MoreBooksProps) {
  return (
    <section className="sl-section sl-more">
      <h2 className="sl-title-h2">{section.title}</h2>
      {section.subtitle ? <p className="sl-subtitle">{section.subtitle}</p> : null}

      <div className="sl-more-grid">
        {section.entries.map((entry) => (
          <article key={entry.id} className="sl-card sl-more-card">
            <img src={entry.coverImage} alt={`${entry.title} cover thumbnail`} className="sl-more-thumb" loading="lazy" width={140} height={220} />
            <div className="sl-more-content">
              <h3 className="sl-more-title">{entry.title}</h3>
              <p className="sl-more-subtitle">{entry.subtitle}</p>
              <div className="sl-more-actions">
                {entry.pdfUrl ? (
                  <a href={entry.pdfUrl} download className="sl-btn sl-btn-secondary sl-btn-compact">
                    Download PDF
                  </a>
                ) : null}
                {entry.seriesUrl ? (
                  <a href={entry.seriesUrl} target="_blank" rel="noopener noreferrer" className="sl-btn sl-btn-pill sl-btn-compact">
                    {entry.seriesLabel ?? 'Open series'}
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
