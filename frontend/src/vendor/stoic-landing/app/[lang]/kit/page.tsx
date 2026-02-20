import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import { getDictionary } from '@/get-dictionary';
import { freeKits } from '@/data/kits';
import styles from './page.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang === 'tp' ? 'tp' : 'en';
  const base = `https://toki-free.abvx.xyz/${safeLang}`;

  return {
    title: 'The Toki Pona Reader’s Kits',
    description:
      'Free beginner-friendly guides to reading toki pona through real philosophical texts.',
    alternates: {
      canonical: base,
      languages: {
        en: 'https://toki-free.abvx.xyz/en',
      },
    },
    openGraph: {
      title: 'The Toki Pona Reader’s Kits',
      description:
        'Free beginner-friendly guides to reading toki pona through real philosophical texts.',
      url: base,
      type: 'website',
    },
  };
}

const features = [
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
];

const kitFaq = {
  faq: {
    title: 'FAQ',
    subtitle: 'Quick answers about the kits and what comes next.',
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
        q: 'Can I print it?',
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
        q: 'Will there be EPUB/Kindle versions?',
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

export default async function KitHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const safeLang = (lang === 'tp' || lang === 'en') ? (lang as 'en' | 'tp') : 'en';
  const dict = await getDictionary(safeLang);

  return (
    <main className={styles.main}>
      <Header lang={safeLang} />

      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <h1 className={styles.heroTitle}>The Toki Pona Reader’s Kits</h1>
            <p className={styles.heroSubtitle}>
              Free beginner-friendly guides to reading toki pona through real philosophical texts.
            </p>
            <p className={styles.heroSubtitle}>Download the PDF, then watch the teaser video as a quick visual tour.</p>
            <p className={styles.heroNote}>Free for personal use (non-commercial). No signup.</p>
          </div>

          <div className={styles.heroVisuals}>
            {freeKits.map((kit) => (
              <div key={kit.id} className={styles.heroCover}>
                <Image
                  src={kit.coverImage}
                  alt={kit.title}
                  fill
                  className={styles.coverImg}
                  sizes="(max-width: 600px) 100vw, 40vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Why these kits?</h2>
          <p className={styles.sectionLead}>A fast way to start reading, even if you’re new to toki pona.</p>
          <div className={styles.featuresGrid}>
            {features.map((feature) => (
              <article key={feature.title} className={styles.featureCard}>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Free books</h2>
          <p className={styles.sectionLead}>Start with a kit. Continue with the series if the format clicks.</p>

          <div className={styles.kitsGrid}>
            {freeKits.map((kit) => (
              <article key={kit.id} className={styles.kitCard}>
                <div className={styles.kitInner}>
                  <div className={styles.kitMedia}>
                    <Image
                      src={kit.promoImage}
                      alt={`${kit.title} promo`}
                      fill
                      className={styles.coverImg}
                      sizes="(max-width: 900px) 100vw, 45vw"
                    />
                  </div>

                  <div>
                    <h3 className={styles.kitTitle}>{kit.title}</h3>
                    <div className={styles.badges}>
                      {kit.badges.map((badge) => (
                        <span key={badge} className={styles.badge}>
                          {badge}
                        </span>
                      ))}
                    </div>
                    <p className={styles.kitSubtitle}>{kit.subtitle}</p>
                    <p className={styles.kitDesc}>{kit.shortDescription}</p>
                    <ul className={styles.kitBullets}>
                      {kit.bullets.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>

                    <div className={styles.kitActions}>
                      <a href={kit.pdfUrl} className="btn btn-accent" target="_blank" rel="noopener noreferrer">
                        Download PDF
                      </a>
                      <a href={kit.teaserUrl} className="btn" target="_blank" rel="noopener noreferrer">
                        Watch teaser
                      </a>
                      <a href={kit.seriesLink.url} className="btn" target="_blank" rel="noopener noreferrer">
                        {kit.seriesLink.label}
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className={styles.licenseLine}>Free for personal use (non-commercial).</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Want more after the kit?</h2>
          <p className={styles.sectionLead}>
            These kits are the “start here” entry points for each series. The full books continue with the same layout and translation anchors.
          </p>
          <div className={styles.bridgeGrid}>
            <a
              href="https://stoic.abvx.xyz/"
              className={styles.bridgeCard}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.bridgeLabel}>Stoic Wisdom in toki pona</span>
              <span>Open ↗</span>
            </a>
            <a
              href="https://dao-toki.abvx.xyz/"
              className={styles.bridgeCard}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.bridgeLabel}>Chinese Wisdom in toki pona</span>
              <span>Open ↗</span>
            </a>
          </div>
        </div>
      </section>

      <FAQ dict={kitFaq} />
      <Footer dict={dict} lang={safeLang} />
    </main>
  );
}
