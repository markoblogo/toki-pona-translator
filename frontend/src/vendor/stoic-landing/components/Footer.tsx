'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

type BannerVariant = 'translator' | 'learn' | 'kit' | 'ukr';

type BannerProps = {
  href: string;
  title: string;
  subtitle: string;
  variant: BannerVariant;
  iconText?: string;
  thumbSrc?: string;
};

function Banner({ href, title, subtitle, variant, iconText = '>', thumbSrc }: BannerProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.bannerCard} ${styles[`banner_${variant}`]} ux-hover-card ux-focus-ring`}
    >
      <div className={styles.bannerInner}>
        {thumbSrc ? (
          <img src={thumbSrc} alt="" className={styles.bannerThumb} loading="lazy" />
        ) : (
          <span className={styles.bannerIcon}>{iconText}</span>
        )}

        <div className={styles.bannerText}>
          <div className={styles.bannerTitle}>{title}</div>
          <div className={styles.bannerSubtitle}>{subtitle}</div>
        </div>
      </div>
    </a>
  );
}

export default function Footer({ dict, lang }: { dict: any; lang: 'en' | 'tp' }) {
  const socialMedium = 'https://abvcreative.medium.com/';
  const socialSubstack = 'https://abvx.substack.com/';
  const socialGitHub = 'https://github.com/markoblogo';
  const mailto = 'mailto:a.biletskyi@gmail.com?subject=Stoic%20Wisdom%20Series';
  const emailDisplay = 'a.biletskyi@gmail.com';

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          <div className={styles.leftCol}>
            <div className={styles.contactRow}>
              <h4 className={styles.contactLabel}>{dict?.contact?.text ?? 'Contact'}</h4>
              <a href={mailto} className={`${styles.mailLink} ux-hover-btn ux-focus-ring`}>
                {emailDisplay}
              </a>

              <div className={styles.socials}>
                <a href={socialMedium} target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ux-hover-btn ux-focus-ring`}>
                  {dict?.contact?.social_medium ?? 'Medium'}
                </a>
                <a href={socialSubstack} target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ux-hover-btn ux-focus-ring`}>
                  {dict?.contact?.social_substack ?? 'Substack'}
                </a>
                <a href={socialGitHub} target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ux-hover-btn ux-focus-ring`}>
                  GitHub
                </a>
              </div>
            </div>

            <div className={styles.legalRow}>
              <a
                href="https://abvx.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.copyright} ux-hover-btn ux-focus-ring`}
              >
                {dict?.footer?.copyright ?? `© ${new Date().getFullYear()} ABVX.xyz`}
              </a>
              <div className={styles.legalLinks}>
                <Link href={`/${lang}/legal`} className={`${styles.legalLink} ux-hover-btn ux-focus-ring`}>
                  {dict?.footer?.legal_mentions ?? 'Legal'}
                </Link>
                <Link href={`/${lang}/privacy`} className={`${styles.legalLink} ux-hover-btn ux-focus-ring`}>
                  {dict?.footer?.privacy_policy ?? 'Privacy'}
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.banners}>
              <Banner
                variant="translator"
                href="https://toki.abvx.xyz/"
                title="Toki Pona Translator"
                subtitle="Translate into toki pona (Latin / sitelen pona / emoji)."
              />
              <Banner
                variant="learn"
                href="https://toki.abvx.xyz/learn"
                title="Learn Toki Pona"
                subtitle="Curated resources + books + the Reader’s Kit."
                iconText=">"
              />
              <Banner
                variant="kit"
                href="https://toki-free.abvx.xyz/en"
                title="The Toki Pona Reader’s Kit"
                subtitle="Free PDF: fast start into reading toki pona (includes Pythagoras full text)."
                thumbSrc="/assets/books/readers-kit/cover.jpg"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
