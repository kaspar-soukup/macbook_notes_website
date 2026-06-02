import { useEffect, useRef, useState } from 'react';
import { Battery, Volume2, Compass, Mail as MailIcon, Music as MusicIcon, Pin, Shield, FileText, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import './styles/kaos.css';

const ACCENTS = ['', 'acc-blue', 'acc-violet', 'acc-green'];

const SEARCH_SVG = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" strokeLinecap="round"/>
  </svg>
);
const GEAR_SVG = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4"/>
  </svg>
);
const EYE_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="2.6"/>
  </svg>
);
interface KaosWinProps {
  title: string;
  heading?: string;
  children: React.ReactNode;
  toolbar?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onExpand?: () => void;
  onSearch?: () => void;
  onGear?: () => void;
  onToggle?: () => void;
  onEye?: () => void;
  pinned?: boolean;
  privacy?: boolean;
  searchOpen?: boolean;
  onSearchClose?: () => void;
  barHandlers?: React.HTMLAttributes<HTMLDivElement>;
}

function KaosWin({
  title, heading, children, toolbar = true,
  onClose, onMinimize, onExpand, onSearch, onGear, onToggle, onEye,
  pinned, privacy, searchOpen, onSearchClose, barHandlers,
}: KaosWinProps) {
  const interactive = Boolean(onClose || onMinimize || onExpand);
  return (
    <div className={`kaos-win${interactive ? ' kw-interactive' : ''}${privacy ? ' kw-privacy' : ''}`}>
      {interactive && pinned && (
        <div className="kw-pin-badge" title="Always on top">
          <Pin size={12} strokeWidth={2.4} fill="currentColor" />
        </div>
      )}
      {interactive && privacy && (
        <div className="kw-privacy-badge" title="Hidden from screen recordings">
          <Shield size={11} strokeWidth={2.4} />
          Private
        </div>
      )}
      <div className="kw-bar" {...barHandlers}>
        <span className="kw-lights">
          <i onClick={onClose}></i>
          <i onClick={onMinimize}></i>
          <i onClick={onExpand}></i>
        </span>
        <span className="kw-title">{title}</span>
        <span className="kw-gear" onClick={onSearch}>{SEARCH_SVG}</span>
      </div>
      {searchOpen && (
        <div className="kw-search">
          {SEARCH_SVG}
          <input type="text" placeholder="Search this note…" autoFocus />
          <span className="kw-search-close" onClick={onSearchClose}>esc</span>
        </div>
      )}
      <div className="kw-body">
        {heading && <div className="kw-h">{heading}</div>}
        {children}
      </div>
      {toolbar && (
        <div className="kw-toolbar">
          <span className="kw-tool-gear" onClick={onGear}>{GEAR_SVG}</span>
          <span className="kw-keys"><span className="k">⌃</span><span className="k">⇧</span><span className="k">N</span></span>
          <span className={`kw-act${pinned ? ' active' : ''}`} onClick={onToggle}>Toggle Window</span>
          <span className="kw-right" onClick={onEye}>{EYE_SVG}</span>
        </div>
      )}
    </div>
  );
}

type DragState = { dragging: boolean; sx: number; sy: number; baseL: number; baseT: number };
type DragOpts = {
  parentSelector?: string;
  excludeSelector?: string;
  bumpZIndex?: boolean;
  onDragEnd?: (left: number, top: number) => void;
};

