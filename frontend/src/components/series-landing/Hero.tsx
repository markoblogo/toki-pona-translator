import type { LandingEntry, SeriesLandingConfig } from './types';

type HeroProps = {
  hero: SeriesLandingConfig['hero'];
  entries: LandingEntry[];
  targetId: string;
  faqId: string;
};

export default function Hero({ hero, entries, targetId, faqId }: HeroProps) {
  return (
    <section className="sl-hero">
      <div className="sl-hero-copy">
        <h1 className="sl-title-h1">{hero.title}</h1>
        <p className="sl-lead">{hero.lead}</p>

        <div className="sl-actions">
          <a href={`#${targetId}`} className="sl-btn sl-btn-primary">
            {hero.primaryCtaLabel}
          </a>
          <a href={`#${faqId}`} className="sl-btn sl-btn-secondary">
            {hero.secondaryCtaLabel}
          </a>
        </div>
        {hero.note ? <p className="sl-note">{hero.note}</p> : null}
        <p className="sl-stamp">Build: 2c0c9b6</p>
      </div>

      <div className="sl-hero-covers">
        {entries.slice(0, 2).map((entry) => (
          <article key={entry.id} className="sl-cover-card">
            {entry.badges?.includes('FREE') ? (
              <div className="sl-free-badge" aria-hidden>
                <span>FREE</span>
              </div>
            ) : null}
            <img src={entry.coverImage} alt={`${entry.title} cover`} className="sl-cover-image" loading="eager" width={560} height={800} />
          </article>
        ))}
      </div>
    </section>
  );
}
