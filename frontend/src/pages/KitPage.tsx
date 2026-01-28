type BannerLinkProps = {
  href: string;
  title: string;
  subtitle: string;
};

function BannerLink({ href, title, subtitle }: BannerLinkProps) {
  return (
    <a
      href={href}
      className="group block rounded-2xl border border-[#E5E7EB] bg-white px-6 py-5 shadow-sm transition hover:border-[#D1D5DB] hover:shadow"
    >
      <div className="flex items-start gap-3">
        <span className="text-[#22C55E] text-2xl font-bold leading-none">&gt;</span>
        <div>
          <div className="text-lg font-semibold leading-tight text-[#111827]">{title}</div>
          <div className="mt-1 text-sm leading-relaxed text-[#6B7280]">{subtitle}</div>
        </div>
      </div>
    </a>
  );
}

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

const LINKS = {
  medium: 'https://abvcreative.medium.com/',
  substack: 'https://abvx.substack.com/',
  github: 'https://github.com/markoblogo',
} as const;

export default function KitPage() {
  return (
    <div className="min-h-screen bg-white text-[#111]">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Copy */}
          <div>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
              The Toki Pona Reader’s Kit
            </h1>

            <p className="mt-4 max-w-prose text-base leading-relaxed text-black/80">
              A free beginner-friendly guide to reading toki pona through short philosophical texts —
              including <em>The Golden Verses of Pythagoras</em> (full text). Download the PDF, then
              use the teaser video as a quick tour before you start reading.
            </p>

            <div className="mt-8 rounded-2xl border border-black/10 bg-white/60 p-5">
              <h2 className="text-xl font-semibold">ilo lipu pi toki pona</h2>
              <p className="mt-2 text-sm leading-relaxed text-black/80">
                lipu ni li pona tawa jan sin: ona li pana e nasin pi kama sona lon toki pona kepeken
                lipu pi toki sona. lipu ni li jo kin e lipu ale pi “The Golden Verses of Pythagoras”.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/kit.pdf"
                download
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
              >
                Download PDF
              </a>
              <a
                href="https://youtu.be/F7fSBElppzI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-black/30 bg-white/70 px-5 py-3 text-sm font-semibold text-black transition hover:bg-white"
              >
                Watch teaser
              </a>
            </div>
          </div>

          {/* Cover */}
          <div className="mx-auto w-full max-w-sm">
            <div className="relative">
              <FreeBadge />
              <div className="group overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.14)]">
                <img
                  src="/kit-cover.jpg"
                  alt="The Toki Pona Reader’s Kit cover"
                  className="h-auto w-full transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.015] group-hover:rotate-[0.25deg]"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 border-t border-black/10 pt-8">
          <div className="grid gap-3 md:grid-cols-2">
            <BannerLink
              href="/"
              title="Toki Pona Translator"
              subtitle="Type in any language. Get Toki Pona in Latin, sitelen pona, or emoji."
            />
            <div className="rounded-2xl border border-black/10 bg-white/40 px-5 py-4 text-sm text-black/60">
              Series page: coming soon.
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-black/50">
            <span>© {new Date().getFullYear()} </span>
            <a
              href="https://abvx.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-black/20 underline-offset-4 hover:text-black"
            >
              ABVX.xyz
            </a>
            <a
              href={LINKS.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-black/20 underline-offset-4 hover:text-black"
            >
              Medium
            </a>
            <a
              href={LINKS.substack}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-black/20 underline-offset-4 hover:text-black"
            >
              Substack
            </a>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-black/20 underline-offset-4 hover:text-black"
            >
              GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
