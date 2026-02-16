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
  bullets: string[];
  coverImage: string;
  promoImage: string;
  pdfUrl?: string;
  teaserUrl?: string;
  seriesUrl?: string;
  seriesLabel?: string;
  badges?: string[];
};

export type SeriesLandingConfig = {
  headerTitle: string;
  hero: {
    title: string;
    lead: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    note?: string;
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
