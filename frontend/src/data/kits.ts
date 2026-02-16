export type Kit = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  bullets: string[];
  coverImage: string;
  promoImage: string;
  pdfUrl: string;
  teaserUrl: string;
  seriesLabel: string;
  seriesUrl: string;
  badges?: string[];
};

export type KitFeature = {
  title: string;
  body: string;
};

export type KitFaq = {
  question: string;
  answer: string;
};

export const READER_KITS: Kit[] = [
  {
    id: 'stoic-readers-kit',
    slug: 'stoic-kit',
    title: 'The Toki Pona Reader’s Kit',
    subtitle: 'A Beginner’s Guide Using Philosophical Texts',
    shortDescription:
      'A free reader-friendly guide to reading toki pona through short philosophical texts — including The Golden Verses of Pythagoras (full text).',
    bullets: [
      'Includes The Golden Verses of Pythagoras (full text)',
      'English → toki pona → sitelen-ready duplicate',
    ],
    coverImage: '/assets/kits/stoicCover.jpg',
    promoImage: '/assets/kits/stoicPromo.jpg',
    pdfUrl: '/assets/kits/stoicKit.pdf',
    teaserUrl: 'https://youtu.be/F7fSBElppzI',
    seriesLabel: 'Open series',
    seriesUrl: 'https://stoic.abvx.xyz/',
    badges: ['FREE'],
  },
  {
    id: 'chinese-readers-kit',
    slug: 'chinese-kit',
    title: 'Chinese Wisdom in toki pona',
    subtitle: 'Free Kit / Reader’s Guide',
    shortDescription:
      'A free kit built around Mozi (墨子) and 兼愛 (Universal Love), plus a small set of art plates demonstrating the series format.',
    bullets: [
      'Includes Mozi (墨子) — 兼愛 (Universal Love) sample',
      'Art plates: Chinese left, sitelen-ready toki pona right',
      'English → toki pona → sitelen-ready duplicate',
    ],
    coverImage: '/assets/kits/chineseCover.svg',
    promoImage: '/assets/kits/chinesePromo.svg',
    pdfUrl: '/assets/kits/chineseKit.pdf',
    teaserUrl: 'https://youtu.be/BOVyG1jP580',
    seriesLabel: 'Open series',
    seriesUrl: 'https://dao-toki.abvx.xyz/',
    badges: ['FREE'],
  },
];

export const KIT_FEATURES: KitFeature[] = [
  {
    title: 'Learn by reading real texts',
    body: 'Each kit starts with the essentials, then gives you a full sample text to read. You improve fastest by reading, not memorizing.',
  },
  {
    title: 'Two writing systems, one text',
    body: 'Latin toki pona + the same lines duplicated for sitelen pona. Learn sitelen by recognition, with zero guesswork.',
  },
  {
    title: 'Consistent layout across series',
    body: 'English reference → toki pona → sitelen-ready duplicate. Once you learn one kit, you can read the rest of the series.',
  },
];

export const KIT_FAQ: KitFaq[] = [
  {
    question: 'What’s inside each kit?',
    answer:
      'A short reading guide, a core glossary, practice drills, and a full sample text presented in the series layout (English reference → toki pona → sitelen-ready duplicate). Some kits also include art plates.',
  },
  {
    question: 'Do I need to know toki pona already?',
    answer:
      'No. Each kit includes the minimum grammar and reading conventions you need. If you know a little toki pona, you’ll move faster — but the kits are designed to work from zero.',
  },
  {
    question: 'Why is the toki pona text duplicated?',
    answer:
      'The second copy is for sitelen pona. It’s the same text, duplicated verbatim, so you can read in Latin or in sitelen without losing alignment.',
  },
  {
    question: 'Is it really free? What’s the license?',
    answer:
      'Yes. The PDFs are free for personal use and sharing. Commercial use isn’t allowed. The translations and layout are original to this edition; the classical sources are credited in the kit.',
  },
  {
    question: 'Can I print the PDF?',
    answer:
      'Yes — personal printing is fine. If you want to distribute printed copies commercially, contact us first.',
  },
  {
    question: 'Where do the English and Chinese texts come from?',
    answer:
      'We rely on public-domain and freely accessible reference editions and classical text sources (credited in Appendix A of each kit). The toki pona translation is original.',
  },
  {
    question: 'Where do I go after finishing a kit?',
    answer:
      'If you like the format, continue with the matching series landing page: Stoic Wisdom or Chinese Wisdom. The books keep the same layout and translation anchors.',
  },
  {
    question: 'Will there be EPUB / Kindle versions?',
    answer:
      'PDF is the main format because layout matters for sitelen pona and parallel text. EPUB/Kindle may appear later for selected titles, but PDF is the canonical edition.',
  },
  {
    question: 'Can I remix or translate the kit?',
    answer:
      'For non-commercial projects, usually yes — but keep attribution and don’t remove credit for the sources and translation. If you want to publish or sell derivatives, contact us.',
  },
  {
    question: 'How often do you update the kits?',
    answer:
      'Occasionally. When we improve formatting, fix typos, or add new free books, the latest versions will be posted here.',
  },
];
