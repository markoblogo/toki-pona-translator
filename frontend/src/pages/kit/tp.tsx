import SeriesLandingPage from '@/components/series-landing/SeriesLandingPage';
import { kitsByLang } from '@/data/kits';

export default function KitTpPage() {
  return <SeriesLandingPage config={kitsByLang.tp} />;
}
