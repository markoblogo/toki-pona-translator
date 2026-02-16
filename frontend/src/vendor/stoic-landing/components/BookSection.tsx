'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Book } from '@/data/books';
import styles from './BookSection.module.css';
import GiftBadge from './GiftBadge';

interface BookSectionProps {
    book: Book;
    dict: any;
    isLast: boolean;
}

export default function BookSection({ book, dict, isLast }: BookSectionProps) {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Select correct localized strings from Dictionary first, fall back to book data
    const lang = dict.lang || 'en';

    // Look up localized content by book ID in the dictionary
    const localizedBook = dict.collection[book.id];

    const title = localizedBook?.title || book.title[lang as keyof typeof book.title] || book.title.en;
    const author = localizedBook?.author || book.author[lang as keyof typeof book.author] || book.author.en;
    const shortDesc = localizedBook?.shortDesc || book.shortDescription[lang as keyof typeof book.shortDescription] || book.shortDescription.en;
    const longDesc = localizedBook?.longDesc || book.longDescription[lang as keyof typeof book.longDescription] || book.longDescription.en;

    const isGift = book.type === 'gift';

    return (
        <section id={book.id} className={`${styles.section} ${isLast ? styles.lastSection : ''}`}>
            <div className={`container ${styles.container}`}>

                {/* Left: Promo Image */}
                <div className={styles.imageCol}>
                    <div
                        className={`${styles.imageWrapper} ux-hover-card ux-focus-ring`}
                        onClick={() => setIsLightboxOpen(true)}
                        role="button"
                        aria-label="Zoom promo image"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setIsLightboxOpen(true);
                            }
                        }}
                    >
                        <Image
                            src={book.promoImage}
                            alt={`Promo for ${title}`}
                            fill
                            className={styles.promoImg}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className={styles.zoomHint}>🔍</div>
                    </div>
                </div>

                {/* Right: Content */}
                <div className={styles.contentCol}>
                    <header className={styles.header}>
                        {isGift && <GiftBadge label="FREE" className={styles.sectionBadge} />}
                        <h2 className={styles.title}>{title}</h2>
                        <p className={styles.author}>{author}</p>
                    </header>

                    <div className={styles.desc}>
                        {/* Render full text immediately */}
                        <p>{shortDesc}</p>
                        <p className={styles.longDesc}>{longDesc}</p>
                    </div>

                    <div className={styles.actions}>
                        {isGift ? (
                            <div className={styles.giftActions}>
                                {book.downloadPdfUrl && (
                                    <a href={book.downloadPdfUrl} download className="btn btn-accent ux-hover-btn ux-focus-ring">
                                        {dict.hero.download_pdf}
                                    </a>
                                )}
                                {book.downloadEpubUrl && (
                                    <a href={book.downloadEpubUrl} download className="btn ux-hover-btn ux-focus-ring">
                                        {dict.hero.download_epub}
                                    </a>
                                )}
                            </div>
                        ) : (
                            <div className={styles.commercialActions}>
                                {book.amazonKindleUrl && (
                                    <a href={book.amazonKindleUrl} target="_blank" rel="noopener" className="btn btn-accent ux-hover-btn ux-focus-ring">
                                        {dict.hero.buy_kindle}
                                    </a>
                                )}
                                {book.amazonPrintUrl && (
                                    <a href={book.amazonPrintUrl} target="_blank" rel="noopener" className="btn ux-hover-btn ux-focus-ring">
                                        {dict.hero.buy_print}
                                    </a>
                                )}
                            </div>
                        )}

                        <div className={styles.secondaryLinks}>
                            {book.teaserVideoId && (
                                <a
                                    href={`https://www.youtube.com/watch?v=${book.teaserVideoId}`}
                                    target="_blank"
                                    rel="noopener"
                                    className={`${styles.teaserLink} ux-hover-btn ux-focus-ring`}
                                >
                                    ▶ {dict.hero.watch_teaser}
                                </a>
                            )}
                            <a href={`/${lang}/books/${book.id}`} className={`${styles.detailsLink} ux-hover-btn ux-focus-ring`}>
                                {dict.collection.learn_more}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Overlay */}
            {isLightboxOpen && (
                <div className={styles.lightbox} onClick={() => setIsLightboxOpen(false)}>
                    <div className={styles.lightboxContent}>
                        <Image
                            src={book.promoImage}
                            alt={title}
                            width={1200}
                            height={800}
                            className={styles.lightboxImg}
                            priority
                        />
                        <button className={`${styles.closeBtn} ux-hover-btn ux-focus-ring`} aria-label="Close">×</button>
                    </div>
                </div>
            )}
        </section>
    );
}
