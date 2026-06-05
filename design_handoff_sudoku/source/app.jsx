// app.jsx — root: state, persistence, theming, tweaks. Loads after the others.
const { useState, useEffect, useRef, useCallback } = React;

const SAVE_KEY = 'sudoku.save.v1';

const THEMES = {
  light: {
    '--bg': '#f5f5f0', '--paper': '#f5f5f0', '--ink': '#0a0a0a',
    '--line': '#cdccc4', '--box': '#0a0a0a', '--peer': '#e8e7e0',
    '--faint': '#8a8a82', '--note': '#8f8e86',
    '--selbg': '#0a0a0a', '--selink': '#f5f5f0',
    '--conflictbg': 'rgba(229,52,31,0.12)',
  },
  dark: {
    '--bg': '#0a0a09', '--paper': '#121210', '--ink': '#f1f0ea',
    '--line': '#272720', '--box': '#7d7c72', '--peer': '#1d1d18',
    '--faint': '#6f6e66', '--note': '#73726a',
    '--selbg': '#f1f0ea', '--selink': '#0c0c0b',
    '--conflictbg': 'rgba(229,52,31,0.20)',
  },
};
const NUMFONTS = { martian: "'Martian Mono', monospace", mono: "'JetBrains Mono', monospace" };

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#e5341f",
  "theme": "light",
  "peers": true,
  "selStyle": "invert",
  "numFont": "martian"
}/*EDITMODE-END*/;

