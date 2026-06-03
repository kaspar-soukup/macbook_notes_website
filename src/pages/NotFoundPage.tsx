import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styles/kaos.css';

export default function NotFoundPage() {
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
        <div className="legal-content" style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 80 }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>404</p>
          <h1 className="section-title">Page not found.</h1>
          <p className="section-sub" style={{ margin: '16px auto 32px', maxWidth: 480 }}>
            The note you were looking for floated somewhere else.
          </p>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', padding: '14px 28px', borderRadius: 24 }}>
            Go home
          </Link>
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
