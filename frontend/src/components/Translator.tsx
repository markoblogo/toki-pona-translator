import { useState } from 'react';
import { mapToSitelenEmoji } from '../utils/mappings';

type TranslationResult = {
    sourceLang: string;
    tokiPonaWords: string[];
    explanation: string;
};

const Translator: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState<TranslationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'latin' | 'pona' | 'emoji'>('latin');
    const [error, setError] = useState<string | null>(null);

    const handleTranslate = async () => {
        if (!inputText.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText }),
            });

            if (!response.ok) {
                throw new Error('Translation failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError('Failed to translate. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderOutput = () => {
        if (!result) return null;

        const words = result.tokiPonaWords;

        switch (mode) {
            case 'latin':
                return <div className="text-xl font-mono">{words.join(' ')}</div>;
            case 'pona':
                // Assuming a sitelen pona font is loaded globally as 'linja-pona'
                return <div className="text-4xl sitelen-pona-text">{words.join(' ')}</div>;
            case 'emoji':
                return <div className="text-4xl">{mapToSitelenEmoji(words)}</div>;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col gap-4">
                    <div>
                        <label className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 block">Input Text</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Enter text in any language. The app will auto-detect and translate to Toki Pona.</p>
                    </div>
                    <textarea
                        className="w-full h-48 p-4 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 dark:text-white transition-all"
                        placeholder="Type anything here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        maxLength={500}
                    />
                    <div className="flex justify-between items-center text-sm">
                        <span className={`${inputText.length >= 500 ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                            {inputText.length}/500 chars
                        </span>
                        <button
                            onClick={handleTranslate}
                            disabled={loading || !inputText.trim()}
                            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Translating...' : 'Translate'}
                        </button>
                    </div>
                    {error && <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}
                </div>

                {/* Output Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <label className="text-lg font-bold text-gray-900 dark:text-gray-100">Translation</label>
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => setMode('latin')}
                                className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${mode === 'latin'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                                Latin
                            </button>
                            <button
                                onClick={() => setMode('pona')}
                                className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${mode === 'pona'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                                sitelen pona
                            </button>
                            <button
                                onClick={() => setMode('emoji')}
                                className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${mode === 'emoji'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                                Emoji
                            </button>
                        </div>
                    </div>

                    <div className="w-full h-48 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 overflow-auto flex items-center justify-center text-center">
                        {result ? renderOutput() : <span className="text-gray-400">Translation will appear here</span>}
                    </div>

                    {result && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Explanation</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{result.explanation}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Detected Language: {result.sourceLang}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Translator;
