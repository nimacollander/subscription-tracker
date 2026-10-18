"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { toISODate } from "@/lib/dates";
import { createExport, exportFilename, MAX_IMPORT_BYTES, parseImport } from "@/lib/dataTransfer";
import type { Subscription } from "@/types/subscription";

type Message = { type: "success" | "error"; text: string } | null;
type PendingImport = { fileName: string; subscriptions: Subscription[] } | null;

function plural(count: number) {
  return `${count} ${count === 1 ? "subscription" : "subscriptions"}`;
}

function downloadFile(contents: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function DataTransfer() {
  const { subscriptions, isLoaded, replaceSubscriptions } = useSubscriptions();
  const [message, setMessage] = useState<Message>(null);
  const [pending, setPending] = useState<PendingImport>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const now = new Date();
    downloadFile(createExport(subscriptions, now), exportFilename(toISODate(now)));
    setMessage({ type: "success", text: `Exported ${plural(subscriptions.length)}.` });
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset so choosing the same file again still fires a change event.
    event.target.value = "";
    if (!file) return;

    if (file.size > MAX_IMPORT_BYTES) {
      setMessage({ type: "error", text: "This file is too large to be a Subscription Tracker export." });
      return;
    }

    const result = parseImport(await file.text());
    if (!result.ok) {
      setMessage({ type: "error", text: result.error });
      return;
    }
    setMessage(null);
    setPending({ fileName: file.name, subscriptions: result.subscriptions });
  }

  function confirmImport() {
    if (!pending) return;
    replaceSubscriptions(pending.subscriptions);
    setMessage({ type: "success", text: `Imported ${plural(pending.subscriptions.length)} from ${pending.fileName}.` });
    setPending(null);
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleExport} disabled={!isLoaded}>
          Export JSON
        </Button>
        <Button onClick={() => fileInputRef.current?.click()} disabled={!isLoaded}>
          Import JSON
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden
          tabIndex={-1}
        />
      </div>

      {/* Errors interrupt (alert); confirmations are announced politely (status). */}
      <div role="alert">
        {message?.type === "error" && (
          <p className="mt-4 rounded-xl border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
            <span className="font-medium">Couldn&apos;t import this file.</span> {message.text}
          </p>
        )}
      </div>
      <div role="status">
        {message?.type === "success" && <p className="mt-4 text-sm text-muted">{message.text}</p>}
      </div>

      {pending && (
        <ConfirmDialog
          title="Replace your subscriptions?"
          description={`This replaces your ${plural(subscriptions.length)} with ${plural(pending.subscriptions.length)} from ${pending.fileName}. Export first if you want a backup.`}
          confirmLabel="Replace"
          onConfirm={confirmImport}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}
