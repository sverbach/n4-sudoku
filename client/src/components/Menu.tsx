interface Props {
  notesMode: boolean;
  onToggleNotes: () => void;
  onErase: () => void;
}

export default function Menu({ notesMode, onToggleNotes, onErase }: Props) {
  return (
    <div className="flex gap-[26px] justify-center mt-[22px]">
      <button
        className={
          'text-[12px] tracking-[2px] font-semibold text-ink pb-[4px] border-b-[3px] ' +
          (notesMode ? 'border-b-accent' : 'border-b-transparent')
        }
        onClick={onToggleNotes}
      >
        NOTES
        <span className={'text-[11px] ' + (notesMode ? 'text-accent' : 'text-faint')}>
          {notesMode ? ' ON' : ' OFF'}
        </span>
      </button>
      <button
        className="text-[12px] tracking-[2px] font-semibold text-ink pb-[4px] border-b-[3px] border-b-transparent"
        onClick={onErase}
      >
        ERASE
      </button>
    </div>
  );
}
