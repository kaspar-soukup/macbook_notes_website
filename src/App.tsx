import { useEffect, useState } from 'react';
import { MacDesktop } from './components/MacDesktop';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
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

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you! ${email} has been added to the waitlist.`);
    setEmail('');
  };

  return (
    <div className="landing-page light-theme">
      {/* Sleek Navigation Header */}
      <header className="site-header">
        <div className="logo-container">
          <svg className="brand-logo-svg" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6C8 4.89543 8.89543 4 10 4H12C13.1046 4 14 4.89543 14 6V13.5L20.5 6.5C21.3284 5.67157 22.6716 5.67157 23.5 6.5C24.3284 7.32843 24.3284 8.67157 23.5 9.5L17.5 16L23.5 22.5C24.3284 23.3284 24.3284 24.6716 23.5 25.5C22.6716 26.3284 21.3284 26.3284 20.5 25.5L14 18.5V26C14 27.1046 13.1046 28 12 28H10C8.89543 28 8 27.1046 8 26V6Z" fill="#ff4e2e"/>
          </svg>
          <span className="brand-name">Kaos Notes</span>
        </div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <a href="#waitlist" className="cta-button">Join the waitlist</a>
      </header>

      {/* Main Hero Header Section */}
      <section className="hero-section">
        {/* Floating sticky notes for Mac Pill */}
        <div className="pill-badge">
          <span className="badge-dot"></span>
          always on top
        </div>

        {/* Squiggle Underscored Headline */}
        <h1 className="hero-title">
          A <span className="squiggle-container">
            notepad
            <svg className="squiggle-svg" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 15 C 20 5, 40 25, 60 5 C 80 15, 90 8, 98 10" stroke="#ff4e2e" strokeWidth="4" strokeLinecap="round" fill="none" />
            </svg>
          </span> whenever and wherever you need it
        </h1>

        <p className="hero-subtitle">
          The keyboard-first, local markdown notes app for macOS. Stays overlayed above other windows, ready at a single keystroke.
        </p>

        {/* Waitlist Input bar */}
        <form onSubmit={handleWaitlistSubmit} className="waitlist-form-pill" id="waitlist">
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="waitlist-input"
            required
          />
          <button type="submit" className="waitlist-submit-btn">Join the waitlist</button>
        </form>
        <p className="waitlist-subtext">free during the beta period • note and drag it anywhere. ✦</p>

        {/* The Interactive simulated macOS desktop */}
        <MacDesktop />
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
