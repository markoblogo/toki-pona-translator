import type { SeriesLandingConfig } from './types';

type Props = {
  labels: SeriesLandingConfig['labels'];
};

export default function LandingFooter({ labels }: Props) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid">
          <div className="leftCol">
            <div className="contactRow">
              <h4 className="contactLabel">{labels.contact}</h4>
              <a href="mailto:a.biletskyi@gmail.com?subject=Toki%20Pona%20Reader%20Kits" className="mailLink">
                a.biletskyi@gmail.com
              </a>

              <div className="socials">
                <a href="https://abvcreative.medium.com/" target="_blank" rel="noopener noreferrer" className="socialLink">{labels.medium}</a>
                <a href="https://abvx.substack.com/" target="_blank" rel="noopener noreferrer" className="socialLink">{labels.substack}</a>
                <a href="https://github.com/markoblogo" target="_blank" rel="noopener noreferrer" className="socialLink">{labels.github}</a>
              </div>
            </div>

            <div className="legalRow">
              <a href="https://abvx.xyz" target="_blank" rel="noopener noreferrer" className="copyright">© 2026 ABVX.xyz</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
