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
  detailsLabel?: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export const LANDING_CONTENT = {
  hero: {
    title: 'The Toki Pona Reader’s Kits',
    subtitle:
      'Free beginner-friendly guides to reading toki pona through real philosophical texts. Download the PDF, then watch the teaser video as a quick visual tour.',
    primaryCta: 'Free books',
    secondaryCta: 'FAQ',
    note: 'Free for personal use (non-commercial). No signup.',
  },
  why: {
    title: 'Why these kits?',
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
    ] as FeatureCard[],
  },
  listTitle: 'Free books',
  moreTitle: 'More books',
  moreSubtitle: 'Start with a kit. Continue with the series if the format clicks.',
  faqTitle: 'FAQ',
  faqSubtitle: 'Short answers about the kits, licensing, and reading method.',
};

export const LANDING_ITEMS: LandingItem[] = [
  {
    id: 'stoic-kit',
    type: 'gift',
    title: 'The Toki Pona Reader’s Kit',
    author: 'A Beginner’s Guide Using Philosophical Texts',
    shortDesc:
      'A free reader-friendly guide to reading toki pona through short philosophical texts — including The Golden Verses of Pythagoras (full text).',
    longDesc:
      'Includes The Golden Verses of Pythagoras (full text). English → toki pona → sitelen-ready duplicate.',
    coverImage: '/assets/kits/stoicCover.jpg',
    promoImage: '/assets/kits/stoicPromo.jpg',
    teaserUrl: 'https://youtu.be/F7fSBElppzI',
    downloadPdfUrl: '/assets/kits/stoicKit.pdf',
    detailsUrl: 'https://stoic.abvx.xyz/',
    detailsLabel: 'Open series',
  },
  {
    id: 'chinese-kit',
    type: 'gift',
    title: 'Chinese Wisdom in toki pona',
    author: 'Free Kit / Reader’s Guide',
    shortDesc:
      'A free kit built around Mozi (墨子) and 兼愛 (Universal Love), plus a small set of art plates demonstrating the series format.',
    longDesc:
      'Includes Mozi (墨子) — 兼愛 (Universal Love) sample. Art plates: Chinese left, sitelen-ready toki pona right. English → toki pona → sitelen-ready duplicate.',
    coverImage: '/assets/kits/chineseCover.svg',
    promoImage: '/assets/kits/chinesePromo.svg',
    teaserUrl: 'https://youtu.be/BOVyG1jP580',
    downloadPdfUrl: '/assets/kits/chineseKit.pdf',
    detailsUrl: 'https://dao-toki.abvx.xyz/',
    detailsLabel: 'Open series',
  },
];

export const MORE_ITEMS: LandingItem[] = [...LANDING_ITEMS];

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'What’s inside each kit?',
    a: 'A short reading guide, core glossary, practice drills, and a full sample text in the same sequence: English reference → toki pona → sitelen-ready duplicate. Some kits include art plates.',
  },
  {
    q: 'Do I need to know toki pona already?',
    a: 'No. The kits include the minimum conventions to start from zero. If you already know some toki pona, you will move faster.',
  },
  {
    q: 'Why is the toki pona text duplicated?',
    a: 'The second copy is for sitelen pona. It is duplicated verbatim so both scripts stay aligned line by line.',
  },
  {
    q: 'Is it really free? What’s the license?',
    a: 'Yes. PDFs are free for personal use and sharing. Commercial use is not allowed.',
  },
  {
    q: 'Can I print the PDF?',
    a: 'Yes, personal printing is fine. For commercial printed distribution, contact us first.',
  },
  {
    q: 'Where do the source texts come from?',
    a: 'We rely on public-domain and openly available source editions, credited in each kit.',
  },
  {
    q: 'Where do I go after finishing a kit?',
    a: 'Continue with the matching series: Stoic Wisdom in toki pona or Chinese Wisdom in toki pona.',
  },
  {
    q: 'Will there be EPUB / Kindle versions?',
    a: 'PDF is the canonical format for now because layout alignment matters for sitelen pona and parallel text.',
  },
  {
    q: 'Can I remix or translate the kit?',
    a: 'For non-commercial projects, usually yes with attribution. For publishing or selling derivatives, contact us.',
  },
  {
    q: 'How often do you update the kits?',
    a: 'Occasionally, when we improve formatting, fix typos, or add new free releases.',
  },
];
