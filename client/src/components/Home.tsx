import ThemeToggle from './ThemeToggle';
import { DIFFS } from '../lib/diffs';
import type { DiffId } from '../lib/diffs';
import { fmt } from '../lib/utils';

interface ResumeInfo {
  label: string;
  seconds: number;
  onResume: () => void;
}

interface Props {
  onNew: (difficulty: DiffId) => void;
  resume: ResumeInfo | null;
  onToggleTheme: () => void;
}

export default function Home({ onNew, resume, onToggleTheme }: Props) {
  return (
    <div className="screen home">
      <ThemeToggle className="home-tt" onToggle={onToggleTheme} />
      <div className="home-top">
        <div className="logo">n4-<br />sud<br />oku</div>
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