function makeDragHandlers(
  dragRef: React.MutableRefObject<DragState>,
  surfaceRef: React.RefObject<HTMLDivElement>,
  opts: DragOpts = {}
) {
  const parentSelector = opts.parentSelector ?? '.app-win';
  const excludeSelector = opts.excludeSelector ?? '.aw-lights';
  const bumpZIndex = opts.bumpZIndex ?? true;
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const finish = (e: React.PointerEvent<HTMLDivElement>) => {
    const wasDragging = dragRef.current.dragging;
    dragRef.current.dragging = false;
    const win = e.currentTarget.closest(parentSelector) as HTMLElement | null;
    win?.classList.remove('dragging');
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
    if (wasDragging && win && opts.onDragEnd) {
      opts.onDragEnd(win.offsetLeft, win.offsetTop);
    }
  };
  return {
    onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
      if ((e.target as Element).closest(excludeSelector)) return;
      const win = e.currentTarget.closest(parentSelector) as HTMLElement;
      if (!win || win.classList.contains('fullscreen')) return;
      const d = dragRef.current;
      d.dragging = true;
      d.sx = e.clientX; d.sy = e.clientY;
      d.baseL = win.offsetLeft; d.baseT = win.offsetTop;
      win.style.left = d.baseL + 'px'; win.style.top = d.baseT + 'px';
      if (bumpZIndex) win.style.zIndex = '25';
      win.classList.add('dragging');
      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
      const d = dragRef.current;
      if (!d.dragging) return;
      const surface = surfaceRef.current;
      const win = e.currentTarget.closest(parentSelector) as HTMLElement;
      if (!surface || !win) return;
      const nW = win.offsetWidth;
      win.style.left = clamp(d.baseL + (e.clientX - d.sx), -nW * 0.18, surface.clientWidth - nW * 0.82) + 'px';
      win.style.top = clamp(d.baseT + (e.clientY - d.sy), 6, surface.clientHeight - 40) + 'px';
    },
    onPointerUp: finish,
    onPointerCancel: finish,
  };
}

const FAQS = [
  { q: 'When does Kaos Notes launch?', a: "We're in private beta now. Join the waitlist and you'll be among the first invited — and you'll get early access free." },
  { q: 'Is it really hidden from screen recordings?', a: "Yes. Kaos Notes uses macOS window-sharing controls so your notes are excluded from screen recordings, screen shares, and screenshots — automatically, with nothing to toggle mid-call." },
  { q: 'Does it sync across my Macs?', a: "Pro syncs your notes securely over iCloud, so a note you start on your laptop is waiting on your desktop. Free keeps everything local on one Mac." },
  { q: 'Is it Mac only?', a: "For now, yes — Kaos Notes is built natively for macOS so it can float above other apps and feel instant. We're listening on iPhone and iPad." },
  { q: 'Will the waitlist cost anything?', a: "Never. Joining is free, and beta access is free. When we launch, Free stays free forever and Pro is an optional upgrade." },
];

