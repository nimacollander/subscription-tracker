"use client";

import { Dialog } from "@/components/ui/Dialog";
import { toFormValues } from "@/lib/subscriptionForm";
import type { Subscription, SubscriptionInput } from "@/types/subscription";
import { SubscriptionForm } from "./SubscriptionForm";

type SubscriptionFormDialogProps = {
  /** Omit to add a new subscription. */
  subscription?: Subscription;
  today: string;
  categorySuggestions: string[];
  onSave: (data: SubscriptionInput) => void;
  onClose: () => void;
};

export function SubscriptionFormDialog({
  subscription,
  today,
  categorySuggestions,
  onSave,
  onClose,
}: SubscriptionFormDialogProps) {
  const isEditing = subscription !== undefined;

  return (
    <Dialog title={isEditing ? `Edit ${subscription.name}` : "Add subscription"} onClose={onClose}>
      <SubscriptionForm
        initialValues={toFormValues(subscription, today)}
        categorySuggestions={categorySuggestions}
        submitLabel={isEditing ? "Save changes" : "Add subscription"}
        onSubmit={onSave}
        onCancel={onClose}
      />
    </Dialog>
  );
}
