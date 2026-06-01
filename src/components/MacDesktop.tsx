import React, { useRef } from 'react';
import { NotesHeroMockup } from './NotesHeroMockup';
import { Battery, Wifi, Bluetooth, Search, SlidersHorizontal } from 'lucide-react';

export const MacDesktop: React.FC = () => {
  const desktopRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mac-desktop light-desktop accent-coral" ref={desktopRef}>
      {/* Sleek Top Menu Bar */}
      <div className="desktop-menubar">
        <div className="menubar-left">
          <span className="apple-logo" style={{ color: '#555555' }}></span>
          <span className="menu-item active" style={{ color: '#111111', fontWeight: 700 }}>Kaos Notes</span>
          <span className="menu-item" style={{ color: '#555555' }}>File</span>
          <span className="menu-item" style={{ color: '#555555' }}>Edit</span>
          <span className="menu-item" style={{ color: '#555555' }}>Note</span>
          <span className="menu-item" style={{ color: '#555555' }}>Window</span>
          <span className="menu-item" style={{ color: '#555555' }}>Help</span>
        </div>
        
        {/* Grey status/tray icons including the user's app icon */}
        <div className="menubar-right" style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#7e7e7e' }}>
          {/* User's custom app icon running in the menu bar */}
          <img 
            src="/app_icon.png" 
            alt="Kaos Notes Menu Icon" 
            style={{ width: '16px', height: '16px', borderRadius: '4px', filter: 'brightness(0.95)' }} 
            title="Kaos Notes Status"
          />
          <Bluetooth size={15} strokeWidth={2} style={{ opacity: 0.8 }} />
          <Wifi size={15} strokeWidth={2} style={{ opacity: 0.8 }} />
          <Battery size={15} strokeWidth={2} style={{ opacity: 0.8 }} />
          <Search size={15} strokeWidth={2} style={{ opacity: 0.8 }} />
          <SlidersHorizontal size={15} strokeWidth={2} style={{ opacity: 0.8 }} />
          <span className="menu-time" style={{ fontSize: '12px', fontWeight: '600', color: '#444444', marginLeft: '4px' }}>Sat 9:41 AM</span>
        </div>
      </div>

      {/* The Single Central Draggable Sticky Notes Mockup */}
      <NotesHeroMockup desktopRef={desktopRef} />
    </div>
  );
};
