import { difficultyLabel } from "../lib/diffs";
import type { DifficultyId } from "../lib/diffs";
import { formatTime } from "../lib/utils";

interface Props {
  seconds: number;
  difficulty: DifficultyId;
  onNew: (difficulty: DifficultyId) => void;
  onMenu: () => void;
  onClose: () => void;
}

export default function WinOverlay({
  seconds,
  difficulty,
  onNew,
  onMenu,
  onClose,
}: Props) {
  const label = difficultyLabel(difficulty);
  return (
    <div className="absolute inset-0 bg-[var(--win-bg)] backdrop-blur-[3px] flex items-center justify-center p-6 z-40">
      <div className="w-full max-w-[340px] bg-paper border-[3px] border-box px-[26px] py-[30px] relative">
        <button
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-faint hover:text-ink"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="text-[11px] tracking-[4px] text-accent">SOLVED</div>
        <div className="font-display font-extrabold text-[54px] tracking-[-2px] text-ink [font-variant-numeric:tabular-nums] mt-[6px] mb-[2px]">
          {formatTime(seconds)}
        </div>
        <div className="text-[11px] tracking-[2px] text-faint">
          DIFFICULTY: {label}
        </div>
        <div className="flex flex-col gap-[10px] mt-6">
          <button
            className="h-12 w-full bg-ink text-paper text-[12px] tracking-[2px] font-semibold"
            onClick={() => onNew(difficulty)}
          >
            NEW · {label}
          </button>
          <button
            className="h-12 w-full border-2 border-box text-ink text-[12px] tracking-[2px] font-semibold"
            onClick={onMenu}
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
