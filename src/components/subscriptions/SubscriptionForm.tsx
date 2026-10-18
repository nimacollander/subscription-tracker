"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, fieldProps } from "@/components/ui/Field";
import { CYCLE_LABELS } from "@/lib/format";
import {
  MAX_LENGTH,
  validateSubscriptionForm,
  type SubscriptionFormErrors,
  type SubscriptionFormValues,
} from "@/lib/subscriptionForm";
import { BILLING_CYCLES, type SubscriptionInput } from "@/types/subscription";

type SubscriptionFormProps = {
  initialValues: SubscriptionFormValues;
  categorySuggestions: string[];
  submitLabel: string;
  onSubmit: (data: SubscriptionInput) => void;
  onCancel: () => void;
};

// Matches the visual order, so the first invalid field gets focus.
const FIELD_ORDER: (keyof SubscriptionFormValues)[] = [
  "name",
  "price",
  "billingCycle",
  "nextBillingDate",
  "category",
  "status",
  "notes",
];

export function SubscriptionForm({
  initialValues,
  categorySuggestions,
  submitLabel,
  onSubmit,
  onCancel,
}: SubscriptionFormProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<SubscriptionFormErrors>({});
  // Show errors only after the first submit, then keep them live as the user fixes them.
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const categoryListId = useId();

  function setField<K extends keyof SubscriptionFormValues>(key: K, value: SubscriptionFormValues[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (submitted) {
      const result = validateSubscriptionForm(next);
      setErrors(result.ok ? {} : result.errors);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const result = validateSubscriptionForm(values);

    if (result.ok) {
      onSubmit(result.data);
      return;
    }
    setErrors(result.errors);
    const firstInvalid = FIELD_ORDER.find((key) => result.errors[key]);
    if (firstInvalid) formRef.current?.querySelector<HTMLElement>(`#${firstInvalid}`)?.focus();
  }

  return (
    // noValidate: show our own inline messages instead of the browser's tooltips.
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Field id="name" label="Name" error={errors.name}>
        <input
          {...fieldProps("name", errors.name)}
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          maxLength={MAX_LENGTH.name}
          autoComplete="off"
          placeholder="e.g. Netflix"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="price" label="Price" error={errors.price}>
          <input
            {...fieldProps("price", errors.price)}
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            value={values.price}
            onChange={(e) => setField("price", e.target.value)}
            placeholder="0.00"
          />
        </Field>

        <Field id="billingCycle" label="Billing cycle" error={errors.billingCycle}>
          <select
            {...fieldProps("billingCycle", errors.billingCycle)}
            value={values.billingCycle}
            onChange={(e) => setField("billingCycle", e.target.value as SubscriptionFormValues["billingCycle"])}
          >
            {BILLING_CYCLES.map((cycle) => (
              <option key={cycle} value={cycle}>
                {CYCLE_LABELS[cycle]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="nextBillingDate" label="Next billing date" error={errors.nextBillingDate}>
          <input
            {...fieldProps("nextBillingDate", errors.nextBillingDate)}
            type="date"
            value={values.nextBillingDate}
            onChange={(e) => setField("nextBillingDate", e.target.value)}
          />
        </Field>

        <Field id="category" label="Category" error={errors.category}>
          <input
            {...fieldProps("category", errors.category)}
            list={categoryListId}
            value={values.category}
            onChange={(e) => setField("category", e.target.value)}
            maxLength={MAX_LENGTH.category}
            autoComplete="off"
            placeholder="e.g. Entertainment"
          />
          <datalist id={categoryListId}>
            {categorySuggestions.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </Field>
      </div>

      <Field id="status" label="Status" error={errors.status}>
        <select
          {...fieldProps("status", errors.status)}
          value={values.status}
          onChange={(e) => setField("status", e.target.value as SubscriptionFormValues["status"])}
        >
          <option value="active">Active</option>
          <option value="paused">Paused (excluded from totals)</option>
        </select>
      </Field>

      <Field id="notes" label="Notes" error={errors.notes} optional>
        <textarea
          {...fieldProps("notes", errors.notes)}
          rows={2}
          value={values.notes}
          onChange={(e) => setField("notes", e.target.value)}
          maxLength={MAX_LENGTH.notes}
        />
      </Field>

      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
