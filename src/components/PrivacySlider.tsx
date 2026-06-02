import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, EyeOff } from 'lucide-react';

export default function PrivacySlider() {
  const [pos, setPos] = useState(55);
  const dragRef = useRef(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      setFromClientX(e.clientX);
    };
    const onUp = () => { dragRef.current = false; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [setFromClientX]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); setPos(p => Math.max(4, p - 4)); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); setPos(p => Math.min(96, p + 4)); }
    else if (e.key === 'Home') { setPos(4); }
    else if (e.key === 'End') { setPos(96); }
  };

  return (
    <div className="ps-frame" ref={frameRef}>
      <div className="ps-layer ps-theirs">
        <PrivacyNote isHidden />
      </div>
      <div className="ps-layer ps-yours" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <PrivacyNote />
      </div>

      <div className="ps-label ps-label-left">What you see</div>
      <div className="ps-label ps-label-right">What they see</div>

      <div
        className="ps-divider"
        style={{ left: `${pos}%` }}
        role="slider"
        tabIndex={0}
        aria-label="Compare what you see versus what they see"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKey}
        onPointerDown={(e) => {
          dragRef.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setFromClientX(e.clientX);
        }}
      >
        <div className="ps-handle">
          <ChevronLeft size={9} strokeWidth={2.6} />
          <ChevronRight size={9} strokeWidth={2.6} />
        </div>
      </div>
    </div>
  );
}

function PrivacyNote({ isHidden = false }: { isHidden?: boolean }) {
  return (
    <div className={`ps-note${isHidden ? ' ps-note-hidden' : ''}`}>
      <div className="ps-note-bar">
        <div className="ps-note-dots" aria-hidden="true">
          <span className="ps-dot ps-dot-red" />
          <span className="ps-dot ps-dot-yellow" />
          <span className="ps-dot ps-dot-green" />
        </div>
        <div className="ps-note-title">Test Note</div>
        <div className="ps-note-actions" aria-hidden="true" />
      </div>
      <div className="ps-note-body">
        <h4>Test Note</h4>
        <ul>
          <li>Bla bla bla</li>
        </ul>
      </div>
      <div className="ps-note-footer">
        <div className="ps-note-keys">
          <span className="ps-key">^</span>
          <span className="ps-key">shift</span>
          <span className="ps-key">N</span>
          <span className="ps-note-caption">Toggle Window</span>
        </div>
        <div className="ps-note-icons" aria-hidden="true">
          <EyeOff size={12} strokeWidth={2} className="ps-note-eye" />
          <span className="ps-note-grip" />
        </div>
      </div>
    </div>
  );
}
