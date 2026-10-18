"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { DEFAULT_CATEGORIES } from "@/data/categories";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useToday } from "@/hooks/useToday";
import type { Subscription, SubscriptionInput } from "@/types/subscription";
import { SubscriptionFormDialog } from "./SubscriptionFormDialog";
import { SubscriptionRow } from "./SubscriptionRow";

// Which dialog is open, if any. Holding the whole subscription keeps the
// dialog content stable even if the list changes underneath it.
type DialogState =
  | { type: "add" }
  | { type: "edit"; subscription: Subscription }
  | { type: "delete"; subscription: Subscription }
  | null;

export function SubscriptionsView() {
  const { subscriptions, isLoaded, addSubscription, updateSubscription, deleteSubscription, toggleStatus } =
    useSubscriptions();
  const [dialog, setDialog] = useState<DialogState>(null);
  const today = useToday();
  // Both come from the browser, so they stay unavailable until after hydration.
  const isReady = isLoaded && today !== null;

  // Existing categories first, then defaults not already used.
  const categorySuggestions = useMemo(
    () => [...new Set([...subscriptions.map((s) => s.category), ...DEFAULT_CATEGORIES])],
    [subscriptions],
  );

  const closeDialog = () => setDialog(null);

  function handleSave(data: SubscriptionInput) {
    if (dialog?.type === "edit") updateSubscription(dialog.subscription.id, data);
    else addSubscription(data);
    closeDialog();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
          <p className="mt-1 text-sm text-muted">
            {isReady ? `${subscriptions.length} tracked` : " "}
          </p>
        </div>
        <Button variant="primary" onClick={() => setDialog({ type: "add" })} disabled={!isReady}>
          + Add subscription
        </Button>
      </div>

      {!isReady ? (
        <ListSkeleton />
      ) : subscriptions.length === 0 ? (
        <EmptyState title="No subscriptions yet" message="Add your first one to start tracking what you spend.">
          <Button variant="primary" onClick={() => setDialog({ type: "add" })}>
            + Add subscription
          </Button>
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-2" aria-label="Subscriptions">
          {subscriptions.map((sub) => (
            <SubscriptionRow
              key={sub.id}
              subscription={sub}
              today={today}
              onEdit={() => setDialog({ type: "edit", subscription: sub })}
              onToggleStatus={() => toggleStatus(sub.id)}
              onDelete={() => setDialog({ type: "delete", subscription: sub })}
            />
          ))}
        </ul>
      )}

      {isReady && (dialog?.type === "add" || dialog?.type === "edit") && (
        <SubscriptionFormDialog
          subscription={dialog.type === "edit" ? dialog.subscription : undefined}
          today={today}
          categorySuggestions={categorySuggestions}
          onSave={handleSave}
          onClose={closeDialog}
        />
      )}

      {dialog?.type === "delete" && (
        <ConfirmDialog
          title={`Delete ${dialog.subscription.name}?`}
          description="This removes it from your list and totals. This can't be undone."
          confirmLabel="Delete"
          onConfirm={() => {
            deleteSubscription(dialog.subscription.id);
            closeDialog();
          }}
          onCancel={closeDialog}
        />
      )}
    </div>
  );
}

function ListSkeleton() {
  return (
    <ul className="flex flex-col gap-2" aria-hidden>
      {Array.from({ length: 4 }, (_, i) => (
        <li key={i} className="h-[74px] animate-pulse rounded-xl border border-border bg-surface" />
      ))}
    </ul>
  );
}
