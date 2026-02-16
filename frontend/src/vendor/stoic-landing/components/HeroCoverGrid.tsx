'use client';

import Image from 'next/image';
import { Book } from '@/data/books';
import styles from './HeroCoverGrid.module.css';
import GiftBadge from './GiftBadge';
import { useState } from 'react';

interface HeroCoverGridProps {
    books: Book[];
    onSelect: (book: Book) => void;
    selectedBookId: string | null;
    dict: any;
    lang: string;
}

// Staircase configuration for Desktop (front -> back).
// Tuned for 5 books with a right-leaning stack like the reference.
const STACK_TRANSFORMS = [
    { x: 0, y: 150, r: -3, z: 10 },   // Front
    { x: 90, y: 95, r: 1, z: 9 },     // Back 1
    { x: 170, y: 40, r: 4, z: 8 },    // Back 2
    { x: 250, y: -15, r: 7, z: 7 },   // Back 3
    { x: 320, y: -70, r: 10, z: 6 },  // Back 4
];

export default function HeroCoverGrid({ books, onSelect, lang }: HeroCoverGridProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const orderedBooks = [...books].sort((a, b) => {
        if (a.type === 'gift') return 1;
        if (b.type === 'gift') return -1;
        return 0;
    });

    const handleBookClick = (book: Book) => {
        onSelect(book);
    };

    return (
        <div className={styles.stackContainer}>
            <div className={styles.scroller}>
                {orderedBooks.map((book, index) => {
                    const isGift = book.type === 'gift';
                    const badgeLabel = 'FREE';
                    const transform = STACK_TRANSFORMS[index] || STACK_TRANSFORMS[0];
                    const isHovered = hoveredIndex === index;

                    return (
                        <div
                            key={book.id}
                            className={`${styles.cardWrapper} ux-focus-ring`}
                            onClick={() => handleBookClick(book)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                '--x': `${transform.x}px`,
                                '--y': `${transform.y}px`,
                                '--r': `${transform.r}deg`,
                                '--z': isHovered ? 50 : transform.z,
                            } as any}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleBookClick(book);
                                }
                            }}
                        >
                            <div className={`${styles.card} ux-hover-card`}>
                                <div className={styles.imageContainer}>
                                    <Image
                                        src={book.coverImage}
                                        alt={book.title[lang === 'tp' ? 'tp' : 'en'] || book.title.en}
                                        fill
                                        className={styles.coverImg}
                                        sizes="(max-width: 768px) 240px, 300px"
                                        priority={index < 3}
                                    />
                                </div>
                                {isGift && (
                                    <GiftBadge label={badgeLabel} />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
