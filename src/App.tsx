import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Battery, Volume2, Compass, Mail as MailIcon, Music as MusicIcon, Pin, Shield, FileText, ArrowLeft, ArrowRight, Lock, Settings, HardDrive, Layers } from 'lucide-react';
import PrivacySlider from './components/PrivacySlider';
import './styles/kaos.css';

const FEATURE_REQUEST_ENDPOINT = (import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined) ?? '';
const FEATURE_REQUEST_MAILTO = 'hello@kaosnotes.app';

async function postToFormspree(payload: Record<string, unknown>): Promise<boolean> {
  if (!FEATURE_REQUEST_ENDPOINT) return false;
  try {
    const res = await fetch(FEATURE_REQUEST_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}



const SHORTCUTS_ALL = [
  { category: 'Global', rows: [
    { action: 'Summon / dismiss', keys: ['⌥', '⇧', 'N'] },
  ]},
  { category: 'Notes', rows: [
    { action: 'New note', keys: ['⌘', 'N'] },
    { action: 'Search notes', keys: ['⌘', '\\'] },
    { action: 'Find in note', keys: ['⌘', 'F'] },
  ]},
  { category: 'Window', rows: [
    { action: 'Snap to left half', keys: ['⌘', '⌃', '←'] },
    { action: 'Snap to right half', keys: ['⌘', '⌃', '→'] },
    { action: 'Resize', keys: ['⌘', '⌃', '–'] },
  ]},
  { category: 'Privacy', rows: [
    { action: 'Hide from recording', keys: ['⌘', '⇧', 'H'] },
  ]},
  { category: 'App', rows: [
    { action: 'Settings', keys: ['⌘', ','] },
  ]},
];


const ACCENTS = ['', 'acc-blue', 'acc-violet', 'acc-green'];

const SEARCH_SVG = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" />
  </svg>
);
const GEAR_SVG = <Settings size={15} strokeWidth={1.8} />;
const EYE_SVG = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="2.6" />
  </svg>
);
const APPLE_LOGO_SVG = (
  <img src="/apple_logo.png" alt="Apple logo" style={{ width: 20, height: 20, objectFit: 'contain' }} />
);
const DOTS_SVG = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <circle cx="4" cy="3" r="1.2" /><circle cx="10" cy="3" r="1.2" />
    <circle cx="4" cy="7" r="1.2" /><circle cx="10" cy="7" r="1.2" />
    <circle cx="4" cy="11" r="1.2" /><circle cx="10" cy="11" r="1.2" />
  </svg>
);
interface KaosWinProps {
  title: string;
  heading?: string;
  headingCursor?: boolean;
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
  title, heading, headingCursor, children, toolbar = true,
  onClose, onMinimize, onExpand, onSearch, onGear, onToggle, onEye,
  pinned, privacy, searchOpen, onSearchClose, barHandlers,
}: KaosWinProps) {
  const interactive = Boolean(onClose || onMinimize || onExpand);
  return (
    <div className={`kaos-win${interactive ? ' kw-interactive' : ''}${privacy ? ' kw-privacy' : ''}`}>
      {pinned && (
        <div className="kw-pin-badge" title="Always on top">
          <Pin size={12} strokeWidth={2.4} fill="currentColor" />
        </div>
      )}
      {privacy && (
        <div className="kw-privacy-badge" title="Hidden from screen recordings">
          <Shield size={11} strokeWidth={2.4} />
          Private
        </div>
      )}
      <div className="kw-bar" {...barHandlers}>
        {interactive && (
          <span className="kw-lights">
            <i onClick={onClose}></i>
            <i onClick={onMinimize}></i>
            <i onClick={onExpand}></i>
          </span>
        )}
        <span className="kw-title">{title}</span>
        <span className="kw-gear" onClick={onGear}>{GEAR_SVG}</span>
      </div>
      {searchOpen && (
        <div className="kw-search">
          {SEARCH_SVG}
          <input type="text" placeholder="Search this note…" autoFocus />
          <span className="kw-search-close" onClick={onSearchClose}>esc</span>
        </div>
      )}
      <div className="kw-body">
        {heading && <div className="kw-h">{heading}{headingCursor && <span className="kw-cursor kw-cursor-h"></span>}</div>}
        {children}
      </div>
      {toolbar && (
        <div className="kw-toolbar">
          <span className="kw-tool-search" onClick={onSearch}>{SEARCH_SVG}</span>
          <span className="kw-keys">
            <span className="k">⌥</span><span className="k">⇧</span><span className="k">N</span>
          </span>
          <span className={`kw-act${pinned ? ' active' : ''}`} onClick={onToggle}>Toggle Window</span>
          <span className="kw-right">
            <span className="kw-eye" onClick={onEye}>{EYE_SVG}</span>
            <span className="kw-dots">{DOTS_SVG}</span>
          </span>
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
  surfaceRef: React.RefObject<HTMLDivElement | null>,
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
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) { }
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
  { q: 'Is Kaos Notes free?', a: "Yes. Kaos Notes is free — no paid tiers, no subscription." },
  { q: 'What platforms does it support?', a: "Mac only — Apple Silicon and Intel, macOS 12 or newer." },
  { q: 'Is it really hidden from screen recordings?', a: "Yes. Kaos Notes uses macOS's window-sharing exclusion so your notes are excluded from screen recordings, screen shares, and screenshots. It's on by default, and you can toggle it with ⌘⇧H." },
  { q: 'Where are my notes stored?', a: "Locally on your Mac, as plain Markdown files. No cloud, no account, no telemetry." },
  { q: "It's in beta — is it stable?", a: "Open beta means it's usable every day, but rough edges exist. We ship updates weekly — if something breaks, drop a note in the feature-request box above." },
];

type TodoNode = { id: string; label: string; children?: TodoNode[] };

const TODO_TREE: TodoNode[] = [
  {
    id: 'root',
    label: 'Try Kaos Notes',
    children: [
      { id: 'visit', label: 'Visit the website' },
      { id: 'download', label: 'Download the macOS beta' },
      { id: 'summon', label: 'Summon a note with ⌥⇧N' },
      { id: 'float-hide', label: 'Hide from screen recordings' },
      { id: 'markdown', label: 'Write a quick note in Markdown' },
    ],
  },
];

const INITIAL_DONE = new Set<string>(['visit']);

function TodoList({
  nodes,
  done,
  onToggle,
}: { nodes: TodoNode[]; done: Set<string>; onToggle: (id: string) => void }) {
  return (
    <ul className="kw-todo">
      {nodes.map(node => {
        const isDone = done.has(node.id);
        return (
          <li key={node.id} className={isDone ? 'done' : ''}>
            <span className="chk" onClick={() => onToggle(node.id)} role="checkbox" aria-checked={isDone} tabIndex={0} />
            <span className="lbl">{node.label}</span>
            {node.children && <TodoList nodes={node.children} done={done} onToggle={onToggle} />}
          </li>
        );
      })}
    </ul>
  );
}

function App() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [todoDone, setTodoDone] = useState<Set<string>>(INITIAL_DONE);
  const toggleTodo = (id: string) => {
    setTodoDone(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const [openApps, setOpenApps] = useState<Set<string>>(new Set(['safari', 'textedit']));
  const [fullscreenApp, setFullscreenApp] = useState<string | null>(null);
  const [navScrolled, setNavScrolled] = useState(false);

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadEmail, setDownloadEmail] = useState('');
  const [downloadEmailSubmitted, setDownloadEmailSubmitted] = useState(false);
  const [downloadEmailError, setDownloadEmailError] = useState('');
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  const [featureRequest, setFeatureRequest] = useState('');
  const [featureRequestEmail, setFeatureRequestEmail] = useState('');
  const [featureRequestSent, setFeatureRequestSent] = useState(false);
  const [featureRequestError, setFeatureRequestError] = useState('');

  const submitFeatureRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeatureRequestError('');
    const idea = featureRequest.trim();
    const email = featureRequestEmail.trim();
    if (idea.length < 4) {
      setFeatureRequestError('Tell us a little more — at least a sentence.');
      return;
    }
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setFeatureRequestError('That email doesn’t look right.');
      return;
    }
    if (FEATURE_REQUEST_ENDPOINT) {
      const ok = await postToFormspree({ idea, email, source: 'feature-request', _subject: 'Kaos Notes — feature request' });
      if (!ok) {
        setFeatureRequestError('Could not send right now. Try again in a moment.');
        return;
      }
    } else {
      const subject = encodeURIComponent('Kaos Notes — feature request');
      const body = encodeURIComponent(`${idea}\n\n— ${email || 'anonymous'}`);
      window.location.href = `mailto:${FEATURE_REQUEST_MAILTO}?subject=${subject}&body=${body}`;
    }
    setFeatureRequestSent(true);
  };

  const triggerDownload = (source: string) => {
    // Navigate to the tracked endpoint; it logs the click and 302s to the DMG.
    // Uses a hidden anchor so the main page stays put while Safari/Chrome handle the download.
    const link = document.createElement('a');
    link.href = `/api/download?source=${encodeURIComponent(source)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadStart = (source: string) => {
    triggerDownload(source);
    setShowDownloadModal(true);
    setDownloadEmail('');
    setDownloadEmailSubmitted(false);
    setDownloadEmailError('');
  };

  // Persisted positions (so drag survives fullscreen toggle)
  const [mailPos, setMailPos] = useState<{ left: string | number; top: string | number }>({ left: '3%', top: '12%' });
  const [musicPos, setMusicPos] = useState<{ left: string | number; top: string | number }>({ left: '66%', top: '12%' });
  const [finderPos, setFinderPos] = useState<{ left: string | number; top: string | number }>({ left: '8%', top: '46%' });
  const [safariPos, setSafariPos] = useState<{ left: string | number; top: string | number }>({ left: '2%', top: '18%' });
  const [textPos, setTextPos] = useState<{ left: string | number; top: string | number }>({ left: '56%', top: '16%' });

  // Kaos note state
  const [kaosOpen, setKaosOpen] = useState(true);
  const [kaosMinimized, setKaosMinimized] = useState(false);
  const kaosExpanded = false;
  const kaosPinned = true;
  const kaosPrivacy = false;
  const kaosSearch = false;
  const kaosAccent = 0;

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

  // Nav scroll fade
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


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
            <p className="section-sub hero-demo-sub">Always on top, keyboard-first, local markdown editor, hidden from screen recordings.</p>
            <div style={{ marginTop: 28 }}>
              <button onClick={() => handleDownloadStart('hero')} className="btn btn-primary" style={{ height: 'auto', padding: '16px 36px', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 28 }}>
                {APPLE_LOGO_SVG}
                <span style={{ fontWeight: 700, fontSize: 16.5, letterSpacing: '-0.01em' }}>Get for Mac</span>
              </button>
              <p className="form-note" style={{ marginTop: 12 }}>Requires macOS 12 or newer</p>
            </div>
          </div>
        </div>
        <div className="demo-pad">
          <div className="hero-mobile-preview reveal">
            <div className="hmp-backdrop">
              <div className="hmp-stack">
                {/* Faux background app to show the note is layered ON TOP */}
                <div className="hmp-bg-window" aria-hidden="true">
                  <div className="hmp-bg-bar">
                    <span className="aw-lights"><i></i><i></i><i></i></span>
                    <div className="hmp-bg-url">
                      <Lock size={9} strokeWidth={2.4} color="#86868b" />
                      <span>kaosnotes.app</span>
                    </div>
                  </div>
                  <div className="hmp-bg-body">
                    <div className="sp-hero" />
                    <div className="sp-line w70" />
                    <div className="sp-line w50" />
                    <div className="sp-line w82" />
                    <div className="sp-grid">
                      <div className="sp-card" />
                      <div className="sp-card" />
                      <div className="sp-card" />
                    </div>
                    <div className="sp-line w70" />
                    <div className="sp-line w40" />
                  </div>
                </div>
                <div className="hmp-note">
                  <KaosWin
                    title="kaos-notes.md"
                    heading="Keep your notes on top."
                    toolbar={false}
                  >
                    <p className="kw-p">Kaos Notes that <b>float above every window</b> on your Mac — right where you left them.<span className="kw-cursor"></span></p>
                  </KaosWin>
                </div>
              </div>
              <p className="hmp-caption">Floats above every window on your Mac.</p>
            </div>
          </div>
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
                        title="ToDo"
                        heading="ToDo"
                        headingCursor
                        privacy={kaosPrivacy}
                        searchOpen={kaosSearch}
                        barHandlers={kaosHandlers}
                      >
                        <TodoList nodes={TODO_TREE} done={todoDone} onToggle={toggleTodo} />
                      </KaosWin>
                    </div>
                  )}

                  {/* Dock */}
                  <div className="dock">
                    {/* Finder */}
                    <div className="demo-dock-item" title="Finder" onClick={() => toggleApp('finder')}>
                      <div className="demo-squircle" style={{ background: 'linear-gradient(160deg, #2577e3, #1a5bbf)' }}>
                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                          <rect x="21" y="0" width="21" height="42" fill="rgba(255,255,255,0.18)" />
                          <circle cx="15.5" cy="19" r="4.8" fill="white" />
                          <circle cx="17" cy="20.5" r="1.9" fill="#1a4fa0" />
                          <circle cx="26.5" cy="19" r="4.8" fill="white" />
                          <circle cx="28" cy="20.5" r="1.9" fill="#1a4fa0" />
                          <path d="M13.5 27.5 Q21 33 28.5 27.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" />
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
      <section className="section feat-section" id="features">
        <div className="wrap">
          <div className="reveal" style={{ maxWidth: 600, marginBottom: 48 }}>
            <h2 className="section-title">How Kaos helps you take notes.</h2>
          </div>
          <div className="bento bento-apple">

            {/* Always on top — span4 */}
            <div className="card card-feature span4 reveal">
              <div className="card-copy">
                <p className="card-eyebrow eyebrow">Always on top</p>
                <h3>Always visible and on top of other apps.</h3>
              </div>
              <div className="card-visual cv-onto-stack">
                <div className="cv-onto-win cv-onto-w1">
                  <div className="cv-onto-bar"><span className="kw-lights"><i /><i /><i /></span></div>
                </div>
                <div className="cv-onto-win cv-onto-w2">
                  <div className="cv-onto-bar"><span className="kw-lights"><i /><i /><i /></span></div>
                </div>
                <div className="cv-onto-win cv-onto-w3">
                  <div className="cv-onto-bar"><span className="kw-lights"><i /><i /><i /></span></div>
                </div>
                <div className="cv-onto-note">
                  <KaosWin title="Sprint notes" pinned toolbar={false}>
                    <p>## Sprint notes</p>
                    <p>- Ship login flow</p>
                    <p>- Review design PR</p>
                  </KaosWin>
                </div>
              </div>
            </div>

            {/* Summon — span2 */}
            <div className="card card-feature span2 reveal">
              <div className="card-copy">
                <p className="card-eyebrow eyebrow">Global shortcut</p>
                <h3>Summon it easily with shortcuts.</h3>
              </div>
              <div className="card-visual cv-summon-stack">
                <div className="cv-summon-dim" />
                <div className="cv-summon-note">
                  <KaosWin title="Ideas" toolbar={false}>
                    <p>- New dashboard layout</p>
                    <p>- Ask Maya about API</p>
                  </KaosWin>
                </div>
                <div className="cv-summon-keys">
                  <kbd className="kbd-key-styled">⌥</kbd>
                  <kbd className="kbd-key-styled">⇧</kbd>
                  <kbd className="kbd-key-styled">N</kbd>
                </div>
              </div>
            </div>

            {/* Markdown — span3 */}
            <div className="card card-feature span3 reveal">
              <div className="card-copy">
                <p className="card-eyebrow eyebrow">Markdown</p>
                <h3>Type Markdown and see it rendered.</h3>
              </div>
              <div className="card-visual">
                <div className="cv-md-split">
                  <div className="cv-md-raw">
                    <span>## Meeting</span>
                    <span></span>
                    <span>- [ ] Follow up</span>
                    <span>- [x] Send recap</span>
                    <span>- [ ] Book room</span>
                  </div>
                  <div className="cv-md-rendered">
                    <div className="cv-md-h">Meeting</div>
                    <ul>
                      <li>Follow up</li>
                      <li>Send recap</li>
                      <li>Book room</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Local & private — span3 */}
            <div className="card card-feature span3 reveal">
              <div className="card-copy">
                <p className="card-eyebrow eyebrow">Local &amp; private</p>
                <h3>Store files locally and let LLMs access them.</h3>
              </div>
              <div className="card-visual cv-local">
                <div className="cv-folder">
                  <HardDrive size={20} strokeWidth={1.8} />
                  <div className="cv-folder-files">
                    <div className="cv-file"><FileText size={12} strokeWidth={2} /> meeting-notes.md</div>
                    <div className="cv-file"><FileText size={12} strokeWidth={2} /> sprint-goals.md</div>
                    <div className="cv-file"><FileText size={12} strokeWidth={2} /> ideas.md</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy slider — span6 */}
            <div className="card card-feature card-privacy span6 reveal" id="privacy">
              <div className="card-copy">
                <p className="card-eyebrow eyebrow">Screen privacy</p>
                <h3>Hide it from screen recordings.</h3>
              </div>
              <div className="card-visual cv-privacy">
                <PrivacySlider />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SHORTCUTS */}
      <section className="section" id="shortcuts">
        <div className="wrap">
          <div className="reveal center" style={{ maxWidth: 560, margin: '0 auto 48px' }}>
            <p className="eyebrow" style={{ justifyContent: 'center' }}>Shortcuts</p>
            <h2 className="section-title">Every shortcut.</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>All rebindable from within the app.</p>
          </div>
          <div className="sc-table-wrap reveal">
            {SHORTCUTS_ALL.map(group => (
              <div key={group.category} className="sc-group">
                <div className="sc-cat-label">{group.category}</div>
                {group.rows.map((row, i) => (
                  <div key={i} className="sc-row">
                    <span className="sc-action">{row.action}</span>
                    <span className="sc-keys">
                      {row.keys.map((k, ki) => <kbd key={ki} className="kbd-key-styled">{k}</kbd>)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE REQUESTS */}
      <section className="section section-dark" id="requests">
        <div className="wrap">
          <div className="center reveal" style={{ maxWidth: 580, margin: '0 auto 40px' }}>
            <p className="eyebrow" style={{ justifyContent: 'center' }}>Open beta</p>
            <h2 className="section-title">What should we build next?</h2>
            <p className="section-sub" style={{ margin: '0 auto 24px' }}>Kaos Notes is shaped by the people using it. Missing a shortcut, a layout, an export option? Tell us — we read every one.</p>
            <div className="fr-meta" style={{ justifyContent: 'center' }}>
              <span className="fr-meta-pill"><Layers size={13} strokeWidth={2.2} /> Weekly updates</span>
              <span className="fr-meta-pill"><Shield size={13} strokeWidth={2.2} /> Replies from the team</span>
            </div>
          </div>
          <form className="fr-form-centered reveal" onSubmit={submitFeatureRequest}>
            {featureRequestSent ? (
              <div className="fr-success">
                <div className="fr-success-icon"><Pin size={18} strokeWidth={2.4} fill="currentColor" /></div>
                <h3>Got it. We'll take a look. ✦</h3>
                <p>Thanks for shaping the roadmap. If you left an email, we'll follow up when this lands.</p>
              </div>
            ) : (
              <>
                <label className="fr-label" htmlFor="fr-idea">Your idea</label>
                <textarea
                  id="fr-idea"
                  className="fr-textarea"
                  placeholder="A shortcut to send a note to the trash, a way to export to PDF…"
                  value={featureRequest}
                  onChange={e => setFeatureRequest(e.target.value)}
                  rows={5}
                  required
                />
                <label className="fr-label" htmlFor="fr-email">Email <span className="fr-label-opt">— optional, so we can follow up</span></label>
                <input
                  id="fr-email"
                  type="email"
                  className="fr-input"
                  placeholder="you@email.com"
                  value={featureRequestEmail}
                  onChange={e => setFeatureRequestEmail(e.target.value)}
                />
                {featureRequestError && <p className="fr-error">{featureRequestError}</p>}
                <button type="submit" className="btn btn-primary fr-submit-full">Send request</button>
              </>
            )}
          </form>
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
            <p className="section-sub" style={{ margin: '0 auto 36px' }}>Download the free beta for macOS today.</p>
            <button onClick={() => handleDownloadStart('footer')} className="btn btn-primary" style={{ height: 'auto', padding: '16px 36px', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 28 }}>
              {APPLE_LOGO_SVG}
              <span style={{ fontWeight: 700, fontSize: 16.5, letterSpacing: '-0.01em' }}>Get for Mac</span>
            </button>
            <p className="form-note" style={{ marginTop: 12, color: 'rgba(255,255,255,0.5)' }}>Requires macOS 12 or newer</p>
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
                <a href="#shortcuts">Shortcuts</a>
                <a href="#requests">Requests</a>
                <a href="#faq">FAQ</a>
              </div>
              <div className="col">
                <h5>Legal</h5>
                <Link to="/privacy">Privacy</Link>
                <Link to="/terms">Terms</Link>
                <Link to="/imprint">Imprint</Link>
              </div>
            </div>
          </div>
          <p className="copyright">© 2026 Kaos Notes. Designed for macOS.</p>
        </div>
      </footer>

      {/* MOBILE MENU BACKDROP */}
      {navMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setNavMenuOpen(false)} />
      )}

      {/* FLOAT NAV */}
      <div className={`float-nav fn-visible${navMenuOpen ? ' fn-menu-open' : ''}${navScrolled ? ' fn-scrolled' : ''}`}>
        <a className="brand fn-brand" href="#top">
          <img className="mark" src="/app_icon.png" alt="" />
          <span>Kaos&nbsp;Notes</span>
        </a>
        <nav className="fn-links">
          <div className="fn-drawer-handle" />
          <a href="#features" onClick={() => setNavMenuOpen(false)}>Features</a>
          <a href="#shortcuts" onClick={() => setNavMenuOpen(false)}>Shortcuts</a>
          <a href="#requests" onClick={() => setNavMenuOpen(false)}>Requests</a>
          <a href="#faq" onClick={() => setNavMenuOpen(false)}>FAQ</a>
          <button onClick={() => { setNavMenuOpen(false); handleDownloadStart('nav-menu'); }} className="btn btn-primary fn-menu-download">Download Beta</button>
        </nav>
        <button
          className="fn-menu-toggle"
          aria-label={navMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navMenuOpen}
          onClick={() => setNavMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
        <button onClick={() => handleDownloadStart('nav-cta')} className="btn btn-primary fn-cta">Download</button>
      </div>

      {showDownloadModal && (
        <div className="dl-modal-overlay" onClick={() => setShowDownloadModal(false)}>
          <div className="dl-modal" onClick={e => e.stopPropagation()}>
            <button className="dl-modal-close" aria-label="Close modal" onClick={() => setShowDownloadModal(false)}>×</button>

            <div className="dl-modal-header">
              <div className="dl-downloaded-badge">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7.5" stroke="#22c55e" strokeWidth="1"/><path d="M4.5 8.5L7 11L11.5 5.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Downloaded
              </div>
              <h2 className="dl-modal-title">How to install Kaos Notes</h2>
            </div>

            <div className="dl-steps">
              <div className="dl-step">
                <div className="dl-step-num">1</div>
                <div className="dl-step-card dl-step-card--dark">
                  <div className="dl-step-illustration dl-step-illustration--finder">
                    <div className="dl-finder-bar">
                      <span className="dl-finder-title">Downloads</span>
                    </div>
                    <div className="dl-finder-dock">
                      <div className="dl-dock-item dl-dock-item--blank" />
                      <div className="dl-dock-item dl-dock-item--dmg">
                        <svg width="28" height="32" viewBox="0 0 28 32" fill="none"><rect x="1" y="5" width="22" height="26" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.2"/><path d="M15 5V1H7L1 7v-2" fill="none"/><path d="M1 7H7V1" stroke="#94a3b8" strokeWidth="1.2" fill="none"/><circle cx="20" cy="22" r="7" fill="#1e3a5f"/><path d="M17 22l3 3 3-3M20 17v8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div className="dl-dock-item dl-dock-item--trash">
                        <svg width="22" height="26" viewBox="0 0 22 26" fill="none"><path d="M4 6h14l-1.5 17a1 1 0 01-1 .9H6.5a1 1 0 01-1-.9L4 6z" fill="#94a3b8"/><path d="M2 6h18M8 6V3h6v3" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                    </div>
                    <div className="dl-finder-cursor">
                      <svg width="14" height="18" viewBox="0 0 14 18" fill="none"><path d="M1 1l12 7-5.5 1L5 17 1 1z" fill="white" stroke="#333" strokeWidth="0.8"/></svg>
                    </div>
                  </div>
                </div>
                <p className="dl-step-desc">Open <span className="dl-highlight">KaosNotes.dmg</span> from your <span className="dl-highlight">Downloads</span> folder</p>
              </div>

              <div className="dl-step">
                <div className="dl-step-num">2</div>
                <div className="dl-step-card dl-step-card--light">
                  <div className="dl-step-illustration dl-step-illustration--drag">
                    <div className="dl-drag-app">
                      <img src="/app_icon.png" alt="Kaos Notes" className="dl-drag-icon" />
                      <div className="dl-drag-cursor">
                        <svg width="14" height="18" viewBox="0 0 14 18" fill="none"><path d="M1 1l12 7-5.5 1L5 17 1 1z" fill="white" stroke="#333" strokeWidth="0.8"/></svg>
                      </div>
                    </div>
                    <div className="dl-drag-arrow">→</div>
                    <div className="dl-drag-folder">
                      <svg width="56" height="48" viewBox="0 0 56 48" fill="none"><path d="M2 10C2 7.8 3.8 6 6 6h16l4 6h22c2.2 0 4 1.8 4 4v26c0 2.2-1.8 4-4 4H6c-2.2 0-4-1.8-4-4V10z" fill="#60a5fa"/><path d="M2 16h52" stroke="#3b82f6" strokeWidth="1"/><text x="10" y="38" fontFamily="monospace" fontSize="10" fill="white">A</text></svg>
                    </div>
                  </div>
                </div>
                <p className="dl-step-desc">Drag the <span className="dl-highlight">Kaos Notes icon</span> into your <span className="dl-highlight">Applications</span> folder</p>
              </div>

              <div className="dl-step">
                <div className="dl-step-num">3</div>
                <div className="dl-step-card dl-step-card--light">
                  <div className="dl-step-illustration dl-step-illustration--apps">
                    <div className="dl-apps-list">
                      <div className="dl-apps-header">Applications</div>
                      <div className="dl-apps-row">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#f97316"/><text x="5" y="14" fontFamily="sans-serif" fontSize="10" fill="white">C</text></svg>
                        <span>Calendar</span>
                      </div>
                      <div className="dl-apps-row dl-apps-row--selected">
                        <img src="/app_icon.png" alt="" style={{ width: 20, height: 20, borderRadius: 5 }} />
                        <span>Kaos Notes</span>
                        <div className="dl-apps-cursor">
                          <svg width="12" height="15" viewBox="0 0 14 18" fill="none"><path d="M1 1l12 7-5.5 1L5 17 1 1z" fill="white" stroke="#333" strokeWidth="0.8"/></svg>
                        </div>
                      </div>
                      <div className="dl-apps-row">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#a855f7"/><text x="5" y="14" fontFamily="sans-serif" fontSize="10" fill="white">C</text></svg>
                        <span>Contacts</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="dl-step-desc">Open <span className="dl-highlight">Kaos Notes</span> from your <span className="dl-highlight">Applications</span> folder</p>
              </div>
            </div>

            <div className="dl-email-section">
              {downloadEmailSubmitted ? (
                <p className="dl-email-done">You're on the list — we'll send updates your way.</p>
              ) : (
                <form className="dl-email-form" onSubmit={async (e) => {
                  e.preventDefault();
                  setDownloadEmailError('');
                  const email = downloadEmail.trim();
                  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                    setDownloadEmailError('That email doesn’t look right.');
                    return;
                  }
                  if (FEATURE_REQUEST_ENDPOINT) {
                    const ok = await postToFormspree({ email, source: 'download-modal', _subject: 'Kaos Notes — download signup' });
                    if (!ok) {
                      setDownloadEmailError('Could not save right now. Try again in a moment.');
                      return;
                    }
                  }
                  setDownloadEmailSubmitted(true);
                }}>
                  <p className="dl-email-label">Get notified about new features &amp; tips</p>
                  <div className="dl-email-row">
                    <input
                      type="email"
                      placeholder="you@email.com"
                      aria-label="Email for updates"
                      value={downloadEmail}
                      onChange={e => setDownloadEmail(e.target.value)}
                      required
                      className="dl-email-input"
                    />
                    <button type="submit" className="btn btn-primary dl-email-btn">Notify me</button>
                  </div>
                  {downloadEmailError && <p className="fr-error" style={{ marginTop: 8 }}>{downloadEmailError}</p>}
                </form>
              )}
            </div>

            <div className="dl-modal-footer">
              <span>Problem? </span>
              <button className="dl-retry-link" onClick={() => { triggerDownload('modal-retry'); }}>Download again</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
