import type { SeriesLandingConfig } from './types';

type WhyProps = {
  why: SeriesLandingConfig['why'];
};

export default function Why({ why }: WhyProps) {
  return (
    <section className="mt-14">
      <header>
        <h2 className="font-serif text-3xl leading-tight text-[#111827]">{why.title}</h2>
        {why.subtitle ? <p className="mt-2 text-sm text-black/70">{why.subtitle}</p> : null}
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {why.cards.map((card) => (
          <article key={card.title} className="card-gloss p-5">
            <h3 className="text-base font-semibold text-[#111827]">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/75">{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
