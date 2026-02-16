'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Hero.module.css';
import HeroCoverGrid from './HeroCoverGrid';
import { books, Book } from '@/data/books';
import VideoModal from './VideoModal';

export default function Hero({ dict, lang }: { dict: any, lang: string }) {
    // Legacy state for modal (preserved but disconnected from immediate click)
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleSelectBook = (book: Book) => {
        // New Behavior: Scroll to section
        const element = document.getElementById(book.id);
        if (element) {
            // Account for header or just spacing, though header is now transparent/absolute overlay
            // Adding a small scroll-margin-top logic via CSS on sections is best, but here we can force it
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const closeModal = () => setSelectedBook(null);

    // Close on ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <section className={styles.hero}>
            <div className={`container ${styles.container}`}>
                <div className={styles.leftCol}>
                    <h1 className={styles.title}>{dict.hero.title}</h1>
                    <p className={styles.subtitle}>{dict.hero.subtitle}</p>

                    {/* Buttons removed as requested */}
                </div>

                <div className={styles.rightCol}>
                    <HeroCoverGrid
                        books={books}
                        onSelect={handleSelectBook}
                        selectedBookId={selectedBook?.id || null}
                        dict={dict}
                        lang={lang}
                    />

                    {/* Preserved Modal Code (Hidden/Inactive unless functionality restored) */}
                    {selectedBook && (
                        <>
                            <div className={styles.modalOverlay} onClick={closeModal} />
                            <div
                                ref={modalRef}
                                className={`${styles.detailPanel} ${selectedBook ? styles.visible : ''}`}
                                role="dialog"
                            >
                                <button className={styles.closeBtn} onClick={closeModal} aria-label="Close modal">&times;</button>
                                <h3 className={styles.detailTitle}>{selectedBook.title[lang as keyof typeof selectedBook.title]}</h3>
                                {/* ... rest of modal content minimized for now ... */}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {activeVideoId && (
                <VideoModal
                    videoId={activeVideoId}
                    onClose={() => setActiveVideoId(null)}
                />
            )}
        </section>
    );
}
