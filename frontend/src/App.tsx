import { useEffect, useMemo, useState } from 'react';
import Translator from './components/Translator';
import Learn from './components/Learn';
import Footer from './components/Footer';
import KitPage from './pages/KitPage';
import SiteHeader from './components/SiteHeader';

type Route = 'app' | 'kit';

function App() {
  const [activeTab, setActiveTab] = useState<'translate' | 'learn'>('translate');
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

  if (route === 'kit') {
    return <KitPage />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <SiteHeader
        title="Toki Pona Translator"
        active={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-grow">{activeTab === 'translate' ? <Translator /> : <Learn />}</main>

      <Footer />
    </div>
  );
}

export default App;
