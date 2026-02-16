import type { Book } from './books';

// Additional Toki Pona-related books by the author (not part of the Stoic series).
// Used for SEO (JSON-LD) and internal linking context.
export const moreBooks: Book[] = [
  {
    id: 'dao-de-jing',
    type: 'commercial',
    title: {
      en: 'Dao De Jing (Tao Te Ching): Chinese text with Toki Pona in sitelen pona',
      tp: 'Dao De Jing (Tao Te Ching): Chinese text with Toki Pona in sitelen pona',
    },
    author: {
      en: 'ABV',
      tp: 'ABV',
    },
    coverImage: '/assets/books/other-books/dao.jpg',
    promoImage: '/assets/books/other-books/dao.jpg',
    amazonKindleUrl: 'https://www.amazon.com/dp/B0G4XNRS4W',
    amazonPrintUrl: 'https://www.amazon.com/dp/B0G5MCFN2T',
    identifiers: {
      asinKindle: 'B0G4XNRS4W',
      asinPrint: 'B0G5MCFN2T',
    },
    teaserVideoId: 'oWA-_FatU3E',
    shortDescription: {
      en: 'Chinese text paired with a sitelen pona toki pona translation — a quiet, art-like sequence of plates.',
      tp: 'Chinese text paired with a sitelen pona toki pona translation — a quiet, art-like sequence of plates.',
    },
    longDescription: {
      en: 'A visual bilingual edition: each chapter appears as a two-page spread — original Chinese on the left, sitelen pona on the right. Includes an English foreword and a compact reading guide.',
      tp: 'A visual bilingual edition: each chapter appears as a two-page spread — original Chinese on the left, sitelen pona on the right. Includes an English foreword and a compact reading guide.',
    },
  },
  {
    id: 'christmas-carol',
    type: 'commercial',
    title: {
      en: 'A Christmas Carol — in Toki Pona: Translated into the minimalist language Toki Pona',
      tp: 'A Christmas Carol — in Toki Pona: Translated into the minimalist language Toki Pona',
    },
    author: {
      en: 'Charles Dickens (trans. ABV)',
      tp: 'Charles Dickens (trans. ABV)',
    },
    coverImage: '/assets/books/other-books/christmas.jpg',
    promoImage: '/assets/books/other-books/christmas.jpg',
    amazonKindleUrl: 'https://www.amazon.com/dp/B0G1N2YHD8',
    amazonPrintUrl: 'https://www.amazon.com/dp/B0G1XVNPSL',
    identifiers: {
      asinKindle: 'B0G1N2YHD8',
      asinPrint: 'B0G1XVNPSL',
    },
    teaserVideoId: 'ammjR4v58CM',
    shortDescription: {
      en: 'Dickens retold through radical simplicity — toki pona + sitelen pona, with atmospheric illustration.',
      tp: 'Dickens retold through radical simplicity — toki pona + sitelen pona, with atmospheric illustration.',
    },
    longDescription: {
      en: 'A bilingual edition designed for learners and literature fans: complete toki pona text with sitelen pona alongside it, plus a brief introduction to the language and script.',
      tp: 'A bilingual edition designed for learners and literature fans: complete toki pona text with sitelen pona alongside it, plus a brief introduction to the language and script.',
    },
  },
  {
    id: 'machine-mind',
    type: 'commercial',
    title: {
      en: 'Toki Pona and the Machine Mind: Designing cleaner prompts, smaller models, and better systems with the world’s simplest language',
      tp: 'Toki Pona and the Machine Mind: Designing cleaner prompts, smaller models, and better systems with the world’s simplest language',
    },
    author: {
      en: 'ABV',
      tp: 'ABV',
    },
    coverImage: '/assets/books/other-books/machine.jpg',
    promoImage: '/assets/books/other-books/machine.jpg',
    amazonKindleUrl: 'https://www.amazon.com/dp/B0G44JSMR2',
    amazonPrintUrl: 'https://www.amazon.com/dp/B0G5MQKZTX',
    identifiers: {
      asinKindle: 'B0G44JSMR2',
      asinPrint: 'B0G5MQKZTX',
    },
    teaserVideoId: '0juEOOI1iEM',
    shortDescription: {
      en: 'A practical field guide: prompt compression, constrained DSLs, and predictable AI interfaces inspired by toki pona.',
      tp: 'A practical field guide: prompt compression, constrained DSLs, and predictable AI interfaces inspired by toki pona.',
    },
    longDescription: {
      en: 'Connects a tiny engineered language with large language models: cleaner prompts, smaller models, and deterministic interfaces between humans and AI.',
      tp: 'Connects a tiny engineered language with large language models: cleaner prompts, smaller models, and deterministic interfaces between humans and AI.',
    },
  },
];
