import type { SeriesLandingConfig } from '@/components/series-landing/types';

const sharedEntries = [
  {
    id: 'stoic-kit',
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
  },
  {
    id: 'chinese-kit',
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
  },
] as const;

const sharedFaq = [
  {
    q: 'What’s inside each kit?',
    a: 'A short reading guide, a core glossary, practice drills, and a full sample text presented in the series layout (English reference → toki pona → sitelen-ready duplicate). Some kits also include art plates.',
  },
  {
    q: 'Do I need to know toki pona already?',
    a: 'No. Each kit includes the minimum grammar and reading conventions you need. If you know a little toki pona, you’ll move faster — but the kits are designed to work from zero.',
  },
  {
    q: 'Why is the toki pona text duplicated?',
    a: 'The second copy is for sitelen pona. It’s the same text, duplicated verbatim, so you can read in Latin or in sitelen without losing alignment.',
  },
  {
    q: 'Is it really free? What’s the license?',
    a: 'Yes. The PDFs are free for personal use and sharing. Commercial use isn’t allowed. The translations and layout are original to this edition; the classical sources are credited in the kit.',
  },
  {
    q: 'Can I print the PDF?',
    a: 'Yes — personal printing is fine. If you want to distribute printed copies commercially, contact us first.',
  },
  {
    q: 'Where do I go after finishing a kit?',
    a: 'If you like the format, continue with the matching series landing page: Stoic Wisdom or Chinese Wisdom.',
  },
  {
    q: 'Will there be EPUB / Kindle versions?',
    a: 'PDF is the main format because layout matters for sitelen pona and parallel text. EPUB/Kindle may appear later for selected titles, but PDF is the canonical edition.',
  },
  {
    q: 'How often do you update the kits?',
    a: 'Occasionally. When we improve formatting, fix typos, or add new free books, the latest versions will be posted here.',
  },
];

export const kitsByLang: Record<'en' | 'tp', SeriesLandingConfig> = {
  en: {
    lang: 'en',
    headerTitle: 'The Toki Pona Reader’s Kits',
    nav: {
      translator: 'Translator',
      learn: 'Learn',
      kit: 'Kit',
      moreBooks: 'More books',
      faq: 'FAQ',
      stoic: 'Toki Stoic',
    },
    hero: {
      title: 'The Toki Pona Reader’s Kits',
      lead: 'Free beginner-friendly guides to reading toki pona through real philosophical texts. Download the PDF, then watch the teaser video as a quick visual tour.',
      primaryCtaLabel: 'Start with the kits',
      primaryCtaHref: '#free-books',
      note: 'Free for personal use (non-commercial). No signup.',
    },
    labels: {
      downloadPdf: 'Download PDF',
      watchTeaser: 'Watch teaser',
      openSeries: 'Open series',
      contact: 'Contact',
      medium: 'Medium',
      substack: 'Substack',
      github: 'GitHub',
    },
    why: {
      title: 'Why these kits?',
      subtitle: 'A fast way to start reading, even if you’re new to toki pona.',
      cards: [
        {
          title: 'Learn by reading real texts',
          text: 'Each kit starts with the essentials, then gives you a full sample text to read. You improve fastest by reading, not memorizing.',
        },
        {
          title: 'Two writing systems, one text',
          text: 'Latin toki pona + the same lines duplicated for sitelen pona. Learn sitelen by recognition, with zero guesswork.',
        },
        {
          title: 'Consistent layout across series',
          text: 'English reference → toki pona → sitelen-ready duplicate. Once you learn one kit, you can read the rest of the series.',
        },
      ],
    },
    entriesSection: {
      id: 'free-books',
      title: 'Free books',
      entries: sharedEntries.map((entry) => ({ ...entry, seriesLabel: 'Open series' })),
    },
    moreSection: {
      title: 'More books about toki pona',
      subtitle: 'Start with a kit. Continue with the series if the format clicks.',
      entries: sharedEntries.map((entry) => ({ ...entry, seriesLabel: 'Open series' })),
    },
    faq: {
      id: 'faq',
      title: 'FAQ',
      subtitle: 'Short answers about the kits, licensing, and reading method.',
      items: sharedFaq,
    },
  },
  tp: {
    lang: 'tp',
    headerTitle: 'lipu pona pi toki pona',
    nav: {
      translator: 'ante toki',
      learn: 'o kama sona',
      kit: 'kit',
      moreBooks: 'lipu ante',
      faq: 'wile sona',
      stoic: 'toki stoika',
    },
    hero: {
      title: 'lipu pona pi toki pona',
      lead: 'lipu ni li pona tawa jan sin. sina ken kama jo e lipu PDF, sina ken lukin e sitelen tawa lili tawa open pona.',
      primaryCtaLabel: 'o open e lipu ni',
      primaryCtaHref: '#free-books',
      note: 'lipu ni li mani ala tawa kepeken sina taso.',
    },
    labels: {
      downloadPdf: 'o kama jo e lipu PDF',
      watchTeaser: 'o lukin e sitelen tawa',
      openSeries: 'o tawa kulupu lipu',
      contact: 'o toki tawa mi',
      medium: 'Medium',
      substack: 'Substack',
      github: 'GitHub',
    },
    why: {
      title: 'tan seme la lipu ni li pona?',
      subtitle: 'sina jan sin la lipu ni li ken pana e open pona.',
      cards: [
        {
          title: 'o kama sona kepeken lukin lipu lon',
          text: 'lipu ale li jo e nasin open, li pana e lipu lon tawa lukin. sina lukin la sina kama sona kepeken tenpo lili.',
        },
        {
          title: 'nasin sitelen tu, toki wan',
          text: 'toki pona lon sitelen Lasina li lon, en sitelen pona lon toki sama li lon kin. ni li pona tawa sona nasa ala.',
        },
        {
          title: 'nasin sama lon kulupu lipu',
          text: 'toki Inli lon open, toki pona lon sinpin, sitelen pona lon poka. sina sona e wan la sina sona e mute.',
        },
      ],
    },
    entriesSection: {
      id: 'free-books',
      title: 'lipu pi mani ala',
      entries: sharedEntries.map((entry) => ({ ...entry, seriesLabel: 'o tawa kulupu lipu' })),
    },
    moreSection: {
      title: 'lipu ante pi toki pona',
      subtitle: 'o open kepeken lipu wan, o tawa kulupu lipu lon tenpo kama.',
      entries: sharedEntries.map((entry) => ({ ...entry, seriesLabel: 'o tawa kulupu lipu' })),
    },
    faq: {
      id: 'faq',
      title: 'wile sona',
      subtitle: 'toki lili pi wile sona',
      items: sharedFaq,
    },
  },
};
