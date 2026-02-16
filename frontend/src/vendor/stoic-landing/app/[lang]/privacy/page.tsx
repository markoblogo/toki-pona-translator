import { getDictionary } from '@/get-dictionary';
import Link from 'next/link';

export default async function PrivacyPage({ params }: { params: Promise<{ lang: 'en' | 'tp' }> }) {
    let { lang } = await params;

    // Dev guard for undefined lang
    if (!lang) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('PrivacyPage: lang is undefined, falling back to en');
        }
        lang = 'en';
    }

    const dict = await getDictionary(lang);
    const backLink = `/${lang}`;

    return (
        <main className="container" style={{ padding: '6rem 1.5rem 4rem', minHeight: '60vh', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>
                {dict.privacy.title}
            </h1>

            <div style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--color-ink)' }}>
                <p><strong>{dict.privacy.dataLabel}</strong><br />
                    {dict.privacy.dataValue}</p>

                <p style={{ marginTop: '1.5rem' }}><strong>{dict.privacy.cookiesLabel}</strong><br />
                    {dict.privacy.cookiesValue}</p>

                <p style={{ marginTop: '1.5rem' }}><strong>{dict.privacy.thirdPartyLabel}</strong><br />
                    {dict.privacy.thirdPartyValue}</p>

                <p style={{ marginTop: '1.5rem' }}><strong>{dict.privacy.rightsLabel}</strong><br />
                    {dict.privacy.rightsValue}</p>

                <p style={{ marginTop: '1.5rem' }}><strong>{dict.privacy.contactLabel}</strong><br />
                    {dict.privacy.contactValue}</p>
            </div>

            <div style={{ marginTop: '4rem', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '2rem' }}>
                <Link href={backLink} style={{ textDecoration: 'none', fontWeight: 'bold' }}>
                    {dict.privacy.back}
                </Link>
            </div>
        </main>
    );
}
