export default function GeneratingModal() {
  return (
    <div className="absolute inset-0 bg-[var(--win-bg)] backdrop-blur-[3px] flex items-center justify-center p-6 z-50">
      <div className="w-full max-w-[340px] bg-paper border-[3px] border-box px-[26px] py-[30px]">
        <div className="text-[11px] tracking-[4px] text-faint mb-5">GENERATING</div>
        <div className="grid grid-cols-3 gap-[3px] w-[75px] mb-5">
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className="w-[23px] h-[23px] border border-line"
              style={{
                animation: 'cell-pulse 0.9s ease-in-out infinite',
                animationDelay: `${index * 100}ms`,
              }}
            />
          ))}
        </div>
        <div className="font-display font-extrabold text-[28px] tracking-[-0.5px] text-ink leading-[1.1]">
          BUILDING<br />YOUR PUZZLE
        </div>
      </div>
    </div>
  );
}
