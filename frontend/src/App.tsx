import { useEffect, useMemo, useState } from 'react';
import Translator from './components/Translator';
import Learn from './components/Learn';
import Footer from './components/Footer';
import KitPage from './pages/KitPage';

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
            {/* Minimal Header */}
            <header className="bg-white border-b border-[#E5E7EB]">
                <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-[#22C55E] text-xl font-bold">&gt;</span>
                        <h1 className="text-lg font-semibold text-[#111827]">Toki Pona Translator</h1>
                    </div>
                    <nav className="flex gap-6 items-center">
                        <a
                            href="/kit"
                            className="text-sm font-medium text-[#6B7280] hover:text-[#111827] hover:underline"
                        >
                            Kit
                        </a>
                        <button
                            onClick={() => setActiveTab('translate')}
                            className={`text-sm font-medium transition-colors ${activeTab === 'translate'
                                    ? 'text-[#111827]'
                                    : 'text-[#6B7280] hover:text-[#111827]'
                                }`}
                        >
                            Translate
                        </button>
                        <button
                            onClick={() => setActiveTab('learn')}
                            className={`text-sm font-medium transition-colors ${activeTab === 'learn'
                                    ? 'text-[#111827]'
                                    : 'text-[#6B7280] hover:text-[#111827] hover:underline'
                                }`}
                        >
                            Learn
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {activeTab === 'translate' ? <Translator /> : <Learn />}
            </main>

            <Footer />
        </div>
    );
}

export default App;
