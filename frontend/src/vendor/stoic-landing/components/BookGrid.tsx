import BookCard from './BookCard';
import styles from './BookGrid.module.css';
import { books } from '@/data/books';

export default function BookGrid({ dict, lang }: { dict: any, lang: string }) {
    return (
        <section id="collection" className={`container ${styles.section}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>{dict.collection.title}</h2>
            </div>

            <div className={styles.grid}>
                {books.map((book) => (
                    <BookCard
                        key={book.id}
                        book={book}
                        dict={dict}
                        lang={lang}
                    />
                ))}
            </div>
        </section>
    );
}
