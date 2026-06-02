import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

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
      {/* Your view: the note + editor, clipped to the LEFT of the divider */}
      <div className="ps-yours" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <div className="ps-glow" aria-hidden />
        <PrivacyContent />
      </div>

      <div className="ps-label ps-label-left">Visible to you</div>
      <div className="ps-label ps-label-right">Invisible to others</div>

      <div
        className="ps-divider"
        style={{ left: `${pos}%` }}
        role="slider"
        tabIndex={0}
        aria-label="Compare what is visible to you versus invisible to others"
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

function PrivacyContent() {
  return (
    <div className="ps-content">
      {/* Top: floating Kaos note */}
      <div className="ps-card">
        <div className="ps-card-head">
          <Sparkles size={14} strokeWidth={2.4} className="ps-card-icon" />
          <span className="ps-card-title">Kaos Note</span>
        </div>
        <div className="ps-card-body">
          <p>
            Add a check for missing <code>userId</code> b
          </p>
          <p>
            Also handle <code>data.name</code> safely to
          </p>
        </div>
      </div>

      {/* Bottom: editor window peeking up */}
      <div className="ps-editor">
        <div className="ps-editor-bar">
          <span className="kw-lights"><i /><i /><i /></span>
          <div className="ps-editor-url">
            <span>fetchUserData</span>
          </div>
        </div>
        <div className="ps-editor-body">
          <div className="ps-editor-gutter">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <div className="ps-editor-code">
            <div className="ps-code-line"><span className="tk-c">// Fetch data from API and display results</span></div>
            <div className="ps-code-line" />
            <div className="ps-code-line"><span className="tk-k">import</span> axios <span className="tk-k">from</span> <span className="tk-s">'axios'</span>;</div>
            <div className="ps-code-line" />
            <div className="ps-code-line"><span className="tk-k">async function</span> <span className="tk-f">fetchUserData</span>(userId) {'{'}</div>
            <div className="ps-code-line">&nbsp;&nbsp;<span className="tk-k">try</span> {'{'}</div>
            <div className="ps-code-line ghost" />
            <div className="ps-code-line ghost short" />
          </div>
        </div>
      </div>
    </div>
  );
}
