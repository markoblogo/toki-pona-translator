import type { SeriesLandingConfig } from './types';

type WhyProps = {
  why: SeriesLandingConfig['why'];
};

export default function Why({ why }: WhyProps) {
  return (
    <section className="sl-section sl-why">
      <header className="sl-header">
        <h2 className="sl-title-h2">{why.title}</h2>
        {why.subtitle ? <p className="sl-subtitle">{why.subtitle}</p> : null}
      </header>

      <div className="sl-feature-grid">
        {why.cards.map((card) => (
          <article key={card.title} className="sl-card sl-feature-card">
            <h3 className="sl-title-h3">{card.title}</h3>
            <p className="sl-text">{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
