import { useState } from 'react';
import Translator from './components/Translator';
import Learn from './components/Learn';

import Footer from './components/Footer';

function App() {
    const [activeTab, setActiveTab] = useState<'translate' | 'learn'>('translate');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col">
            <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Toki Pona Translator</h1>
                    <nav className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('translate')}
                            className={`px-4 py-2 rounded-lg transition-colors font-medium ${activeTab === 'translate'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}
                        >
                            Translate
                        </button>
                        <button
                            onClick={() => setActiveTab('learn')}
                            className={`px-4 py-2 rounded-lg transition-colors font-medium ${activeTab === 'learn'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}
                        >
                            Learn
                        </button>
                    </nav>
                </div>
            </header>

            <main className="flex-grow py-8">
                {activeTab === 'translate' ? <Translator /> : <Learn />}
            </main>

            <Footer />
        </div>
    );
}

export default App;
