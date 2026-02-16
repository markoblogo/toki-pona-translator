import Hero from './Hero';
import Why from './Why';
import EntrySection from './EntrySection';
import MoreBooks from './MoreBooks';
import FAQ from './FAQ';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';
import './series-landing.css';
import type { SeriesLandingConfig } from './types';

type SeriesLandingPageProps = {
  config: SeriesLandingConfig;
};

export default function SeriesLandingPage({ config }: SeriesLandingPageProps) {
  return (
    <div className="landing-scope">
      <div className="sl-shell">
        <LandingHeader />

        <main className="sl-main">
          <Hero hero={config.hero} entries={config.entriesSection.entries} />

          <Why why={config.why} />

          <section id={config.entriesSection.id} className="sl-section sl-entries">
            <h2 className="sl-title-h2">{config.entriesSection.title}</h2>
            {config.entriesSection.entries.map((entry, index) => (
              <EntrySection key={entry.id} entry={entry} reverse={index % 2 === 1} />
            ))}
          </section>

          <MoreBooks section={config.moreSection} />

          <FAQ faq={config.faq} />
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
