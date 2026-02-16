import type { SeriesLandingConfig } from './types';

type FAQProps = {
  faq: SeriesLandingConfig['faq'];
};

export default function FAQ({ faq }: FAQProps) {
  return (
    <section id={faq.id} className="sl-section sl-faq">
      <header className="sl-header sl-header-center">
        <h2 className="sl-title-h2">{faq.title}</h2>
        {faq.subtitle ? <p className="sl-subtitle">{faq.subtitle}</p> : null}
      </header>

      <div className="sl-faq-list">
        {faq.items.map((item) => (
          <details key={item.q} className="sl-card sl-faq-item">
            <summary className="sl-faq-question">{item.q}</summary>
            <p className="sl-faq-answer">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
