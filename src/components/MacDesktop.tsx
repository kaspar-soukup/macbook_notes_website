import React, { useRef } from 'react';
import { NotesHeroMockup } from './NotesHeroMockup';
import { Battery, Wifi, Bluetooth, Search, SlidersHorizontal, Compass, Code, Settings } from 'lucide-react';

export const MacDesktop: React.FC = () => {
  const desktopRef = useRef<HTMLDivElement>(null);

  return (
    <div className="macbook-device-wrapper">
      {/* Physical Macbook Bezel & Body Frame */}
      <div className="macbook-bezel">
        {/* Camera Notch */}
        <div className="macbook-camera-notch">
          <div className="camera-lens"></div>
        </div>

        {/* The Screen / Desktop Container */}
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

          {/* macOS Elegant Dock */}
          <div className="desktop-dock">
            {/* Finder */}
            <div className="dock-item" title="Finder">
              <div className="squircle-icon finder-bg">
                <span className="finder-face">☺</span>
              </div>
            </div>

            {/* Safari */}
            <div className="dock-item" title="Safari">
              <div className="squircle-icon safari-bg">
                <Compass size={20} color="#007aff" strokeWidth={2} />
              </div>
            </div>

            {/* VS Code */}
            <div className="dock-item" title="VS Code">
              <div className="squircle-icon vscode-bg">
                <Code size={20} color="#0066b3" strokeWidth={2} />
              </div>
            </div>

            {/* Custom Kaos Notes App (Active indicator) */}
            <div className="dock-item active-app" title="Kaos Notes">
              <img src="/app_icon.png" alt="Kaos Notes" className="squircle-icon kaos-notes-dock-icon" />
              <span className="active-dot"></span>
            </div>

            {/* System Settings */}
            <div className="dock-item" title="System Settings">
              <div className="squircle-icon settings-bg">
                <Settings size={20} color="#8e8e93" strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>

        {/* MacBook bottom bezel bar with subtle logo text */}
        <div className="macbook-bottom-bezel">
          <span className="macbook-logo-text">MacBook Pro</span>
        </div>
      </div>

      {/* Macbook aluminum bottom keyboard hinge base */}
      <div className="macbook-hinge-base"></div>
    </div>
  );
};
