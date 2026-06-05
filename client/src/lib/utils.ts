export function peersOf(sel: number | null): Set<number> {
  if (sel == null) return new Set();
  const sr = (sel / 9) | 0, sc = sel % 9;
  const br = (sr / 3 | 0) * 3, bc = (sc / 3 | 0) * 3;
  const set = new Set<number>();
  for (let k = 0; k < 9; k++) { set.add(sr * 9 + k); set.add(k * 9 + sc); }
  for (let r = br; r < br + 3; r++) for (let c = bc; c < bc + 3; c++) set.add(r * 9 + c);
  set.delete(sel);
  return set;
}

export function fmt(sec: number): string {
  const m = (sec / 60) | 0, s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

export const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export const NUMFONTS: Record<'martian' | 'mono', string> = {
  martian: "'Martian Mono', monospace",
  mono: "'JetBrains Mono', monospace",
};
