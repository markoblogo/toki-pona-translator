import type { SeriesLandingConfig } from '@/components/series-landing/types';

export const kitsLandingConfig: SeriesLandingConfig = {
  headerTitle: 'The Toki Pona Reader’s Kits',
  activeNav: 'kit',
  hero: {
    title: 'The Toki Pona Reader’s Kits (DEPLOY TEST 6b22cab)',
    lead: 'Free beginner-friendly guides to reading toki pona through real philosophical texts. Download the PDF, then watch the teaser video as a quick visual tour.',
    primaryCtaLabel: 'Free books',
    secondaryCtaLabel: 'FAQ',
    note: 'Free for personal use (non-commercial). No signup.',
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
    entries: [
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
        badges: ['FREE'],
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
        badges: ['FREE'],
      },
    ],
  },
  moreSection: {
    title: 'More books',
    subtitle: 'Start with a kit. Continue with the series if the format clicks.',
    entries: [
      {
        id: 'more-stoic-kit',
        title: 'The Toki Pona Reader’s Kit',
        subtitle: 'A Beginner’s Guide Using Philosophical Texts',
        shortDescription:
          'A free reader-friendly guide to reading toki pona through short philosophical texts — including The Golden Verses of Pythagoras (full text).',
        bullets: [],
        coverImage: '/assets/kits/stoicCover.jpg',
        promoImage: '/assets/kits/stoicPromo.jpg',
        pdfUrl: '/assets/kits/stoicKit.pdf',
        teaserUrl: 'https://youtu.be/F7fSBElppzI',
        seriesLabel: 'Open series',
        seriesUrl: 'https://stoic.abvx.xyz/',
      },
      {
        id: 'more-chinese-kit',
        title: 'Chinese Wisdom in toki pona',
        subtitle: 'Free Kit / Reader’s Guide',
        shortDescription:
          'A free kit built around Mozi (墨子) and 兼愛 (Universal Love), plus a small set of art plates demonstrating the series format.',
        bullets: [],
        coverImage: '/assets/kits/chineseCover.svg',
        promoImage: '/assets/kits/chinesePromo.svg',
        pdfUrl: '/assets/kits/chineseKit.pdf',
        teaserUrl: 'https://youtu.be/BOVyG1jP580',
        seriesLabel: 'Open series',
        seriesUrl: 'https://dao-toki.abvx.xyz/',
      },
    ],
  },
  faq: {
    id: 'faq',
    title: 'FAQ',
    subtitle: 'Short answers about the kits, licensing, and reading method.',
    items: [
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
        q: 'Where do the English and Chinese texts come from?',
        a: 'We rely on public-domain and freely accessible reference editions and classical text sources (credited in Appendix A of each kit). The toki pona translation is original.',
      },
      {
        q: 'Where do I go after finishing a kit?',
        a: 'If you like the format, continue with the matching series landing page: Stoic Wisdom or Chinese Wisdom. The books keep the same layout and translation anchors.',
      },
      {
        q: 'Will there be EPUB / Kindle versions?',
        a: 'PDF is the main format because layout matters for sitelen pona and parallel text. EPUB/Kindle may appear later for selected titles, but PDF is the canonical edition.',
      },
      {
        q: 'Can I remix or translate the kit?',
        a: 'For non-commercial projects, usually yes — but keep attribution and don’t remove credit for the sources and translation. If you want to publish or sell derivatives, contact us.',
      },
      {
        q: 'How often do you update the kits?',
        a: 'Occasionally. When we improve formatting, fix typos, or add new free books, the latest versions will be posted here.',
      },
    ],
  },
};
