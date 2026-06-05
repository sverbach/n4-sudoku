import { useEffect, useRef } from 'react';

interface GameNotFoundModalProps {
  onGoHome: () => void;
}

export default function GameNotFoundModal({ onGoHome }: GameNotFoundModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const handleGoHome = () => {
    dialogRef.current?.close();
    onGoHome();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onGoHome}
      className="bg-paper border-[3px] border-box px-[26px] py-[30px] w-[min(340px,calc(100vw-48px))]"
    >
      <div className="text-[11px] tracking-[4px] text-accent mb-3">NOT FOUND</div>
      <p className="text-[14px] text-faint mb-6">This share link is invalid or has expired.</p>
      <button
        onClick={handleGoHome}
        className="h-12 w-full bg-ink text-paper text-[12px] tracking-[2px] font-semibold"
      >
        GO HOME
      </button>
    </dialog>
  );
}
