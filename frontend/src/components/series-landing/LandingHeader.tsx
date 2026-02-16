export default function LandingHeader() {
  return (
    <header className="headerBar">
      <div className="inner">
        <div className="brand">
          <span className="brandMark">&gt;</span>
          <a href="/kit" className="brandTitle">Toki Reader Kits</a>
        </div>

        <nav className="nav" aria-label="Site navigation">
          <a className="navLink" href="/">Translator</a>
          <a className="navLink" href="/learn">Learn</a>
          <a className="navLink" href="/kit">Kit</a>
          <a className="navLink" href="#more-books">More books</a>
          <a className="navLink" href="#faq">FAQ</a>
          <a className="navLink navLinkActive" href="https://stoic.abvx.xyz/" target="_blank" rel="noopener noreferrer">
            Toki Stoic
          </a>
        </nav>
      </div>
    </header>
  );
}
