'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './BookCard.module.css';
import { Book } from '@/data/books';

interface BookCardProps {
    book: Book;
    dict: any;
    lang: string;
}

export default function BookCard({ book, dict, lang }: BookCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const title = book.title[lang as keyof typeof book.title];
    const author = book.author[lang as keyof typeof book.author];
    const shortDesc = book.shortDescription[lang as keyof typeof book.shortDescription];
    const longDesc = book.longDescription[lang as keyof typeof book.longDescription];

    const paperSoonText = lang === 'tp' ? 'kama sona' : 'soon';

    return (
        <div className={`${styles.card} ux-hover-card`} id={book.id}>
            <div className={styles.coverWrapper}>
                <Image
                    src={book.promoImage}
                    alt={title}
                    fill
                    className={styles.coverImg}
                    sizes="(max-width: 768px) 100vw, 30vw"
                />
            </div>

            <div className={styles.content}>
                <div className={styles.text}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.author}>{author}</p>
                    <p className={styles.hook}>{shortDesc}</p>
                </div>

                <div className={styles.actions}>
                    <div className={styles.amazonGroup}>
                        {book.type === 'gift' ? (
                            <>
                                <a href={book.downloadPdfUrl} download className={`${styles.buyBtn} ux-hover-btn ux-focus-ring`}>
                                    {dict.hero.download_pdf}
                                </a>
                                <a href={book.downloadEpubUrl} download className={`${styles.printBtn} ux-hover-btn ux-focus-ring`}>
                                    {dict.hero.download_epub}
                                </a>
                            </>
                        ) : (
                            <>
                                <a href={book.amazonKindleUrl} target="_blank" rel="noopener noreferrer" className={`${styles.buyBtn} ux-hover-btn ux-focus-ring`}>
                                    {dict.hero.buy_kindle}
                                </a>
                                <a href={book.amazonPrintUrl} target="_blank" rel="noopener noreferrer" className={`${styles.printBtn} ux-hover-btn ux-focus-ring`}>
                                    {dict.hero.buy_print}
                                </a>
                            </>
                        )}
                    </div>
                    <button
                        className={`${styles.moreBtn} ux-hover-btn ux-focus-ring`}
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-expanded={isExpanded}
                    >
                        {isExpanded ? '−' : '+'} {dict.collection.learn_more}
                    </button>
                </div>

                <div className={`${styles.accordion} ${isExpanded ? styles.expanded : ''}`}>
                    <div className={styles.longDesc}>
                        <p>{longDesc}</p>
                        {book.teaserVideoId && (
                            <div className={styles.teaserLinkWrapper}>
                                <a
                                    href={`https://www.youtube.com/watch?v=${book.teaserVideoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${styles.teaserLink} ux-hover-btn ux-focus-ring`}
                                >
                                    ▶ {dict.hero.watch_teaser}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
