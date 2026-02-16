'use client';

import Image from 'next/image';
import styles from './MoreBooks.module.css';

type MoreBook = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  promoSrc: string;
  kindleUrl: string;
  paperbackUrl: string;
  teaserUrl: string;
};

const BOOKS: MoreBook[] = [
  {
    id: 'dao',
    title: 'Dao De Jing (Tao Te Ching): Chinese text with Toki Pona in sitelen pona',
    subtitle: 'Chinese text with Toki Pona in sitelen pona',
    description:
      'A visual bilingual edition: classical Chinese on the left, toki pona in sitelen pona on the right — chapter-by-chapter plates with a compact reading guide.',
    promoSrc: '/assets/books/other-books/dao.jpg',
    kindleUrl: 'https://www.amazon.com/dp/B0G4XNRS4W',
    paperbackUrl: 'https://www.amazon.com/dp/B0G5MCFN2T',
    teaserUrl: 'https://youtu.be/oWA-_FatU3E',
  },
  {
    id: 'christmas',
    title: 'A Christmas Carol — in Toki Pona: Translated into the minimalist language Toki Pona',
    subtitle: 'Bilingual edition with sitelen pona',
    description:
      'Dickens retold through radical simplicity — toki pona text paired with sitelen pona and a calm, book-as-art layout.',
    promoSrc: '/assets/books/other-books/christmas.jpg',
    kindleUrl: 'https://www.amazon.com/dp/B0G1N2YHD8',
    paperbackUrl: 'https://www.amazon.com/dp/B0G1XVNPSL',
    teaserUrl: 'https://youtu.be/ammjR4v58CM',
  },
  {
    id: 'machine',
    title:
      'Toki Pona and the Machine Mind: Designing cleaner prompts, smaller models, and better systems with the world’s simplest language',
    subtitle: 'Designing cleaner prompts, smaller models, and better systems',
    description:
      'A practical field guide: prompt compression, constrained DSLs, and predictable AI interfaces inspired by toki pona and its visual scripts.',
    promoSrc: '/assets/books/other-books/machine.jpg',
    kindleUrl: 'https://www.amazon.com/dp/B0G44JSMR2',
    paperbackUrl: 'https://www.amazon.com/dp/B0G5MQKZTX',
    teaserUrl: 'https://youtu.be/0juEOOI1iEM',
  },
];

export default function MoreBooks({ dict }: { dict: any }) {
  return (
    <section id="more-books" className={styles.section}>
      <div className="container">
        <div className={styles.heading}>
          <h2 className={styles.title}>{dict?.moreBooks?.title ?? 'More books about toki pona'}</h2>
          <p className={styles.subtitle}>
            {dict?.moreBooks?.subtitle ?? 'Not part of the Stoic series — other editions by the author.'}
          </p>
        </div>

        <div className={styles.grid}>
          {BOOKS.map((b) => (
            <article key={b.id} className={`${styles.card} ux-hover-card`}>
              <div className={styles.inner}>
                <div className={styles.media}>
                  <Image src={b.promoSrc} alt={`Promo for ${b.title}`} fill className={styles.promoImg} sizes="(max-width: 900px) 100vw, 50vw" />
                </div>

                <div className={styles.content}>
                  <div className={styles.kicker}>BOOK</div>
                  <h3 className={styles.bookTitle}>{b.title}</h3>
                  <div className={styles.bookSubtitle}>{b.subtitle}</div>
                  <p className={styles.desc}>{b.description}</p>

                  <div className={styles.actions}>
                    <div className={styles.ctas}>
                      <a href={b.kindleUrl} target="_blank" rel="noopener" className={`btn btn-accent ux-hover-btn ux-focus-ring ${styles.btnCompact}`}>
                        {dict?.hero?.buy_kindle ?? 'KINDLE EDITION'}
                      </a>
                      <a href={b.paperbackUrl} target="_blank" rel="noopener" className={`btn ux-hover-btn ux-focus-ring ${styles.btnCompact}`}>
                        {dict?.hero?.buy_print ?? 'PAPERBACK'}
                      </a>
                    </div>

                    <a href={b.teaserUrl} target="_blank" rel="noopener" className={`${styles.teaser} ux-hover-btn ux-focus-ring`}>
                      ▶ {dict?.hero?.watch_teaser ?? 'Watch teaser'}
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
