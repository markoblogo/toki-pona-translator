import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '../globals.css';
import { getDictionary } from '@/get-dictionary';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-serif',
    display: 'swap',
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const safeLang = (lang === 'tp' || lang === 'en') ? (lang as 'en' | 'tp') : 'en';
    const dict = await getDictionary(safeLang);

    return {
        title: dict.meta.title,
        description: dict.meta.description,
        alternates: {
            canonical: `https://stoic.abvx.xyz/${safeLang}`,
            languages: {
                en: 'https://stoic.abvx.xyz/en',
                // NOTE: Next Metadata typing only allows specific hreflang codes.
                // We keep route /tp but cast key to avoid TS error; this renders hreflang="tok".
                ['tok' as any]: 'https://stoic.abvx.xyz/tp',
            } as any,
        },
        openGraph: {
            title: dict.meta.title,
            description: dict.meta.description,
            url: `https://stoic.abvx.xyz/${safeLang}`,
            siteName: 'Stoic Wisdom Series',
            locale: safeLang === 'tp' ? 'en_US' : 'en_US',
            type: 'website',
            images: [
                {
                    url: 'https://stoic.abvx.xyz/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Stoic Wisdom Series — toki pona editions',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: dict.meta.title,
            description: dict.meta.description,
            images: ['https://stoic.abvx.xyz/twitter-card.jpg'],
        },
        robots: {
            index: true,
            follow: true,
        }
    };
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const safeLang = (lang === 'tp' || lang === 'en') ? (lang as 'en' | 'tp') : 'en';
    return (
        <html lang={safeLang === 'tp' ? 'tok' : 'en'} className={`${inter.variable} ${playfair.variable}`}>
            <body>{children}</body>
        </html>
    );
}
