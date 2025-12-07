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
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        if (!result) return;
        let text = '';
        switch (mode) {
            case 'latin':
            case 'pona':
                text = result.tokiPonaWords.join(' ');
                break;
            case 'emoji':
                text = mapToSitelenEmoji(result.tokiPonaWords);
                break;
        }

        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

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
            console.error('Translation error details:', err);
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
                            className="w-full h-48 p-4 border border-[#E5E7EB] rounded-xl resize-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent bg-white text-[#111827] placeholder-[#9CA3AF] transition-all disabled:bg-gray-50 disabled:text-gray-400"
                            placeholder="Type anything here..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            maxLength={500}
                            disabled={loading}
                        />
                        <div className="flex justify-between items-center mt-4">
                            <span className={`text-xs ${inputText.length >= 500 ? 'text-[#F59E0B] font-medium' : 'text-[#9CA3AF]'}`}>
                                {inputText.length}/500 chars
                            </span>
                            <button
                                onClick={handleTranslate}
                                disabled={loading || !inputText.trim()}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading && (
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
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
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <div className="flex items-center gap-4">
                                <label className="text-xs font-semibold text-[#111827] uppercase tracking-wide">
                                    Translation
                                </label>
                                {/* Segmented Control Group */}
                                <div className="flex bg-[#F3F4F6] p-1 rounded-lg">
                                    <button
                                        onClick={() => setMode('latin')}
                                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'latin' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}`}
                                    >
                                        Latin
                                    </button>
                                    <button
                                        onClick={() => setMode('pona')}
                                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'pona' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}`}
                                    >
                                        sitelen pona
                                    </button>
                                    <button
                                        onClick={() => setMode('emoji')}
                                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'emoji' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}`}
                                    >
                                        Emoji
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleCopy}
                                disabled={!result}
                                className="px-3 py-1.5 text-sm font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg hover:bg-gray-50 hover:text-[#111827] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                                title="Copy to clipboard"
                            >
                                {isCopied ? (
                                    <>
                                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-green-600">Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
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
