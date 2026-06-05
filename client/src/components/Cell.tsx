import { DIGITS } from "../lib/utils";

interface Props {
  row: number;
  col: number;
  value: number;
  given: boolean;
  note: number[];
  isSelected: boolean;
  isPeer: boolean;
  isConflict: boolean;
  isBoxSolved: boolean;
  sameValue: boolean;
  selectionStyle: "invert" | "ring";
  paused: boolean;
  onClick: () => void;
}

export default function Cell({
  row,
  col,
  value,
  given,
  note,
  isSelected,
  isPeer,
  isConflict,
  isBoxSolved,
  sameValue,
  selectionStyle,
  paused,
  onClick,
}: Props) {
  const classNames: string[] = [
    "relative flex items-center justify-center transition-[background] duration-100",
  ];

  if (col !== 8)
    classNames.push(
      col % 3 === 2 ? "border-r-2 border-r-box" : "border-r border-r-line",
    );
  if (row !== 8)
    classNames.push(
      row % 3 === 2 ? "border-b-2 border-b-box" : "border-b border-b-line",
    );

  let backgroundClass = "bg-paper";
  if (isBoxSolved && !isConflict) backgroundClass = "bg-solvedbg";
  if (isPeer || sameValue) backgroundClass = "bg-peers";
  if (isConflict) backgroundClass = "bg-conflictbg";
  if (isSelected && selectionStyle === "invert") backgroundClass = "bg-selbg";
  classNames.push(backgroundClass);

  if (sameValue && !(isSelected && selectionStyle === "invert"))
    classNames.push("shadow-[var(--same-shadow)]");
  if (isSelected && selectionStyle === "ring")
    classNames.push("shadow-[var(--ring-shadow)] z-[1]");

  let digitColor = "text-ink";
  if (isConflict) digitColor = "text-accent";
  if (isSelected && selectionStyle === "invert") digitColor = "text-selink";
  const digitWeight =
    given || (isSelected && selectionStyle === "invert")
      ? "font-bold"
      : "font-normal";

  const digitClassNames = [
    "font-mono text-[clamp(17px,5.4vw,25px)] leading-[1]",
    digitColor,
    digitWeight,
    paused ? "blur-[6px] opacity-25" : "",
  ].join(" ");

  const notesClassNames = [
    "grid grid-cols-3 grid-rows-3 w-full h-full p-[7%]",
    paused ? "blur-[6px] opacity-25" : "",
  ].join(" ");

  const boxPos = (row % 3) * 3 + (col % 3);

  return (
    <div className={classNames.join(" ")} onClick={onClick}>
      {isBoxSolved && !isConflict && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            animation: "box-solve 0.75s ease-out forwards",
            animationDelay: `${boxPos * 55}ms`,
          }}
        />
      )}
      {note.length > 0 && !value ? (
        <div className={notesClassNames}>
          {DIGITS.map((digit) => (
            <span
              key={digit}
              className={
                "flex items-center justify-center font-mono text-[clamp(7px,2.3vw,11px)] leading-[1] " +
                (note.includes(digit) ? "text-note" : "text-transparent")
              }
            >
              {digit}
            </span>
          ))}
        </div>
      ) : (
        <span className={digitClassNames}>{value || ""}</span>
      )}
    </div>
  );
}
