export type FreeKit = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  bullets: string[];
  downloadUrl: string;
  teaserUrl: string;
  coverImage: string;
  promoImage: string;
  seriesLink: {
    label: string;
    url: string;
  };
  badges: string[];
};

export const freeKits: FreeKit[] = [
  {
    id: 'toki-readers-kit',
    slug: 'toki-readers-kit',
    title: 'The Toki Pona Reader’s Kit',
    subtitle: 'A Beginner’s Guide Using Philosophical Texts',
    shortDescription:
      'A free reader-friendly guide to reading toki pona through short philosophical texts — including The Golden Verses of Pythagoras (full text).',
    bullets: [
      'Includes The Golden Verses of Pythagoras (full text)',
      'English → toki pona → sitelen-ready duplicate',
    ],
    downloadUrl: '/assets/kits/stoicKit.pdf',
    teaserUrl: 'https://youtu.be/6AhXMiVvsXg',
    coverImage: '/assets/kits/stoicCover.png',
    promoImage: '/assets/kits/stoicPromo.jpg',
    seriesLink: {
      label: 'Stoic Wisdom series',
      url: 'https://stoic.abvx.xyz/',
    },
    badges: ['FREE'],
  },
  {
    id: 'chinese-wisdom-kit',
    slug: 'chinese-wisdom-kit',
    title: 'Chinese Wisdom in toki pona',
    subtitle: 'Free Kit / Reader’s Guide',
    shortDescription:
      'A free kit built around Mozi (墨子) and 兼愛 (Universal Love), plus a small set of art plates demonstrating the series format.',
    bullets: [
      'Includes Mozi (墨子) — 兼愛 (Universal Love) sample',
      'Art plates: Chinese left, sitelen-ready toki pona right',
      'English → toki pona → sitelen-ready duplicate',
    ],
    downloadUrl: '/assets/kits/chineseKit.pdf',
    teaserUrl: 'https://youtu.be/BOVyG1jP580',
    coverImage: '/assets/kits/chineseCover.jpg',
    promoImage: '/assets/kits/chinesePromo.png',
    seriesLink: {
      label: 'Chinese Wisdom series',
      url: 'https://dao-toki.abvx.xyz/',
    },
    badges: ['FREE'],
  },
];
