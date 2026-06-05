import { useState, useEffect, useCallback, useMemo } from 'react';
import { generate, conflicts as computeConflicts, isComplete, counts as computeCounts } from './lib/sudoku';
import { diffLabel } from './lib/diffs';
import type { DiffId } from './lib/diffs';
import type { Game, Settings } from './types';
import Home from './components/Home';
import GameHeader from './components/GameHeader';
import Board from './components/Board';
import Numpad from './components/Numpad';
import Menu from './components/Menu';
import WinOverlay from './components/WinOverlay';

const SAVE_KEY = 'sudoku.save.v1';
const SETTINGS_KEY = 'sudoku.settings.v1';

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
} as const;

const SETTINGS_DEFAULTS: Settings = {
  accent: '#e5341f',
  theme: 'light',
  peers: true,
  selStyle: 'invert',
  numFont: 'martian',
};

function loadSave(): { game: Game; selected: number | null; notesMode: boolean; screen: 'home' | 'game' } | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const s = JSON.parse(raw) as { game?: Game; selected?: number; notesMode?: boolean; screen?: string };
      if (s.game && !s.game.won) {
        return {
          game: s.game,
          selected: s.selected ?? null,
          notesMode: !!s.notesMode,
          screen: s.screen === 'game' ? 'game' : 'home',
        };
      }
    }
  } catch { /* ignore */ }
  return null;
}

function makeGame(difficulty: DiffId): Game {
  const { puzzle, solution } = generate(difficulty);
  return {
    difficulty,
    givenMask: puzzle.map((v) => v !== 0),
    values: puzzle.slice(),
    notes: Array.from({ length: 81 }, (): number[] => []),
    solution,
    seconds: 0,
    won: false,
  };
}

export default function App() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) return { ...SETTINGS_DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) };
    } catch { /* ignore */ }
    return SETTINGS_DEFAULTS;
  });

  const [initSave] = useState(loadSave);
  const [screen, setScreen] = useState<'home' | 'game'>(initSave?.screen ?? 'home');
  const [game, setGame] = useState<Game | null>(initSave?.game ?? null);
  const [selected, setSelected] = useState<number | null>(initSave?.selected ?? null);
  const [notesMode, setNotesMode] = useState(initSave?.notesMode ?? false);
  const [paused, setPaused] = useState(false);
  const [generating, setGenerating] = useState(false);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ screen, game, selected, notesMode }));
    } catch { /* ignore */ }
  }, [screen, game, selected, notesMode]);

  // theme / accent CSS vars
  useEffect(() => {
    const root = document.documentElement;
    const vars = THEMES[settings.theme];
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.style.setProperty('--accent', settings.accent);
    root.style.setProperty('color-scheme', settings.theme === 'dark' ? 'dark' : 'light');
  }, [settings.theme, settings.accent]);

  // timer
  useEffect(() => {
    if (screen !== 'game' || !game || game.won || paused) return;
    const id = setInterval(() => {
      setGame((g) => (g && !g.won ? { ...g, seconds: g.seconds + 1 } : g));
    }, 1000);
    return () => clearInterval(id);
  }, [screen, game?.won, paused]);

  const conflicts = useMemo(
    () => game ? computeConflicts(game.values) : new Set<number>(),
    [game?.values],
  );
  const counts = useMemo(
    () => game ? computeCounts(game.values) : new Array<number>(10).fill(0),
    [game?.values],
  );

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => {
      const next = { ...s, [key]: value };
      try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const newGame = useCallback((difficulty: DiffId) => {
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

  const place = useCallback((n: number) => {
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
      const won = isComplete(values);
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

  // keyboard
  useEffect(() => {
    if (screen !== 'game') return;
    const onKey = (e: KeyboardEvent) => {
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
    ? {
        label: diffLabel(game.difficulty),
        seconds: game.seconds,
        onResume: () => setScreen('game'),
      }
    : null;

  const toggleTheme = useCallback(() => {
    updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark');
  }, [settings.theme, updateSetting]);

  return (
    <div className="app">
      {screen === 'home' && (
        <Home onNew={newGame} resume={resume} onToggleTheme={toggleTheme} />
      )}

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
              highlightPeers={settings.peers}
              selStyle={settings.selStyle}
              paused={paused}
              onSelect={setSelected}
            />
          </div>
          <div className="controls">
            <Numpad counts={counts} onNum={place} numFont={settings.numFont} />
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
        <div className="generating">
          <span>GENERATING<span className="dots">…</span></span>
        </div>
      )}
    </div>
  );
}
