import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import Hero from './Hero';
import Why from './Why';
import EntrySection from './EntrySection';
import MoreBooks from './MoreBooks';
import FAQ from './FAQ';
import type { SeriesLandingConfig } from './types';

type SeriesLandingPageProps = {
  config: SeriesLandingConfig;
};

export default function SeriesLandingPage({ config }: SeriesLandingPageProps) {
  return (
    <div className="min-h-screen bg-white text-[#111]">
      <SiteHeader title={config.headerTitle} active={config.activeNav} />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <Hero
          hero={config.hero}
          entries={config.entriesSection.entries}
          targetId={config.entriesSection.id}
          faqId={config.faq.id}
        />

        <Why why={config.why} />

        <section id={config.entriesSection.id} className="mt-14">
          <h2 className="font-serif text-3xl leading-tight text-[#111827]">{config.entriesSection.title}</h2>
          {config.entriesSection.entries.map((entry, index) => (
            <EntrySection key={entry.id} entry={entry} reverse={index % 2 === 1} />
          ))}
        </section>

        <MoreBooks section={config.moreSection} />

        <FAQ faq={config.faq} />

        <SiteFooter />
      </main>
    </div>
  );
}
