import styles from './Badge.module.css';

interface BadgeProps {
    label: string;
    className?: string;
}

export default function Badge({ label, className = '' }: BadgeProps) {
    return (
        <div className={`${styles.badge} ${className}`}>
            {label}
        </div>
    );
}
