import { useEffect, useMemo, useState } from 'react';
import Translator from './components/Translator';
import Learn from './components/Learn';
import Footer from './components/Footer';
import KitPage from './pages/KitPage';
import SiteHeader from './components/SiteHeader';

type Route = 'app' | 'kit';

function App() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const route: Route = useMemo(() => {
    if (path === '/kit' || path === '/kit/') return 'kit';
    return 'app';
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
    return <KitPage />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <SiteHeader
        title="Toki Pona Translator"
        active={activeTab}
        onNavigate={navigate}
      />

      <main className="flex-grow">{activeTab === 'translate' ? <Translator /> : <Learn />}</main>

      <Footer />
    </div>
  );
}

export default App;
