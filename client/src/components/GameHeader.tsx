import ThemeToggle from './ThemeToggle';
import { difficultyLabel } from '../lib/diffs';
import type { DifficultyId } from '../lib/diffs';
import { formatTime } from '../lib/utils';

interface Props {
  difficulty: DifficultyId;
  seconds: number;
  paused: boolean;
  won: boolean;
  onBack: () => void;
  onPause: () => void;
  onToggleTheme: () => void;
  onShare: () => void;
}

export default function GameHeader({ difficulty, seconds, paused, won, onBack, onPause, onToggleTheme, onShare }: Props) {
  const label = difficultyLabel(difficulty);
  return (
    <div className="px-5 pt-[14px]">
      <div className="flex items-center justify-between -mr-[10px]">
        <button className="text-[11px] tracking-[2px] text-faint font-semibold py-[6px] hover:text-accent" onClick={onBack}>
          ← MENU
        </button>
        <div className="flex items-center">
          <button
            className="w-11 h-11 flex items-center justify-center text-ink hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onShare}
            disabled={won}
            title={won ? 'Cannot share completed games' : 'Share this game'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
          <ThemeToggle onToggle={onToggleTheme} />
        </div>
      </div>
      <div className="flex items-end justify-between pt-[6px] pb-[14px] border-b-2 border-ink mt-[2px]">
        <div>
          <div className="text-[10px] tracking-[3px] text-faint">DIFFICULTY</div>
          <div className="font-display text-[24px] font-extrabold tracking-[-0.5px] text-ink">{label}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] tracking-[3px] text-faint">TIME</div>
          <button
            className="font-display text-[24px] font-extrabold tracking-[-0.5px] text-ink [font-variant-numeric:tabular-nums] hover:text-accent"
            onClick={onPause}
            title="Pause / resume"
          >
            {paused ? '▶ ' + formatTime(seconds) : formatTime(seconds)}
          </button>
        </div>
      </div>
    </div>
  );
}
