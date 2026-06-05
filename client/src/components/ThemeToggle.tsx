interface Props {
  onToggle: () => void;
  className?: string;
}

export default function ThemeToggle({ onToggle, className }: Props) {
  return (
    <button
      className={'w-11 h-11 flex items-center justify-center text-ink flex-shrink-0 hover:text-accent ' + (className ?? '')}
      onClick={onToggle}
      aria-label="Toggle light or dark"
      title="Light / dark"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M10 1.8 a8.2 8.2 0 0 1 0 16.4 z" fill="currentColor" />
      </svg>
    </button>
  );
}
