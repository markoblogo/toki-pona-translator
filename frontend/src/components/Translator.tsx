import { useState } from 'react';
import { mapToSitelenEmoji } from '../utils/mappings';
import { API_BASE_URL } from '../config/api';

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
            const response = await fetch(`${API_BASE_URL}/api/translate`, {
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
                return <div className="text-xl font-mono text-[#111827]">{words.join(' ')}</div>;
            case 'pona':
                return <div className="text-4xl sitelen-pona-text text-[#111827]">{words.join(' ')}</div>;
            case 'emoji':
                return <div className="text-4xl">{mapToSitelenEmoji(words)}</div>;
            default:
                return null;
        }
    };

    return (
        <div className="py-12 px-4">
            {/* Hero Section */}
            <div className="max-w-5xl mx-auto text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
                    Translate into Toki Pona
                </h2>
                <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
                    Type in any language. Get Toki Pona in Latin, sitelen pona, or emoji.
                </p>
            </div>

            {/* Cards Container */}
            <div className="max-w-5xl mx-auto">
                {/* Input/Output Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Input Card */}
                    <div className="card">
                        <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wide mb-3">
                            Input Text
                        </label>
                        <textarea
                            className="w-full h-48 p-4 border border-[#E5E7EB] rounded-xl resize-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent bg-white text-[#111827] placeholder-[#9CA3AF] transition-all"
                            placeholder="Type anything here..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            maxLength={500}
                        />
                        <div className="flex justify-between items-center mt-4">
                            <span className={`text-xs ${inputText.length >= 500 ? 'text-[#F59E0B] font-medium' : 'text-[#9CA3AF]'}`}>
                                {inputText.length}/500 chars
                            </span>
                            <button
                                onClick={handleTranslate}
                                disabled={loading || !inputText.trim()}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Translating...' : 'Translate'}
                            </button>
                        </div>
                        {error && (
                            <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Output Card */}
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-xs font-semibold text-[#111827] uppercase tracking-wide">
                                Translation
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setMode('latin')}
                                    className={`btn-pill ${mode === 'latin' ? 'btn-pill-active' : 'btn-pill-inactive'}`}
                                >
                                    Latin
                                </button>
                                <button
                                    onClick={() => setMode('pona')}
                                    className={`btn-pill ${mode === 'pona' ? 'btn-pill-active' : 'btn-pill-inactive'}`}
                                >
                                    sitelen pona
                                </button>
                                <button
                                    onClick={() => setMode('emoji')}
                                    className={`btn-pill ${mode === 'emoji' ? 'btn-pill-active' : 'btn-pill-inactive'}`}
                                >
                                    Emoji
                                </button>
                            </div>
                        </div>

                        <div className="h-48 flex items-center justify-center bg-[#F9FAFB] rounded-xl p-6 border border-[#E5E7EB]">
                            {result ? (
                                renderOutput()
                            ) : (
                                <span className="text-[#9CA3AF]">Translation will appear here</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Explanation Card */}
                {result && (
                    <div className="card">
                        <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide mb-3">
                            Explanation
                        </h3>
                        <p className="text-[#6B7280] leading-relaxed mb-3">
                            {result.explanation}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">
                            Detected Language: <span className="font-medium text-[#6B7280]">{result.sourceLang}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Translator;
