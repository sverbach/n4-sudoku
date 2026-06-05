import { useState, useEffect, useRef } from 'react';

interface ShareCreatedModalProps {
  shareId: string;
  onClose: () => void;
}

export default function ShareCreatedModal({ shareId, onClose }: ShareCreatedModalProps) {
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const url = `${window.location.origin}/share/${shareId}`;

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    dialogRef.current?.close();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="bg-paper border-[3px] border-box px-[26px] py-[30px] w-[min(340px,calc(100vw-48px))]"
    >
      <div className="text-[11px] tracking-[4px] text-accent mb-3">GAME SHARED</div>
      <p className="text-[12px] font-mono text-ink break-all mb-6">{url}</p>
      <div className="flex flex-col gap-[10px]">
        <button
          onClick={handleCopy}
          className="h-12 w-full bg-ink text-paper text-[12px] tracking-[2px] font-semibold"
        >
          {copied ? 'COPIED!' : 'COPY LINK'}
        </button>
        <button
          onClick={handleClose}
          className="h-12 w-full border-2 border-box text-ink text-[12px] tracking-[2px] font-semibold"
        >
          CLOSE
        </button>
      </div>
    </dialog>
  );
}
