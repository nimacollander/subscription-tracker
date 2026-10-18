"use client";

import { Button } from "./Button";
import { Dialog } from "./Dialog";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ title, description, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog title={title} description={description} onClose={onCancel}>
      {/* Cancel comes first so it gets initial focus: Enter won't delete by accident. */}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
