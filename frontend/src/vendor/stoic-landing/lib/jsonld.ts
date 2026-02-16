import type { Book } from '@/data/books';

export const SITE_URL = 'https://stoic.abvx.xyz';

export function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ABVX',
    url: 'https://abvx.xyz',
    sameAs: ['https://abvcreative.medium.com/', 'https://abvx.substack.com/', 'https://github.com/markoblogo'],
  };
}

export function websiteJsonLd(lang: 'en' | 'tp') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Stoic Wisdom Series',
    url: SITE_URL,
    inLanguage: lang === 'tp' ? 'tok' : 'en',
  };
}

export function seriesJsonLd(lang: 'en' | 'tp') {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWorkSeries',
    name: 'Stoic Wisdom Series',
    url: `${SITE_URL}/${lang}`,
    inLanguage: lang === 'tp' ? 'tok' : 'en',
    publisher: {
      '@type': 'Organization',
      name: 'ABVX',
      url: 'https://abvx.xyz',
    },
  };
}

function identifiersFromBook(book: Book) {
  const ids: any[] = [];
  if (book.identifiers?.isbn13Print) {
    ids.push({ '@type': 'PropertyValue', propertyID: 'ISBN-13', value: book.identifiers.isbn13Print });
  }
  if (book.identifiers?.asinKindle) {
    ids.push({ '@type': 'PropertyValue', propertyID: 'ASIN', value: book.identifiers.asinKindle });
  }
  if (book.identifiers?.asinPrint) {
    ids.push({ '@type': 'PropertyValue', propertyID: 'ASIN', value: book.identifiers.asinPrint });
  }
  return ids.length ? ids : undefined;
}

export function jsonLdForBook(lang: 'en' | 'tp', book: Book) {
  const inLanguage = lang === 'tp' ? 'tok' : 'en';

  const common: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${SITE_URL}/${lang}#${book.id}`,
    name: book.title[lang],
    author: { '@type': 'Person', name: book.author[lang] },
    inLanguage,
    publisher: { '@type': 'Organization', name: 'ABVX', url: 'https://abvx.xyz' },
  };

  const identifier = identifiersFromBook(book);
  if (identifier) common.identifier = identifier;
  if (book.identifiers?.isbn13Print) common.isbn = book.identifiers.isbn13Print;

  const sameAs = [book.amazonKindleUrl, book.amazonPrintUrl].filter(Boolean);
  if (sameAs.length) common.sameAs = sameAs;

  if (book.type === 'commercial') {
    const offers = [
      book.amazonKindleUrl
        ? { '@type': 'Offer', url: book.amazonKindleUrl, availability: 'https://schema.org/InStock' }
        : null,
      book.amazonPrintUrl
        ? { '@type': 'Offer', url: book.amazonPrintUrl, availability: 'https://schema.org/InStock' }
        : null,
    ].filter(Boolean);
    if (offers.length) common.offers = offers;
  } else {
    const offers = [
      book.downloadPdfUrl
        ? {
            '@type': 'Offer',
            url: book.downloadPdfUrl,
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          }
        : null,
      book.downloadEpubUrl
        ? {
            '@type': 'Offer',
            url: book.downloadEpubUrl,
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          }
        : null,
    ].filter(Boolean);
    if (offers.length) common.offers = offers;
  }

  return common;
}
