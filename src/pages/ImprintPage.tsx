import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styles/kaos.css';

export default function ImprintPage() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <div className="wrap">
          <Link to="/" className="legal-back">
            <ArrowLeft size={16} strokeWidth={2} />
            Back to Kaos Notes
          </Link>
        </div>
      </header>

      <main className="wrap legal-body">
        <div className="legal-content">
          <p className="eyebrow">Legal</p>
          <h1 className="section-title">Imprint</h1>
          <p className="legal-date">Angaben gemäß § 5 TMG / Information according to § 5 TMG</p>

          <section className="legal-section">
            <h2>Responsible for content</h2>
            <p>
              <strong>[YOUR FULL NAME]</strong><br />
              [Street and house number]<br />
              [Postal code] [City]<br />
              [Country]
            </p>
          </section>

          <section className="legal-section">
            <h2>Contact</h2>
            <p>
              Email: <a href="mailto:[YOUR EMAIL]">[YOUR EMAIL]</a><br />
              Website: <a href="https://kaosnotes.app">kaosnotes.app</a>
            </p>
          </section>

          <section className="legal-section">
            <h2>Business registration</h2>
            <p>
              [If applicable: Trade register entry, register court, registration number]<br />
              [If applicable: VAT identification number according to § 27a UStG: DE…]
            </p>
            <p className="legal-placeholder-note">
              If you are operating as an individual (Kleinunternehmer), you can remove the business
              registration section and note your VAT exemption status under § 19 UStG instead.
            </p>
          </section>

          <section className="legal-section">
            <h2>Dispute resolution</h2>
            <p>
              The European Commission provides a platform for online dispute resolution (OS):
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
                {' '}https://ec.europa.eu/consumers/odr/
              </a>.
            </p>
            <p>
              We are not obliged and not willing to participate in dispute resolution proceedings
              before a consumer arbitration board.
            </p>
          </section>

          <section className="legal-section">
            <h2>Liability for content</h2>
            <p>
              As a service provider we are responsible for our own content on this website in
              accordance with general law (§ 7 Abs.1 TMG). According to §§ 8 to 10 TMG, however, we
              are not obligated to monitor transmitted or stored third-party information or to
              investigate circumstances indicating illegal activity.
            </p>
          </section>

          <section className="legal-section">
            <h2>Copyright</h2>
            <p>
              The content and works created by the site operators on these pages are subject to German
              copyright law. Duplication, processing, distribution, or any form of commercialization
              of such material beyond the scope of copyright law requires written consent of the
              respective author or creator.
            </p>
          </section>
        </div>
      </main>

      <footer className="legal-footer">
        <div className="wrap">
          <p>© 2026 Kaos Notes · <Link to="/privacy">Privacy</Link> · <Link to="/imprint">Imprint</Link></p>
        </div>
      </footer>
    </div>
  );
}
