import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styles/kaos.css';

export default function TermsPage() {
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
          <h1 className="section-title">Terms of Use</h1>
          <p className="legal-date">Last updated: June 2, 2026</p>

          <section className="legal-section">
            <h2>1. Acceptance of terms</h2>
            <p>
              By downloading, installing, or using Kaos Notes ("the App"), you agree to be bound by
              these Terms of Use. If you do not agree to these terms, do not use the App.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. License</h2>
            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable license to download
              and use Kaos Notes on Apple-branded devices you own or control, solely for your personal,
              non-commercial purposes, in accordance with these Terms.
            </p>
            <p>
              You may not copy, modify, distribute, sell, or sublicense the App. You may not reverse
              engineer, disassemble, or attempt to derive the source code of the App, except as
              permitted by applicable law.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Free and Pro tiers</h2>
            <p>
              Kaos Notes is available in a Free tier and an optional paid Pro tier. The Free tier is
              provided at no cost and may include limitations on features. The Pro tier is available via
              a subscription or one-time purchase and unlocks additional features including iCloud sync.
            </p>
            <p>
              Pricing and features of each tier may change with reasonable notice. Existing paid
              subscribers will be notified of any price changes before they take effect.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Beta software</h2>
            <p>
              Kaos Notes is currently in beta. Beta versions may be unstable, contain bugs, and change
              significantly before general release. We strongly recommend keeping backups of important
              notes. We are not liable for data loss during the beta period.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Acceptable use</h2>
            <p>You agree not to use the App to:</p>
            <ul>
              <li>Violate any applicable law or regulation</li>
              <li>Infringe the intellectual property rights of any third party</li>
              <li>Transmit malware, spam, or other harmful content</li>
              <li>Attempt to gain unauthorised access to our systems or other users' data</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Intellectual property</h2>
            <p>
              The App, its original content, features, and functionality are and will remain the
              exclusive property of [YOUR NAME / COMPANY NAME] and its licensors. Our trademarks and
              trade dress may not be used in connection with any product or service without prior
              written consent.
            </p>
            <p>
              Your notes and content remain entirely your own. We claim no ownership over anything you
              write in Kaos Notes.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Disclaimer of warranties</h2>
            <p>
              The App is provided "as is" and "as available" without any warranty of any kind, express
              or implied. We do not warrant that the App will be uninterrupted, error-free, or free of
              viruses or other harmful components. Your use of the App is at your sole risk.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by applicable law, [YOUR NAME / COMPANY NAME] shall not
              be liable for any indirect, incidental, special, consequential, or punitive damages,
              including loss of data, arising out of or in connection with your use of the App. Our
              total liability to you for any claims arising under these Terms shall not exceed the
              amount you paid for the App in the twelve months preceding the claim.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Privacy</h2>
            <p>
              Your use of the App is also governed by our <Link to="/privacy">Privacy Policy</Link>,
              which is incorporated into these Terms by reference.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Changes to these terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide at least 14 days'
              notice of material changes via the App or email. Continued use after the effective date
              constitutes your acceptance of the updated Terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Governing law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of
              [YOUR JURISDICTION], without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Contact</h2>
            <p>
              Questions about these Terms? Reach us at:<br />
              <a href="mailto:[YOUR EMAIL]">[YOUR EMAIL]</a>
            </p>
          </section>
        </div>
      </main>

      <footer className="legal-footer">
        <div className="wrap">
          <p>© 2026 Kaos Notes · <Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link> · <Link to="/imprint">Imprint</Link></p>
        </div>
      </footer>
    </div>
  );
}
