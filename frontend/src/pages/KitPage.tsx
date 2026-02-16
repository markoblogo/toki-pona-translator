import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { KIT_FAQ, KIT_FEATURES, READER_KITS, type Kit } from '@/data/kits';

function FreeBadge({ text = 'FREE' }: { text?: string }) {
  return (
    <div className="absolute -top-3 -right-3 z-10 select-none">
      <div className="h-14 w-14 rotate-[-10deg] rounded-full bg-[#E53935] shadow-[0_12px_30px_rgba(0,0,0,0.20)]">
        <div className="flex h-full w-full items-center justify-center rounded-full border-[3px] border-white">
          <div className="flex h-[86%] w-[86%] items-center justify-center rounded-full border-2 border-white/70 border-dashed">
            <span className="text-xs font-black tracking-widest text-white">{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KitSection({ kit, reverse }: { kit: Kit; reverse?: boolean }) {
  const gridClass = reverse ? 'lg:grid-cols-[1fr,1.05fr]' : 'lg:grid-cols-[1.05fr,1fr]';

  return (
    <section id={kit.slug} className="border-t border-black/8 py-12 sm:py-14">
      <div className={`grid gap-8 items-center ${gridClass} lg:gap-12`}>
        <div className={reverse ? 'lg:order-2' : ''}>
          <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
            <img
              src={kit.promoImage}
              alt={`${kit.title} promo`}
              className="h-auto w-full"
              loading="lazy"
              width={1440}
              height={900}
            />
          </div>
        </div>

        <div className={reverse ? 'lg:order-1' : ''}>
          <header>
            <h2 className="font-serif text-3xl leading-tight text-[#111827] sm:text-4xl">{kit.title}</h2>
            <p className="mt-2 text-sm font-semibold tracking-wide text-black/55">{kit.subtitle}</p>
          </header>

          <p className="mt-4 text-base leading-relaxed text-black/80">{kit.shortDescription}</p>

          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-black/80">
            {kit.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="mt-[2px] text-[#22C55E]">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={kit.pdfUrl}
              download
              className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Download PDF
            </a>
            <a
              href={kit.teaserUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-black/30 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
            >
              Watch teaser
            </a>
            <a
              href={kit.seriesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[#22C55E]/30 bg-[#ECFDF3] px-5 py-2.5 text-sm font-semibold text-[#166534] transition hover:bg-[#dcfce7]"
            >
              {kit.seriesLabel}
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
      <SiteHeader title="The Toki Pona Reader’s Kits" active="kit" />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="font-serif text-4xl leading-tight text-[#111827] sm:text-5xl">The Toki Pona Reader’s Kits</h1>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-black/80">
              Free beginner-friendly guides to reading toki pona through real philosophical texts. Download the PDF, then
              watch the teaser video as a quick visual tour.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#free-books"
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/90"
              >
                Free books
              </a>
              <a
                href="#faq"
                className="inline-flex items-center justify-center rounded-full border border-black/30 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
              >
                FAQ
              </a>
            </div>
            <p className="mt-3 text-xs text-black/55">Free for personal use (non-commercial). No signup.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {READER_KITS.map((kit) => (
              <article key={kit.id} className="relative mx-auto w-full max-w-[230px]">
                {kit.badges?.includes('FREE') ? <FreeBadge /> : null}
                <img
                  src={kit.coverImage}
                  alt={`${kit.title} cover`}
                  className="h-auto w-full rounded-xl border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.14)]"
                  loading="eager"
                  width={560}
                  height={800}
                />
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <header>
            <h2 className="font-serif text-3xl leading-tight text-[#111827]">Why these kits?</h2>
            <p className="mt-2 text-sm text-black/70">A fast way to start reading, even if you’re new to toki pona.</p>
          </header>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {KIT_FEATURES.map((feature) => (
              <article key={feature.title} className="card-gloss p-5">
                <h3 className="text-base font-semibold text-[#111827]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/75">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div id="free-books" className="mt-14">
          {READER_KITS.map((kit, index) => (
            <KitSection key={kit.id} kit={kit} reverse={index % 2 === 1} />
          ))}
        </div>

        <section className="mt-4">
          <header>
            <h2 className="font-serif text-3xl leading-tight text-[#111827]">More books</h2>
            <p className="mt-2 text-sm text-black/70">Start with a kit. Continue with the series if the format clicks.</p>
          </header>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {READER_KITS.map((kit) => (
              <article key={`more-${kit.id}`} className="card-gloss overflow-hidden p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={kit.coverImage}
                    alt={`${kit.title} cover thumbnail`}
                    className="h-20 w-16 rounded-md border border-black/10 object-cover"
                    loading="lazy"
                    width={140}
                    height={220}
                  />
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-[#111827] line-clamp-2">{kit.title}</h3>
                    <p className="mt-1 text-xs text-black/60 line-clamp-2">{kit.subtitle}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <a
                        href={kit.pdfUrl}
                        download
                        className="inline-flex items-center justify-center rounded-full border border-black/20 bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-black/[0.03]"
                      >
                        Download PDF
                      </a>
                      <a
                        href={kit.seriesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-[#22C55E]/30 bg-[#ECFDF3] px-3 py-1.5 text-xs font-semibold text-[#166534] transition hover:bg-[#dcfce7]"
                      >
                        Open series
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs text-black/55">Free for personal use (non-commercial). No signup.</p>
        </section>

        <section id="faq" className="mt-14">
          <header className="text-center">
            <h2 className="font-serif text-4xl leading-tight text-[#111827]">FAQ</h2>
          </header>

          <div className="mt-6 space-y-3">
            {KIT_FAQ.map((item) => (
              <details key={item.question} className="card-gloss overflow-hidden px-5 py-4">
                <summary className="cursor-pointer list-none text-base font-semibold text-[#111827]">
                  {item.question}
                </summary>
                <p className="pt-3 text-sm leading-relaxed text-black/75">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
