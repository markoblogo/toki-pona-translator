

const Learn: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6">Learn Toki Pona</h2>

            <div className="grid gap-6">
                <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-3">Official / Standard Resources</h3>
                    <ul className="list-disc list-inside space-y-2 text-blue-600 dark:text-blue-400">
                        <li><a href="https://tokipona.org/" target="_blank" rel="noopener noreferrer" className="hover:underline">tokipona.org</a> - The official website</li>
                        <li><a href="https://devurandom.xyz/tokipona/" target="_blank" rel="noopener noreferrer" className="hover:underline">Toki Pona: The Language of Good</a> - The official book (pu) info</li>
                    </ul>
                </section>

                <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-3">Dictionaries & Tools</h3>
                    <ul className="list-disc list-inside space-y-2 text-blue-600 dark:text-blue-400">
                        <li><a href="https://linku.la/" target="_blank" rel="noopener noreferrer" className="hover:underline">Linku</a> - The most comprehensive dictionary</li>
                        <li><a href="http://tokipona.net/tp/janpije/okamasona.php" target="_blank" rel="noopener noreferrer" className="hover:underline">o kama sona e toki pona!</a> - A classic course</li>
                    </ul>
                </section>

                <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-3">Writing Systems</h3>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                        Toki Pona has several writing systems. The most common alternative to Latin is <strong>sitelen pona</strong>, a logographic script.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-blue-600 dark:text-blue-400">
                        <li><a href="https://www.kreativekorp.com/software/fonts/sitelenselikiwen/" target="_blank" rel="noopener noreferrer" className="hover:underline">sitelen selikiwen</a> - A font for sitelen pona</li>
                        <li><a href="https://jonathangabel.com/toki-pona/" target="_blank" rel="noopener noreferrer" className="hover:underline">Jonathan Gabel's Lessons</a> - Learn sitelen sitelen</li>
                    </ul>
                </section>

                <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-3">Sitelen Emoji / Sitelen Pilin</h3>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                        <strong>Sitelen Emoji</strong> (also known as sitelen pilin) is an emoji-based adaptation inspired by sitelen pona.
                        Each Toki Pona word is mapped to one or more emojis that suggest its meaning.
                        There is no single official standard; many community projects and experiments exist.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-blue-600 dark:text-blue-400">
                        <li><a href="https://www.reddit.com/r/sitelenEmoji/" target="_blank" rel="noopener noreferrer" className="hover:underline">r/sitelenEmoji</a> - Reddit community</li>
                        <li><a href="https://play.google.com/store/apps/details?id=com.gboard.sitelenemoji" target="_blank" rel="noopener noreferrer" className="hover:underline">Sitelen Emoji Keyboard</a> - Example Android App</li>
                        <li><a href="https://sona.pona.la/wiki/Sitelen_Emoji" target="_blank" rel="noopener noreferrer" className="hover:underline">Sitelen Emoji Wiki</a> - Community Wiki</li>
                    </ul>
                </section>
                <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-3">From the creator</h3>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                        Additional resources created by the author of this app.
                    </p>
                    <ul className="space-y-4 text-blue-600 dark:text-blue-400">
                        <li>
                            <a href="https://www.amazon.com/dp/B0FV3F1RC5" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline block">
                                Meditations of Marcus Aurelius — in Toki Pona
                            </a>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                A Toki Pona translation of Marcus Aurelius' <em>Meditations</em>, featuring sitelen pona script, an introduction to the language, and a glossary. Designed for beginners and philosophy enthusiasts alike.
                            </p>
                        </li>
                        <li>
                            <a href="https://www.amazon.com/dp/B0G1N2YHD8" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline block">
                                A Christmas Carol — in Toki Pona
                            </a>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Charles Dickens' classic <em>A Christmas Carol</em> presented as a bilingual edition. Includes sitelen pona script and illustrations, making it a great resource for learners and literature fans.
                            </p>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Learn;
