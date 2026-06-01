import React, { useRef } from 'react';
import { NotesHeroMockup } from './NotesHeroMockup';

export const MacDesktop: React.FC = () => {
  const desktopRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mac-desktop" ref={desktopRef}>
      {/* Sleek Top Menu Bar */}
      <div className="desktop-menubar">
        <div className="menubar-left">
          <span className="apple-logo"></span>
          <span className="menu-item active">Notes</span>
          <span className="menu-item">File</span>
          <span className="menu-item">Edit</span>
          <span className="menu-item">Format</span>
          <span className="menu-item">Window</span>
          <span className="menu-item">Help</span>
        </div>
        <div className="menubar-right">
          <span className="menu-icon">🔋 100%</span>
          <span className="menu-icon">📶</span>
          <span className="menu-icon">🔍</span>
          <span className="menu-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Simulated Background Window 1: VS Code / Rust Backend */}
      <div className="bg-window vscode-window">
        <div className="window-header">
          <div className="window-controls">
            <span className="control dot-red"></span>
            <span className="control dot-yellow"></span>
            <span className="control dot-green"></span>
          </div>
          <span className="tab-title">main.rs — macbook_notes</span>
        </div>
        <div className="window-body">
          <pre>
            <code>
{`// src-tauri/src/main.rs
use cocoa::appkit::{NSWindow, NSWindowCollectionBehavior};
use tauri::{App, Manager, Runtime};

fn setup_mac_window<R: Runtime>(app: &mut App<R>) {
    let window = app.get_webview_window("main").unwrap();
    let ns_window = window.ns_window().unwrap() as id;
    
    unsafe {
        // Floating overlay above active workspaces
        let mut collection_behavior = window.collection_behavior().unwrap();
        collection_behavior.insert(
            NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
        );
        window.set_collection_behavior(collection_behavior).unwrap();
    }
}`}
            </code>
          </pre>
        </div>
      </div>

      {/* Simulated Background Window 2: Safari / Documentation */}
      <div className="bg-window safari-window">
        <div className="window-header">
          <div className="window-controls">
            <span className="control dot-red"></span>
            <span className="control dot-yellow"></span>
            <span className="control dot-green"></span>
          </div>
          <div className="safari-address-bar">
            <span>macbooknotes.com/docs</span>
          </div>
        </div>
        <div className="window-body">
          <div className="safari-content">
            <h3>⚡ Keyboard First Shortcuts</h3>
            <p>Macbook Notes stays out of your way until you trigger it. Use the global shortcut to summon, start writing instantly, and dismiss when done.</p>
            <div className="shortcut-row">
              <span className="kbd">⌥ Space</span>
              <span>Open / Close window</span>
            </div>
            <div className="shortcut-row">
              <span className="kbd">⌘ N</span>
              <span>Create new note</span>
            </div>
            <div className="shortcut-row">
              <span className="kbd">⌘ F</span>
              <span>Search in files</span>
            </div>
          </div>
        </div>
      </div>

      {/* The Central Interactive Macbook Notes Mockup */}
      <NotesHeroMockup desktopRef={desktopRef} />

      {/* Sleek macOS Dock */}
      <div className="desktop-dock">
        <div className="dock-icon notes-app-icon active-indicator" title="Macbook Notes">📝</div>
        <div className="dock-icon" title="Finder">📁</div>
        <div className="dock-icon" title="VS Code">💻</div>
        <div className="dock-icon" title="Safari">🌐</div>
        <div className="dock-icon" title="Terminal">🔲</div>
        <div className="dock-divider"></div>
        <div className="dock-icon" title="System Settings">⚙️</div>
      </div>
    </div>
  );
};
