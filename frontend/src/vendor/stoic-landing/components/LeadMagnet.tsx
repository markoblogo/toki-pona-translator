import styles from './LeadMagnet.module.css';

export default function LeadMagnet({ dict }: { dict: any }) {
    return (
        <section className={styles.section}>
            <div className={`container ${styles.container}`}>
                <div className={styles.content}>
                    <h2 className={styles.title}>{dict.gift.title}</h2>
                    <p className={styles.status}>{dict.gift.status}</p>
                    <p className={styles.notice}>{dict.gift.notice}</p>

                    <div className={styles.actions}>
                        <button className={styles.btnDisabled} disabled>PDF ({dict.gift.placeholder_cta})</button>
                        <button className={styles.btnDisabled} disabled>ePub ({dict.gift.placeholder_cta})</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