function App() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [heroEmail, setHeroEmail] = useState('');
  const [footEmail, setFootEmail] = useState('');
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [footSubmitted, setFootSubmitted] = useState(false);
  const [openApps, setOpenApps] = useState<Set<string>>(new Set(['safari', 'textedit']));
  const [fullscreenApp, setFullscreenApp] = useState<string | null>(null);

  // Persisted positions (so drag survives fullscreen toggle)
  const [mailPos, setMailPos] = useState<{ left: string | number; top: string | number }>({ left: '3%', top: '12%' });
  const [musicPos, setMusicPos] = useState<{ left: string | number; top: string | number }>({ left: '66%', top: '12%' });
  const [finderPos, setFinderPos] = useState<{ left: string | number; top: string | number }>({ left: '8%', top: '46%' });
  const [safariPos, setSafariPos] = useState<{ left: string | number; top: string | number }>({ left: '2%', top: '44%' });
  const [textPos, setTextPos] = useState<{ left: string | number; top: string | number }>({ left: '56%', top: '40%' });

  // Kaos note state
  const [kaosOpen, setKaosOpen] = useState(true);
  const [kaosMinimized, setKaosMinimized] = useState(false);
  const [kaosExpanded, setKaosExpanded] = useState(false);
  const [kaosPinned, setKaosPinned] = useState(true);
  const [kaosPrivacy, setKaosPrivacy] = useState(false);
  const [kaosSearch, setKaosSearch] = useState(false);
  const [kaosAccent, setKaosAccent] = useState(0);

  const toggleApp = (app: string) => {
    setOpenApps(prev => {
      const next = new Set(prev);
      if (next.has(app)) {
        next.delete(app);
        if (fullscreenApp === app) setFullscreenApp(null);
      } else {
        next.add(app);
      }
      return next;
    });
  };
  const closeApp = (app: string) => {
    setOpenApps(prev => { const next = new Set(prev); next.delete(app); return next; });
    if (fullscreenApp === app) setFullscreenApp(null);
  };
  const toggleFullscreen = (app: string) => {
    if (!openApps.has(app)) return;
    setFullscreenApp(prev => prev === app ? null : app);
  };
  const onKaosDockClick = () => {
    if (!kaosOpen) { setKaosOpen(true); setKaosMinimized(false); return; }
    if (kaosMinimized) { setKaosMinimized(false); return; }
  };

  const heroLandRef = useRef<HTMLElement>(null);
  const ldSurfaceRef = useRef<HTMLDivElement>(null);
  const ldNoteRef = useRef<HTMLDivElement>(null);
  const mailDrag = useRef<DragState>({ dragging: false, sx: 0, sy: 0, baseL: 0, baseT: 0 });
  const musicDrag = useRef<DragState>({ dragging: false, sx: 0, sy: 0, baseL: 0, baseT: 0 });
  const finderDrag = useRef<DragState>({ dragging: false, sx: 0, sy: 0, baseL: 0, baseT: 0 });
  const safariDrag = useRef<DragState>({ dragging: false, sx: 0, sy: 0, baseL: 0, baseT: 0 });
  const textDrag = useRef<DragState>({ dragging: false, sx: 0, sy: 0, baseL: 0, baseT: 0 });
  const kaosDrag = useRef<DragState>({ dragging: false, sx: 0, sy: 0, baseL: 0, baseT: 0 });
  const mailHandlers = makeDragHandlers(mailDrag, ldSurfaceRef, {
    onDragEnd: (l, t) => setMailPos({ left: l, top: t }),
  });
  const musicHandlers = makeDragHandlers(musicDrag, ldSurfaceRef, {
    onDragEnd: (l, t) => setMusicPos({ left: l, top: t }),
  });
  const finderHandlers = makeDragHandlers(finderDrag, ldSurfaceRef, {
    onDragEnd: (l, t) => setFinderPos({ left: l, top: t }),
  });
  const safariHandlers = makeDragHandlers(safariDrag, ldSurfaceRef, {
    onDragEnd: (l, t) => setSafariPos({ left: l, top: t }),
  });
  const textHandlers = makeDragHandlers(textDrag, ldSurfaceRef, {
    onDragEnd: (l, t) => setTextPos({ left: l, top: t }),
  });
  const kaosHandlers = makeDragHandlers(kaosDrag, ldSurfaceRef, {
    parentSelector: '.ld-note',
    excludeSelector: '.kw-lights, .kw-gear, .kw-toolbar, .kw-search',
    bumpZIndex: false,
  });

  // Body classes
  useEffect(() => {
    document.body.classList.add('acc-coral', 'dir-a');
    return () => { document.body.classList.remove('acc-coral', 'dir-a'); };
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);


  function handleWaitlist(e: React.FormEvent, email: string, setSubmitted: (v: boolean) => void, setEmail: (v: string) => void) {
    e.preventDefault();
    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
    if (!ok) return;
    setSubmitted(true);
    setEmail('');
  }

  function toggleFaq(idx: number) {
    setFaqOpen(prev => prev === idx ? null : idx);
  }

  return (
    <>
      {/* HERO — live desktop mockup */}
      <section className="section demo-scene hero-demo" id="hero-land" ref={heroLandRef}>
        <div className="wrap">
          <div className="reveal center" style={{ maxWidth: 760, margin: '0 auto 40px' }}>
            <h1 className="section-title hero-demo-h1">Notes wherever you need them.</h1>
            <p className="section-sub hero-demo-sub">Always on top · Keyboard-first · Markdown editor · Hidden from screen recordings</p>
            <form className="waitlist center-x" id="waitlist-hero" noValidate
              onSubmit={e => handleWaitlist(e, heroEmail, setHeroSubmitted, setHeroEmail)}
              style={{ marginTop: 28 }}>
              <input type="email" placeholder="you@email.com" aria-label="Email address"
                value={heroEmail} onChange={e => setHeroEmail(e.target.value)} />
              <button type="submit" className="btn btn-primary">Join the waitlist</button>
            </form>
            {heroSubmitted && <p className="form-note form-done" style={{ marginTop: 12 }}>You're on the list — we'll be in touch. ✦</p>}
          </div>
        </div>
        <div className="demo-pad">
          <div className="demo-outer reveal" id="demo-outer">
            <div className="hero-d">
              <div className="livedesk" id="livedesk">
                {/* Menubar with fullscreen toggle */}
                <div className="menubar">
                  <img src="/app_icon.png" alt="" style={{ width: 15, height: 15, objectFit: 'contain', flexShrink: 0 }} />
                  <strong>Kaos&nbsp;Notes</strong>
                  <span className="mb">File</span>
                  <span className="mb">Edit</span>
                  <span className="mb">Note</span>
                  <span className="mb">Window</span>
                  <span className="mb">Help</span>
                  <div className="mb-right" style={{ marginRight: 10 }}>
                    <Volume2 size={13} strokeWidth={2} style={{ opacity: 0.65 }} />
                    <Battery size={13} strokeWidth={2} style={{ opacity: 0.65 }} />
                    <b>Sat 9:41</b>
                  </div>
                </div>

                {/* Drag surface */}
                <div className="ld-surface" id="ld-surface" ref={ldSurfaceRef}>
                  {/* Background windows */}
                  {openApps.has('mail') && (
                  <div className={`app-win awin-mail${fullscreenApp === 'mail' ? ' fullscreen' : ''}`} style={fullscreenApp === 'mail' ? {} : { left: mailPos.left, top: mailPos.top, width: 540, zIndex: 1 }}>
                    <div className="aw-bar" {...mailHandlers}>
                      <span className="aw-lights">
                        <i className="clickable" onClick={() => closeApp('mail')}></i>
                        <i></i>
                        <i className="clickable" onClick={() => toggleFullscreen('mail')}></i>
                      </span>
                      <span className="aw-title">Mail — Inbox</span>
                    </div>
                    <div className="aw-body mailbody">
                      <div className="mail-side">
                        <span className="msr on"></span><span className="msr"></span><span className="msr"></span>
                        <span className="msr"></span><span className="msr"></span>
                      </div>
                      <div className="mail-main">
                        <div className="mrow on"><span className="mav"></span><span className="ml"><b></b><i></i></span></div>
                        <div className="mrow"><span className="mav"></span><span className="ml"><b></b><i></i></span></div>
                        <div className="mrow"><span className="mav"></span><span className="ml"><b></b><i></i></span></div>
                        <div className="mrow"><span className="mav"></span><span className="ml"><b></b><i></i></span></div>
                      </div>
                    </div>
                  </div>
                  )}

                  {openApps.has('music') && (
                  <div className={`app-win awin-music${fullscreenApp === 'music' ? ' fullscreen' : ''}`} style={fullscreenApp === 'music' ? {} : { left: musicPos.left, top: musicPos.top, width: 344, zIndex: 2 }}>
                    <div className="aw-bar" {...musicHandlers}>
                      <span className="aw-lights">
                        <i className="clickable" onClick={() => closeApp('music')}></i>
                        <i></i>
                        <i className="clickable" onClick={() => toggleFullscreen('music')}></i>
                      </span>
                      <span className="aw-title">Now Playing</span>
                    </div>
                    <div className="aw-body musicbody">
                      <div className="album"></div>
                      <div className="m-meta"><span className="mt1"></span><span className="mt2"></span></div>
                      <div className="m-prog"><span></span></div>
                      <div className="m-ctrl"><i></i><i className="big"></i><i></i></div>
                    </div>
                  </div>
                  )}

                  {openApps.has('finder') && (
                  <div className={`app-win awin-finder${fullscreenApp === 'finder' ? ' fullscreen' : ''}`} style={fullscreenApp === 'finder' ? {} : { left: finderPos.left, top: finderPos.top, width: 500, zIndex: 3 }}>
                    <div className="aw-bar" {...finderHandlers}>
                      <span className="aw-lights">
                        <i className="clickable" onClick={() => closeApp('finder')}></i>
                        <i></i>
                        <i className="clickable" onClick={() => toggleFullscreen('finder')}></i>
                      </span>
                      <span className="aw-title">Finder — Documents</span>
                    </div>
                    <div className="aw-body finderbody">
                      <div className="finder-side">
                        <div className="fs-section">Favorites</div>
                        <div className="fs-item on"><span className="fs-dot" style={{ background: '#5ac8fa' }} />Documents</div>
                        <div className="fs-item"><span className="fs-dot" style={{ background: '#ffcc00' }} />Downloads</div>
                        <div className="fs-item"><span className="fs-dot" style={{ background: '#ff9500' }} />Desktop</div>
                        <div className="fs-item"><span className="fs-dot" style={{ background: '#af52de' }} />Pictures</div>
                        <div className="fs-section">iCloud</div>
                        <div className="fs-item"><span className="fs-dot" style={{ background: '#34c759' }} />Shared</div>
                      </div>
                      <div className="finder-main">
                        <div className="finder-grid">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="finder-file">
                              <div className="ff-thumb" />
                              <div className="ff-label" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  )}

                  {openApps.has('safari') && (
                  <div className={`app-win awin-safari${fullscreenApp === 'safari' ? ' fullscreen' : ''}`} style={fullscreenApp === 'safari' ? {} : { left: safariPos.left, top: safariPos.top, width: 440, zIndex: 4 }}>
                    <div className="aw-bar safari-bar" {...safariHandlers}>
                      <span className="aw-lights">
                        <i className="clickable" onClick={() => closeApp('safari')}></i>
                        <i></i>
                        <i className="clickable" onClick={() => toggleFullscreen('safari')}></i>
                      </span>
                      <div className="safari-nav">
                        <ArrowLeft size={13} strokeWidth={2.2} color="#a1a1a6" />
                        <ArrowRight size={13} strokeWidth={2.2} color="#d2d2d6" />
                      </div>
                      <div className="safari-url">
                        <Lock size={10} strokeWidth={2.4} color="#86868b" />
                        <span>kaosnotes.app</span>
                      </div>
                    </div>
                    <div className="aw-body safaribody">
                      <div className="safari-page">
                        <div className="sp-hero" />
                        <div className="sp-line w70" />
                        <div className="sp-line w50" />
                        <div className="sp-grid">
                          <div className="sp-card" />
                          <div className="sp-card" />
                          <div className="sp-card" />
                        </div>
                      </div>
                    </div>
                  </div>
                  )}

                  {openApps.has('textedit') && (
                  <div className={`app-win awin-text${fullscreenApp === 'textedit' ? ' fullscreen' : ''}`} style={fullscreenApp === 'textedit' ? {} : { left: textPos.left, top: textPos.top, width: 420, zIndex: 5 }}>
                    <div className="aw-bar" {...textHandlers}>
                      <span className="aw-lights">
                        <i className="clickable" onClick={() => closeApp('textedit')}></i>
                        <i></i>
                        <i className="clickable" onClick={() => toggleFullscreen('textedit')}></i>
                      </span>
                      <span className="aw-title">untitled.txt — TextEdit</span>
                    </div>
                    <div className="aw-body textbody">
                      <div className="text-toolbar">
                        <span className="tt-style">B</span>
                        <span className="tt-style tt-i">I</span>
                        <span className="tt-style tt-u">U</span>
                        <span className="tt-sep" />
                        <span className="tt-chip" />
                        <span className="tt-chip" />
                      </div>
                      <div className="text-page">
                        <div className="tp-line w90" />
                        <div className="tp-line w75" />
                        <div className="tp-line w82" />
                        <div className="tp-line w40" />
                        <div className="tp-line w0" />
                        <div className="tp-line w68" />
                        <div className="tp-line w55" />
                      </div>
                    </div>
                  </div>
                  )}

                  {/* Floating draggable note — always-on-top demo */}
                  {kaosOpen && (
                  <div
                    ref={ldNoteRef}
                    className={[
                      'ld-note',
                      kaosPinned ? 'kaos-pinned' : 'kaos-unpinned',
                      kaosMinimized ? 'kaos-minimized' : '',
                      kaosExpanded ? 'kaos-expanded' : '',
                      ACCENTS[kaosAccent],
                    ].filter(Boolean).join(' ')}
                    style={{ left: 'calc(50% - 180px)', top: '12%' }}
                  >
                    <KaosWin
                      title="kaos-notes.md"
                      heading="Keep your kaos on top."
                      pinned={kaosPinned}
                      privacy={kaosPrivacy}
                      searchOpen={kaosSearch}
                      onClose={() => setKaosOpen(false)}
                      onMinimize={() => setKaosMinimized(true)}
                      onExpand={() => setKaosExpanded(v => !v)}
                      onSearch={() => setKaosSearch(v => !v)}
                      onSearchClose={() => setKaosSearch(false)}
                      onGear={() => setKaosAccent(a => (a + 1) % ACCENTS.length)}
                      onToggle={() => setKaosPinned(v => !v)}
                      onEye={() => setKaosPrivacy(v => !v)}
                      barHandlers={kaosHandlers}
                    >
                      <p className="kw-p">Notes that <b>float above every window</b> on your Mac — right where you left them. Catch the thought, then get back to work.<span className="kw-cursor"></span></p>
                    </KaosWin>
                  </div>
                  )}

                  {/* Dock */}
                  <div className="dock">
                    {/* Finder */}
                    <div className="demo-dock-item" title="Finder" onClick={() => toggleApp('finder')}>
                      <div className="demo-squircle" style={{ background: 'linear-gradient(160deg, #2577e3, #1a5bbf)' }}>
                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                          <rect x="21" y="0" width="21" height="42" fill="rgba(255,255,255,0.18)"/>
                          <circle cx="15.5" cy="19" r="4.8" fill="white"/>
                          <circle cx="17" cy="20.5" r="1.9" fill="#1a4fa0"/>
                          <circle cx="26.5" cy="19" r="4.8" fill="white"/>
                          <circle cx="28" cy="20.5" r="1.9" fill="#1a4fa0"/>
                          <path d="M13.5 27.5 Q21 33 28.5 27.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                        </svg>
                      </div>
                      {openApps.has('finder') && <span className="demo-dock-dot" />}
                    </div>

                    {/* Safari */}
                    <div className="demo-dock-item" title="Safari" onClick={() => toggleApp('safari')}>
                      <div className="demo-squircle" style={{ background: 'linear-gradient(160deg, #5ac8fa, #0a84ff)' }}>
                        <Compass size={22} color="white" strokeWidth={1.8} />
                      </div>
                      {openApps.has('safari') && <span className="demo-dock-dot" />}
                    </div>

                    {/* TextEdit */}
                    <div className="demo-dock-item" title="TextEdit" onClick={() => toggleApp('textedit')}>
                      <div className="demo-squircle" style={{ background: 'linear-gradient(160deg, #f2f2f7, #d1d1d6)' }}>
                        <FileText size={22} color="#1d1d1f" strokeWidth={1.8} />
                      </div>
                      {openApps.has('textedit') && <span className="demo-dock-dot" />}
                    </div>

                    {/* Mail */}
                    <div className="demo-dock-item" title="Mail" onClick={() => toggleApp('mail')}>
                      <div className="demo-squircle" style={{ background: 'linear-gradient(160deg, #4db8ff, #006ee6)' }}>
                        <MailIcon size={21} color="white" strokeWidth={1.8} />
                      </div>
                      {openApps.has('mail') && <span className="demo-dock-dot" />}
                    </div>

                    {/* Music */}
                    <div className="demo-dock-item" title="Music" onClick={() => toggleApp('music')}>
                      <div className="demo-squircle" style={{ background: 'linear-gradient(160deg, #ff6b8a, #fc2d55)' }}>
                        <MusicIcon size={21} color="white" strokeWidth={1.8} />
                      </div>
                      {openApps.has('music') && <span className="demo-dock-dot" />}
                    </div>

                    <span className="dock-sep"></span>

                    {/* Kaos Notes */}
                    <div className="demo-dock-item" title="Kaos Notes" onClick={onKaosDockClick}>
                      <div className="demo-squircle">
                        <img src="/app_icon.png" alt="Kaos Notes" />
                      </div>
                      {kaosOpen && <span className="demo-dock-dot" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="wrap">
          <div className="reveal" style={{ maxWidth: 620, marginBottom: 54 }}>
            <p className="eyebrow">Built for the way you think</p>
            <h2 className="section-title">Small app. Sharp details.</h2>
            <p className="section-sub">Everything you'd expect from a thoughtful Mac app — and a few touches you didn't.</p>
          </div>
          <div className="bento">
            <div className="card span4 reveal">
              <div className="feat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7v10M4 7l3.5 4L11 7v10M15 8v8M15 16l3 3 3-3M18 8v8"/>
                </svg>
              </div>
              <h3>Write in Markdown. Read in style.</h3>
              <p>Headings, checklists, bold and links — type it plain and Kaos renders it beautifully, live, as you go.</p>
              <div style={{ marginTop: 26 }}>
                <KaosWin title="groceries.md" heading="Groceries">
                  <ul className="bullets">
                    <li className="done">Oat milk</li>
                    <li><b>Fresh basil</b> 🌱</li>
                    <li><i>Good</i> olive oil<span className="kw-cursor"></span></li>
                  </ul>
                </KaosWin>
              </div>
            </div>

            <div className="card span2 reveal">
              <div className="feat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v9M12 3l-3 3M12 3l3 3M5 21h14M5 16l7 5 7-5"/>
                </svg>
              </div>
              <h3>Always on top</h3>
              <p>Pin a note above every window so it's there the second you need it — and gone when you don't.</p>
            </div>

            <div className="card span2 reveal">
              <div className="feat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3.5-7 10-7c2 0 3.7.6 5.1 1.5M22 12s-3.5 7-10 7c-2 0-3.8-.6-5.2-1.6"/>
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M3 3l18 18"/>
                </svg>
              </div>
              <h3>Invisible on share</h3>
              <p>Your notes disappear from screen recordings and shared screens. Private thoughts stay private.</p>
            </div>

            <div className="card span4 reveal" style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div className="feat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2"/>
                    <path d="M6 10h0M10 10h0M14 10h0M18 10h0M6 14h12"/>
                  </svg>
                </div>
                <h3>A note in a keystroke</h3>
                <p>Summon a fresh note from any app, instantly. Set the shortcut to whatever fits your hands.</p>
              </div>
              <div className="kbd" style={{ marginTop: 0 }}>
                <span className="kbd-key">⌃</span><span className="kbd-key">⇧</span><span className="kbd-key">N</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="wrap">
          <div className="reveal" style={{ maxWidth: 620, marginBottom: 56 }}>
            <p className="eyebrow">How it works</p>
            <h2 className="section-title">Three steps. No friction.</h2>
          </div>
          <div className="steps">
            <div className="step reveal">
              <div className="line"></div>
              <h3>Hit the hotkey</h3>
              <p>Press your shortcut from anywhere — a crisp new note floats in, focused and ready.</p>
            </div>
            <div className="step reveal">
              <div className="line"></div>
              <h3>Jot it down</h3>
              <p>Type in plain Markdown. Checklists, headings and emphasis render as you write.</p>
            </div>
            <div className="step reveal">
              <div className="line"></div>
              <h3>Let it float</h3>
              <p>Pin it on top, tuck it on a Space, or let it hide itself. It's there when you come back.</p>
            </div>
          </div>
        </div>
      </section>



      {/* FAQ */}
      <section className="section" id="faq">
        <div className="wrap">
          <div className="reveal center" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ marginLeft: 'auto', marginRight: 'auto' }}>Questions</p>
            <h2 className="section-title">Good to know</h2>
          </div>
          <div className="faq reveal">
            {FAQS.map((item, idx) => (
              <div key={idx} className={`qa${faqOpen === idx ? ' open' : ''}`}>
                <button className="qa-q" onClick={() => toggleFaq(idx)}>
                  {item.q}
                  <i className="ico">+</i>
                </button>
                <div className="qa-a" style={{ maxHeight: faqOpen === idx ? 500 : 0 }}>
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="waitlist">
        <div className="wrap">
          <div className="center reveal" style={{ maxWidth: 640, margin: '0 auto' }}>
            <h2>Bring a little order to the kaos.</h2>
            <p className="section-sub" style={{ margin: '0 auto 36px' }}>Join the waitlist for early, free access on Mac.</p>
            <form className="waitlist center-x on-dark" id="waitlist-foot" noValidate
              onSubmit={e => handleWaitlist(e, footEmail, setFootSubmitted, setFootEmail)}>
              <input type="email" placeholder="you@email.com" aria-label="Email address"
                value={footEmail} onChange={e => setFootEmail(e.target.value)} />
              <button type="submit" className="btn btn-primary">Join the waitlist</button>
            </form>
            {footSubmitted && <p className="form-note form-done" style={{ marginTop: 12 }}>You're on the list — we'll be in touch. ✦</p>}
          </div>
          <div className="footer-cols">
            <div>
              <a className="brand" href="#top">
                <img className="mark mark-invert" src="/app_icon.png" alt="" />
                <span>Kaos&nbsp;Notes</span>
              </a>
              <p style={{ marginTop: 16, maxWidth: '30ch', fontSize: 14.5, lineHeight: 1.5 }}>
                Floating sticky notes for Mac. Catch the thought, keep the calm.
              </p>
            </div>
            <div className="footer-nav">
              <div className="col">
                <h5>Product</h5>
                <a href="#features">Features</a>
                <a href="#how">How it works</a>
                <a href="#faq">FAQ</a>
              </div>
              <div className="col">
                <h5>Company</h5>
                <a href="#">About</a>
                <a href="#">Blog</a>
                <a href="#">Contact</a>
              </div>
              <div className="col">
                <h5>Legal</h5>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
              </div>
            </div>
          </div>
          <p className="copyright">© 2026 Kaos Notes. Designed for macOS.</p>
        </div>
      </footer>

      {/* FLOAT NAV */}
      <div className="float-nav fn-visible">
        <a className="brand fn-brand" href="#top">
          <img className="mark" src="/app_icon.png" alt="" />
          <span>Kaos&nbsp;Notes</span>
        </a>
        <nav className="fn-links">
          <a href="#features">Features</a>
          <a href="#how">How&nbsp;it&nbsp;works</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a href="#waitlist" className="btn btn-primary fn-cta">Join the waitlist</a>
      </div>
    </>
  );
}

export default App;
