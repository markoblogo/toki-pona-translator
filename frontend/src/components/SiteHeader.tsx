type SiteHeaderProps = {
  title: string;
  active?: 'translate' | 'learn' | 'kit';
  onSelectTab?: (tab: 'translate' | 'learn') => void;
};

export default function SiteHeader({ title, active, onSelectTab }: SiteHeaderProps) {
  const NavLink = ({ href, label, isActive }: { href: string; label: string; isActive?: boolean }) => (
    <a
      href={href}
      className={`text-sm font-medium transition-colors ${
        isActive ? 'text-[#111827]' : 'text-[#6B7280] hover:text-[#111827] hover:underline'
      }`}
    >
      {label}
    </a>
  );

  const NavButton = ({ label, tab }: { label: string; tab: 'translate' | 'learn' }) => (
    <button
      type="button"
      onClick={() => onSelectTab?.(tab)}
      className={`text-sm font-medium transition-colors ${
        active === tab ? 'text-[#111827]' : 'text-[#6B7280] hover:text-[#111827]'
      } ${active !== tab ? 'hover:underline' : ''}`}
    >
      {label}
    </button>
  );

  return (
    <header className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[#22C55E] text-xl font-bold">&gt;</span>
          <h1 className="text-lg font-semibold text-[#111827]">{title}</h1>
        </div>

        <nav className="flex gap-6 items-center">
          {/* Translator */}
          {onSelectTab ? (
            <>
              <NavButton label="Translate" tab="translate" />
              <NavButton label="Learn" tab="learn" />
            </>
          ) : (
            <>
              <NavLink href="/" label="Translator" isActive={active === 'translate'} />
              <NavLink href="/" label="Learn" isActive={active === 'learn'} />
            </>
          )}

          {/* Kit */}
          <NavLink href="/kit" label="Kit" isActive={active === 'kit'} />

          {/* Stoic */}
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
