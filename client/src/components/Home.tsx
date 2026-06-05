import ThemeToggle from "./ThemeToggle";
import { DIFFS } from "../lib/diffs";
import type { DifficultyId } from "../lib/diffs";
import { formatTime } from "../lib/utils";

interface ResumeInfo {
  label: string;
  seconds: number;
  onResume: () => void;
}

interface Props {
  onNew: (difficulty: DifficultyId) => void;
  resume: ResumeInfo | null;
  onToggleTheme: () => void;
}

export default function Home({ onNew, resume, onToggleTheme }: Props) {
  return (
    <div className="relative min-h-full flex flex-col flex-1 px-[22px] pt-[calc(env(safe-area-inset-top)_+_40px)] pb-[calc(env(safe-area-inset-bottom)_+_22px)]">
      <ThemeToggle
        className="absolute top-[calc(env(safe-area-inset-top)_+_30px)] right-3 z-[5]"
        onToggle={onToggleTheme}
      />

      <div className="flex-shrink-0">
        <div className="font-display font-extrabold text-[clamp(40px,12.5vw,56px)] leading-[0.9] tracking-[-1.5px] text-ink">
          n4
          <br />
          sud
          <br />
          oku
        </div>
        <div className="text-[11px] tracking-[3px] text-faint mt-4">
          OFFLINE · NO ACCOUNT
        </div>
      </div>

      {resume && (
        <button
          className="flex-shrink-0 flex items-center justify-between w-full px-[6px] py-3 mt-6 text-ink transition-[background] duration-[120ms] hover:bg-peers"
          onClick={resume.onResume}
        >
          <span className="flex flex-col items-start gap-[5px]">
            <span className="text-[10px] tracking-[2.5px] text-accent font-semibold">
              ▶ RESUME
            </span>
            <span className="font-display font-extrabold text-[19px] tracking-[-0.5px]">
              {resume.label}
            </span>
          </span>
          <span className="font-display font-extrabold text-[19px] [font-variant-numeric:tabular-nums]">
            {formatTime(resume.seconds)}
          </span>
        </button>
      )}

      <div className="flex-1 grid grid-cols-2 mt-6 mb-[22px] border-t-2 border-l-2 border-ink">
        {DIFFS.map((difficulty) => (
          <button
            key={difficulty.id}
            className="group relative flex flex-col justify-end items-start min-h-[120px] p-4 border-r-2 border-b-2 border-ink bg-paper text-ink text-left transition-[background,color] duration-[120ms] hover:bg-ink hover:text-paper"
            onClick={() => onNew(difficulty.id)}
          >
            <span className="font-display font-extrabold text-[20px] tracking-[-0.5px]">
              {difficulty.label}
            </span>
            <span className="text-[10px] tracking-[1.5px] text-faint mt-[6px] group-hover:text-[rgba(245,245,240,0.55)]">
              {difficulty.sub}
            </span>
            <span className="absolute top-[14px] right-[14px] text-[15px] text-accent">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
