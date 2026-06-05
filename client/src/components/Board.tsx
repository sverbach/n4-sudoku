import { peersOf, DIGITS } from '../lib/utils';

interface Props {
  values: number[];
  givenMask: boolean[];
  notes: number[][];
  selected: number | null;
  conflicts: Set<number>;
  highlightPeers: boolean;
  selStyle: 'invert' | 'ring';
  paused: boolean;
  onSelect: (i: number) => void;
}

export default function Board({ values, givenMask, notes, selected, conflicts, highlightPeers, selStyle, paused, onSelect }: Props) {
  const peers = highlightPeers ? peersOf(selected) : new Set<number>();
  const selVal = selected != null ? values[selected] : 0;

  const cells: React.ReactNode[] = [];
  for (let i = 0; i < 81; i++) {
    const r = (i / 9) | 0, c = i % 9;
    const v = values[i];
    const given = givenMask[i];
    const isSel = i === selected;
    const isPeer = peers.has(i);
    const isConflict = conflicts.has(i);
    const sameVal = !!(selVal && v === selVal && !isSel);
    const note = notes[i];

    const cls = ['cell'];
    if (c % 3 === 2 && c !== 8) cls.push('bx-r');
    if (r % 3 === 2 && r !== 8) cls.push('bx-b');
    if (isPeer) cls.push('peer');
    if (sameVal) cls.push('same');
    if (isConflict) cls.push('conflict');
    if (isSel) cls.push(selStyle === 'ring' ? 'sel-ring' : 'sel-invert');
    if (given) cls.push('given');

    cells.push(
      <div key={i} className={cls.join(' ')} onClick={() => onSelect(i)}>
        {note.length > 0 && !v ? (
          <div className="notes">
            {DIGITS.map((n) => (
              <span key={n} className={note.includes(n) ? 'on' : ''}>{n}</span>
            ))}
          </div>
        ) : (
          <span className="digit">{v || ''}</span>
        )}
      </div>
    );
  }

  return (
    <div className={'board' + (paused ? ' paused' : '')}>
      <div className="board-grid">{cells}</div>
      {paused && <div className="pause-veil">PAUSED</div>}
    </div>
  );
}
