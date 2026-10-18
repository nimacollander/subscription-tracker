"use client";

import { useEffect, useId, useRef } from "react";

type DialogProps = {
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
};

/**
 * A modal built on the native <dialog>, which traps focus, makes the rest of the
 * page inert, and closes on Escape. Opens when mounted, so render it conditionally.
 * The first focusable element inside receives focus.
 */
export function Dialog({ title, description, onClose, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const opener = document.activeElement as HTMLElement | null;

    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      // The dialog unmounts instead of closing, so restore focus manually.
      opener?.focus();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Escape fires "cancel"; let the parent decide by unmounting.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-lg rounded-xl border border-border bg-surface p-6 text-foreground shadow-xl backdrop:bg-black/50"
    >
      <h2 id={titleId} className="text-lg font-semibold">
        {title}
      </h2>
      {description && (
        <p id={descriptionId} className="mt-1 text-sm text-muted">
          {description}
        </p>
      )}
      <div className="mt-5">{children}</div>
    </dialog>
  );
}
