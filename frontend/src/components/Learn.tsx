
const Learn: React.FC = () => {
    return (
        <div className="py-12 px-4">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
                    Learn Toki Pona
                </h2>
                <p className="text-lg text-[#6B7280]">
                    Resources to help you learn the world's simplest language
                </p>
            </div>

            {/* Cards Container */}
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Official Resources */}
                <section className="card">
                    <h3 className="text-lg font-bold text-[#111827] mb-4">Official / Standard Resources</h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="https://tokipona.org/" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium">
                                tokipona.org
                            </a>
                            <span className="text-[#9CA3AF]"> — The official website</span>
                        </li>
                        <li>
                            <a href="https://devurandom.xyz/tokipona/" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium">
                                Toki Pona: The Language of Good
                            </a>
                            <span className="text-[#9CA3AF]"> — The official book (pu) info</span>
                        </li>
                    </ul>
                </section>

                {/* Dictionaries & Tools */}
                <section className="card">
                    <h3 className="text-lg font-bold text-[#111827] mb-4">Dictionaries & Tools</h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="https://linku.la/" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium">
                                Linku
                            </a>
                            <span className="text-[#9CA3AF]"> — The most comprehensive dictionary</span>
                        </li>
                        <li>
                            <a href="http://tokipona.net/tp/janpije/okamasona.php" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium">
                                o kama sona e toki pona!
                            </a>
                            <span className="text-[#9CA3AF]"> — A classic course</span>
                        </li>
                    </ul>
                </section>

                {/* Writing Systems */}
                <section className="card">
                    <h3 className="text-lg font-bold text-[#111827] mb-4">Writing Systems</h3>
                    <p className="text-[#6B7280] mb-4 leading-relaxed">
                        Toki Pona has several writing systems. The most common alternative to Latin is <strong className="text-[#111827]">sitelen pona</strong>, a logographic script.
                    </p>
                    <ul className="space-y-3">
                        <li>
                            <a href="https://www.kreativekorp.com/software/fonts/sitelenselikiwen/" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium">
                                sitelen selikiwen
                            </a>
                            <span className="text-[#9CA3AF]"> — A font for sitelen pona</span>
                        </li>
                        <li>
                            <a href="https://jonathangabel.com/toki-pona/" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium">
                                Jonathan Gabel's Lessons
                            </a>
                            <span className="text-[#9CA3AF]"> — Learn sitelen sitelen</span>
                        </li>
                    </ul>
                </section>

                {/* Sitelen Emoji */}
                <section className="card">
                    <h3 className="text-lg font-bold text-[#111827] mb-4">Sitelen Emoji / Sitelen Pilin</h3>
                    <p className="text-[#6B7280] mb-4 leading-relaxed">
                        <strong className="text-[#111827]">Sitelen Emoji</strong> (also known as sitelen pilin) is an emoji-based adaptation inspired by sitelen pona.
                        Each Toki Pona word is mapped to one or more emojis that suggest its meaning.
                        There is no single official standard; many community projects and experiments exist.
                    </p>
                    <ul className="space-y-3">
                        <li>
                            <a href="https://www.reddit.com/r/sitelenEmoji/" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium">
                                r/sitelenEmoji
                            </a>
                            <span className="text-[#9CA3AF]"> — Reddit community</span>
                        </li>
                        <li>
                            <a href="https://play.google.com/store/apps/details?id=com.gboard.sitelenemoji" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium">
                                Sitelen Emoji Keyboard
                            </a>
                            <span className="text-[#9CA3AF]"> — Example Android App</span>
                        </li>
                        <li>
                            <a href="https://sona.pona.la/wiki/Sitelen_Emoji" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium">
                                Sitelen Emoji Wiki
                            </a>
                            <span className="text-[#9CA3AF]"> — Community Wiki</span>
                        </li>
                    </ul>
                </section>

                {/* From the Creator */}
                <section className="card">
                    <h3 className="text-lg font-bold text-[#111827] mb-4">From the Creator</h3>
                    <p className="text-[#6B7280] mb-4">
                        Additional resources created by the author of this app.
                    </p>
                    <div className="space-y-5">
                        <div>
                            <a href="https://www.amazon.com/dp/B0FV3F1RC5" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-semibold text-base">
                                Meditations of Marcus Aurelius — in Toki Pona
                            </a>
                            <p className="text-sm text-[#6B7280] mt-1.5 leading-relaxed">
                                A Toki Pona translation of Marcus Aurelius' <em>Meditations</em>, featuring sitelen pona script, an introduction to the language, and a glossary. Designed for beginners and philosophy enthusiasts alike.
                            </p>
                        </div>
                        <div>
                            <a href="https://www.amazon.com/dp/B0G1N2YHD8" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-semibold text-base">
                                A Christmas Carol — in Toki Pona
                            </a>
                            <p className="text-sm text-[#6B7280] mt-1.5 leading-relaxed">
                                Charles Dickens' classic <em>A Christmas Carol</em> presented as a bilingual edition. Includes sitelen pona script and illustrations, making it a great resource for learners and literature fans.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Learn;
