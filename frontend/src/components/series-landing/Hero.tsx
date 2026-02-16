import type { LandingEntry, SeriesLandingConfig } from './types';

type HeroProps = {
  hero: SeriesLandingConfig['hero'];
  entries: LandingEntry[];
};

export default function Hero({ hero, entries }: HeroProps) {
  const first = entries[0];
  const second = entries[1];

  return (
    <section className="sl-hero">
      <div className="sl-hero-copy">
        <h1 className="sl-title-h1">{hero.title}</h1>
        <p className="sl-lead">{hero.lead}</p>

        <div className="sl-actions">
          <a href={hero.primaryCtaHref} className="sl-btn sl-btn-primary">
            {hero.primaryCtaLabel}
          </a>
        </div>
        {hero.note ? <p className="sl-note">{hero.note}</p> : null}
      </div>

      <div className="sl-showcase" aria-label="Featured kits showcase">
        {second ? (
          <img
            src={second.coverImage}
            alt={`${second.title} cover`}
            className="sl-showcase-cover sl-showcase-cover-back"
            loading="eager"
            width={560}
            height={800}
          />
        ) : null}
        {first ? (
          <img
            src={first.coverImage}
            alt={`${first.title} cover`}
            className="sl-showcase-cover sl-showcase-cover-front"
            loading="eager"
            width={560}
            height={800}
          />
        ) : null}
      </div>
    </section>
  );
}
