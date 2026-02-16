'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './LanguageSwitch.module.css';

export default function LanguageSwitch({ currentLang }: { currentLang: 'en' | 'tp' }) {
    const pathname = usePathname();

    const getNewPath = (lang: 'en' | 'tp') => {
        if (!pathname) return `/${lang}`;
        const segments = pathname.split('/');
        // segments[0] is empty, segments[1] is current lang
        const newSegments = [...segments];
        newSegments[1] = lang;
        return newSegments.join('/') || '/';
    };

    return (
        <div className={styles.switch}>
            <Link
                href={getNewPath('en')}
                className={`${styles.btn} ux-hover-btn ux-focus-ring ${currentLang === 'en' ? styles.active : ''}`}
            >
                EN
            </Link>
            <span className={styles.sep}>/</span>
            <Link
                href={getNewPath('tp')}
                className={`${styles.btn} ux-hover-btn ux-focus-ring ${currentLang === 'tp' ? styles.active : ''}`}
            >
                TP
            </Link>
        </div>
    );
}
