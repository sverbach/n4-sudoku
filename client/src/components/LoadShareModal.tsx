import { useEffect, useRef } from 'react';

interface LoadShareModalProps {
  previewText: string;
  hasActiveGame: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LoadShareModal({ previewText, hasActiveGame, onConfirm, onCancel }: LoadShareModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const handleClose = () => {
    dialogRef.current?.close();
    onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="bg-paper border-[3px] border-box px-[26px] py-[30px] w-[min(340px,calc(100vw-48px))]"
    >
      <div className="text-[11px] tracking-[4px] text-accent mb-3">LOAD GAME</div>
      <pre className="text-[12px] text-ink font-mono mb-4 leading-relaxed whitespace-pre-wrap">{previewText}</pre>
      {hasActiveGame && (
        <p className="text-[11px] tracking-[1px] text-faint mb-4">This will replace your current game.</p>
      )}
      <div className="flex flex-col gap-[10px]">
        <button
          onClick={onConfirm}
          className="h-12 w-full bg-ink text-paper text-[12px] tracking-[2px] font-semibold"
        >
          CONTINUE
        </button>
        <button
          onClick={handleClose}
          className="h-12 w-full border-2 border-box text-ink text-[12px] tracking-[2px] font-semibold"
        >
          CANCEL
        </button>
      </div>
    </dialog>
  );
}
