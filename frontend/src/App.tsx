import { useEffect, useMemo, useState } from 'react';
import Translator from './components/Translator';
import Learn from './components/Learn';
import Footer from './components/Footer';
import KitPage from './pages/KitPage';
import SiteHeader from './components/SiteHeader';
import AsciiThemeBoot from './components/AsciiThemeBoot';

type Route = 'app' | 'kit';

function getKitLang(pathname: string): 'en' | 'tp' | null {
  if (pathname === '/kit' || pathname === '/kit/') return null;
  if (pathname === '/kit/en' || pathname === '/kit/en/') return 'en';
  if (pathname === '/kit/tp' || pathname === '/kit/tp/') return 'tp';
  return null;
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (path === '/kit' || path === '/kit/') {
      window.history.replaceState({}, '', '/kit/en');
      setPath('/kit/en');
    }
  }, [path]);

  const route: Route = useMemo(() => {
    if (path.startsWith('/kit')) return 'kit';
    return 'app';
  }, [path]);

  const kitLang = useMemo<'en' | 'tp'>(() => {
    return getKitLang(path) ?? 'en';
  }, [path]);

  const activeTab = useMemo<'translate' | 'learn'>(() => {
    if (path === '/learn' || path === '/learn/') return 'learn';
    return 'translate';
  }, [path]);

  const navigate = (to: '/' | '/learn') => {
    if (window.location.pathname === to) return;
    window.history.pushState({}, '', to);
    setPath(to);
  };

  if (route === 'kit') {
    return (
      <>
        <AsciiThemeBoot />
        <KitPage lang={kitLang} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <AsciiThemeBoot />
      <SiteHeader title="Toki Pona Translator" active={activeTab} onNavigate={navigate} />

      <main className="flex-grow">{activeTab === 'translate' ? <Translator /> : <Learn />}</main>

      <Footer />
    </div>
  );
}

export default App;
