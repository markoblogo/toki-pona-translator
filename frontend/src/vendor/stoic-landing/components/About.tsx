import styles from './About.module.css';

export default function About({ dict }: { dict: any }) {
    return (
        <section className={`container ${styles.section}`}>
            <div className={styles.inner}>
                <h2 className={styles.title}>
                    {dict.why.title}
                    <span className={styles.decorator}></span>
                </h2>
                <div className={styles.textBlock}>
                    <p className={styles.paragraph}>{dict.why.text}</p>
                </div>
            </div>
        </section>
    );
}
