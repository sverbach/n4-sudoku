import { diffLabel } from '../lib/diffs';
import type { DiffId } from '../lib/diffs';
import { fmt } from '../lib/utils';

interface Props {
  seconds: number;
  difficulty: DiffId;
  onNew: (difficulty: DiffId) => void;
  onMenu: () => void;
}

export default function WinOverlay({ seconds, difficulty, onNew, onMenu }: Props) {
  const label = diffLabel(difficulty);
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
