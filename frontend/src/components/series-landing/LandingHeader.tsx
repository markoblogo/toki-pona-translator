export default function LandingHeader() {
  return (
    <header className="sl-headerbar">
      <div className="sl-headerbar-inner">
        <a href="/" className="sl-brand" aria-label="Toki ABVX home">
          <span className="sl-brand-mark">&gt;</span>
          <span className="sl-brand-text">Toki Reader Kits</span>
        </a>

        <nav className="sl-nav" aria-label="Primary">
          <a href="/" className="sl-nav-link">Translate</a>
          <a href="/learn" className="sl-nav-link">Learn</a>
          <a href="/kit" className="sl-nav-link is-active">Kit</a>
          <a href="https://stoic.abvx.xyz/" target="_blank" rel="noopener noreferrer" className="sl-nav-link">Toki Stoic</a>
        </nav>
      </div>
    </header>
  );
}
