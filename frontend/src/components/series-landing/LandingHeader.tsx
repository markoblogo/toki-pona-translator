import type { SeriesLandingConfig } from './types';

type Props = {
  lang: 'en' | 'tp';
  nav: SeriesLandingConfig['nav'];
};

export default function LandingHeader({ lang, nav }: Props) {
  const langPath = lang === 'tp' ? 'tp' : 'en';

  return (
    <header className="headerBar">
      <div className="inner">
        <div className="brand">
          <span className="brandMark">&gt;</span>
          <a href={`https://toki-free.abvx.xyz/${langPath}`} className="brandTitle">{lang === 'tp' ? 'lipu pona' : 'Toki Reader Kits'}</a>
        </div>

        <nav className="nav" aria-label="Site navigation">
          <a className="navLink" href="/">{nav.translator}</a>
          <a className="navLink" href="/learn">{nav.learn}</a>
          <a className="navLink" href={`https://toki-free.abvx.xyz/${langPath}`}>{nav.kit}</a>
          <a className="navLink" href="#more-books">{nav.moreBooks}</a>
          <a className="navLink" href="#faq">{nav.faq}</a>
          <a className="navLink navLinkActive" href={`/${lang === 'tp' ? 'tp' : 'en'}`} target="_blank" rel="noopener noreferrer">
            {nav.stoic}
          </a>
          <a className={`navLink ${lang === 'en' ? 'navLinkActive' : ''}`} href="https://toki-free.abvx.xyz/en">EN</a>
          <span className="navSep">/</span>
          <a className={`navLink ${lang === 'tp' ? 'navLinkActive' : ''}`} href="https://toki-free.abvx.xyz/tp">TP</a>
        </nav>
      </div>
    </header>
  );
}
