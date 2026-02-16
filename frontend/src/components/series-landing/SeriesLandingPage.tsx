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
    <div className="landing-scope sl-shell" style={{ border: "12px solid #ff00ff", boxSizing: "border-box" }}> 
      <SiteHeader title={config.headerTitle} active={config.activeNav} />

      <main className="sl-main">
        <Hero
          hero={config.hero}
          entries={config.entriesSection.entries}
          targetId={config.entriesSection.id}
          faqId={config.faq.id}
        />

        <Why why={config.why} />

        <section id={config.entriesSection.id} className="sl-section sl-entries">
          <h2 className="sl-title-h2">{config.entriesSection.title}</h2>
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
