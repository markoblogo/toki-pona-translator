
import styles from './WhySection.module.css';

interface WhySectionProps {
    dict: any;
}

export default function WhySection({ dict }: WhySectionProps) {
    const cards = [
        dict.why.cards.history,
        dict.why.cards.style,
        dict.why.cards.europe,
        dict.why.cards.discovery,
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <header className={styles.header}>
                    <h2 className={styles.title}>{dict.why.title}</h2>
                </header>

                <div className={styles.grid}>
                    {cards.map((card: any, i: number) => (
                        <div key={i} className={`${styles.card} ux-hover-card`}>
                            <h3 className={styles.cardTitle}>{card.title}</h3>
                            <p className={styles.cardText}>{card.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
