import React, { useState, useEffect, useRef } from 'react';

interface NotesHeroMockupProps {
  desktopRef: React.RefObject<HTMLDivElement | null>;
}

export const NotesHeroMockup: React.FC<NotesHeroMockupProps> = ({ desktopRef }) => {
  // Positioning state (centered by default)
  const [position, setPosition] = useState({ x: 0, y: -20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  
  // Note content state
  const [content, setContent] = useState('');
  const [isTypingSimulated, setIsTypingSimulated] = useState(true);
  
  // Custom states
  const [alwaysOnTop, setAlwaysOnTop] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const fullText = `# A notepad whenever and wherever you need it

always on top

- ⚡ Press **Cmd + Shift + N** to summon instantly
- 📝 Markdown-first rich text editing
- 🔒 Local-first & offline, stored in SQLite
- 🎨 Frosted glass aesthetic
- 📌 Always on top, floats above other windows

*Try typing here or drag me around the desktop!*`;

  // Typing effect on mount
  useEffect(() => {
    if (!isTypingSimulated) return;
    let index = 0;
    setContent('');
    
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setContent(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTypingSimulated(false);
      }
    }, 20); // Fast, snappy typing

    return () => clearInterval(interval);
  }, [isTypingSimulated]);

  // Pointer dragging handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag from the top titlebar/handle
    const target = e.target as HTMLElement;
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

    // Optional bounds checking relative to desktop size
    if (desktopRef.current) {
      const desktopRect = desktopRef.current.getBoundingClientRect();
      
      // Limit bounds so the window doesn't get dragged off-screen completely
      newX = Math.max(-desktopRect.width / 2 + 100, Math.min(desktopRect.width / 2 - 100, newX));
      newY = Math.max(-desktopRect.height / 2 + 50, Math.min(desktopRect.height / 2 - 50, newY));
    }

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // Turn off typing simulation if the user clicks/focuses to edit
  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    setIsTypingSimulated(false);
    setContent(e.currentTarget.innerText);
  };

  return (
    <div
      className={`notes-window ${alwaysOnTop ? 'always-on-top' : ''} ${isMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Titlebar/Drag Handle */}
      <div className="window-titlebar">
        <div className="window-controls">
          <button 
            className="control-btn close" 
            title="Reset Note"
            onClick={() => {
              setIsTypingSimulated(true);
            }} 
          />
          <button 
            className="control-btn minimize" 
            title="Toggle Minimize"
            onClick={() => setIsMinimized(!isMinimized)} 
          />
          <button 
            className="control-btn maximize" 
            title="Toggle Always On Top"
            onClick={() => setAlwaysOnTop(!alwaysOnTop)} 
          />
        </div>
        <div className="drag-handle">
          <span className="window-title-text">Macbook Notes</span>
          {alwaysOnTop && <span className="pinned-badge">Always on Top</span>}
        </div>
        <div className="window-meta">
          <span>Markdown</span>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="editor-container">
        <div className="line-numbers">
          {content.split('\n').map((_, index) => (
            <div key={index} className="line-no">{index + 1}</div>
          ))}
        </div>
        <div 
          className="editor-textarea"
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          onFocus={() => setIsTypingSimulated(false)}
          data-placeholder="Start typing your note here..."
        >
          {content}
        </div>
      </div>

      {/* Status Bar */}
      <div className="window-statusbar">
        <div className="statusbar-left">
          <span>{content.length} characters</span>
          <span>{content.split(/\s+/).filter(Boolean).length} words</span>
        </div>
        <div className="statusbar-right">
          <span>UTF-8</span>
          <span>⌥ Space</span>
        </div>
      </div>
    </div>
  );
};

