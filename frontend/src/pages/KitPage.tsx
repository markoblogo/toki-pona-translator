import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { FAQ_ITEMS, LANDING_CONTENT, LANDING_ITEMS, MORE_ITEMS, type LandingItem } from '@/data/kits';

function FreeBadge() {
  return (
    <div className="absolute -top-4 -right-4 z-10 select-none">
      <div className="h-16 w-16 rotate-[-10deg] rounded-full bg-[#E53935] shadow-[0_12px_30px_rgba(0,0,0,0.20)]">
        <div className="flex h-full w-full items-center justify-center rounded-full border-[3px] border-white">
          <div className="flex h-[86%] w-[86%] items-center justify-center rounded-full border-2 border-white/70 border-dashed">
            <span className="text-sm font-black tracking-widest text-white">FREE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemSection({ item, reverse = false }: { item: LandingItem; reverse?: boolean }) {
  const imageCol = reverse ? 'lg:order-2' : '';
  const contentCol = reverse ? 'lg:order-1' : '';

  return (
    <section id={item.id} className="border-t border-black/8 py-12 sm:py-14">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr,1fr] lg:gap-12">
        <div className={imageCol}>
          <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
            {item.type === 'gift' ? <FreeBadge /> : null}
            <img src={item.promoImage} alt={`${item.title} promo`} className="h-auto w-full" loading="lazy" width={1400} height={900} />
          </div>
        </div>

        <div className={contentCol}>
          <header>
            <h2 className="font-serif text-3xl leading-tight text-[#111827] sm:text-4xl">{item.title}</h2>
            <p className="mt-2 text-sm font-semibold tracking-wide text-black/55">{item.author}</p>
          </header>

          <p className="mt-4 text-base leading-relaxed text-black/80">{item.shortDesc}</p>
          <p className="mt-3 text-sm leading-relaxed text-black/70">{item.longDesc}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {item.type === 'gift' ? (
              <>
                {item.downloadPdfUrl ? (
                  <a
                    href={item.downloadPdfUrl}
                    download
                    className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/90"
                  >
                    Download PDF
                  </a>
                ) : null}
                {item.downloadEpubUrl ? (
                  <a
                    href={item.downloadEpubUrl}
                    download
                    className="inline-flex items-center justify-center rounded-full border border-black/30 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
                  >
                    Download EPUB
                  </a>
                ) : null}
              </>
            ) : (
              <>
                {item.kindleUrl ? (
                  <a
                    href={item.kindleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/90"
                  >
                    Kindle edition
                  </a>
                ) : null}
                {item.printUrl ? (
                  <a
                    href={item.printUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-black/30 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
                  >
                    Paperback
                  </a>
                ) : null}
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            {item.teaserUrl ? (
              <a href={item.teaserUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[#111827] hover:underline">
                ▶ Watch teaser
              </a>
            ) : null}
            <a href={item.detailsUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[#111827] underline underline-offset-4">
              {item.detailsLabel ?? 'Learn more'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function KitPage() {
  return (
    <div className="min-h-screen bg-white text-[#111]">
      <SiteHeader title={LANDING_CONTENT.hero.title} active="kit" />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="font-serif text-4xl leading-tight text-[#111827] sm:text-5xl">{LANDING_CONTENT.hero.title}</h1>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-black/80">{LANDING_CONTENT.hero.subtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#collection"
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/90"
              >
                {LANDING_CONTENT.hero.primaryCta}
              </a>
              <a
                href="#faq"
                className="inline-flex items-center justify-center rounded-full border border-black/30 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
              >
                {LANDING_CONTENT.hero.secondaryCta}
              </a>
            </div>
            {'note' in LANDING_CONTENT.hero ? (
              <p className="mt-3 text-xs text-black/55">{LANDING_CONTENT.hero.note}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {LANDING_ITEMS.slice(0, 5).map((item) => (
              <div key={item.id} className="mx-auto w-full max-w-[210px]">
                <img
                  src={item.coverImage}
                  alt={`${item.title} cover`}
                  className="h-auto w-full rounded-xl border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.14)]"
                  loading="eager"
                  width={420}
                  height={640}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-serif text-3xl leading-tight text-[#111827]">{LANDING_CONTENT.why.title}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {LANDING_CONTENT.why.cards.map((card) => (
              <article key={card.title} className="card-gloss p-5">
                <h3 className="text-base font-semibold text-[#111827]">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/75">{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="collection" className="mt-14">
          <h2 className="font-serif text-3xl leading-tight text-[#111827]">{LANDING_CONTENT.listTitle}</h2>
          {LANDING_ITEMS.map((item, index) => (
            <ItemSection key={item.id} item={item} reverse={index % 2 === 1} />
          ))}
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-3xl leading-tight text-[#111827]">{LANDING_CONTENT.moreTitle}</h2>
          <p className="mt-2 text-sm text-black/70">{LANDING_CONTENT.moreSubtitle}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {MORE_ITEMS.map((item) => (
              <article key={item.id} className="card-gloss overflow-hidden p-4">
                <img src={item.coverImage} alt={`${item.title} cover`} className="h-48 w-full rounded-lg object-cover" loading="lazy" />
                <h3 className="mt-3 text-sm font-semibold leading-snug text-[#111827]">{item.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.downloadPdfUrl ? (
                    <a
                      href={item.downloadPdfUrl}
                      download
                      className="inline-flex items-center rounded-full border border-black/20 px-3 py-1 text-xs font-semibold text-black hover:bg-black/[0.03]"
                    >
                      Download PDF
                    </a>
                  ) : item.kindleUrl ? (
                    <a
                      href={item.kindleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-black/20 px-3 py-1 text-xs font-semibold text-black hover:bg-black/[0.03]"
                    >
                      Kindle
                    </a>
                  ) : null}
                  {item.teaserUrl ? (
                    <a
                      href={item.teaserUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-black/20 px-3 py-1 text-xs font-semibold text-black hover:bg-black/[0.03]"
                    >
                      Teaser
                    </a>
                  ) : null}
                  <a
                    href={item.detailsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-[#22C55E]/40 bg-[#ECFDF3] px-3 py-1 text-xs font-semibold text-[#166534] hover:bg-[#dcfce7]"
                  >
                    {item.detailsLabel ?? 'Learn more'}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="mt-14">
          <header className="text-center">
            <h2 className="font-serif text-4xl leading-tight text-[#111827]">{LANDING_CONTENT.faqTitle}</h2>
            <p className="mt-2 text-sm text-black/70">{LANDING_CONTENT.faqSubtitle}</p>
          </header>

          <div className="mt-6 space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="card-gloss overflow-hidden px-5 py-4">
                <summary className="cursor-pointer list-none text-base font-semibold text-[#111827]">{item.q}</summary>
                <p className="pt-3 text-sm leading-relaxed text-black/75">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
