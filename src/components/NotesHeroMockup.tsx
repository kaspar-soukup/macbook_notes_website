import React, { useState, useEffect, useRef } from 'react';
import { MilkdownEditorWrapper } from './MilkdownEditor';
import { Search, Eye, GripVertical } from 'lucide-react';

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

    // Bounds checking relative to desktop size
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
      className={`mac-note-window ${alwaysOnTop ? 'focused-window' : ''} ${isMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '560px',
        height: '380px',
        zIndex: 10,
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
            style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', background: '#ff5f56', cursor: 'pointer' }}
          />
          <button 
            className="control-btn minimize" 
            title="Toggle Minimize"
            onClick={() => setIsMinimized(!isMinimized)} 
            style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', background: '#ffbd2e', cursor: 'pointer', marginLeft: '6px' }}
          />
          <button 
            className="control-btn maximize" 
            title="Toggle Always On Top"
            onClick={() => setAlwaysOnTop(!alwaysOnTop)} 
            style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', background: '#27c93f', cursor: 'pointer', marginLeft: '6px' }}
          />
        </div>
        <div className="drag-handle" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab' }}>
          <span className="window-title-text" style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>Kaos Notes</span>
        </div>
        <Search size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.8 }} />
      </div>

      {/* Editor Content Area */}
      <div className="editor-container" style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, background: 'transparent', height: 'calc(100% - 76px)' }}>
        {isTypingSimulated ? (
          <>
            <div className="line-numbers" style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(0,0,0,0.02)', borderRight: '1px solid rgba(0,0,0,0.04)' }}>
              {content.split('\n').map((_, index) => (
                <div key={index} className="line-no" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', width: '18px', textAlign: 'right' }}>{index + 1}</div>
              ))}
            </div>
            <div 
              className="editor-textarea"
              contentEditable
              suppressContentEditableWarning
              onInput={handleContentChange}
              onFocus={() => setIsTypingSimulated(false)}
              data-placeholder="Start typing your note here..."
              style={{ flexGrow: 1, padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)', outline: 'none', overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', userSelect: 'text', textAlign: 'left' }}
            >
              {content}
            </div>
          </>
        ) : (
          <div className="milkdown-wrapper" onClick={() => setIsTypingSimulated(false)} style={{ flexGrow: 1, width: '100%', height: '100%', overflowY: 'auto', textAlign: 'left' }}>
            <MilkdownEditorWrapper initialContent={content || fullText} />
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="window-bottombar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '36px', padding: '0 14px', borderTop: '1px solid rgba(0,0,0,0.04)', background: 'rgba(0,0,0,0.01)', fontSize: '11px' }}>
        <div className="bottombar-left" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="btn-small" style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, fontSize: '9px', color: 'var(--text-secondary)' }}>^</span>
          <span className="btn-small" style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, fontSize: '9px', color: 'var(--text-secondary)' }}>⇧</span>
          <span className="btn-small" style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, fontSize: '9px', color: 'var(--text-secondary)' }}>N</span>
          <span className="btn-text" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Toggle Window</span>
        </div>
        <div className="bottombar-right" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
          <Eye size={14} style={{ cursor: 'pointer', opacity: 0.8 }} />
          <GripVertical size={14} style={{ cursor: 'pointer', opacity: 0.8 }} />
        </div>
      </div>
    </div>
  );
};
