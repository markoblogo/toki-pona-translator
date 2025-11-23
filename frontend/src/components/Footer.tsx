import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-12 py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-4xl mx-auto px-4 flex flex-col gap-2">
                <p>
                    Created by Anton Biletskyi-Volokh – Website: <a href="https://abvx.xyz" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 dark:text-blue-400">abvx.xyz</a> · GitHub: <a href="https://github.com/markoblogo" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 dark:text-blue-400">github.com/markoblogo</a>
                </p>
                <p>Powered by Gemini 3 • Built with React & Vite</p>
            </div>
        </footer>
    );
};

export default Footer;
