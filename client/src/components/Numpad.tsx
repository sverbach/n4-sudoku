import { DIGITS, NUMBER_FONTS } from '../lib/utils';
import type { Settings } from '../types';

interface Props {
  disabled: Set<number>;
  onNum: (digit: number) => void;
  numberFont: Settings['numberFont'];
}

export default function Numpad({ disabled, onNum, numberFont }: Props) {
  return (
    <div className="flex justify-between items-center" style={{ fontFamily: NUMBER_FONTS[numberFont] }}>
      {DIGITS.map((digit) => (
        <button
          key={digit}
          disabled={disabled.has(digit)}
          className={
            'text-[clamp(25px,8vw,34px)] font-bold leading-[1] px-[2px] py-[6px] transition-[color,transform] duration-100 active:text-accent active:translate-y-[1px] ' +
            (disabled.has(digit) ? 'text-line opacity-40 cursor-default' : 'text-ink')
          }
          onClick={() => onNum(digit)}
        >
          {digit}
        </button>
      ))}
    </div>
  );
}
