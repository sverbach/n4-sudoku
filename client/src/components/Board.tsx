import { useMemo } from 'react';
import { peersOf } from '../lib/utils';
import Cell from './Cell';

interface Props {
  values: number[];
  givenMask: boolean[];
  notes: number[][];
  selected: number | null;
  conflicts: Set<number>;
  highlightPeers: boolean;
  selectionStyle: 'invert' | 'ring';
  paused: boolean;
  onSelect: (index: number) => void;
}

export default function Board({ values, givenMask, notes, selected, conflicts, highlightPeers, selectionStyle, paused, onSelect }: Props) {
  const peers = highlightPeers ? peersOf(selected) : new Set<number>();
  const selectedValue = selected != null ? values[selected] : 0;

  const solvedBoxes = useMemo(() => {
    const result = new Set<number>();
    for (let bRow = 0; bRow < 3; bRow++) {
      for (let bCol = 0; bCol < 3; bCol++) {
        let ok = true;
        for (let r = 0; r < 3 && ok; r++)
          for (let c = 0; c < 3 && ok; c++) {
            const idx = (bRow * 3 + r) * 9 + (bCol * 3 + c);
            if (!values[idx] || conflicts.has(idx)) ok = false;
          }
        if (ok) result.add(bRow * 3 + bCol);
      }
    }
    return result;
  }, [values, conflicts]);

  return (
    <div className="relative w-[var(--board-size)]">
      <div className="grid grid-cols-9 grid-rows-9 aspect-square border-[3px] border-box bg-paper">
        {Array.from({ length: 81 }, (_, index) => {
          const row = (index / 9) | 0;
          const col = index % 9;
          const value = values[index];
          const boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
          return (
            <Cell
              key={index}
              row={row}
              col={col}
              value={value}
              given={givenMask[index]}
              note={notes[index]}
              isSelected={index === selected}
              isPeer={peers.has(index)}
              isConflict={conflicts.has(index)}
              isBoxSolved={solvedBoxes.has(boxIndex)}
              sameValue={!!(selectedValue && value === selectedValue && index !== selected)}
              selectionStyle={selectionStyle}
              paused={paused}
              onClick={() => onSelect(index)}
            />
          );
        })}
      </div>
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-[22px] tracking-[2px] text-ink">
          PAUSED
        </div>
      )}
    </div>
  );
}
