import SeriesLandingPage from '@/components/series-landing/SeriesLandingPage';
import { kitsByLang } from '@/data/kits';

export default function KitEnPage() {
  return <SeriesLandingPage config={kitsByLang.en} />;
}
