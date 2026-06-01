import { useEffect, useRef, useState } from 'react';
import './styles/kaos.css';

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
const CHECK_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

function KaosWin({ title, heading, children, toolbar = true }: {
  title: string;
  heading?: string;
  children: React.ReactNode;
  toolbar?: boolean;
}) {
  return (
    <div className="kaos-win">
      <div className="kw-bar">
        <span className="kw-lights"><i></i><i></i><i></i></span>
        <span className="kw-title">{title}</span>
        <span className="kw-gear">{SEARCH_SVG}</span>
      </div>
      <div className="kw-body">
        {heading && <div className="kw-h">{heading}</div>}
        {children}
      </div>
      {toolbar && (
        <div className="kw-toolbar">
          {GEAR_SVG}
          <span className="kw-keys"><span className="k">⌃</span><span className="k">⇧</span><span className="k">N</span></span>
          <span className="kw-act">Toggle Window</span>
          <span className="kw-right">{EYE_SVG}</span>
        </div>
      )}
    </div>
  );
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [heroEmail, setHeroEmail] = useState('');
  const [footEmail, setFootEmail] = useState('');
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [footSubmitted, setFootSubmitted] = useState(false);
  const heroLandRef = useRef<HTMLElement>(null);
  const ldSurfaceRef = useRef<HTMLDivElement>(null);
  const ldNoteRef = useRef<HTMLDivElement>(null);
  const tryItSurfaceRef = useRef<HTMLDivElement>(null);
  const tryItHintRef = useRef<HTMLDivElement>(null);

  // Body classes
  useEffect(() => {
    document.body.classList.add('acc-coral', 'dir-a');
    return () => { document.body.classList.remove('acc-coral', 'dir-a', 'demo-fs'); };
  }, []);

  // Fullscreen toggle
  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add('demo-fs');
    } else {
      document.body.classList.remove('demo-fs');
    }
  }, [isFullscreen]);

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

  // Hero note drag
  useEffect(() => {
    const surface = ldSurfaceRef.current;
    const note = ldNoteRef.current;
    if (!surface || !note) return;
    let zTop = 30;
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
    const handle = (note.querySelector('.kw-bar') as HTMLElement) || note;
    let sx = 0, sy = 0, baseL = 0, baseT = 0, dragging = false;

    const onNoteDown = () => { note.style.zIndex = String(++zTop); };
    const onHandleDown = (e: PointerEvent) => {
      if ((e.target as Element).closest('.kw-lights') || (e.target as Element).closest('.kw-gear')) return;
      dragging = true;
      note.classList.add('dragging');
      sx = e.clientX; sy = e.clientY;
      baseL = note.offsetLeft; baseT = note.offsetTop;
      note.style.left = baseL + 'px'; note.style.top = baseT + 'px';
      handle.setPointerCapture(e.pointerId);
      e.preventDefault();
    };
    const onHandleMove = (e: PointerEvent) => {
      if (!dragging) return;
      const sw = surface.clientWidth, sh = surface.clientHeight;
      const nW = note.offsetWidth;
      let nl = baseL + (e.clientX - sx);
      let nt = baseT + (e.clientY - sy);
      nl = clamp(nl, -nW * 0.18, sw - nW * 0.82);
      nt = clamp(nt, 6, sh - 40);
      note.style.left = nl + 'px'; note.style.top = nt + 'px';
    };
    const onEnd = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      note.classList.remove('dragging');
      try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
    };

    note.addEventListener('pointerdown', onNoteDown);
    handle.addEventListener('pointerdown', onHandleDown as EventListener);
    handle.addEventListener('pointermove', onHandleMove as EventListener);
    handle.addEventListener('pointerup', onEnd as EventListener);
    handle.addEventListener('pointercancel', onEnd as EventListener);
    return () => {
      note.removeEventListener('pointerdown', onNoteDown);
      handle.removeEventListener('pointerdown', onHandleDown as EventListener);
      handle.removeEventListener('pointermove', onHandleMove as EventListener);
      handle.removeEventListener('pointerup', onEnd as EventListener);
      handle.removeEventListener('pointercancel', onEnd as EventListener);
    };
  }, []);

  // Try-it sandbox
  useEffect(() => {
    const surface = tryItSurfaceRef.current;
    const hint = tryItHintRef.current;
    const spawnBtn = document.getElementById('stage-spawn');
    const hintTap = document.getElementById('hint-tap');
    const stage = document.getElementById('kaos-stage');
    if (!surface || !spawnBtn) return;
    const surf = surface;

    let zTop = 10, count = 0;
    let activeNote: HTMLElement | null = null;
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

    const SEEDS = [
      { title: 'New note', h: 'Hello 👋', ph: 'Type anything…', body: 'Drag me by the title bar.\nThen drop another with ⌃⇧N.' },
      { title: 'quick.md', h: 'Idea', ph: "What's on your mind?", body: 'Notes float above everything — and hide themselves when you share your screen.' },
      { title: 'today.md', h: 'Today', ph: 'Add a to-do…', body: '• Try the shortcut\n• Drag this around\n• Pile them up' },
      { title: 'Reminder', h: "Don't forget", ph: 'Jot it down…', body: 'Call mom before 6pm 🌿' },
      { title: 'New note', h: '', ph: 'Start typing…', body: '' },
    ];
    const SEARCH = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" stroke-linecap="round"/></svg>';
    const GEAR = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4"/></svg>';
    const EYE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="2.6"/></svg>';

    function placeCaretEnd(node: HTMLElement) {
      node.focus();
      const sel = window.getSelection();
      if (!sel) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    function stageInView() {
      if (!stage) return false;
      const r = stage.getBoundingClientRect();
      return r.top < window.innerHeight * 0.85 && r.bottom > window.innerHeight * 0.15;
    }

    function bringToFront(el: HTMLElement) { el.style.zIndex = String(++zTop); }

    function wireClose(el: HTMLElement) {
      const closeBtn = el.querySelector('.kw-lights i:first-child') as HTMLElement;
      closeBtn.addEventListener('pointerdown', e => e.stopPropagation());
      closeBtn.addEventListener('click', e => {
        e.stopPropagation();
        el.classList.add('closing');
        el.addEventListener('animationend', () => {
          el.remove();
          if (activeNote === el) activeNote = null;
          if (!surf.querySelector('.demo-note') && hint) hint.classList.remove('gone');
        }, { once: true });
      });
    }

    function wireDrag(el: HTMLElement) {
      const handle = el.querySelector('.kw-bar') as HTMLElement;
      let startX = 0, startY = 0, baseL = 0, baseT = 0, dragging = false;
      el.addEventListener('pointerdown', () => bringToFront(el));
      handle.addEventListener('pointerdown', (e: PointerEvent) => {
        if ((e.target as Element).closest('.kw-lights') || (e.target as Element).closest('.kw-gear')) return;
        dragging = true;
        el.classList.add('dragging');
        startX = e.clientX; startY = e.clientY;
        baseL = parseFloat(el.style.left); baseT = parseFloat(el.style.top);
        handle.setPointerCapture(e.pointerId);
        e.preventDefault();
      });
      handle.addEventListener('pointermove', (e: PointerEvent) => {
        if (!dragging) return;
        const sw = surf.clientWidth, sh = surf.clientHeight;
        const nW = el.offsetWidth;
        let nl = baseL + (e.clientX - startX);
        let nt = baseT + (e.clientY - startY);
        nl = clamp(nl, 6, Math.max(6, sw - nW - 6));
        nt = clamp(nt, 6, Math.max(6, sh - 34));
        el.style.left = nl + 'px'; el.style.top = nt + 'px';
      });
      const end = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        el.classList.remove('dragging');
        try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
      };
      handle.addEventListener('pointerup', end);
      handle.addEventListener('pointercancel', end);
    }

    function makeNote(seed: typeof SEEDS[0]) {
      const W = 304;
      const el = document.createElement('div');
      el.className = 'demo-note';
      el.style.width = W + 'px';
      el.innerHTML =
        '<div class="kaos-win" style="width:' + W + 'px">' +
          '<div class="kw-bar">' +
            '<span class="kw-lights"><i title="Close"></i><i></i><i></i></span>' +
            '<span class="kw-title">' + seed.title + '</span>' +
            '<span class="kw-gear">' + SEARCH + '</span>' +
          '</div><div class="kw-body">' +
            (seed.h !== undefined ? '<div class="kw-h" contenteditable="true" spellcheck="false">' + (seed.h || '') + '</div>' : '') +
            '<div class="kw-edit" contenteditable="true" spellcheck="false" data-ph="' + seed.ph + '">' +
              (seed.body || '').replace(/\n/g, '<br>') +
            '</div></div>' +
          '<div class="kw-toolbar">' + GEAR +
            '<span class="kw-keys"><span class="k">⌃</span><span class="k">⇧</span><span class="k">N</span></span>' +
            '<span class="kw-act">Toggle Window</span>' +
            '<span class="kw-right">' + EYE + '</span>' +
          '</div></div>';

      const sw = surf.clientWidth, sh = surf.clientHeight;
      const off = (count % 7) * 26;
      let left = Math.round(sw / 2 - W / 2 - 40 + off);
      let top = Math.round(sh * 0.18 + off);
      left = clamp(left, 12, Math.max(12, sw - W - 12));
      top = clamp(top, 12, Math.max(12, sh - 150));
      el.style.left = left + 'px'; el.style.top = top + 'px';

      surf.appendChild(el);
      count++;
      bringToFront(el);
      wireDrag(el);
      wireClose(el);
      const body = el.querySelector('.kw-edit') as HTMLElement;
      requestAnimationFrame(() => placeCaretEnd(body));
      activeNote = el;
      return el;
    }

    function spawn(seedOverride?: typeof SEEDS[0]) {
      const seed = seedOverride ?? SEEDS[count % SEEDS.length];
      if (hint && !hint.classList.contains('gone')) hint.classList.add('gone');
      if (activeNote) {
        const prev = activeNote;
        activeNote = null;
        prev.classList.add('closing');
        prev.addEventListener('animationend', () => { prev.remove(); activeNote = makeNote(seed); }, { once: true });
      } else {
        activeNote = makeNote(seed);
      }
    }

    const onSpawn = () => spawn();
    const onHintTap = () => spawn();
    const onKeyDown = (e: KeyboardEvent) => {
      const isN = e.key === 'n' || e.key === 'N' || e.code === 'KeyN';
      if (e.ctrlKey && e.shiftKey && !e.altKey && isN && stageInView()) {
        e.preventDefault();
        spawn();
      }
    };

    spawnBtn.addEventListener('click', onSpawn);
    if (hintTap) hintTap.addEventListener('click', onHintTap);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      spawnBtn.removeEventListener('click', onSpawn);
      if (hintTap) hintTap.removeEventListener('click', onHintTap);
      window.removeEventListener('keydown', onKeyDown);
    };
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

  function toggleFullscreen() {
    setIsFullscreen(prev => !prev);
    window.dispatchEvent(new Event('resize'));
  }

  return (
    <>
      {/* HERO LAND */}
      <section className="hero-land" id="hero-land" ref={heroLandRef}>
        <div className="wrap hero-land-wrap">
          <p className="eyebrow pill">Floating sticky notes for Mac</p>
          <h1 className="hero-land-h1">Always<br /><span className="hero-accent">on top.</span></h1>
          <p className="hero-land-sub">Notes that float above every window on your Mac — right where you left them. Catch the thought, keep the calm.</p>
          <form className="waitlist center-x" id="waitlist-hero" noValidate
            onSubmit={e => handleWaitlist(e, heroEmail, setHeroSubmitted, setHeroEmail)}>
            <input type="email" placeholder="you@email.com" aria-label="Email address"
              value={heroEmail} onChange={e => setHeroEmail(e.target.value)} />
            <button type="submit" className="btn btn-primary">Join the waitlist</button>
          </form>
          {heroSubmitted
            ? <p className="form-note hero-land-note form-done">You're on the list — we'll be in touch. ✦</p>
            : <p className="form-note hero-land-note">Free during the beta — drag the note below to try it. ✦</p>
          }
        </div>
      </section>

      {/* DEMO SCENE */}
      <section className="demo-scene" id="demo-scene">
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
                  <span className="mb-right" style={{ marginRight: 10 }}>🔋&nbsp;&nbsp;🔊&nbsp;&nbsp;<b>Sat 9:41</b></span>
                  <button className="demo-fs-btn" type="button" title={isFullscreen ? 'Exit fullscreen' : 'Expand to fullscreen'}
                    onClick={toggleFullscreen}>
                    {isFullscreen ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3v5H3M21 8h-5V3M3 16h5v5M16 21v-5h5"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                      </svg>
                    )}
                    <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
                  </button>
                </div>

                {/* Drag surface */}
                <div className="ld-surface" id="ld-surface" ref={ldSurfaceRef}>
                  {/* Background windows */}
                  <div className="app-win awin-mail" style={{ left: '5%', top: '50%', width: 540, zIndex: 1 }}>
                    <div className="aw-bar">
                      <span className="aw-lights"><i></i><i></i><i></i></span>
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

                  <div className="app-win awin-music" style={{ left: '55%', top: '41%', width: 344, zIndex: 2 }}>
                    <div className="aw-bar">
                      <span className="aw-lights"><i></i><i></i><i></i></span>
                      <span className="aw-title">Now Playing</span>
                    </div>
                    <div className="aw-body musicbody">
                      <div className="album"></div>
                      <div className="m-meta"><span className="mt1"></span><span className="mt2"></span></div>
                      <div className="m-prog"><span></span></div>
                      <div className="m-ctrl"><i></i><i className="big"></i><i></i></div>
                    </div>
                  </div>

                  {/* Floating draggable note */}
                  <div className="ld-note" ref={ldNoteRef} style={{ left: 'calc(50% - 180px)', top: '10%' }}>
                    <KaosWin title="kaos-notes.md" heading="Keep your kaos on top.">
                      <p className="kw-p">Notes that <b>float above every window</b> on your Mac — right where you left them. Catch the thought, then get back to work.<span className="kw-cursor"></span></p>
                    </KaosWin>
                  </div>

                  {/* Always-on-top badge (shows in fullscreen) */}
                  <div className="always-on-top-badge">
                    <span className="aot-dot"></span>Note is always on top
                  </div>

                  {/* Dock */}
                  <div className="dock">
                    <span className="dock-app" style={{ '--c': '#16c172' } as React.CSSProperties}></span>
                    <span className="dock-app" style={{ '--c': '#5ac8fa' } as React.CSSProperties}></span>
                    <span className="dock-app" style={{ '--c': '#ff9f0a' } as React.CSSProperties}></span>
                    <span className="dock-app" style={{ '--c': '#ff375f' } as React.CSSProperties}></span>
                    <span className="dock-app" style={{ '--c': '#bf5af2' } as React.CSSProperties}></span>
                    <span className="dock-sep"></span>
                    <span className="dock-app" style={{ '--c': '#8e8e93' } as React.CSSProperties}></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Fullscreen backdrop */}
        <div className="demo-bd" id="demo-bd" onClick={() => setIsFullscreen(false)}></div>
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

      {/* SHOWCASE */}
      <section className="section alt" id="showcase">
        <div className="wrap">
          <div className="reveal center" style={{ maxWidth: 620, margin: '0 auto 48px' }}>
            <p className="eyebrow" style={{ marginLeft: 'auto', marginRight: 'auto' }}>See it in action</p>
            <h2 className="section-title">It just feels like Mac.</h2>
            <p className="section-sub">Native, fast, and right at home in your menu bar.</p>
          </div>
          <div className="showcase-frame reveal">
            <div className="image-placeholder" style={{ aspectRatio: '16/9' }}>
              Product screenshot — notes floating on a desktop
            </div>
          </div>
          <div className="bento reveal" style={{ marginTop: 20 }}>
            <div className="showcase-frame" style={{ gridColumn: 'span 3' }}>
              <div className="image-placeholder" style={{ aspectRatio: '4/3' }}>
                Close-up: a single note + markdown
              </div>
            </div>
            <div className="showcase-frame" style={{ gridColumn: 'span 3' }}>
              <div className="image-placeholder" style={{ aspectRatio: '4/3' }}>
                The menu bar + hotkey moment
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

      {/* TRY IT */}
      <section className="section alt" id="try">
        <div className="wrap">
          <div className="reveal" style={{ maxWidth: 640, marginBottom: 46 }}>
            <p className="eyebrow">Try it — right here</p>
            <h2 className="section-title">Drop a note. Drag it anywhere.</h2>
            <p className="section-sub">A little playground that works just like the real thing. Hit the shortcut to float a fresh note in, type into it, then drag it around by its title bar.</p>
          </div>
          <div className="sandbox reveal" id="kaos-stage">
            <div className="stage-top">
              <img src="/app_icon.png" alt="" />
              <strong>Kaos&nbsp;Notes</strong>
              <span className="mb">File</span>
              <span className="mb">Edit</span>
              <span className="mb">Note</span>
              <span className="stage-top-right">Playground · drag, type, close</span>
            </div>
            <div className="stage-surface" id="kaos-surface" ref={tryItSurfaceRef}>
              <div className="stage-hint" id="stage-hint" ref={tryItHintRef}>
                <div className="hint-keys">
                  <span className="kbd-key big">⌃</span>
                  <span className="kbd-key big">⇧</span>
                  <span className="kbd-key big">N</span>
                </div>
                <p className="hint-lead">Press the shortcut to drop a note</p>
                <button className="hint-tap" id="hint-tap" type="button">or tap to try it</button>
              </div>
            </div>
            <button className="stage-spawn" id="stage-spawn" type="button">
              <span className="plus">+</span> New note
              <span className="spawn-keys"><span>⌃</span><span>⇧</span><span>N</span></span>
            </button>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section alt" id="pricing">
        <div className="wrap">
          <div className="reveal center" style={{ maxWidth: 620, margin: '0 auto 52px' }}>
            <p className="eyebrow" style={{ marginLeft: 'auto', marginRight: 'auto' }}>Pricing</p>
            <h2 className="section-title">Free to start. Yours to keep.</h2>
            <p className="section-sub">Join the waitlist now — early access is free while we're in beta.</p>
          </div>
          <div className="pricing">
            <div className="price reveal">
              <div className="p-name">Free</div>
              <div className="amount">$0</div>
              <p className="p-desc">Everything you need to capture a thought.</p>
              <ul>
                <li>{CHECK_SVG}Unlimited notes</li>
                <li>{CHECK_SVG}Markdown editor</li>
                <li>{CHECK_SVG}Always on top</li>
              </ul>
              <a href="#waitlist" className="btn btn-ghost">Join the waitlist</a>
            </div>
            <div className="price feature reveal">
              <span className="badge-pop">Most popular</span>
              <div className="p-name">Pro</div>
              <div className="amount">$4<small>/mo</small></div>
              <p className="p-desc">For people who live in their notes.</p>
              <ul>
                <li>{CHECK_SVG}Everything in Free</li>
                <li>{CHECK_SVG}Hide from screen recording</li>
                <li>{CHECK_SVG}Global hotkeys &amp; themes</li>
                <li>{CHECK_SVG}iCloud sync</li>
              </ul>
              <a href="#waitlist" className="btn btn-primary">Join the waitlist</a>
            </div>
            <div className="price reveal">
              <div className="p-name">Lifetime</div>
              <div className="amount">$79<small> once</small></div>
              <p className="p-desc">Pay once. Pro forever, every update.</p>
              <ul>
                <li>{CHECK_SVG}Everything in Pro</li>
                <li>{CHECK_SVG}All future updates</li>
                <li>{CHECK_SVG}Founder's badge</li>
              </ul>
              <a href="#waitlist" className="btn btn-ghost">Join the waitlist</a>
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
                <a href="#pricing">Pricing</a>
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
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a href="#waitlist" className="btn btn-primary fn-cta">Join the waitlist</a>
      </div>
    </>
  );
}

export default App;
