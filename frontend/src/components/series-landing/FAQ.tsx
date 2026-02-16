import type { SeriesLandingConfig } from './types';

type FAQProps = {
  faq: SeriesLandingConfig['faq'];
};

export default function FAQ({ faq }: FAQProps) {
  return (
    <section id={faq.id} className="section faqSection">
      <header className="header">
        <h2 className="title">{faq.title}</h2>
        {faq.subtitle ? <p className="subtitle">{faq.subtitle}</p> : null}
      </header>

      <div className="list">
        {faq.items.map((item) => (
          <details key={item.q} className="item">
            <summary className="question">{item.q}</summary>
            <div className="answer">
              <p>{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
