import KitEnPage from './kit/en';
import KitTpPage from './kit/tp';

type Props = {
  lang: 'en' | 'tp';
};

export default function KitPage({ lang }: Props) {
  return lang === 'tp' ? <KitTpPage /> : <KitEnPage />;
}
