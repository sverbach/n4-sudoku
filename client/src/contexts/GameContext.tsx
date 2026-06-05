import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Game } from '../types';
import type { DifficultyId } from '../lib/diffs';
import { generate, conflicts as computeConflicts, isComplete, counts as computeCounts } from '../lib/sudoku';
import { serializeGame } from '../lib/shareFormat';

const SAVE_KEY = 'sudoku.save.v1';

function loadSave(): { game: Game; selected: number | null; notesMode: boolean; screen: 'home' | 'game' } | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { game?: Game; selected?: number; notesMode?: boolean; screen?: string };
      if (parsed.game && !parsed.game.won) {
        return {
          game: parsed.game,
          selected: parsed.selected ?? null,
          notesMode: !!parsed.notesMode,
          screen: parsed.screen === 'game' ? 'game' : 'home',
        };
      }
    }
  } catch { /* ignore */ }
  return null;
}

function makeGame(difficulty: DifficultyId): Game {
  const { puzzle, solution } = generate(difficulty);
  return {
    difficulty,
    givenMask: puzzle.map((value) => value !== 0),
    values: puzzle.slice(),
    notes: Array.from({ length: 81 }, (): number[] => []),
    solution,
    seconds: 0,
    won: false,
  };
}

interface GameContextValue {
  screen: 'home' | 'game';
  setScreen: (screen: 'home' | 'game') => void;
  game: Game | null;
  selected: number | null;
  setSelected: (index: number | null) => void;
  notesMode: boolean;
  toggleNotesMode: () => void;
  paused: boolean;
  togglePaused: () => void;
  generating: boolean;
  conflicts: Set<number>;
  counts: number[];
  shareCreatedId: string | null;
  setShareCreatedId: (id: string | null) => void;
  shareError: string | null;
  newGame: (difficulty: DifficultyId) => void;
  place: (digit: number) => void;
  erase: () => void;
  solve: () => void;
  shareGame: () => Promise<void>;
  loadGameFromShare: (game: Game, nextScreen?: 'home' | 'game') => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [initSave] = useState(loadSave);
  const [screen, setScreen] = useState<'home' | 'game'>(initSave?.screen ?? 'home');
  const [game, setGame] = useState<Game | null>(initSave?.game ?? null);
  const [selected, setSelected] = useState<number | null>(initSave?.selected ?? null);
  const [notesMode, setNotesMode] = useState(initSave?.notesMode ?? false);
  const [paused, setPaused] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [shareCreatedId, setShareCreatedId] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ screen, game, selected, notesMode }));
    } catch { /* ignore */ }
  }, [screen, game, selected, notesMode]);

  useEffect(() => {
    if (screen !== 'game' || !game || game.won || paused) return;
    const intervalId = setInterval(() => {
      setGame((current) => (current && !current.won ? { ...current, seconds: current.seconds + 1 } : current));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [screen, game?.won, paused]);

  const conflicts = useMemo(
    () => (game ? computeConflicts(game.values) : new Set<number>()),
    [game?.values],
  );
  const counts = useMemo(
    () => (game ? computeCounts(game.values) : new Array<number>(10).fill(0)),
    [game?.values],
  );

  const newGame = useCallback((difficulty: DifficultyId) => {
    setGenerating(true);
    setPaused(false);
    const startedAt = Date.now();
    setTimeout(() => {
      const newG = makeGame(difficulty);
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, 1500 - elapsed);
      const apply = () => {
        setGame(newG);
        setSelected(null);
        setNotesMode(false);
        setScreen('game');
        setGenerating(false);
      };
      if (remaining > 0) setTimeout(apply, remaining); else apply();
    }, 30);
  }, []);

  const shareGame = useCallback(async () => {
    if (!game) return;
    try {
      setShareError(null);
      const payload = serializeGame(game);
      const response = await fetch('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameState: payload }),
      });
      if (!response.ok) throw new Error('Failed to create share');
      const data = await response.json();
      setShareCreatedId(data.id);
    } catch (error) {
      setShareError(error instanceof Error ? error.message : 'Failed to share game');
    }
  }, [game]);

  const loadGameFromShare = useCallback((loadedGame: Game, nextScreen?: 'home' | 'game') => {
    setGame(loadedGame);
    setSelected(null);
    setNotesMode(false);
    setScreen(nextScreen ?? 'game');
    setPaused(false);
  }, []);

  const place = useCallback((digit: number) => {
    setGame((current) => {
      if (!current || current.won || selected == null || current.givenMask[selected]) return current;
      const values = current.values.slice();
      const notes = current.notes.map((noteRow) => noteRow.slice());
      if (notesMode) {
        values[selected] = 0;
        const noteRow = notes[selected];
        const existingIndex = noteRow.indexOf(digit);
        if (existingIndex === -1) noteRow.push(digit); else noteRow.splice(existingIndex, 1);
      } else {
        values[selected] = values[selected] === digit ? 0 : digit;
        notes[selected] = [];
      }
      return { ...current, values, notes, won: isComplete(values) };
    });
  }, [selected, notesMode]);

  const solve = useCallback(() => {
    setGame((current) => {
      if (!current || current.won) return current;
      return { ...current, values: current.solution.slice(), notes: Array.from({ length: 81 }, (): number[] => []), won: true };
    });
  }, []);

  const erase = useCallback(() => {
    setGame((current) => {
      if (!current || selected == null || current.givenMask[selected]) return current;
      const values = current.values.slice();
      const notes = current.notes.map((noteRow) => noteRow.slice());
      values[selected] = 0;
      notes[selected] = [];
      return { ...current, values, notes, won: false };
    });
  }, [selected]);

  const toggleNotesMode = useCallback(() => setNotesMode((current) => !current), []);
  const togglePaused = useCallback(() => setPaused((current) => !current), []);

  return (
    <GameContext.Provider value={{
      screen, setScreen,
      game,
      selected, setSelected,
      notesMode, toggleNotesMode,
      paused, togglePaused,
      generating,
      conflicts, counts,
      shareCreatedId, setShareCreatedId,
      shareError,
      newGame, place, erase, solve, shareGame, loadGameFromShare,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
