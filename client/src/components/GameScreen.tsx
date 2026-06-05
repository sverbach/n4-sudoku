import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { useSettings } from '../contexts/SettingsContext';
import GameHeader from './GameHeader';
import Board from './Board';
import Numpad from './Numpad';
import Menu from './Menu';
import WinOverlay from './WinOverlay';
import ShareCreatedModal from './ShareCreatedModal';

export default function GameScreen() {
  const {
    game, selected, setSelected, notesMode, toggleNotesMode,
    paused, togglePaused, conflicts,
    shareCreatedId, setShareCreatedId, shareError,
    place, erase, solve, newGame, shareGame, setScreen,
  } = useGame();

  const disabledDigits = useMemo<Set<number>>(() => {
    if (!game || selected == null) return new Set();
    const row = (selected / 9) | 0;
    const col = selected % 9;
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    const digits = new Set<number>();
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        const v = game.values[r * 9 + c];
        if (v !== 0) digits.add(v);
      }
    }
    return digits;
  }, [game?.values, selected]);

  const placeIfAllowed = useCallback((digit: number) => {
    if (!disabledDigits.has(digit)) place(digit);
  }, [disabledDigits, place]);

  const [winDismissed, setWinDismissed] = useState(false);
  useEffect(() => { if (!game?.won) setWinDismissed(false); }, [game?.won]);

  const { settings, toggleTheme } = useSettings();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key >= '1' && event.key <= '9') { placeIfAllowed(+event.key); }
      else if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') { erase(); }
      else if (event.key === 'n' || event.key === 'N') { toggleNotesMode(); }
      else if (event.key.startsWith('Arrow') && selected != null) {
        let row = (selected / 9) | 0, col = selected % 9;
        if (event.key === 'ArrowUp') row = Math.max(0, row - 1);
        if (event.key === 'ArrowDown') row = Math.min(8, row + 1);
        if (event.key === 'ArrowLeft') col = Math.max(0, col - 1);
        if (event.key === 'ArrowRight') col = Math.min(8, col + 1);
        setSelected(row * 9 + col);
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected, placeIfAllowed, erase, toggleNotesMode, setSelected]);

  if (!game) return null;

  return (
    <div className="min-h-full flex flex-col flex-1 pt-[env(safe-area-inset-top)]">
      <GameHeader
        difficulty={game.difficulty}
        seconds={game.seconds}
        paused={paused}
        won={game.won}
        onBack={() => setScreen('home')}
        onPause={togglePaused}
        onToggleTheme={toggleTheme}
        onShare={shareGame}
      />
      <div className="flex-1 flex items-center justify-center px-5 py-[18px]">
        <Board
          values={game.values}
          givenMask={game.givenMask}
          notes={game.notes}
          selected={selected}
          conflicts={conflicts}
          highlightPeers={settings.peers}
          selectionStyle={settings.selectionStyle}
          paused={paused}
          onSelect={setSelected}
        />
      </div>
      <div className="flex-shrink-0 px-6 pt-[6px] pb-[calc(env(safe-area-inset-bottom)_+_22px)]">
        <Numpad disabled={disabledDigits} onNum={placeIfAllowed} numberFont={settings.numberFont} />
        <Menu notesMode={notesMode} onToggleNotes={toggleNotesMode} onErase={erase} />
      </div>
      {game.won && !winDismissed && (
        <WinOverlay
          seconds={game.seconds}
          difficulty={game.difficulty}
          onNew={newGame}
          onMenu={() => setScreen('home')}
          onClose={() => setWinDismissed(true)}
        />
      )}
      {shareCreatedId && (
        <ShareCreatedModal shareId={shareCreatedId} onClose={() => setShareCreatedId(null)} />
      )}
      {shareError && (
        <div className="absolute top-4 left-4 right-4 bg-accent text-paper text-[12px] tracking-[2px] font-semibold px-4 py-3 z-50">
          {shareError}
        </div>
      )}
      {import.meta.env.DEV && !game.won && (
        <button
          onClick={solve}
          className="absolute bottom-4 right-4 bg-red-500 text-white text-[10px] tracking-[2px] font-semibold uppercase px-3 py-1.5 opacity-70 hover:opacity-100 z-50"
        >
          Solve
        </button>
      )}
    </div>
  );
}
