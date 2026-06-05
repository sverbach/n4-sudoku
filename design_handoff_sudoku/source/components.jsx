// components.jsx — presentational pieces for the Sudoku app.
// All colors come from CSS vars set on :root by the app (theme/accent tweaks).
// Exports to window: Home, GameHeader, Board, Numpad, Menu, WinOverlay.

const DIFFS = [
  { id: 'easy',      label: 'EASY',      sub: '42 GIVENS' },
  { id: 'medium',    label: 'MEDIUM',    sub: '34 GIVENS' },
  { id: 'hard',      label: 'HARD',      sub: '30 GIVENS' },
  { id: 'very-hard', label: 'VERY HARD', sub: '25 GIVENS' },
];

function peersOf(sel) {
  if (sel == null) return new Set();
  const sr = (sel / 9) | 0, sc = sel % 9;
  const br = (sr / 3 | 0) * 3, bc = (sc / 3 | 0) * 3;
  const set = new Set();
  for (let k = 0; k < 9; k++) { set.add(sr * 9 + k); set.add(k * 9 + sc); }
  for (let r = br; r < br + 3; r++) for (let c = bc; c < bc + 3; c++) set.add(r * 9 + c);
  set.delete(sel);
  return set;
}

function fmt(sec) {
  const m = (sec / 60) | 0, s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

// ─────────────────────────────────────────────────────────────
// HOME — 2×2 difficulty grid + resume bar
// ─────────────────────────────────────────────────────────────
function Home({ onNew, resume, theme, onToggleTheme }) {
  return (
    <div className="screen home">
      <ThemeToggle className="home-tt" onToggle={onToggleTheme} />
      <div className="home-top">
        <div className="logo">n4-<br/>sud<br/>oku</div>
        <div className="tag">OFFLINE · NO ACCOUNT</div>
      </div>

      {resume && (
        <button className="resume" onClick={resume.onResume}>
          <span className="resume-l">
            <span className="resume-k">▶ RESUME</span>
            <span className="resume-v">{resume.label}</span>
          </span>
          <span className="resume-time">{fmt(resume.seconds)}</span>
        </button>
      )}

      <div className="diff-grid">
        {DIFFS.map((d) => (
          <button key={d.id} className="diff-card" onClick={() => onNew(d.id)}>
            <span className="diff-label">{d.label}</span>
            <span className="diff-sub">{d.sub}</span>
            <span className="diff-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// THEME TOGGLE — brutalist contrast glyph (half-filled circle)
// ─────────────────────────────────────────────────────────────
function ThemeToggle({ onToggle, className }) {
  return (
    <button className={'theme-toggle ' + (className || '')} onClick={onToggle}
            aria-label="Toggle light or dark" title="Light / dark">
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M10 1.8 a8.2 8.2 0 0 1 0 16.4 z" fill="currentColor" />
      </svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// GAME HEADER — back · difficulty · timer (Monolith)
// ─────────────────────────────────────────────────────────────
function GameHeader({ difficulty, seconds, paused, onBack, onPause, onToggleTheme }) {
  const label = (DIFFS.find((d) => d.id === difficulty) || {}).label || '';
  return (
    <div className="g-header">
      <div className="g-topbar">
        <button className="back" onClick={onBack}>← MENU</button>
        <ThemeToggle onToggle={onToggleTheme} />
      </div>
      <div className="g-stats">
        <div className="stat">
          <div className="stat-k">DIFFICULTY</div>
          <div className="stat-v">{label}</div>
        </div>
        <div className="stat right">
          <div className="stat-k">TIME</div>
          <button className="stat-v timer" onClick={onPause} title="Pause / resume">
            {paused ? '▶ ' + fmt(seconds) : fmt(seconds)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BOARD
// ─────────────────────────────────────────────────────────────
function Board({ values, givenMask, notes, selected, conflicts, highlightPeers, selStyle, onSelect, paused }) {
  const peers = highlightPeers ? peersOf(selected) : new Set();
  const selVal = selected != null ? values[selected] : 0;

  const cells = [];
  for (let i = 0; i < 81; i++) {
    const r = (i / 9) | 0, c = i % 9;
    const v = values[i];
    const given = givenMask[i];
    const isSel = i === selected;
    const isPeer = peers.has(i);
    const isConflict = conflicts.has(i);
    const sameVal = selVal && v === selVal && !isSel;
    const note = notes[i];

    const cls = ['cell'];
    if (c % 3 === 2 && c !== 8) cls.push('bx-r');
    if (r % 3 === 2 && r !== 8) cls.push('bx-b');
    if (isPeer) cls.push('peer');
    if (sameVal) cls.push('same');
    if (isConflict) cls.push('conflict');
    if (isSel) cls.push(selStyle === 'ring' ? 'sel-ring' : 'sel-invert');
    if (given) cls.push('given');

    cells.push(
      <div key={i} className={cls.join(' ')} onClick={() => onSelect(i)}>
        {note && note.length && !v ? (
          <div className="notes">
            {[1,2,3,4,5,6,7,8,9].map((n) => (
              <span key={n} className={note.includes(n) ? 'on' : ''}>{n}</span>
            ))}
          </div>
        ) : (
          <span className="digit">{v || ''}</span>
        )}
      </div>
    );
  }

  return (
    <div className={'board' + (paused ? ' paused' : '')}>
      <div className="board-grid">{cells}</div>
      {paused && <div className="pause-veil">PAUSED</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NUMPAD (Typesetter — big numerals, dim when all 9 placed)
// ─────────────────────────────────────────────────────────────
function Numpad({ counts, onNum, numFont }) {
  return (
    <div className="numpad" style={{ fontFamily: numFont }}>
      {[1,2,3,4,5,6,7,8,9].map((n) => (
        <button
          key={n}
          className={'num' + (counts[n] >= 9 ? ' done' : '')}
          onClick={() => onNum(n)}
        >{n}</button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MENU (Typesetter — text labels, accent underline on active)
// ─────────────────────────────────────────────────────────────
function Menu({ notesMode, onToggleNotes, onErase }) {
  return (
    <div className="menu">
      <button className={'menu-item' + (notesMode ? ' active' : '')} onClick={onToggleNotes}>
        NOTES<span className="state">{notesMode ? ' ON' : ' OFF'}</span>
      </button>
      <button className="menu-item" onClick={onErase}>ERASE</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WIN
// ─────────────────────────────────────────────────────────────
function WinOverlay({ seconds, difficulty, onNew, onMenu }) {
  const label = (DIFFS.find((d) => d.id === difficulty) || {}).label || '';
  return (
    <div className="win">
      <div className="win-card">
        <div className="win-k">SOLVED</div>
        <div className="win-time">{fmt(seconds)}</div>
        <div className="win-sub">{label} · NO MISTAKES</div>
        <div className="win-actions">
          <button className="btn-solid" onClick={() => onNew(difficulty)}>NEW · {label}</button>
          <button className="btn-line" onClick={onMenu}>MENU</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Home, GameHeader, ThemeToggle, Board, Numpad, Menu, WinOverlay, peersOf, fmtTime: fmt, DIFFS });
