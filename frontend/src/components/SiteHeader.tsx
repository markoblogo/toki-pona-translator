type SiteHeaderProps = {
  title: string;
  active?: 'translate' | 'learn' | 'kit';
  /** If provided, we do client-side navigation for Translate/Learn without page reload */
  onNavigate?: (to: '/' | '/learn') => void;
};

export default function SiteHeader({ title, active, onNavigate }: SiteHeaderProps) {
  const NavLink = ({
    href,
    label,
    isActive,
    clientNav,
  }: {
    href: string;
    label: string;
    isActive?: boolean;
    clientNav?: '/' | '/learn';
  }) => (
    <a
      href={href}
      onClick={(e) => {
        if (clientNav && onNavigate) {
          e.preventDefault();
          onNavigate(clientNav);
        }
      }}
      className={`text-sm font-medium transition-colors ${
        isActive ? 'text-[#111827]' : 'text-[#6B7280] hover:text-[#111827] hover:underline'
      }`}
    >
      {label}
    </a>
  );

  return (
    <header className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[#22C55E] text-xl font-bold">&gt;</span>
          <h1 className="text-lg font-semibold text-[#111827]">{title}</h1>
        </div>

        <nav className="flex gap-6 items-center">
          <NavLink href="/" label="Translate" isActive={active === 'translate'} clientNav="/" />
          <NavLink href="/learn" label="Learn" isActive={active === 'learn'} clientNav="/learn" />
          <NavLink href="/kit" label="Kit" isActive={active === 'kit'} />

          <a
            href="https://stoic.abvx.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#6B7280] hover:text-[#111827] hover:underline"
          >
            Toki Stoic
          </a>
        </nav>
      </div>
    </header>
  );
}
