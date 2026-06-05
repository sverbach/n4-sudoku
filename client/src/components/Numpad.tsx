import { DIGITS, NUMFONTS } from '../lib/utils';
import type { Settings } from '../types';

interface Props {
  counts: number[];
  onNum: (n: number) => void;
  numFont: Settings['numFont'];
}

export default function Numpad({ counts, onNum, numFont }: Props) {
  return (
    <div className="numpad" style={{ fontFamily: NUMFONTS[numFont] }}>
      {DIGITS.map((n) => (
        <button
          key={n}
          className={'num' + (counts[n] >= 9 ? ' done' : '')}
          onClick={() => onNum(n)}
        >{n}</button>
      ))}
    </div>
  );
}
