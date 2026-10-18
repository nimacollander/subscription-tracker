"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { DEFAULT_CATEGORIES } from "@/data/categories";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useToday } from "@/hooks/useToday";
import { formatCurrency } from "@/lib/format";
import { calculateTotals } from "@/lib/pricing";
import {
  applyQuery,
  DEFAULT_QUERY,
  getCategories,
  isFiltered,
  type SubscriptionQuery,
} from "@/lib/subscriptionQuery";
import type { Subscription, SubscriptionInput } from "@/types/subscription";
import { SubscriptionFilters } from "./SubscriptionFilters";
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
  const [query, setQuery] = useState<SubscriptionQuery>(DEFAULT_QUERY);
  const today = useToday();
  // Both come from the browser, so they stay unavailable until after hydration.
  const isReady = isLoaded && today !== null;

  // Existing categories first, then defaults not already used.
  const categorySuggestions = useMemo(
    () => [...new Set([...subscriptions.map((s) => s.category), ...DEFAULT_CATEGORIES])],
    [subscriptions],
  );

  const categories = useMemo(() => getCategories(subscriptions), [subscriptions]);
  // If the selected category disappears (its last subscription was deleted or edited), show all.
  const effectiveQuery = categories.includes(query.category) ? query : { ...query, category: "all" };
  const visible = isReady ? applyQuery(subscriptions, effectiveQuery, today) : [];
  const filtered = isFiltered(effectiveQuery);
  const totals = calculateTotals(subscriptions);

  // Keeps the chosen sort; only the filters reset.
  const clearFilters = () => setQuery({ ...DEFAULT_QUERY, sort: query.sort });
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
          {/* Paused subscriptions are excluded, so pausing one updates this immediately. */}
          <p className="mt-1 text-sm text-muted">
            {isReady ? `${totals.activeCount} active · ${formatCurrency(totals.monthly)}/mo` : " "}
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
        <>
          <SubscriptionFilters
            query={effectiveQuery}
            categories={categories}
            counts={{ active: totals.activeCount, paused: subscriptions.length - totals.activeCount }}
            onChange={setQuery}
          />

          <div className="-mt-2 flex min-h-8 items-center justify-between gap-4">
            <p className="text-sm text-muted" aria-live="polite">
              {filtered
                ? `Showing ${visible.length} of ${subscriptions.length}`
                : `${subscriptions.length} ${subscriptions.length === 1 ? "subscription" : "subscriptions"}`}
            </p>
            {filtered && (
              <Button size="sm" variant="ghost" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>

          {visible.length === 0 ? (
            <EmptyState title="No matching subscriptions" message="Try a different search or clear the filters.">
              <Button onClick={clearFilters}>Clear filters</Button>
            </EmptyState>
          ) : (
            <ul className="flex flex-col gap-2" aria-label="Subscriptions">
              {visible.map((sub) => (
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
        </>
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
