import type { LandingEntry, SeriesLandingConfig } from './types';

type HeroProps = {
  hero: SeriesLandingConfig['hero'];
  entries: LandingEntry[];
};

export default function Hero({ hero, entries }: HeroProps) {
  const first = entries[0];
  const second = entries[1];

  return (
    <section className="hero section">
      <div className="container">
        <div className="leftCol">
          <h1 className="title">{hero.title}</h1>
          <p className="subtitle">{hero.lead}</p>
          <div className="actions">
            <a href={hero.primaryCtaHref} className="btn btn-accent">
              {hero.primaryCtaLabel}
            </a>
          </div>
          {hero.note ? <p className="note">{hero.note}</p> : null}
        </div>

        <div className="rightCol">
          <div className="showcase">
            {second ? (
              <img
                src={second.coverImage}
                alt={`${second.title} cover`}
                className="cover backCover"
                loading="eager"
                width={560}
                height={800}
              />
            ) : null}
            {first ? (
              <img
                src={first.coverImage}
                alt={`${first.title} cover`}
                className="cover frontCover"
                loading="eager"
                width={560}
                height={800}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
