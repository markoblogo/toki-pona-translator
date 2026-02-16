import type { SeriesLandingConfig } from './types';

type WhyProps = {
  why: SeriesLandingConfig['why'];
};

export default function Why({ why }: WhyProps) {
  return (
    <section className="section whySection">
      <header className="header">
        <h2 className="title">{why.title}</h2>
        {why.subtitle ? <p className="subtitle">{why.subtitle}</p> : null}
      </header>

      <div className="grid">
        {why.cards.map((card) => (
          <article key={card.title} className="card">
            <h3 className="cardTitle">{card.title}</h3>
            <p className="cardText">{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
