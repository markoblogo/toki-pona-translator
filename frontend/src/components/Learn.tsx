type LinkRow = {
    href: string;
    label: string;
    note: string;
};

type Book = {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    promoSrc: string;
    kindleUrl: string;
    paperbackUrl: string;
    teaserUrl: string;
};

const OFFICIAL_RESOURCES: Array<{ title: string; items: LinkRow[] }> = [
    {
        title: 'Official / Standard Resources',
        items: [
            { href: 'https://tokipona.org/', label: 'tokipona.org', note: 'The official website' },
        ],
    },
    {
        title: 'Dictionaries & Tools',
        items: [
            { href: 'https://linku.la/', label: 'Linku', note: 'The most comprehensive dictionary' },
            {
                href: 'http://tokipona.net/tp/janpije/okamasona.php',
                label: 'o kama sona e toki pona!',
                note: 'A classic course',
            },
        ],
    },
    {
        title: 'Writing Systems',
        items: [
            {
                href: 'https://www.kreativekorp.com/software/fonts/sitelenselikiwen/',
                label: 'sitelen selikiwen',
                note: 'A font for sitelen pona',
            },
            {
                href: 'https://jonathangabel.com/toki-pona/',
                label: "Jonathan Gabel's Lessons",
                note: 'Learn sitelen sitelen',
            },
        ],
    },
    {
        title: 'Sitelen Emoji / Sitelen Pilin',
        items: [
            { href: 'https://www.reddit.com/r/sitelenEmoji/', label: 'r/sitelenEmoji', note: 'Reddit community' },
            { href: 'https://sona.pona.la/wiki/Sitelen_Emoji', label: 'Sitelen Emoji Wiki', note: 'Community Wiki' },
        ],
    },
];

const ARTICLES: Array<{ href: string; title: string; desc: string }> = [
    {
        href: 'https://abvcreative.medium.com/i-built-a-google-translate-for-toki-pona-and-it-broke-my-brain-in-the-best-possible-way-354dc934c99c',
        title: 'I Built a “Google Translate” for Toki Pona — and It Broke My Brain in the Best Possible Way',
        desc: 'Behind the scenes of building this translator and what it taught me about toki pona and LLMs.',
    },
    {
        href: 'https://abvcreative.medium.com/the-tiny-language-that-teaches-ai-to-think-and-humans-to-calm-down-410e9e376b0f',
        title: 'The Tiny Language That Teaches AI To Think (And Humans To Calm Down)',
        desc: 'How toki pona works as a mental tool for clarity, focus, and working with large language models.',
    },
    {
        href: 'https://abvcreative.medium.com/the-smallest-language-that-punches-above-its-weight-and-why-i-translated-meditations-into-toki-8c4998ba2e94',
        title: 'The Smallest Language That Punches Above Its Weight (and Why I Translated Meditations into Toki Pona)',
        desc: 'Why a minimalist language is surprisingly powerful for philosophy, translation, and creative work.',
    },
];

const BOOKS: Book[] = [
    {
        id: 'dao',
        title: 'Dao De Jing (Tao Te Ching): Chinese text with Toki Pona in sitelen pona',
        subtitle: 'Chinese text with Toki Pona in sitelen pona',
        description:
            'A visual bilingual edition: classical Chinese on the left, toki pona in sitelen pona on the right — chapter-by-chapter plates with a compact reading guide.',
        promoSrc: '/promo/books/dao.jpg',
        kindleUrl: 'https://www.amazon.com/dp/B0G4XNRS4W',
        paperbackUrl: 'https://www.amazon.com/dp/B0G5MCFN2T',
        teaserUrl: 'https://youtu.be/oWA-_FatU3E',
    },
    {
        id: 'christmas',
        title: 'A Christmas Carol — in Toki Pona: Translated into the minimalist language Toki Pona',
        subtitle: 'Bilingual edition with sitelen pona',
        description:
            'Dickens retold through radical simplicity — toki pona text paired with sitelen pona and a calm, book-as-art layout.',
        promoSrc: '/promo/books/christmas.jpg',
        kindleUrl: 'https://www.amazon.com/dp/B0G1N2YHD8',
        paperbackUrl: 'https://www.amazon.com/dp/B0G1XVNPSL',
        teaserUrl: 'https://youtu.be/ammjR4v58CM',
    },
    {
        id: 'machine',
        title: 'Toki Pona and the Machine Mind: Designing cleaner prompts, smaller models, and better systems with the world’s simplest language',
        subtitle: 'Designing cleaner prompts, smaller models, and better systems',
        description:
            'A practical field guide: prompt compression, constrained DSLs, and predictable AI interfaces inspired by toki pona and its visual scripts.',
        promoSrc: '/promo/books/machine.jpg',
        kindleUrl: 'https://www.amazon.com/dp/B0G44JSMR2',
        paperbackUrl: 'https://www.amazon.com/dp/B0G5MQKZTX',
        teaserUrl: 'https://youtu.be/0juEOOI1iEM',
    },
];

