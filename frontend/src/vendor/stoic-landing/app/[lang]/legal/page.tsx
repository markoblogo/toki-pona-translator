import { getDictionary } from '@/get-dictionary';
import Link from 'next/link';

export default async function LegalPage({ params }: { params: Promise<{ lang: 'en' | 'tp' }> }) {
    let { lang } = await params;

    // Dev guard for undefined lang
    if (!lang) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('LegalPage: lang is undefined, falling back to en');
        }
        lang = 'en';
    }

    const dict = await getDictionary(lang);
    const backLink = `/${lang}`;

    return (
        <main className="container" style={{ padding: '6rem 1.5rem 4rem', minHeight: '60vh', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>
                {dict.legal.title}
            </h1>

            <div style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--color-ink)' }}>
                <p><strong>{dict.legal.editorLabel}</strong><br />
                    {dict.legal.editorValue}</p>

                <p style={{ marginTop: '1.5rem' }}><strong>{dict.legal.contactLabel}</strong><br />
                    <a href="mailto:a.biletskyi@gmail.com" style={{ textDecoration: 'underline' }}>a.biletskyi@gmail.com</a></p>

                <p style={{ marginTop: '1.5rem' }}><strong>{dict.legal.hostingLabel}</strong><br />
                    {dict.legal.hostingValue}</p>

                <p style={{ marginTop: '1.5rem' }}><strong>{dict.legal.ipLabel}</strong><br />
                    {dict.legal.ipValue}</p>

                <p style={{ marginTop: '1.5rem' }}><strong>{dict.legal.liabilityLabel}</strong><br />
                    {dict.legal.liabilityValue}</p>

                <p style={{ marginTop: '1.5rem' }}><strong>{dict.legal.externalLinksLabel}</strong><br />
                    {dict.legal.externalLinksValue}</p>
            </div>

            <div style={{ marginTop: '4rem', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '2rem' }}>
                <Link href={backLink} style={{ textDecoration: 'none', fontWeight: 'bold' }}>
                    {dict.legal.back}
                </Link>
            </div>
        </main>
    );
}
