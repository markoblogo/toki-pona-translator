
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
                            <a href="https://sona.pona.la/wiki/Sitelen_Emoji" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium">
                                Sitelen Emoji Wiki
                            </a>
                            <span className="text-[#9CA3AF]"> — Community Wiki</span>
                        </li>
                    </ul>
                </section>

                {/* Articles & essays */}
                <section className="card">
                    <h3 className="text-lg font-bold text-[#111827] mb-4">Articles & essays</h3>
                    <ul className="space-y-6">
                        <li>
                            <a href="https://abvcreative.medium.com/i-built-a-google-translate-for-toki-pona-and-it-broke-my-brain-in-the-best-possible-way-354dc934c99c" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium block">
                                I Built a “Google Translate” for Toki Pona — and It Broke My Brain in the Best Possible Way
                            </a>
                            <p className="text-sm text-[#6B7280] mt-1">
                                A behind-the-scenes story of building this translator, what broke, and what I learned about Toki Pona and AI along the way.
                            </p>
                        </li>
                        <li>
                            <a href="https://abvcreative.medium.com/the-tiny-language-that-teaches-ai-to-think-and-humans-to-calm-down-410e9e376b0f" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium block">
                                The Tiny Language That Teaches AI To Think (And Humans To Calm Down)
                            </a>
                            <p className="text-sm text-[#6B7280] mt-1">
                                How Toki Pona works as a mental tool for clarity, focus, and working with large language models.
                            </p>
                        </li>
                        <li>
                            <a href="https://abvcreative.medium.com/the-smallest-language-that-punches-above-its-weight-and-why-i-translated-meditations-into-toki-8c4998ba2e94" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium block">
                                The Smallest Language That Punches Above Its Weight (and Why I Translated Meditations into Toki Pona)
                            </a>
                            <p className="text-sm text-[#6B7280] mt-1">
                                Why a minimalist language is surprisingly powerful for philosophy, translation, and creative work.
                            </p>
                        </li>
                    </ul>
                </section>

                {/* Reader's Kit */}
                <section className="card">
                    <h3 className="text-lg font-bold text-[#111827] mb-4">Free Reader’s Kit</h3>
                    <p className="text-[#6B7280] mb-4 leading-relaxed">
                        A beginner-friendly PDF to start reading toki pona with short philosophical texts (includes a full text).
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a href="/kit" className="text-[#22C55E] hover:underline font-semibold">Open the kit landing</a>
                        <a href="/kit.pdf" className="text-[#22C55E] hover:underline font-medium" download>Download PDF</a>
                        <a href="https://youtu.be/F7fSBElppzI" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium">Watch teaser</a>
                    </div>
                </section>

                {/* From the Creator */}
                <section className="card">
                    <h3 className="text-lg font-bold text-[#111827] mb-4">From the Creator</h3>
                    <p className="text-[#6B7280] mb-4">
                        Additional resources created by the author of this app.
                    </p>
                    <div className="space-y-6">
                        {/* Book 1 */}
                        <div>
                            <a href="https://www.amazon.com/dp/B0FV3F1RC5" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-semibold text-base">
                                Meditations of Marcus Aurelius — in Toki Pona
                            </a>
                            <p className="text-sm text-[#6B7280] mt-1.5 leading-relaxed">
                                A Toki Pona translation of Marcus Aurelius' <em>Meditations</em>, with sitelen pona script, an intro to the language, and a glossary. Designed for beginners in both Stoicism and Toki Pona.
                            </p>
                        </div>
                        {/* Book 2 */}
                        <div>
                            <a href="https://www.amazon.com/dp/B0G1N2YHD8" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-semibold text-base">
                                A Christmas Carol — in Toki Pona
                            </a>
                            <p className="text-sm text-[#6B7280] mt-1.5 leading-relaxed">
                                Charles Dickens' classic <em>A Christmas Carol</em> retold in Toki Pona with parallel sitelen pona script and atmospheric illustrations. A bilingual edition for learners and literature fans.
                            </p>
                        </div>
                        {/* Book 3 */}
                        <div>
                            <a href="https://www.amazon.com/dp/B0G4XNRS4W" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-semibold text-base">
                                Dao De Jing (Tao Te Ching): Chinese text with Toki Pona in sitelen pona
                            </a>
                            <p className="text-sm text-[#6B7280] mt-1.5 leading-relaxed">
                                A visual bilingual edition of the Dao De Jing: original Chinese text paired with Toki Pona in sitelen pona. Includes a brief guide and chapter-by-chapter plates for readers interested in Daoism, Toki Pona, and experimental script design.
                            </p>
                        </div>
                        {/* Book 4 */}
                        <div>
                            <a href="https://www.amazon.com/dp/B0G44JSMR2" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-semibold text-base">
                                Toki Pona and the Machine Mind
                            </a>
                            <p className="text-sm text-[#6B7280] mt-1.5 leading-relaxed">
                                A practical field guide to using Toki Pona as a design tool for AI: cleaner prompts, constrained prompt languages, and small language models. Written for engineers, builders, and Toki Pona enthusiasts who want more predictable, minimal systems.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="text-center pb-8">
                    <p className="text-[#6B7280]">
                        Feedback or ideas? Reach me via my site <a href="https://abvx.xyz" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline">abvx.xyz</a> or <a href="https://github.com/markoblogo/toki-pona-translator" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline">open an issue on GitHub</a>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Learn;
