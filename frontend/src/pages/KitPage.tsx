import SeriesLandingPage from '@/components/series-landing/SeriesLandingPage';
import { kitsLandingConfig } from '@/data/kits';

export default function KitPage() {
  return <SeriesLandingPage config={kitsLandingConfig} />;
}
