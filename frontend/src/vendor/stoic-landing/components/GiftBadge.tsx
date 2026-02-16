
import styles from './GiftBadge.module.css';

interface GiftBadgeProps {
    label: string;
    className?: string;
    style?: React.CSSProperties;
}

export default function GiftBadge({ label, className = '', style }: GiftBadgeProps) {
    // Determine if it's French or Ukrainian specific styling needs (optional, but good for "stamp" variants)
    // For now standard stamp.
    return (
        <div className={`${styles.badge} ux-hover-sticker ${className}`} style={style}>
            <div className={styles.innerRing}>
                <span className={styles.text}>{label}</span>
            </div>
        </div>
    );
}
