export type FeatureCard = {
  title: string;
  text: string;
};

export type LandingItem = {
  id: string;
  type: 'commercial' | 'gift';
  title: string;
  author: string;
  shortDesc: string;
  longDesc: string;
  coverImage: string;
  promoImage: string;
  teaserUrl?: string;
  kindleUrl?: string;
  printUrl?: string;
  downloadPdfUrl?: string;
  downloadEpubUrl?: string;
  detailsUrl: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export const LANDING_CONTENT = {
  hero: {
    title: 'Stoic Wisdom in Toki Pona',
    subtitle:
      'Classic Stoic texts reimagined in the world’s simplest language. Minimal words, clear ideas — with sitelen pona alongside toki pona for a calm, visual reread.',
    primaryCta: 'Books in the series',
    secondaryCta: 'FAQ',
  },
  why: {
    title: 'Why this series?',
    cards: [
      {
        title: 'A language built for clarity',
        text: 'Toki pona forces you to say the essence. That constraint fits Stoicism: fewer claims, less noise, more control over meaning.',
      },
      {
        title: 'Stoicism in small, readable pieces',
        text: 'These books are short, practical, and aphoristic. You can read them slowly, revisit passages, and use them as daily prompts.',
      },
      {
        title: 'Latin script + sitelen pona',
        text: 'Each text is available in Latin toki pona and sitelen pona. One is for reading, the other is for seeing structure and rhythm.',
      },
      {
        title: 'A coherent set, not random books',
        text: 'Same visual style, same reading approach, consistent vocabulary choices. You can start anywhere — or collect the full set as one project.',
      },
    ] as FeatureCard[],
  },
  listTitle: 'Books in the series',
  moreTitle: 'More books',
  moreSubtitle: 'Other books by the author (outside the Stoic series).',
  faqTitle: 'FAQ',
  faqSubtitle: 'Short answers about the series, sitelen pona, and reading method.',
};

export const LANDING_ITEMS: LandingItem[] = [
  {
    id: 'marcus-meditations',
    type: 'commercial',
    title: 'Meditations of Marcus Aurelius — in Toki Pona',
    author: 'Marcus Aurelius',
    shortDesc: 'A minimalist Stoic classic, reimagined through toki pona.',
    longDesc:
      'Each passage is rendered in Latin toki pona and mirrored in sitelen pona, turning daily reflection into a clean, low-noise reading practice. If you want one book that defines the whole series, start here.',
    coverImage: 'https://stoic.abvx.xyz/assets/books/marcus-meditations/cover.webp',
    promoImage: 'https://stoic.abvx.xyz/assets/books/marcus-meditations/promo.webp',
    teaserUrl: 'https://www.youtube.com/watch?v=ILN2qILESH0',
    kindleUrl: 'https://www.amazon.com/dp/B0FV3F1RC5',
    printUrl: 'https://www.amazon.com/dp/B0FVLPD69K',
    detailsUrl: 'https://stoic.abvx.xyz/en/books/marcus-meditations',
  },
  {
    id: 'epictetus-enchiridion',
    type: 'commercial',
    title: 'Epictetus: The Enchiridion in toki pona',
    author: 'Epictetus',
    shortDesc:
      'A compact Stoic manual for clear choices under pressure: learn what is in your control, what is not, and how to act without noise.',
    longDesc:
      'The Enchiridion is a practical handbook: short chapters meant to be revisited, especially when life gets loud. This edition reimagines Epictetus in toki pona for a calmer, more inspectable kind of reading.',
    coverImage: 'https://stoic.abvx.xyz/assets/books/epictetus-enchiridion/cover.webp',
    promoImage: 'https://stoic.abvx.xyz/assets/books/epictetus-enchiridion/promo.webp',
    teaserUrl: 'https://www.youtube.com/watch?v=DNgkm9tf6Cg',
    kindleUrl: 'https://www.amazon.com/dp/B0GKWR5NL1',
    printUrl: 'https://www.amazon.com/dp/B0GKXXJGZV',
    detailsUrl: 'https://stoic.abvx.xyz/en/books/epictetus-enchiridion',
  },
  {
    id: 'seneca-shortness-of-life',
    type: 'commercial',
    title: 'Seneca: On the Shortness of Life in toki pona',
    author: 'Seneca',
    shortDesc:
      'A sharp, calming reminder that life isn’t “too short” — we simply waste much of it. Readable, practical Stoic advice on attention, priorities, and reclaiming your days, reimagined in toki pona.',
    longDesc:
      '“Life is short” is the common complaint. Seneca’s answer is tougher and more useful: the problem isn’t the length of life, but what we trade it for. This short classic is a practical guide to noticing waste, resisting distraction, and investing your days on purpose.',
    coverImage: 'https://stoic.abvx.xyz/assets/books/seneca-shortness-of-life/cover.webp',
    promoImage: 'https://stoic.abvx.xyz/assets/books/seneca-shortness-of-life/promo.webp',
    teaserUrl: 'https://www.youtube.com/watch?v=_JL2xu4Sn70',
    kindleUrl: 'https://www.amazon.com/dp/B0GKCJ72PG',
    printUrl: 'https://www.amazon.com/dp/B0GL1ZBK18',
    detailsUrl: 'https://stoic.abvx.xyz/en/books/seneca-shortness-of-life',
  },
  {
    id: 'cicero-on-duties',
    type: 'commercial',
    title: 'Cicero: On Duties (De Officiis) in toki pona — with sitelen pona',
    author: 'Cicero',
    shortDesc:
      'A practical handbook for moral decision-making in real life—promises, reputation, money, public duty, friendship, and pressure—reimagined in toki pona with sitelen pona for slow, clear rereading.',
    longDesc:
      'Cicero’s On Duties is built for the hardest everyday question: what to do when advantage pulls one way and conscience pulls another. This edition keeps the public-domain English reference text for comparison, then presents a full toki pona translation in two reading layers—Latin script and sitelen pona.',
    coverImage: 'https://stoic.abvx.xyz/assets/books/cicero-on-duties/cover.webp',
    promoImage: 'https://stoic.abvx.xyz/assets/books/cicero-on-duties/promo.webp',
    teaserUrl: 'https://www.youtube.com/watch?v=61dVZDB-tYs',
    kindleUrl: 'https://www.amazon.com/dp/B0GL86LVF1',
    printUrl: 'https://www.amazon.com/dp/B0GLFN8KBX',
    detailsUrl: 'https://stoic.abvx.xyz/en/books/cicero-on-duties',
  },
  {
    id: 'readers-kit',
    type: 'gift',
    title: 'The Toki Pona Reader’s Kit (Free PDF)',
    author: 'ABV & Pythagoras',
    shortDesc:
      'A beginner-friendly entry point into reading toki pona with philosophical texts — plus the full practice text: The Golden Verses of Pythagoras.',
    longDesc: 'Download it, learn the cues, and use it as your fast start before diving into the series.',
    coverImage: 'https://stoic.abvx.xyz/assets/books/readers-kit/cover.webp',
    promoImage: 'https://stoic.abvx.xyz/assets/books/readers-kit/promo.webp',
    teaserUrl: 'https://www.youtube.com/watch?v=F7fSBElppzI',
    downloadPdfUrl: 'https://toki.abvx.xyz/kit.pdf',
    detailsUrl: 'https://stoic.abvx.xyz/en/books/readers-kit',
  },
];

export const MORE_ITEMS: LandingItem[] = [
  {
    id: 'dao-de-jing',
    type: 'commercial',
    title: 'Dao De Jing (Tao Te Ching): Chinese text with Toki Pona in sitelen pona',
    author: 'ABV',
    shortDesc: 'Chinese text paired with a sitelen pona toki pona translation — a quiet, art-like sequence of plates.',
    longDesc:
      'A visual bilingual edition: each chapter appears as a two-page spread — original Chinese on the left, sitelen pona on the right.',
    coverImage: 'https://stoic.abvx.xyz/assets/books/other-books/dao.jpg',
    promoImage: 'https://stoic.abvx.xyz/assets/books/other-books/dao.jpg',
    teaserUrl: 'https://www.youtube.com/watch?v=oWA-_FatU3E',
    kindleUrl: 'https://www.amazon.com/dp/B0G4XNRS4W',
    printUrl: 'https://www.amazon.com/dp/B0G5MCFN2T',
    detailsUrl: 'https://www.amazon.com/dp/B0G4XNRS4W',
  },
  {
    id: 'christmas-carol',
    type: 'commercial',
    title: 'A Christmas Carol — in Toki Pona: Translated into the minimalist language Toki Pona',
    author: 'Charles Dickens (trans. ABV)',
    shortDesc: 'Dickens retold through radical simplicity — toki pona + sitelen pona, with atmospheric illustration.',
    longDesc:
      'A bilingual edition designed for learners and literature fans: complete toki pona text with sitelen pona alongside it.',
    coverImage: 'https://stoic.abvx.xyz/assets/books/other-books/christmas.jpg',
    promoImage: 'https://stoic.abvx.xyz/assets/books/other-books/christmas.jpg',
    teaserUrl: 'https://www.youtube.com/watch?v=ammjR4v58CM',
    kindleUrl: 'https://www.amazon.com/dp/B0G1N2YHD8',
    printUrl: 'https://www.amazon.com/dp/B0G1XVNPSL',
    detailsUrl: 'https://www.amazon.com/dp/B0G1N2YHD8',
  },
  {
    id: 'machine-mind',
    type: 'commercial',
    title:
      'Toki Pona and the Machine Mind: Designing cleaner prompts, smaller models, and better systems with the world’s simplest language',
    author: 'ABV',
    shortDesc:
      'A practical field guide: prompt compression, constrained DSLs, and predictable AI interfaces inspired by toki pona.',
    longDesc:
      'Connects a tiny engineered language with large language models: cleaner prompts, smaller models, and deterministic interfaces.',
    coverImage: 'https://stoic.abvx.xyz/assets/books/other-books/machine.jpg',
    promoImage: 'https://stoic.abvx.xyz/assets/books/other-books/machine.jpg',
    teaserUrl: 'https://www.youtube.com/watch?v=0juEOOI1iEM',
    kindleUrl: 'https://www.amazon.com/dp/B0G44JSMR2',
    printUrl: 'https://www.amazon.com/dp/B0G5MQKZTX',
    detailsUrl: 'https://www.amazon.com/dp/B0G44JSMR2',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'What is Stoic Wisdom in toki pona?',
    a: 'It’s a book series that reimagines classic Stoic texts in toki pona, with each line also repeated in sitelen pona. The goal is a calmer, lower-noise way to read ethics.',
  },
  {
    q: 'Which books are in the series?',
    a: 'The series includes key classics commonly read as practical ethics: Marcus Aurelius, Epictetus, Seneca, and Cicero. Each book is edited for slow, daily reading in the same visual system.',
  },
  {
    q: 'Are these full texts or summaries?',
    a: 'They are full editions in a structured reading format, not short summaries.',
  },
  {
    q: 'Do you include the English reference text?',
    a: 'Yes. Each book includes a public-domain English reference text so you can verify meaning and compare translation choices.',
  },
  {
    q: 'What is sitelen pona?',
    a: 'It’s a pictographic writing system for toki pona. In these books it works as a second pass: the same line is shown again visually.',
  },
  {
    q: 'Do I need to know sitelen pona before reading?',
    a: 'No. You can read the Latin script first. The sitelen pona layer is there for slower rereading and recognition over time.',
  },
  {
    q: 'Is this suitable for beginners in toki pona?',
    a: 'It works best for motivated beginners who can tolerate ambiguity and rereading.',
  },
  {
    q: 'How should I read these books daily?',
    a: 'Read one short section, then reread the same lines in sitelen pona. Pick one anchor phrase and use it as a rule for your day.',
  },
  {
    q: 'Are these available on Kindle and paperback?',
    a: 'Yes. The editions are designed as print-style reading, and the Kindle version follows the same structure as closely as possible.',
  },
  {
    q: 'Where can I get the free reader’s kit?',
    a: 'The reader’s kit is linked from the series page and includes a quick orientation for reading toki pona and sitelen pona in this format.',
  },
  {
    q: 'How is this different from other Stoic editions?',
    a: 'The difference is the reading system: minimal language, two-layer reread with sitelen pona, English reference text, and a phrase-based glossary.',
  },
];
