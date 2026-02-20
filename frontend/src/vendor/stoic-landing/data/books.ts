export interface LocalizedString {
    en: string;
    tp: string;
}

export interface BookIdentifiers {
    asinKindle?: string;
    asinPrint?: string;
    isbn13Print?: string;
}

export interface Book {
    id: string; // The slug (folder name)
    type: 'commercial' | 'gift';
    title: LocalizedString;
    author: LocalizedString;
    coverImage: string;
    promoImage: string;
    amazonKindleUrl?: string;
    amazonPrintUrl?: string;
    downloadPdfUrl?: string;
    downloadEpubUrl?: string;
    teaserVideoId?: string;
    shortDescription: LocalizedString;
    longDescription: LocalizedString;

    identifiers?: BookIdentifiers;
}

export const books: Book[] = [
    {
        id: "marcus-meditations",
        type: 'commercial',
        title: {
            en: "Meditations of Marcus Aurelius — in Toki Pona",
            tp: "lipu “Meditations” pi jan Maku — lon toki pona"
        },
        author: {
            en: "Marcus Aurelius",
            tp: "jan Makusi Ojeliju"
        },
        coverImage: "/assets/books/marcus-meditations/cover.webp",
        promoImage: "/assets/books/marcus-meditations/promo.webp",
        amazonKindleUrl: "https://www.amazon.com/dp/B0FV3F1RC5",
        amazonPrintUrl: "https://www.amazon.com/dp/B0FVLPD69K",
        identifiers: {
            asinKindle: 'B0FV3F1RC5',
            asinPrint: 'B0FVLPD69K',
            isbn13Print: '979-8268811124',
        },
        teaserVideoId: "ILN2qILESH0",
        shortDescription: {
            en: "A minimalist Stoic classic, reimagined in the world’s simplest language.",
            tp: "lipu ni li lipu suli pi nasin stoic."
        },
        longDescription: {
            en: "What happens when ancient Stoic wisdom meets the world’s simplest language? “Meditations of Marcus Aurelius — in Toki Pona” invites readers to rediscover the timeless reflections of the Roman emperor through the lens of Toki Pona — a constructed language built on simplicity, clarity, and harmony. Each passage is carefully rendered in Toki Pona and mirrored in sitelen pona. This edition includes the full translation, an introduction, and a glossary/reading guide.",
            tp: "toki ona li kama lon toki pona, li lon sitelen Lasina en sitelen pona. sina ken lukin e toki lili lon tenpo suno ale, la pilin en lawa li kama pona."
        }
    },
    {
        id: "epictetus-enchiridion",
        type: 'commercial',
        title: {
            en: "Epictetus: The Enchiridion in toki pona",
            tp: "jan Epiteto: lipu Enkilijon lon toki pona"
        },
        author: {
            en: "Epictetus",
            tp: "jan Epiteto"
        },
        coverImage: "/assets/books/epictetus-enchiridion/cover.webp",
        promoImage: "/assets/books/epictetus-enchiridion/promo.webp",
        amazonKindleUrl: "https://www.amazon.com/dp/B0GKWR5NL1",
        amazonPrintUrl: "https://www.amazon.com/dp/B0GKXXJGZV",
        teaserVideoId: "DNgkm9tf6Cg",
        shortDescription: {
            en: "A compact Stoic manual for clear choices under pressure: learn what is in your control, what is not, and how to act without noise.",
            tp: "lipu Enkilijon li lipu lili pi sona Sito. ona li pana e nasin pi lawa insa: ijo li lon pali mi, ijo li lon pali ala mi. ona li pona tawa tenpo pi wile mute en tenpo pi pilin pakala."
        },
        longDescription: {
            en: "The Enchiridion is a practical handbook: short chapters meant to be revisited, especially when life gets loud. This edition reimagines Epictetus in toki pona for a calmer, more inspectable kind of reading. What you get in this volume: Public-domain English reference text (Elizabeth Carter, 1758) for comparison. Two-layer toki pona reading format: Latin script + the same line repeated for sitelen pona. A reading method designed for slow progress: small daily units, repetition, and “What is the instruction?” as the main question. Links to the free beginner kit and the series page. Created & curated by Biletskyi-Volokh Anton.",
            tp: "lipu Enkilijon li lipu pi nasin pali. lipu lili mute li lon. sina ken lukin e wan, sina awen, sina kepeken sona ona lon tenpo suno. lipu ni li ante e toki pi jan Epiteto kepeken toki pona, tawa ni: lukin li nasa ala, lawa li ken awen. ijo lon lipu ni: toki Inli pi lipu pi jan Elizabeth Carter tawa lukin ante. toki pona lon sitelen Lasina, en toki sama lon sitelen pona. nasin pi lukin lili lon tenpo mute: o lukin e lipu lili, o awen, o pana e sona ona tawa tenpo suno. nasin pona: “toki pona pi lipu ni li wile ni: sina ken lukin e pali wile.” sina ken kama jo e lipu pona pi kama sona, e lipu pi kulupu lipu, lon nimi lon lipu."
        }
    },
    {
        id: "seneca-shortness-of-life",
        type: 'commercial',
        title: {
            en: "Seneca: On the Shortness of Life in toki pona",
            tp: "jan Seneka — lipu pi tenpo lili pi lon — lon toki pona"
        },
        author: {
            en: "Seneca",
            tp: "jan Seneka"
        },
        coverImage: "/assets/books/seneca-shortness-of-life/cover.webp",
        promoImage: "/assets/books/seneca-shortness-of-life/promo.webp",
        amazonKindleUrl: "https://www.amazon.com/dp/B0GKCJ72PG",
        amazonPrintUrl: "https://www.amazon.com/dp/B0GL1ZBK18",
        teaserVideoId: "_JL2xu4Sn70",
        shortDescription: {
            en: "A sharp, calming reminder that life isn’t “too short” — we simply waste much of it. Readable, practical Stoic advice on attention, priorities, and reclaiming your days, reimagined in toki pona.",
            tp: "lipu ni li pana e sona pi tenpo: tenpo li lili ala; mi weka e tenpo mute. lipu ni li pana e nasin pona tawa lawa en pali, li toki e ni: o kama jo sin e tenpo sina — lon toki pona."
        },
        longDescription: {
            en: "“Life is short” is the common complaint. Seneca’s answer is tougher and more useful: the problem isn’t the length of life, but what we trade it for. This short classic is a practical guide to noticing waste, resisting distraction, and investing your days on purpose. This edition is part of Stoic Wisdom in Toki Pona — classic Stoic texts reimagined in the world’s simplest language. The English text is public domain; the toki pona version is a new creative work, written to keep the language clean, small, and readable while preserving Seneca’s practical force. Reading help is built into the edition: the translation keeps key phrases stable so repeated ideas stay easy to spot, and the glossary is designed around recurring “anchor patterns.” You can also start with the free Reader’s Kit and links provided in the book.",
            tp: "jan mute li toki e ni: “tenpo mi li lili.” taso jan Seneka li toki wawa: tenpo li lili ala; mi weka e tenpo mute. lipu ni li pana e nasin pona tawa ni: o lukin e weka pi tenpo, o awen e lawa, o kepeken tenpo kepeken wile pona. lipu ni li lon kulupu Stoic Wisdom in Toki Pona. toki Inli li tan lipu pi jan ala. toki pona li pali sin, li pali tawa ni: toki pi jan Seneka li awen wawa, taso toki li awen pona, li awen lili, li awen ken lukin. toki pona lon lipu ni li awen sama lon ijo suli: nimi li awen sama la, sina ken lukin e ijo sama lon tenpo mute. lipu pi nimi pi pana sona li pana e nasin tan kulupu pi toki sama. sina wile open la, lipu “Reader’s Kit” en nasin pi sitelen pona li lon (kepeken nimi pi pana tawa sina)."
        }
    },
    {
        id: "cicero-on-duties",
        type: 'commercial',
        title: {
            en: "Cicero: On Duties (De Officiis) in toki pona — with sitelen pona",
            tp: "jan Sise: lipu pi pali wile pona lon toki pona; sitelen pona kin"
        },
        author: {
            en: "Cicero",
            tp: "jan Sise"
        },
        coverImage: "/assets/books/cicero-on-duties/cover.webp",
        promoImage: "/assets/books/cicero-on-duties/promo.webp",
        amazonKindleUrl: "https://www.amazon.com/dp/B0GL86LVF1",
        amazonPrintUrl: "https://www.amazon.com/dp/B0GLFN8KBX",
        teaserVideoId: "61dVZDB-tYs",
        shortDescription: {
            en: "A practical handbook for moral decision-making in real life—promises, reputation, money, public duty, friendship, and pressure—reimagined in toki pona with sitelen pona for slow, clear rereading.",
            tp: "lipu ni li pana e nasin pi pali wile pona lon tenpo ale. ona li pana e toki pona en sitelen pona tawa lukin sin, tawa lawa insa pi awen pona."
        },
        longDescription: {
            en: "Cicero’s On Duties is built for the hardest everyday question: what to do when advantage pulls one way and conscience pulls another. This edition keeps the public-domain English reference text for comparison, then presents a full toki pona translation in two reading layers—Latin script and sitelen pona—so you can reread the same claims with fresh attention. Book I lays the foundation: what moral rightness is, where it comes from, and how it becomes practical rules you can carry into any situation. Book II tests “useful” choices in work, wealth, reputation, favors, and public life. Book III is the stress test: when the honorable and the useful seem to clash, Cicero argues that real advantage can’t be built on injustice—and that “benefit” bought by wrongdoing is a hidden debt paid later by you or the community.",
            tp: "lipu ni li lon kulupu pi sona pona stoika lon toki pona. toki Inli li lon tawa lukin ante; toki pona li pali sin, li awen pona, li awen lili, li awen ken lukin. sitelen pona kin li lon tawa lukin sin, tawa pali pi lawa insa. lipu Book I li pana e open: ona li toki e ni: pali wile pona li seme, ona li kama tan seme, ona li kama nasin pi pali lon tenpo ale. lipu Book II li alasa e pona tawa kulupu lon mani, lon pali, lon nimi, lon pana pona, lon pali pi kulupu. lipu Book III li wile e pona pi awen: pona pi lon ala li ken kama tan pali ike. sina pali ike tawa jan, sina pakala e toki, anu sina pakala e nasin pona sina la, “pona” ni li len taso; ona li kama ike lon tenpo kama tawa sina anu tawa kulupu."
        }
    },
    {
        id: "readers-kit",
        type: 'gift',
        title: {
            en: "The Toki Pona Reader’s Kit (Free PDF)",
            tp: "ilo lipu pi toki pona (lipu pi mani ala)"
        },
        author: {
            en: "ABV & Pythagoras",
            tp: "ABV en jan Pitakola"
        },
        coverImage: "/assets/books/readers-kit/cover.webp",
        promoImage: "/assets/books/readers-kit/promo.webp",
        // TODO: migrate to toki-free.abvx.xyz equivalent when the new direct PDF path is confirmed.
        downloadPdfUrl: "https://toki.abvx.xyz/kit.pdf",
        teaserVideoId: "F7fSBElppzI",
        shortDescription: {
            en: "A beginner-friendly entry point into reading toki pona with philosophical texts — plus the full practice text: The Golden Verses of Pythagoras.",
            tp: "lipu ni li pona tawa jan sin."
        },
        longDescription: {
            en: "Download it, learn the cues, and use it as your fast start before diving into the series.",
            tp: "ona li pana e nasin pi lukin lipu lon toki pona, li jo kin e lipu ale pi “The Golden Verses of Pythagoras”. o kama jo e lipu, o kama sona lili, la sina ken tawa lipu pi kulupu ni."
        }
    }
];
