import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { KIT_FAQ, KIT_FEATURES, READER_KITS, type Kit } from '@/data/kits';

function FreeBadge({ text = 'FREE' }: { text?: string }) {
  return (
    <div className="absolute -top-4 -right-4 z-10 select-none">
      <div className="h-16 w-16 rotate-[-10deg] rounded-full bg-[#E53935] shadow-[0_12px_30px_rgba(0,0,0,0.20)]">
        <div className="flex h-full w-full items-center justify-center rounded-full border-[3px] border-white">
          <div className="flex h-[86%] w-[86%] items-center justify-center rounded-full border-2 border-white/70 border-dashed">
            <span className="text-sm font-black tracking-widest text-white">{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KitCard({ kit }: { kit: Kit }) {
  return (
    <article className="card-gloss overflow-hidden p-5 sm:p-6">
      <div className="grid gap-5 md:grid-cols-[160px,1fr] md:items-start">
        <div className="relative mx-auto w-full max-w-[190px] md:mx-0">
          {kit.badges?.includes('FREE') ? <FreeBadge text="FREE" /> : null}
          <img
            src={kit.coverImage}
            alt={`${kit.title} cover`}
            className="h-auto w-full rounded-xl border border-black/10 bg-white shadow-[0_15px_35px_rgba(0,0,0,0.14)]"
            loading="lazy"
            width={560}
            height={800}
          />
        </div>

        <div>
          <h3 className="font-serif text-2xl leading-tight text-[#111827]">{kit.title}</h3>
          <p className="mt-1 text-sm font-semibold tracking-wide text-black/55">{kit.subtitle}</p>
          <p className="mt-4 text-sm leading-relaxed text-black/80">{kit.shortDescription}</p>

          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-black/80">
            {kit.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="mt-[2px] text-[#22C55E]">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-3">
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
            {kit.seriesLink ? (
              <a
                href={kit.seriesLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#22C55E]/30 bg-[#ECFDF3] px-5 py-2.5 text-sm font-semibold text-[#166534] transition hover:bg-[#dcfce7]"
              >
                {kit.seriesLink.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function KitPage() {
  return (
    <div className="min-h-screen bg-white text-[#111]">
      <SiteHeader title="Toki Pona Reader's Kits" active="kit" />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="font-serif text-4xl leading-tight text-[#111827] sm:text-5xl">The Toki Pona Reader's Kits</h1>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-black/80">
              Free beginner-friendly guides to reading toki pona through real philosophical texts.
              <br />
              Download the PDF, then watch the teaser video as a quick visual tour.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
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
              <div key={kit.id} className="mx-auto w-full max-w-[230px]">
                <img
                  src={kit.coverImage}
                  alt={`${kit.title} cover`}
                  className="h-auto w-full rounded-xl border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.14)]"
                  loading="eager"
                  width={560}
                  height={800}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-serif text-3xl leading-tight text-[#111827]">Why these kits?</h2>
          <p className="mt-2 text-sm text-black/70">A fast way to start reading, even if you're new to toki pona.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {KIT_FEATURES.map((feature) => (
              <article key={feature.title} className="card-gloss p-5">
                <h3 className="text-base font-semibold text-[#111827]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/75">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="free-books" className="mt-14">
          <h2 className="font-serif text-3xl leading-tight text-[#111827]">Free books</h2>
          <p className="mt-2 text-sm text-black/70">Start with a kit. Continue with the series if the format clicks.</p>

          <div className="mt-6 grid gap-5">
            {READER_KITS.map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>

          <p className="mt-5 text-xs text-black/55">Free for personal use (non-commercial). No signup.</p>
        </section>

        <section className="mt-14 rounded-2xl border border-black/10 bg-white/60 p-6">
          <h2 className="font-serif text-3xl leading-tight text-[#111827]">Want more after the kit?</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-black/75">
            These kits are the "start here" entry points for each series. The full books continue with the same layout and
            translation anchors.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href="https://stoic.abvx.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-black/10 bg-white px-5 py-4 transition hover:border-black/20 hover:shadow"
            >
              <div className="text-base font-semibold text-[#111827]">Stoic Wisdom in toki pona</div>
              <div className="mt-1 text-sm text-black/60">Open series</div>
            </a>
            <a
              href="https://dao-toki.abvx.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-black/10 bg-white px-5 py-4 transition hover:border-black/20 hover:shadow"
            >
              <div className="text-base font-semibold text-[#111827]">Chinese Wisdom in toki pona</div>
              <div className="mt-1 text-sm text-black/60">Open series</div>
            </a>
          </div>
        </section>

        <section id="faq" className="mt-14">
          <h2 className="font-serif text-3xl leading-tight text-[#111827]">FAQ</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {KIT_FAQ.map((item) => (
              <article key={item.question} className="card-gloss p-5">
                <h3 className="text-base font-semibold text-[#111827]">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/75">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
