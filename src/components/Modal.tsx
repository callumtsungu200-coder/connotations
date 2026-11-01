import { useEffect, useId, useRef, type ReactNode } from 'react';
import { CloseIcon } from './Icons';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, title, onClose, children, className }: Props) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const target = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current;
    target?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panel}
        className={`modal ${className ?? ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button type="button" className="icon-button modal-close" aria-label="Close" onClick={onClose}>
          <CloseIcon />
        </button>
        <h2 id={titleId} className="modal-title">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
