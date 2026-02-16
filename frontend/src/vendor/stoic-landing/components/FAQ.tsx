import styles from './FAQ.module.css';

export default function FAQ({ dict }: { dict: any }) {
  const items = dict?.faq?.items ?? [];
  if (!items.length) return null;

  return (
    <section id="faq" className={styles.section}>
      <div className="container">
        <header className={styles.header}>
          <h2 className={styles.title}>{dict.faq.title}</h2>
          {dict.faq.subtitle && <p className={styles.subtitle}>{dict.faq.subtitle}</p>}
        </header>

        <div className={styles.list}>
          {items.map((item: any, index: number) => (
            <details key={index} className={`${styles.item} ux-hover-card ux-focus-ring`}>
              <summary className={`${styles.question} ux-hover-btn`}>{item.q}</summary>
              <div className={styles.answer}>
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
