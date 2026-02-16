import type { LandingEntry } from './types';

type EntrySectionProps = {
  entry: LandingEntry;
  reverse?: boolean;
};

export default function EntrySection({ entry, reverse = false }: EntrySectionProps) {
  return (
    <section id={entry.id} className="sl-entry">
      <div className={`sl-entry-grid ${reverse ? 'is-reverse' : ''}`}>
        <div className="sl-entry-media-col">
          <div className="sl-entry-media">
            <img src={entry.promoImage} alt={`${entry.title} promo`} className="sl-entry-image" loading="lazy" width={1400} height={900} />
          </div>
        </div>

        <div className="sl-entry-content">
          <header>
            <h3 className="sl-title-h2">{entry.title}</h3>
            <p className="sl-entry-subtitle">{entry.subtitle}</p>
          </header>

          <p className="sl-text sl-entry-short">{entry.shortDescription}</p>

          <ul className="sl-bullets">
            {entry.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>

          <div className="sl-actions">
            {entry.pdfUrl ? (
              <a href={entry.pdfUrl} download className="sl-btn sl-btn-primary">
                Download PDF
              </a>
            ) : null}
            {entry.teaserUrl ? (
              <a href={entry.teaserUrl} target="_blank" rel="noopener noreferrer" className="sl-btn sl-btn-secondary">
                Watch teaser
              </a>
            ) : null}
            {entry.seriesUrl ? (
              <a href={entry.seriesUrl} target="_blank" rel="noopener noreferrer" className="sl-btn sl-btn-pill">
                {entry.seriesLabel ?? 'Open series'}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
