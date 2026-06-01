import React, { useRef, useState } from 'react';
import { NotesHeroMockup } from './NotesHeroMockup';

export const MacDesktop: React.FC = () => {
  const desktopRef = useRef<HTMLDivElement>(null);
  const [accentColor, setAccentColor] = useState<string>('coral');

  return (
    <div className={`mac-desktop light-desktop accent-${accentColor}`} ref={desktopRef}>
      {/* Sleek Top Menu Bar */}
      <div className="desktop-menubar">
        <div className="menubar-left">
          <span className="apple-logo"></span>
          <span className="menu-item active">Kaos Notes</span>
          <span className="menu-item">File</span>
          <span className="menu-item">Edit</span>
          <span className="menu-item">Note</span>
          <span className="menu-item">Window</span>
          <span className="menu-item">Help</span>
        </div>
        <div className="menubar-right">
          <span className="menu-icon">🔋</span>
          <span className="menu-icon">📶</span>
          <span className="menu-time">Sat 9:41 AM</span>
        </div>
      </div>

      {/* The Single Central Draggable Sticky Notes Mockup */}
      <NotesHeroMockup desktopRef={desktopRef} />

      {/* Accent Switcher Pill at the Bottom */}
      <div className="accent-switcher-bar">
        <span className="accent-label">Accent</span>
        <div className="accent-dots">
          <button
            className={`dot-btn dot-coral ${accentColor === 'coral' ? 'active' : ''}`}
            onClick={() => setAccentColor('coral')}
            title="Coral Accent"
          />
          <button
            className={`dot-btn dot-green ${accentColor === 'green' ? 'active' : ''}`}
            onClick={() => setAccentColor('green')}
            title="Green Accent"
          />
          <button
            className={`dot-btn dot-charcoal ${accentColor === 'charcoal' ? 'active' : ''}`}
            onClick={() => setAccentColor('charcoal')}
            title="Charcoal Accent"
          />
        </div>
      </div>
    </div>
  );
};