function makeGame(difficulty) {
  const { puzzle, solution } = window.Sudoku.generate(difficulty);
  return {
    difficulty,
    givenMask: puzzle.map((v) => v !== 0),
    values: puzzle.slice(),
    notes: Array.from({ length: 81 }, () => []),
    solution,
    seconds: 0,
    won: false,
  };
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [screen, setScreen] = useState('home');
  const [game, setGame] = useState(null);
  const [selected, setSelected] = useState(null);
  const [notesMode, setNotesMode] = useState(false);
  const [paused, setPaused] = useState(false);
  const [generating, setGenerating] = useState(false);
  const loaded = useRef(false);

  // ── load saved state once ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.game) {
          setGame(s.game);
          setSelected(s.selected ?? null);
          setNotesMode(!!s.notesMode);
          if (s.screen === 'game' && !s.game.won) setScreen('game');
        }
      }
    } catch (e) {}
    loaded.current = true;
  }, []);

  // ── persist ──
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ screen, game, selected, notesMode }));
    } catch (e) {}
  }, [screen, game, selected, notesMode]);

  // ── theme / accent vars ──
  useEffect(() => {
    const root = document.documentElement;
    const vars = THEMES[t.theme] || THEMES.light;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('color-scheme', t.theme === 'dark' ? 'dark' : 'light');
  }, [t.theme, t.accent]);

  // ── timer ──
  useEffect(() => {
    if (screen !== 'game' || !game || game.won || paused) return;
    const id = setInterval(() => {
      setGame((g) => (g && !g.won ? { ...g, seconds: g.seconds + 1 } : g));
    }, 1000);
    return () => clearInterval(id);
  }, [screen, game && game.won, paused]);

  const conflicts = game ? window.Sudoku.conflicts(game.values) : new Set();
  const counts = game ? window.Sudoku.counts(game.values) : [];

  // ── actions ──
  const newGame = useCallback((difficulty) => {
    setGenerating(true);
    setPaused(false);
    setTimeout(() => {
      const g = makeGame(difficulty);
      setGame(g);
      setSelected(null);
      setNotesMode(false);
      setScreen('game');
      setGenerating(false);
    }, 30);
  }, []);

  const place = useCallback((n) => {
    setGame((g) => {
      if (!g || g.won || selected == null || g.givenMask[selected]) return g;
      const values = g.values.slice();
      const notes = g.notes.map((a) => a.slice());
      if (notesMode) {
        values[selected] = 0;
        const arr = notes[selected];
        const k = arr.indexOf(n);
        if (k === -1) arr.push(n); else arr.splice(k, 1);
      } else {
        values[selected] = values[selected] === n ? 0 : n;
        notes[selected] = [];
      }
      const won = window.Sudoku.isComplete(values);
      return { ...g, values, notes, won };
    });
  }, [selected, notesMode]);

  const erase = useCallback(() => {
    setGame((g) => {
      if (!g || selected == null || g.givenMask[selected]) return g;
      const values = g.values.slice();
      const notes = g.notes.map((a) => a.slice());
      values[selected] = 0;
      notes[selected] = [];
      return { ...g, values, notes, won: false };
    });
  }, [selected]);

  // ── keyboard support ──
  useEffect(() => {
    if (screen !== 'game') return;
    const onKey = (e) => {
      if (e.key >= '1' && e.key <= '9') { place(+e.key); }
      else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') { erase(); }
      else if (e.key === 'n' || e.key === 'N') { setNotesMode((m) => !m); }
      else if (e.key.startsWith('Arrow') && selected != null) {
        let r = (selected / 9) | 0, c = selected % 9;
        if (e.key === 'ArrowUp') r = Math.max(0, r - 1);
        if (e.key === 'ArrowDown') r = Math.min(8, r + 1);
        if (e.key === 'ArrowLeft') c = Math.max(0, c - 1);
        if (e.key === 'ArrowRight') c = Math.min(8, c + 1);
        setSelected(r * 9 + c);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, selected, place, erase]);

  const resume = (game && !game.won)
    ? { label: (window.DIFFS.find((d) => d.id === game.difficulty) || {}).label, seconds: game.seconds, onResume: () => setScreen('game') }
    : null;

  const toggleTheme = () => setTweak('theme', t.theme === 'dark' ? 'light' : 'dark');

  return (
    <div className="app">
      {screen === 'home' && <Home onNew={newGame} resume={resume} theme={t.theme} onToggleTheme={toggleTheme} />}

      {screen === 'game' && game && (
        <div className="screen game-screen">
          <GameHeader
            difficulty={game.difficulty}
            seconds={game.seconds}
            paused={paused}
            onBack={() => setScreen('home')}
            onPause={() => setPaused((p) => !p)}
            onToggleTheme={toggleTheme}
          />
          <div className="board-wrap">
            <Board
              values={game.values}
              givenMask={game.givenMask}
              notes={game.notes}
              selected={selected}
              conflicts={conflicts}
              highlightPeers={t.peers}
              selStyle={t.selStyle}
              paused={paused}
              onSelect={setSelected}
            />
          </div>
          <div className="controls">
            <Numpad counts={counts} onNum={place} numFont={NUMFONTS[t.numFont]} />
            <Menu notesMode={notesMode} onToggleNotes={() => setNotesMode((m) => !m)} onErase={erase} />
          </div>
          {game.won && (
            <WinOverlay
              seconds={game.seconds}
              difficulty={game.difficulty}
              onNew={newGame}
              onMenu={() => setScreen('home')}
            />
          )}
        </div>
      )}

      {generating && (
        <div className="generating"><span>GENERATING<span className="dots">…</span></span></div>
      )}

      <TweaksPanel>
        <TweakSection label="Accent" />
        <TweakColor label="Accent" value={t.accent}
          options={['#e5341f', '#1f8a5b', '#2a6fdb', '#7a5ae0', '#0a0a0a']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Surface" />
        <TweakRadio label="Theme" value={t.theme} options={['light', 'dark']}
          onChange={(v) => setTweak('theme', v)} />
        <TweakSection label="Board" />
        <TweakRadio label="Selection" value={t.selStyle} options={['invert', 'ring']}
          onChange={(v) => setTweak('selStyle', v)} />
        <TweakToggle label="Highlight peers" value={t.peers}
          onChange={(v) => setTweak('peers', v)} />
        <TweakRadio label="Numeral" value={t.numFont} options={['martian', 'mono']}
          onChange={(v) => setTweak('numFont', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
