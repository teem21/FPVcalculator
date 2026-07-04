import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  src: string;
  alt: string;
  onClose: () => void;
}

/** Full-screen image overlay. Closes on backdrop/image click or Escape. */
export function Lightbox({ src, alt, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 cursor-zoom-out animate-[fadeIn_120ms_ease-out]"
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>,
    document.body,
  );
}
