import React, { useState, useRef } from 'react';

interface NotesWindowProps {
  id: string;
  title: string;
  initialX: number;
  initialY: number;
  children: React.ReactNode;
  alwaysOnTop: boolean;
  onFocus: () => void;
  desktopRef: React.RefObject<HTMLDivElement | null>;
}

export const NotesWindow: React.FC<NotesWindowProps> = ({
  title,
  initialX,
  initialY,
  children,
  alwaysOnTop,
  onFocus,
  desktopRef,
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    onFocus();
    const target = e.target as HTMLElement;
    // Drag from titlebar or specific drag handles
    if (!target.closest('.window-titlebar') && !target.closest('.drag-handle')) return;

    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    let newX = e.clientX - dragStart.current.x;
    let newY = e.clientY - dragStart.current.y;

    // Bounds checking relative to desktop size
    if (desktopRef.current) {
      const desktopRect = desktopRef.current.getBoundingClientRect();
      newX = Math.max(10, Math.min(desktopRect.width - 320, newX));
      newY = Math.max(40, Math.min(desktopRect.height - 240, newY));
    }

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div
      className={`mac-note-window ${alwaysOnTop ? 'focused-window' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: alwaysOnTop ? 10 : 2,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Title bar */}
      <div className="window-titlebar">
        <div className="window-controls">
          <span className="control dot-red"></span>
          <span className="control dot-yellow"></span>
          <span className="control dot-green"></span>
        </div>
        <div className="drag-handle">
          <span className="window-title-text">{title}</span>
        </div>
        <div className="window-search-icon">🔍</div>
      </div>

      {/* Content */}
      <div className="window-content">{children}</div>

      {/* Bottom Action Bar */}
      <div className="window-bottombar">
        <div className="bottombar-left">
          <span className="btn-small">^</span>
          <span className="btn-small">⇧</span>
          <span className="btn-small">N</span>
          <span className="btn-text">Toggle Window</span>
        </div>
        <div className="bottombar-right">
          <span className="btn-icon">👁️</span>
          <span className="btn-drag">:::</span>
        </div>
      </div>
    </div>
  );
};
