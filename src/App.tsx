import { useEffect, useState } from 'react';
import { MacDesktop } from './components/MacDesktop';
import './App.css';

function App() {
  const [lastKeyPressed, setLastKeyPressed] = useState<string>('None');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let keyDisplay = '';
      if (e.metaKey) keyDisplay += '⌘ ';
      if (e.altKey) keyDisplay += '⌥ ';
      if (e.shiftKey) keyDisplay += '⇧ ';
      
      if (e.key === ' ') {
        keyDisplay += 'Space';
      } else if (e.key !== 'Meta' && e.key !== 'Alt' && e.key !== 'Shift') {
        keyDisplay += e.key.toUpperCase();
      } else {
        keyDisplay = keyDisplay.trim();
      }

      if (keyDisplay) {
        setLastKeyPressed(keyDisplay);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="landing-page">
      {/* Premium Navigation Header */}
      <header className="site-header">
        <div className="logo-container">
          <span className="app-icon">📝</span>
          <span className="brand-name">Macbook Notes</span>
        </div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#docs">Docs</a></li>
          <li><a href="https://github.com/kaspar-soukup/macbook_notes" target="_blank" rel="noreferrer">GitHub</a></li>
        </ul>
        <a href="#download" className="cta-button">Download App</a>
      </header>

      {/* Main Hero Header Section */}
      <section className="hero-section">
        <span className="hero-tagline">always on top</span>
        <h1 className="hero-title">A notepad whenever and wherever you need it</h1>
        <p className="hero-subtitle">
          The keyboard-first, local markdown notes app for macOS. Stays overlayed above other windows, ready at a single keystroke.
        </p>

        {/* The Interactive simulated macOS desktop */}
        <MacDesktop />
      </section>

      {/* Feature Showcase Grid Section */}
      <section id="features" className="features-section">
        <h2 className="section-title">Reclaim your writing focus</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📌</div>
            <h3>Always On Top</h3>
            <p>Floats cleanly above active workspaces, full-screen applications, and windows. Stays present until explicitly dismissed.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Keyboard-First Navigation</h3>
            <p>Designed with zero mouse dependencies. Search files, create, format, and navigate completely with speed shortcuts.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Local-First Architecture</h3>
            <p>Your notes are stored directly on your computer as standard markdown files, indexed seamlessly in a high-speed SQLite database.</p>
          </div>
        </div>
      </section>

      {/* Keyboard HUD */}
      <div className="keyboard-hud">
        <span>Press any key to test:</span>
        <span className="hud-shortcut">{lastKeyPressed}</span>
      </div>
    </div>
  );
}

export default App;
