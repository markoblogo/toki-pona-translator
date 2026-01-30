type BannerLinkProps = {
  href: string;
  title: string;
  subtitle: string;
  icon?: string;
};

function BannerLink({ href, title, subtitle, icon = '>' }: BannerLinkProps) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="group block rounded-2xl border border-black/10 bg-white px-5 py-4 shadow-sm transition hover:border-black/20 hover:shadow"
    >
      <div className="flex items-start gap-3">
        <span className={`text-2xl font-bold leading-none ${icon === '>' ? 'text-[#22C55E]' : 'text-[#111]'}`}>{icon}</span>
        <div className="min-w-0">
          <div className="text-base font-semibold leading-tight text-[#111827] line-clamp-2">{title}</div>
          <div className="mt-1 text-sm leading-relaxed text-[#6B7280] line-clamp-1">{subtitle}</div>
        </div>
      </div>
    </a>
  );
}

const LINKS = {
  medium: 'https://abvcreative.medium.com/',
  substack: 'https://abvx.substack.com/',
  github: 'https://github.com/markoblogo',
} as const;

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-black/10 pt-8">
      <div className="grid gap-3 md:grid-cols-3">
        <BannerLink
          href="/"
          title="Toki Pona Translator"
          subtitle="Type in any language. Get Toki Pona in Latin, sitelen pona, or emoji."
          icon=">"
        />
        <BannerLink
          href="https://stoic.abvx.xyz"
          title="Stoic Wisdom Series"
          subtitle="Stoic classics reimagined in toki pona (EN / TP)."
          icon="S"
        />
        <BannerLink
          href="https://ukrmodernism.abvx.xyz/fr"
          title="Ukrainian Modernism"
          subtitle="Ukrainian modernist novels — translated into French."
          icon="M"
        />
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
  );
}
