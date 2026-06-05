interface Props {
  notesMode: boolean;
  onToggleNotes: () => void;
  onErase: () => void;
}

export default function Menu({ notesMode, onToggleNotes, onErase }: Props) {
  return (
    <div className="menu">
      <button className={'menu-item' + (notesMode ? ' active' : '')} onClick={onToggleNotes}>
        NOTES<span className="state">{notesMode ? ' ON' : ' OFF'}</span>
      </button>
      <button className="menu-item" onClick={onErase}>ERASE</button>
    </div>
  );
}
