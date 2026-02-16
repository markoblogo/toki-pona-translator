import type { SeriesLandingConfig } from './types';

type FAQProps = {
  faq: SeriesLandingConfig['faq'];
};

export default function FAQ({ faq }: FAQProps) {
  return (
    <section id={faq.id} className="mt-14">
      <header className="text-center">
        <h2 className="font-serif text-4xl leading-tight text-[#111827]">{faq.title}</h2>
        {faq.subtitle ? <p className="mt-2 text-sm text-black/70">{faq.subtitle}</p> : null}
      </header>

      <div className="mt-6 space-y-3">
        {faq.items.map((item) => (
          <details key={item.q} className="card-gloss overflow-hidden px-5 py-4">
            <summary className="cursor-pointer list-none text-base font-semibold text-[#111827]">{item.q}</summary>
            <p className="pt-3 text-sm leading-relaxed text-black/75">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