const Learn: React.FC = () => {
    return (
        <div className="relative py-12 px-4">
            {/* Subtle hero glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.12),transparent_55%)]" />

            {/* Hero */}
            <div className="max-w-5xl mx-auto mb-10">
                <div className="card-gloss p-8 md:p-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">Learn Toki Pona</h2>
                    <p className="text-lg text-[#374151] max-w-2xl mx-auto">
                        A compact learning hub — official references, community tools, and my own books & resources.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">
                {/* My resources */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Kit */}
                    <a href="/kit" className="card-gloss overflow-hidden block hover:shadow-[0_22px_70px_rgba(15,23,42,0.10)] transition">
                        <div className="p-5">
                            <div className="text-[11px] font-semibold tracking-wide text-[#22C55E] uppercase">Free PDF</div>
                            <div className="mt-1 text-base font-semibold text-[#111827] leading-tight">The Reader’s Kit</div>
                            <div className="mt-2 text-sm text-[#6B7280] leading-relaxed">
                                Beginner-friendly entry point into reading toki pona (includes a full text).
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3 text-sm">
                                <span className="text-[#22C55E] font-semibold">Open</span>
                                <a className="text-[#22C55E] hover:underline" href="/kit.pdf" download onClick={(e) => e.stopPropagation()}>
                                    PDF
                                </a>
                                <a className="text-[#22C55E] hover:underline" href="https://youtu.be/F7fSBElppzI" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                    Teaser
                                </a>
                            </div>
                        </div>
                        <div className="border-t border-black/5">
                            <img src="/promo/card-kit.jpg" alt="" className="h-28 w-full object-cover" loading="lazy" />
                        </div>
                    </a>

                    {/* Emoji mapping */}
                    <a href="https://github.com/markoblogo/sitelen-emoji-truth" target="_blank" rel="noopener noreferrer" className="card-gloss overflow-hidden block hover:shadow-[0_22px_70px_rgba(15,23,42,0.10)] transition">
                        <div className="p-5">
                            <div className="text-[11px] font-semibold tracking-wide text-[#22C55E] uppercase">Dictionary</div>
                            <div className="mt-1 text-base font-semibold text-[#111827] leading-tight">sitelen-emoji-truth</div>
                            <div className="mt-2 text-sm text-[#6B7280] leading-relaxed">
                                The pinned “source of truth” mapping used by the translator’s emoji mode.
                            </div>
                            <div className="mt-4 text-sm text-[#22C55E] font-semibold">Open on GitHub →</div>
                        </div>
                        <div className="border-t border-black/5">
                            <img src="/promo/card-emoji.jpg" alt="" className="h-28 w-full object-cover" loading="lazy" />
                        </div>
                    </a>

                    {/* Stoic */}
                    <a href="https://stoic.abvx.xyz" target="_blank" rel="noopener noreferrer" className="card-gloss overflow-hidden block hover:shadow-[0_22px_70px_rgba(15,23,42,0.10)] transition">
                        <div className="p-5">
                            <div className="text-[11px] font-semibold tracking-wide text-[#22C55E] uppercase">Series</div>
                            <div className="mt-1 text-base font-semibold text-[#111827] leading-tight">Toki Stoic</div>
                            <div className="mt-2 text-sm text-[#6B7280] leading-relaxed">
                                Stoic classics reimagined in toki pona (EN/TP) with sitelen pona.
                            </div>
                            <div className="mt-4 text-sm text-[#22C55E] font-semibold">Open the series →</div>
                        </div>
                        <div className="border-t border-black/5">
                            <img src="/promo/card-stoic.jpg" alt="" className="h-28 w-full object-cover" loading="lazy" />
                        </div>
                    </a>
                </section>

                {/* Official resources (compact) */}
                <section className="card-gloss p-6">
                    <div className="flex items-baseline justify-between gap-4 flex-wrap">
                        <h3 className="text-lg font-bold text-[#111827]">Official & community resources</h3>
                        <span className="text-xs text-[#6B7280]">A short, high-signal list</span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {OFFICIAL_RESOURCES.map((group) => (
                            <div key={group.title}>
                                <div className="text-xs font-semibold tracking-wide text-[#22C55E] uppercase mb-3">{group.title}</div>
                                <ul className="space-y-2">
                                    {group.items.map((it) => (
                                        <li key={it.href} className="text-sm">
                                            <a href={it.href} target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline font-medium">
                                                {it.label}
                                            </a>
                                            <span className="text-[#9CA3AF]"> — {it.note}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Books (not in Stoic series) */}
                <section className="card-gloss p-6">
                    <div className="flex items-baseline justify-between gap-4 flex-wrap">
                        <h3 className="text-lg font-bold text-[#111827]">More books about toki pona</h3>
                        <span className="text-xs text-[#6B7280]">Not part of the Stoic series</span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {BOOKS.map((b) => (
                            <div
                                key={b.id}
                                className="group relative card-gloss overflow-hidden transition hover:shadow-[0_28px_90px_rgba(15,23,42,0.16)] hover:-translate-y-[2px]"
                            >
                                <div className="p-6">
                                    <div className="text-[11px] font-semibold tracking-wide text-[#22C55E] uppercase">Book</div>
                                    <div className="mt-1 text-lg font-semibold text-[#111827] leading-tight">{b.title}</div>
                                    <div className="mt-1 text-sm text-[#6B7280]">{b.subtitle}</div>
                                    <p className="mt-3 text-sm leading-relaxed text-[#374151]">{b.description}</p>

                                    <div className="mt-5 flex flex-wrap gap-3 text-sm">
                                        <a href={b.kindleUrl} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-inactive">
                                            Kindle
                                        </a>
                                        <a href={b.paperbackUrl} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-inactive">
                                            Paperback
                                        </a>
                                        <a href={b.teaserUrl} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-active">
                                            Teaser
                                        </a>
                                    </div>
                                </div>

                                <div className="border-t border-black/5">
                                    <img src={b.promoSrc} alt="" className="h-32 w-full object-cover" loading="lazy" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Articles */}
                <section className="card-gloss p-6">
                    <h3 className="text-lg font-bold text-[#111827]">Posts</h3>
                    <p className="text-sm text-[#6B7280] mt-2">Selected essays about toki pona, translation, and AI.</p>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {ARTICLES.map((a) => (
                            <a
                                key={a.href}
                                href={a.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="card-gloss p-5 hover:shadow-[0_22px_70px_rgba(15,23,42,0.10)] transition"
                            >
                                <div className="text-sm font-semibold text-[#111827] leading-tight">{a.title}</div>
                                <div className="mt-2 text-sm text-[#6B7280] leading-relaxed">{a.desc}</div>
                                <div className="mt-4 text-sm text-[#22C55E] font-semibold">Read →</div>
                            </a>
                        ))}
                    </div>
                </section>

                <section className="text-center pb-8">
                    <p className="text-[#6B7280]">
                        Feedback or ideas? Reach me via{' '}
                        <a href="https://abvx.xyz" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline">
                            abvx.xyz
                        </a>{' '}
                        or{' '}
                        <a
                            href="https://github.com/markoblogo/toki-pona-translator"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#22C55E] hover:underline"
                        >
                            open an issue on GitHub
                        </a>
                        .
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Learn;
