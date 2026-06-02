import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styles/kaos.css';

export default function PrivacyPage() {
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
          <h1 className="section-title">Privacy Policy</h1>
          <p className="legal-date">Last updated: June 2, 2026</p>

          <section className="legal-section">
            <h2>1. Overview</h2>
            <p>
              Kaos Notes is a macOS app built to keep your notes local and private. This Privacy Policy
              explains what limited data we collect, why we collect it, and how we protect it. We believe
              your notes are yours — they never leave your Mac unless you explicitly enable iCloud sync.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Data we collect</h2>

            <h3>2.1 Notes and content</h3>
            <p>
              All notes you create in Kaos Notes are stored exclusively on your device using local file
              storage. We have no access to the content of your notes. When iCloud sync is enabled (Pro
              tier), your notes are synced via Apple's iCloud infrastructure — subject to Apple's own
              privacy policy — and are not transmitted to our servers.
            </p>

            <h3>2.2 Email address (optional)</h3>
            <p>
              If you choose to join our mailing list or submit your email after downloading the beta, we
              collect your email address to send you product updates, release notes, and tips. You can
              unsubscribe at any time by clicking the unsubscribe link in any email we send.
            </p>

            <h3>2.3 Crash reports (optional)</h3>
            <p>
              With your explicit permission, Kaos Notes may send anonymised crash reports to help us fix
              bugs. These reports contain information about the crash (stack trace, macOS version, app
              version) but no note content or personal identifiers. You can opt out at any time in the
              app's preferences.
            </p>

            <h3>2.4 Website analytics</h3>
            <p>
              Our marketing website may use privacy-respecting analytics (no cookies, no cross-site
              tracking) to understand aggregate visitor traffic. No personal data is stored or shared
              with third-party ad networks.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. How we use your data</h2>
            <p>We use the limited data we collect solely to:</p>
            <ul>
              <li>Send product updates and release announcements to users who opted in</li>
              <li>Diagnose crashes and improve app stability (with your permission)</li>
              <li>Understand aggregate website traffic to improve our marketing pages</li>
            </ul>
            <p>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </section>

          <section className="legal-section">
            <h2>4. Data retention</h2>
            <p>
              Email addresses are retained until you unsubscribe or request deletion. Anonymised crash
              reports are deleted after 90 days. You can request deletion of your email at any time by
              contacting us at the address below.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Third-party services</h2>
            <p>
              We may use the following third-party services. Each is governed by its own privacy policy:
            </p>
            <ul>
              <li><strong>Apple iCloud</strong> — for optional Pro sync</li>
              <li><strong>[EMAIL PROVIDER]</strong> — for transactional and newsletter emails</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Your rights (GDPR / CCPA)</h2>
            <p>
              Depending on your location, you may have the right to access, correct, or delete any
              personal data we hold about you, and the right to object to or restrict processing.
              To exercise these rights, please contact us at the address below. We will respond within
              30 days.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Children's privacy</h2>
            <p>
              Kaos Notes is not directed at children under 13. We do not knowingly collect personal
              information from children. If you believe a child has provided us with personal data,
              please contact us and we will delete it promptly.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be announced
              via the app or the mailing list. Continued use of Kaos Notes after the effective date
              constitutes your acceptance of the revised policy.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Contact</h2>
            <p>
              Questions about this Privacy Policy? Reach us at:<br />
              <strong>[YOUR NAME / COMPANY NAME]</strong><br />
              [ADDRESS LINE 1]<br />
              [CITY, POSTAL CODE, COUNTRY]<br />
              <a href="mailto:[YOUR EMAIL]">[YOUR EMAIL]</a>
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
