import type { LandingEntry, SeriesLandingConfig } from './types';

type EntrySectionProps = {
  entry: LandingEntry;
  reverse?: boolean;
  labels: SeriesLandingConfig['labels'];
};

export default function EntrySection({ entry, reverse = false, labels }: EntrySectionProps) {
  return (
    <section id={entry.id} className="section bookSection">
      <div className={`container ${reverse ? 'reverse' : ''}`}>
        <div className="imageCol">
          <div className="imageWrapper">
            <img src={entry.promoImage} alt={`${entry.title} promo`} className="promoImg" loading="lazy" width={1400} height={900} />
          </div>
        </div>

        <div className="contentCol">
          <header className="header">
            <h3 className="title">{entry.title}</h3>
            <p className="author">{entry.subtitle}</p>
          </header>

          <p className="desc">{entry.shortDescription}</p>

          <ul className="bullets">
            {entry.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>

          <div className="actions">
            {entry.pdfUrl ? (
              <a href={entry.pdfUrl} download className="btn btnPrimary">
                {labels.downloadPdf}
              </a>
            ) : null}
            {entry.teaserUrl ? (
              <a href={entry.teaserUrl} target="_blank" rel="noopener noreferrer" className="btn btnSecondary">
                {labels.watchTeaser}
              </a>
            ) : null}
            {entry.seriesUrl ? (
              <a href={entry.seriesUrl} target="_blank" rel="noopener noreferrer" className="btn btnPill">
                {entry.seriesLabel ?? labels.openSeries}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
