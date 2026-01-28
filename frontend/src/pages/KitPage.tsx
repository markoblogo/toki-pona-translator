type BannerLinkProps = {
  href: string;
  title: string;
  subtitle: string;
};

function BannerLink({ href, title, subtitle }: BannerLinkProps) {
  return (
    <a
      href={href}
      className="block rounded-2xl border border-black/10 bg-white/60 px-5 py-4 transition hover:bg-white"
    >
      <div className="text-sm font-semibold text-black">{title}</div>
      <div className="mt-1 text-sm text-black/70">{subtitle}</div>
    </a>
  );
}

function FreeBadge() {
  return (
    <div className="absolute -top-4 -right-4 z-10">
      <div className="h-16 w-16 rounded-full border-2 border-black bg-white shadow-sm">
        <div className="flex h-full w-full items-center justify-center rounded-full border border-black/20">
          <span className="text-xs font-bold tracking-widest text-black">FREE</span>
        </div>
      </div>
    </div>
  );
}

const LINKS = {
  medium: 'https://medium.com/@abvx',
  substack: 'https://abvx.substack.com',
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
              <div className="overflow-hidden rounded-xl border border-black/15 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                <img
                  src="/kit-cover.jpg"
                  alt="The Toki Pona Reader’s Kit cover"
                  className="h-auto w-full"
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
              title="Translate into Toki Pona"
              subtitle="A browser-based translator with Latin + sitelen pona output."
            />
            <div className="rounded-2xl border border-black/10 bg-white/40 px-5 py-4 text-sm text-black/60">
              Series page: coming soon.
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-black/50">
            <span>© {new Date().getFullYear()} ABVX.xyz</span>
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
