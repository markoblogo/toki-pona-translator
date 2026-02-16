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
    <div className="kitLanding main">
      <LandingHeader lang={config.lang} nav={config.nav} />

      <main className="pageContainer">
        <Hero hero={config.hero} entries={config.entriesSection.entries} />

        <Why why={config.why} />

        <section id={config.entriesSection.id} className="section collectionSection">
          <h2 className="title">{config.entriesSection.title}</h2>
          {config.entriesSection.entries.map((entry, index) => (
            <EntrySection key={entry.id} entry={entry} labels={config.labels} reverse={index % 2 === 1} />
          ))}
        </section>

        <MoreBooks section={config.moreSection} labels={config.labels} />

        <FAQ faq={config.faq} />
      </main>

      <LandingFooter labels={config.labels} />
    </div>
  );
}
