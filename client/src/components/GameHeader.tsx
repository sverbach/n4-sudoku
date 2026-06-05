import ThemeToggle from './ThemeToggle';
import { diffLabel } from '../lib/diffs';
import type { DiffId } from '../lib/diffs';
import { fmt } from '../lib/utils';

interface Props {
  difficulty: DiffId;
  seconds: number;
  paused: boolean;
  onBack: () => void;
  onPause: () => void;
  onToggleTheme: () => void;
}

export default function GameHeader({ difficulty, seconds, paused, onBack, onPause, onToggleTheme }: Props) {
  const label = diffLabel(difficulty);
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
