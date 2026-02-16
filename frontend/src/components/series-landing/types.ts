export type LandingFeature = {
  title: string;
  text: string;
};

export type LandingFaq = {
  q: string;
  a: string;
};

export type LandingEntry = {
  id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  bullets: readonly string[];
  coverImage: string;
  promoImage: string;
  pdfUrl?: string;
  teaserUrl?: string;
  seriesUrl?: string;
  seriesLabel?: string;
};

export type SeriesLandingConfig = {
  lang: 'en' | 'tp';
  headerTitle: string;
  nav: {
    translator: string;
    learn: string;
    kit: string;
    moreBooks: string;
    faq: string;
    stoic: string;
  };
  hero: {
    title: string;
    lead: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    note?: string;
  };
  labels: {
    downloadPdf: string;
    watchTeaser: string;
    openSeries: string;
    contact: string;
    medium: string;
    substack: string;
    github: string;
  };
  why: {
    title: string;
    subtitle?: string;
    cards: LandingFeature[];
  };
  entriesSection: {
    id: string;
    title: string;
    entries: LandingEntry[];
  };
  moreSection: {
    title: string;
    subtitle?: string;
    entries: LandingEntry[];
  };
  faq: {
    id: string;
    title: string;
    subtitle?: string;
    items: LandingFaq[];
  };
};
