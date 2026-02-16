import SeriesLandingPage from '@/components/series-landing/SeriesLandingPage';
import { kitsByLang } from '@/data/kits';

type Props = {
  lang: 'en' | 'tp';
};

export default function KitPage({ lang }: Props) {
  return <SeriesLandingPage config={kitsByLang[lang]} />;
}
